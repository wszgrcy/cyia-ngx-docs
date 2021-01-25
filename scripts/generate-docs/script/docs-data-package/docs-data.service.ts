import { DocType } from '../define/doc-type';
import { DocService } from '../define/doc-service';
import { MethodMemberDoc } from 'dgeni-packages/typescript/api-doc-types/MethodMemberDoc';
import { DocMethod } from '../define/doc-method';
import { DocParameter } from '../define/parameter';
import { ParameterContainer } from 'dgeni-packages/typescript/api-doc-types/ParameterContainer';
import { FunctionExportDoc } from 'dgeni-packages/typescript/api-doc-types/FunctionExportDoc';
import { PropertyMemberDoc } from 'dgeni-packages/typescript/api-doc-types/PropertyMemberDoc';
import { DocDecorator, DocFunction } from '../define/function';
import { DocModule } from '../define/doc-module';
import { TSconfigService } from './tsconfig.service';
import { OVERVIEW_TAG, EXAMPLE_TAG } from '../const/comment-tag';
import * as path from 'path';
import * as ts from 'typescript';
import { DocClass, DocComponent, DocDirective } from '../define';
export function docsDataService(tsconfigService) {
  return new DocsDataService(tsconfigService);
}
export class DocsDataService {
  constructor(private tsconfigService: TSconfigService) {}
  private docTypeMap = new Map<string, DocType>();
  /**原始类型的文档列表 */
  private orgtypeDocList = [];

  private docServiceMap = new Map<string, DocService>();
  private docDecoratorMap = new Map<string, DocDecorator>();
  private docModuleMap = new Map<string, DocModule>();
  private docDirectiveMap = new Map<string, DocDirective>();
  private docComponentMap = new Map<string, DocComponent>();
  private docClassMap = new Map<string, DocClass>();
  private docFunctionMap = new Map<string, DocFunction>();
  /**由于类型的特殊性,需要全部传入递归实现 */
  setDocTypes(docs = []) {
    // todo 修改类型识别判断
    this.orgtypeDocList = docs.filter((item) => item.docType === 'class' || item.docType === 'interface');
    this.orgtypeDocList.forEach((doc: any, i) => {
      this.addDocType(doc);
    });
  }
  /**当作普通的类或接口添加 */
  private addDocType(doc) {
    if (this.docTypeMap.has(doc.name)) {
      return;
    }
    const docType = new DocType();
    docType.name = doc.name;
    docType.description = doc.description;

    docType.propertyList = doc.members.map((member: PropertyMemberDoc) => {
      // console.log(member);
      const checker = member.typeChecker;
      const symbol = member.symbol;
      const type = checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration),
        undefined,
        ts.TypeFormatFlags.None
      );
      const extraType = this.findDocType(member.type);
      if (extraType) {
        docType.extraDocTypeList.push(extraType);
      }
      return {
        name: member.name,
        description: (member as any).description,
        type: type,
        // default: member.declaration.initializer.text,
      };
    });
    this.docTypeMap.set(doc.name, docType);
  }
  private findDocType(type: string) {
    const returnType = this.docTypeMap.get(type);
    if (!returnType) {
      const orgDoc = this.orgtypeDocList.find((doc) => doc.name === type);
      if (orgDoc) {
        this.addDocType(orgDoc);
        return this.docTypeMap.get(type);
      } else {
        return undefined;
      }
    }
    return returnType;
  }
  getDocType(name: string) {
    if (name.includes('=')) {
      return undefined;
    }
    name = name.replace(/<.+>/, '').replace(/\[.*\]/, '');
    return this.docTypeMap.get(name);
  }
  /**ng服务 */
  addDocService(item) {
    let instance = this.getClassData(item, new DocService());
    this.docServiceMap.set(item.name, instance);
  }
  /**处理方法,函数(装饰器)的参数 */
  handle(docs: FunctionExportDoc) {
    return docs.parameterDocs
      .map((item) => {
        const checker = item.typeChecker;
        const symbol = item.symbol;
        const type = checker.typeToString(
          checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration),
          undefined,
          ts.TypeFormatFlags.None
        );
        return {
          parameterDoc: item,
          parameter: type,
          /**注释 */
          param: docs['params'] && (docs['params'] as ParameterContainer['params']).find((param) => param.name === item.name),
        };
      })
      .map((item) => this.handleParameter(item));
  }
  private handleParameter({
    parameterDoc,
    parameter,
    param,
  }: {
    parameterDoc: ParameterContainer['parameterDocs'][0];
    parameter: ParameterContainer['parameters'][0];
    param?: ParameterContainer['params'][0];
  }) {
    const docParameter = new DocParameter(parameterDoc.name);
    docParameter.description = (param && param.description) || parameterDoc.description;
    docParameter.isRestParam = parameterDoc.isRestParam;
    docParameter.defaultValue = parameterDoc.defaultValue;
    docParameter.isOptional = docParameter.isRestParam || parameterDoc.isOptional;
    docParameter.parameter = parameter;
    docParameter.type = parameter;

    docParameter.typeLink = this.getDocType(docParameter.type);
    return docParameter;
  }
  /**ts装饰器 */
  addDocDecorator(item) {
    let instance = this.getFunctionData(item, new DocDecorator());
    this.docDecoratorMap.set(item.name, instance);
  }
  /**ng模块 */
  addDocModule(item) {
    const docModule: DocModule = new DocModule();
    docModule.id = item.id;
    docModule.name = item.name;
    docModule.description = item.description;
    docModule.aliases = item.aliases;
    docModule.importLib = this.tsconfigService.getDocPackage(item);
    docModule.templatename = 'overview';
    /**概述文档标签 */
    const tag = item.tags.tags.find((item) => item.tagName === OVERVIEW_TAG);
    if (tag) {
      docModule.markdownPath = path.resolve(item.basePath, item.originalModule, '../', tag.description);
    }
    const exampleTag = item.tags.tags.find((item) => item.tagName === EXAMPLE_TAG);
    if (exampleTag) {
      docModule.examplePath = path.resolve(item.basePath, item.originalModule, '../', exampleTag.description);
    }
    docModule.decoratorParameters = item.decorators.find((item) => item.name === 'NgModule').argumentInfo;
    docModule.NgModule = docModule.decoratorParameters[0];
    docModule.folder = item.originalModule.split('/').slice(-2)[0];
    this.docModuleMap.set(item.name, docModule);
  }
  addComponent(item) {
    let instance = this.getClassData(item, new DocComponent());
    // todo
    instance.selector = '';
    this.docComponentMap.set(item.name, instance);
  }
  addDirective(item) {
    let instance = this.getClassData(item, new DocDirective());
    // todo
    instance.selector = '';
    this.docDirectiveMap.set(item.name, instance);
  }
  addClass(item) {
    let instance = this.getClassData(item, new DocClass());
    this.docClassMap.set(item.name, instance);
  }
  addFunction(item) {
    let instance = this.getFunctionData(item, new DocFunction());
    this.docFunctionMap.set(item.name, instance);
  }
  private getFunctionData<T extends DocFunction>(item, instance: T) {
    instance.id = item.id;
    instance.name = item.name;
    instance.description = item.description;
    instance.aliases = item.aliases;
    instance.docParameters = this.handle(item);
    instance.importLib = this.tsconfigService.getDocPackage(item);
    return instance;
  }
  private getClassData<T extends DocClass>(item, instance: T) {
    instance.id = item.id;
    instance.aliases = item.aliases;
    instance.name = item.name;
    instance.description = item.description;
    instance.importLib = this.tsconfigService.getDocPackage(item);
    instance.methodList = item.members
      .filter((member) => member instanceof MethodMemberDoc)
      .map((member: MethodMemberDoc) => {
        const docMethod = new DocMethod();
        docMethod.name = member.name;
        docMethod.description = (member as any).description;
        docMethod.docParameters = this.handle(member as any);
        docMethod.returnType = member.type;
        if (!member.type) {
          const symbol = member.symbol;
          const checker = member.typeChecker;
          const print = ts.createPrinter();
          const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
          const typeNode = checker.typeToTypeNode(type, undefined, undefined);
          docMethod.returnType = print.printNode(ts.EmitHint.Unspecified, (typeNode as any).type, undefined);
        }
        return docMethod;
      });
    return instance;
  }
  getDocServices() {
    return [...this.docServiceMap.values()];
  }
  getDocDecorators() {
    return [...this.docDecoratorMap.values()];
  }
  getDocModules() {
    return [...this.docModuleMap.values()];
  }
  getAll(): any[] {
    return [].concat(this.getDocDecorators(), this.getDocModules(), this.getDocServices());
  }
}
