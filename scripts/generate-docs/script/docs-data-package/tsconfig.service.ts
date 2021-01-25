import { CompilerOptions } from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { FileInfo } from 'dgeni-packages/typescript/services/TsParser/FileInfo';
import * as glob from 'glob';
import { ConfigService } from './config.service';
export function tsconfigService(configService) {
  return new TSconfigService(configService);
}
/**用来查找包对应的路径 */
export class TSconfigService {
  private compilerOptions: CompilerOptions;
  /**保存路径对应的包引用 */
  private pathMap = new Map<string, string>();
  constructor(private configService: ConfigService) {}
  /**读库的配置文件 */
  async read() {
    const res = ts.readConfigFile(this.configService.config.tsConfigPath, (str) => {
      return fs.readFileSync(str).toString();
    });
    const config = ts.parseJsonConfigFileContent(res.config, ts.sys, this.configService.config.libraryPath);
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
  /** 获得包的名字
   * todo 需要更优雅写法
   */
  getDocPackage(doc: { fileInfo: FileInfo }) {
    const realFilePath = doc.fileInfo.realFilePath;
    let patternPath: string;
    for (const path of this.pathMap.keys()) {
      if (realFilePath.includes(path)) {
        patternPath = path;
        break;
      }
    }
    if (patternPath) {
      return this.pathMap.get(patternPath);
    }
    return this.configService.config.projectName;
  }
}
