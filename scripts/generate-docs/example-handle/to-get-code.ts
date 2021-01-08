import { exec } from 'child_process';
import * as path from 'path';
import { EXAMPLE_CODE_PATH_INPUT, EXAMPLE_CODE_PATH_OUTPUT } from '../config/path.config';
import * as fs from 'fs-extra';
import { createCssSelectorForHtml } from '../../utils/selector';
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
        obj[path.join(item.parent, item.current, fileName).replace(/\\/g, '/')] = fs
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

export function toGetExampleCodes() {
  const list = fs.readdirSync(EXAMPLE_CODE_PATH_INPUT, { withFileTypes: true });
  list
    .filter((item) => item.isDirectory())
    .forEach((dirent) => {
      const dirPath = path.join(EXAMPLE_CODE_PATH_INPUT, dirent.name);
      const obj = getDirContent(dirPath);
      fs.ensureFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, dirent.name + '.json'));
      fs.writeFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, dirent.name + '.json'), JSON.stringify(obj));
    });
  console.log('实例代码转换完成');
}

export function toGetShareCode() {
  const dirPath = path.join(EXAMPLE_CODE_PATH_INPUT, '../../share-file');
  const obj = getDirContent(dirPath);
  fs.ensureFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, 'share-file.json'));
  fs.writeFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, 'share-file.json'), JSON.stringify(obj));
  console.log('分享代码转换完成');
}
/**
 *
 * 我期望的其实是是 低耦合,尽量不将两部分代码合并起来
 */
export class ExampleHandle {
  constructor(options?) {}
  codeGroupMap = new Map<string, any>();
  shareCodeGroup = {};
  build() {
    this.toGetShareCode();
    this.toGetExampleCodes();
  }
  /** 实例代码 */
  toGetExampleCodes() {
    const list = fs.readdirSync(EXAMPLE_CODE_PATH_INPUT, { withFileTypes: true });
    list
      .filter((item) => item.isDirectory())
      .forEach((dirent) => {
        const dirPath = path.join(EXAMPLE_CODE_PATH_INPUT, dirent.name);
        const obj = getDirContent(dirPath);
        this.codeGroupMap.set(dirent.name, obj);
        fs.ensureFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, dirent.name + '.json'));
        fs.writeFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, dirent.name + '.json'), JSON.stringify(obj));
      });
    console.log('实例代码转换完成');
  }
  /** 共享代码 */
  toGetShareCode() {
    const dirPath = path.join(EXAMPLE_CODE_PATH_INPUT, '../../share-file');
    this.shareCodeGroup = getDirContent(dirPath);

    fs.ensureFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, 'share-file.json'));
    fs.writeFileSync(path.join(EXAMPLE_CODE_PATH_OUTPUT, 'share-file.json'), JSON.stringify(this.shareCodeGroup));
    console.log('分享代码转换完成');
  }
  /** 增量操作 */
  toGetIncrementAction() {
    let angularJson = this.shareCodeGroup['angular.json'];
    let packages = angularJson['projects'];
    // todo 需要可选
    let examplePackage = packages['examples'];
    let buildOptions = examplePackage['architect']['build']['options'];
    let indexPatch = buildOptions['index'];
    let htmlString = this.shareCodeGroup[indexPatch];
    let cssSelector = createCssSelectorForHtml(htmlString);
    let result = cssSelector.query('body');
    result[0].startSourceSpan.start;
    this.codeGroupMap.forEach((value, key) => {
      let file = value['index.ts'];
      delete value['index.ts'];
      //todo 读取模块/组件名 插入到module中 获取selector插入到index.html中,读取
    });
    /**
     * 查 angular.json
     * 从 angular.json 中找到 html路径
     * 从共享代码中访问html
     * 分析记录
     *
     */
  }
}
/**
 * 先加载生成代码,加载后保存index.html文件
 * 然后找到共享部分,找到导出的启动组件,并且找到selector,
 * 计算index的插入位置然后保存
 * 将 位置和要插入的文本保存为关系
 * 找到实例的模块,并且将模块的插入关系保存
 * 将关系保存为一个文件,
 * 共享index.ts导出为bootstrap和import
 * todo 如何在例子外插入文件
 */
