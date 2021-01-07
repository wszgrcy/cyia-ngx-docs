import { exec } from 'child_process';
import * as path from 'path';
import { EXAMPLE_CODE_PATH_INPUT, EXAMPLE_CODE_PATH_OUTPUT } from '../config/path.config';
import * as fs from 'fs-extra';
function getDirContent(prefix) {
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
