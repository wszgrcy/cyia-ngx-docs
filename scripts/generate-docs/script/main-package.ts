import * as path from 'path';
import { Package } from 'dgeni';
import { ReadTypeScriptModules } from 'dgeni-packages/typescript/processors/readTypeScriptModules';
import { SOURCECODE_PATH, TO_BE_GENERATED_FILES } from './const/path';

/**文档导出目录 */
const DOCSOUT_PATH = path.resolve(__dirname, '../../../src/assets');
// console.log('导出路径', DOCSOUT_PATH);
import { BUILD_PACKAGE } from './build-package';
/**允许导出文档类型 */
export default new Package('cyia-ngx-docs', [BUILD_PACKAGE])
  // .processor(ExportSpecifiedDocsProcessorFactory)
  .config(function (readFilesProcessor) {
    // doc 虽然被禁用了,但是输出的时候要用
    readFilesProcessor.basePath = SOURCECODE_PATH;
    // doc 生成文件为ts时,需要关闭此处理器
    readFilesProcessor.$enabled = false;
  })
  .config(function (log, writeFilesProcessor) {
    log.level = 'info';
    writeFilesProcessor.outputFolder = DOCSOUT_PATH;
  })
  .config(function (readTypeScriptModules: ReadTypeScriptModules) {
    // ts文件基准文件夹
    readTypeScriptModules.basePath = SOURCECODE_PATH;
    // 隐藏private变量
    readTypeScriptModules.hidePrivateMembers = true;
    // typescript 入口
    readTypeScriptModules.sourceFiles = TO_BE_GENERATED_FILES;
    // readTypeScriptModules.ignoreExportsMatching = [/index\.ts/, '__esModule']
    // readTypeScriptModules.sortClassMembers = true
  });
