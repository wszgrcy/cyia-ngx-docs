import { CompilerOptions } from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { LIB_PATH } from '../const/path';
import * as ts from 'typescript';
import { FileInfo } from 'dgeni-packages/typescript/services/TsParser/FileInfo';
import * as glob from 'glob';
export function tsconfigService() {
  return new TSconfigService();
}
/**用来查找包对应的路径 */
export class TSconfigService {
  private compilerOptions: CompilerOptions;
  /**保存路径对应的包引用 */
  private pathMap = new Map<string, string>();
  /**读库的配置文件 */
  async read(tsconfigpath: string = 'tsconfig.lib.json') {
    const res = ts.readConfigFile(path.resolve(LIB_PATH, tsconfigpath), (str) => {
      return fs.readFileSync(str).toString();
    });
    const config = ts.parseJsonConfigFileContent(res.config, ts.sys, LIB_PATH);
    this.compilerOptions = config.options;
    for (const packageName in this.compilerOptions.paths) {
      if (this.compilerOptions.paths.hasOwnProperty(packageName)) {
        const paths = this.compilerOptions.paths[packageName];
        paths
          .map((relativePath) => {
            return path.resolve(this.compilerOptions.baseUrl, relativePath);
          })
          .map((item) => {
            return glob.sync(item);
          })
          .forEach((item) => {
            item.forEach((path) => {
              this.pathMap.set(path, packageName);
            });
          });
      }
    }
  }
  getDocPackage(doc: { fileInfo: FileInfo }) {
    const realFilePath = doc.fileInfo.realFilePath;
    let patternPath;
    for (const path of this.pathMap.keys()) {
      if (realFilePath.includes(path)) {
        patternPath = path;
        break;
      }
    }
    if (patternPath) {
      return this.pathMap.get(patternPath);
    }
    return 'cyia-ngx-common';
  }
}
