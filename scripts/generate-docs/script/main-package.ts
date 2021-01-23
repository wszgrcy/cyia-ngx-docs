import * as path from 'path';
import { Package } from 'dgeni';
import { ReadTypeScriptModules } from 'dgeni-packages/typescript/processors/readTypeScriptModules';

/**文档导出目录 */
const DOCSOUT_PATH = path.resolve(process.cwd(), './src/assets');
import { buildPackageFactory } from './build-package';
import { GenerateDocConfig } from './define/generate-doc-config';
export function mainPackageFactory(config: GenerateDocConfig) {
  return (
    new Package('cyia-ngx-docs', [buildPackageFactory(config)])
      // .processor(ExportSpecifiedDocsProcessorFactory)
      .config(function (readFilesProcessor) {
        // doc 虽然被禁用了,但是输出的时候要用
        readFilesProcessor.basePath = config.sourcePath;
        // doc 生成文件为ts时,需要关闭此处理器
        readFilesProcessor.$enabled = false;
      })
      .config(function (log, writeFilesProcessor) {
        log.level = 'info';
        writeFilesProcessor.outputFolder = DOCSOUT_PATH;
      })
      .config(function (readTypeScriptModules: ReadTypeScriptModules) {
        // ts文件基准文件夹
        readTypeScriptModules.basePath = config.sourcePath;
        // 隐藏private变量
        readTypeScriptModules.hidePrivateMembers = true;
        // typescript 入口
        readTypeScriptModules.sourceFiles = config.generateDocFileList;
        // readTypeScriptModules.ignoreExportsMatching = [/index\.ts/, '__esModule']
        // readTypeScriptModules.sortClassMembers = true
      })
  );
}

