import * as path from 'path';
import { EXAMPLE_CODE_PATH_OUTPUT } from '../config/path.config';
import * as fs from 'fs-extra';
import { createCssSelectorForHtml, createCssSelectorForTs } from 'cyia-code-util';
import ts from 'typescript';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
function getDirContent(prefix: string) {
  const obj = {};

  const list = [{ parent: '', current: '' }];
  while (list.length) {
    const item = list.pop();
    const direntList = fs.readdirSync(path.join(prefix, item.parent, item.current), { withFileTypes: true });
    direntList
      .filter((item) => !item.isDirectory())
      .map((item) => item.name)
      .forEach((fileName) => {
        obj[path.posix.join(item.parent, item.current, fileName)] = fs
          .readFileSync(path.join(prefix, item.parent, item.current, fileName))
          .toString();
      });

    list.push(
      ...direntList
        .filter((item) => item.isDirectory())
        .map((item) => item.name)
        .map((_item) => ({ parent: path.join(item.parent, item.current), current: _item }))
    );
  }
  return obj;
}

/**
 *
 * 我期望的其实是是 低耦合,尽量不将两部分代码合并起来
 */
export class ExampleCodeHandle {
  constructor(private options?: { projectName: string; exampleCodePath: string }) {}
  private codeGroupMap = new Map<string, any>();
  private shareCodeGroup = {};
  run() {
    this.clear()
    this.toGetShareCode();
    this.toGetExampleCodes();
    this.toGetIncrementAction();
  }
  clear() {
    fs.removeSync(EXAMPLE_CODE_PATH_OUTPUT);
  }
  /** 实例代码 */
  private toGetExampleCodes() {
    const list = fs.readdirSync(this.options.exampleCodePath, { withFileTypes: true });
    list
      .filter((item) => item.isDirectory())
      .forEach((dirent) => {
        const dirPath = path.join(this.options.exampleCodePath, dirent.name);
        const obj = getDirContent(dirPath);
        this.codeGroupMap.set(dirent.name, obj);
      });
  }
  /** 共享代码 */
  private toGetShareCode() {
    const dirPath = path.resolve(this.options.exampleCodePath, '../../share-file');
    this.shareCodeGroup = getDirContent(dirPath);

    fs.ensureFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, 'share-file.json'));
    fs.writeFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, 'share-file.json'), JSON.stringify(this.shareCodeGroup));
  }
  /** 增量操作 */
  private toGetIncrementAction() {
    const angularJson = JSON.parse(this.shareCodeGroup['angular.json']);
    const packages = angularJson['projects'];
    const examplePackage = packages[this.options.projectName];
    const buildOptions = examplePackage['architect']['build']['options'];
    /**index.html */
    const indexPatch = buildOptions['index'];
    const htmlString = this.shareCodeGroup[indexPatch];
    const cssSelector = createCssSelectorForHtml(htmlString);
    const result = cssSelector.queryAll('body');
    const labelInsertPos = result[0].startSourceSpan.end.offset;
    const mainPath = buildOptions['main'];
    const bootstrapModuleInfo = this.findBootstrapModule(mainPath);
    const insertInfo = this.findExampleProjectInsertPosition(bootstrapModuleInfo);
    this.codeGroupMap.forEach((value, key) => {
      const file = value['index.ts'];
      delete value['index.ts'];
      const selector = createCssSelectorForTs(ts.createSourceFile('index.ts', file, ts.ScriptTarget.Latest, true));
      let importModuleName: string;
      let importModulePath: string;
      let bootstrapComponentName: string;
      let bootstrapComponentPath: string;
      let bootstrapComponentSelector: string;
      selector.queryAll('ExportDeclaration[exportClause][moduleSpecifier]').forEach((node: ts.ExportDeclaration) => {
        const importModule: ts.ExportSpecifier = selector.queryAll(node, `ExportSpecifier[name=ImportModule]`)[0] as any;
        if (importModule) {
          importModuleName = importModule.propertyName.text;
          importModulePath = (node.moduleSpecifier as ts.StringLiteral).text;
        }
        const bootstrapComponent: ts.ExportSpecifier = selector.queryAll(node, `ExportSpecifier[name=BootstrapComponent]`)[0] as any;
        if (bootstrapComponent) {
          bootstrapComponentName = bootstrapComponent.propertyName.text;
          bootstrapComponentPath = (node.moduleSpecifier as ts.StringLiteral).text;
        }
      });
      bootstrapComponentSelector = this.findComponentSelector(bootstrapComponentName, value[path.join(bootstrapComponentPath) + '.ts']);

      const incrementAction: { insert: { filePath: string; content: string; position: number }[] } = {
        insert: [
          { filePath: indexPatch, position: labelInsertPos, content: `<${bootstrapComponentSelector}></${bootstrapComponentSelector}>` },
          {
            filePath: bootstrapModuleInfo.filePath + '.ts',
            position: 0,
            content: `import { ${bootstrapComponentName} } from "./${path.posix.join(
              buildRelativePath(path.posix.join('/', bootstrapModuleInfo.filePath), path.posix.join('/', 'src/app', key)),
              bootstrapComponentPath
            )}";\n`,
          },
          {
            filePath: bootstrapModuleInfo.filePath + '.ts',
            position: 0,
            content: `import { ${importModuleName} } from "./${path.posix.join(
              buildRelativePath(path.posix.join('/', bootstrapModuleInfo.filePath), path.posix.join('/', 'src/app', key)),
              importModulePath
            )}";\n`,
          },
          {
            filePath: bootstrapModuleInfo.filePath + '.ts',
            position: insertInfo.bootstrapPosition,
            content: insertInfo.bootstrapComma + bootstrapComponentName,
          },
          {
            filePath: bootstrapModuleInfo.filePath + '.ts',
            position: insertInfo.importPosition,
            content: insertInfo.importComma + importModuleName,
          },
        ].sort((a, b) => b.position - a.position),
      };
      fs.ensureFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, key + '.json'));
      fs.writeFileSync(
        path.join(EXAMPLE_CODE_PATH_OUTPUT, key + '.json'),
        JSON.stringify({
          file: value,
          action: incrementAction,
        })
      );
    });
  }
  /** 查询组件的 selector:'xxxx' */
  private findComponentSelector(componentName: string, content: string) {
    const selector = createCssSelectorForTs(ts.createSourceFile('', content, ts.ScriptTarget.Latest, true));
    const classDeclaration: ts.ClassDeclaration = selector.queryAll(`ClassDeclaration[name=${componentName}]`)[0] as any;
    const propertyAssignment: ts.PropertyAssignment = selector.queryAll(classDeclaration, 'PropertyAssignment[name=selector]')[0] as any;
    const selectorName = (propertyAssignment.initializer as ts.StringLiteral).text;
    return selectorName;
  }
  private findExampleProjectInsertPosition({ filePath, moduleName }: { filePath: string; moduleName: string }) {
    const fileContent = this.shareCodeGroup[filePath + '.ts'];
    const selector = createCssSelectorForTs(ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true));
    const result = selector.queryAll(`ClassDeclaration[name=${moduleName}]`);
    if (result.length !== 1) {
      throw new Error(`查询${moduleName}有误${result.length}`);
    }
    const importPropertyAssignment: ts.ArrayLiteralExpression = selector.queryAll(
      result[0],
      'PropertyAssignment[name=imports] ArrayLiteralExpression'
    )[0] as any;

    const bootstrapPropertyAssignment: ts.ArrayLiteralExpression = selector.queryAll(
      result[0],
      'PropertyAssignment[name=bootstrap] ArrayLiteralExpression'
    )[0] as any;
    return {
      importPosition: importPropertyAssignment.elements.end,
      importComma: importPropertyAssignment.elements.length ? ',' : '',
      bootstrapPosition: bootstrapPropertyAssignment.elements.end,
      bootstrapComma: bootstrapPropertyAssignment.elements.length ? ',' : '',
    };
  }
  /** 查找启动模块(AppModule)的路径及名字 */
  private findBootstrapModule(mainPath: string) {
    const content = this.shareCodeGroup[mainPath];
    const selector = createCssSelectorForTs(ts.createSourceFile(mainPath, content, ts.ScriptTarget.Latest, true));
    let result = selector.queryAll(
      'PropertyAccessExpression[name=catch] CallExpression PropertyAccessExpression[name=bootstrapModule]~SyntaxList>Identifier'
    );
    if (result.length !== 1) {
      throw new Error('查找模块名有误' + result.length);
    }
    /** 启动模块名 */
    const moduleName = (result[0] as ts.Identifier).text;
    result = selector
      .queryAll('ImportDeclaration')
      .filter((node) => selector.queryAll(node, `ImportClause ImportSpecifier[name=${moduleName}]`).length);
    if (result.length !== 1) {
      throw new Error('查找引入有误' + result.length);
    }
    const modulePath = ((result[0] as ts.ImportDeclaration).moduleSpecifier as ts.StringLiteral | ts.NoSubstitutionTemplateLiteral).text;
    return { filePath: path.posix.join(path.dirname(mainPath), modulePath), moduleName: moduleName };
  }
}
/**
 * todo 如何在例子外插入文件
 */
