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
  constructor(private configService: ConfigService) {}
 
  /**
   *
   * 获得包的名字
   *
   *
   */
  getDocPackage(doc: { fileInfo: FileInfo }) {
    let realFilePath = doc.fileInfo.realFilePath;
    let rootPackage = path.dirname(this.configService.config.angularJsonConfig.setConfiguration('prod').getProject());
    while ((realFilePath = path.dirname(realFilePath)) !== rootPackage) {
      if (fs.existsSync(path.join(realFilePath, 'package.json'))) {
        return path.relative(rootPackage, realFilePath);
      }
    }
  }
}
