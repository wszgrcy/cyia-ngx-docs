import * as path from 'path';
import { Package } from 'dgeni';
import { ReadTypeScriptModules } from 'dgeni-packages/typescript/processors/readTypeScriptModules';

/**源码路径 */
const SOURCECODE_PATH = path.resolve(
  __dirname,
  '../../../../cyia-ngx-common/lib/src'
);
/**模板路径 */
/**文档导出目录 */
const DOCSOUT_PATH = path.resolve(__dirname, '../../../src/assets');

import { BUILD_PACKAGE } from './build-package';
/**允许导出文档类型 */
export default new Package('cyia-ngx-docs', [BUILD_PACKAGE])
  // .processor(ExportSpecifiedDocsProcessorFactory)
  .config(function(readFilesProcessor) {
    // doc 虽然被禁用了,但是输出的时候要用
    readFilesProcessor.basePath = SOURCECODE_PATH;
    // doc 生成文件为ts时,需要关闭此处理器
    readFilesProcessor.$enabled = false;
  })
  .config(function(log, writeFilesProcessor) {
    // Set logging level
    log.level = 'info';

    writeFilesProcessor.outputFolder = DOCSOUT_PATH;
  })
  .config(function(readTypeScriptModules: ReadTypeScriptModules) {
    // ts文件基准文件夹
    readTypeScriptModules.basePath = SOURCECODE_PATH;
    // 隐藏private变量
    readTypeScriptModules.hidePrivateMembers = true;
    // typescript 入口
    readTypeScriptModules.sourceFiles = [
      './repository/decorator/index.ts',
      './repository/type/**/*',
      './repository/repository.service.ts',
      './repository/repository.module.ts',
      './loading-hint/loading-hint.module.ts',
      './loading-hint/loading-hint.decorator.ts',
      './loading-hint/loading-hint.service.ts'
    ];
    // readTypeScriptModules.ignoreExportsMatching = [/index\.ts/, '__esModule']
    // readTypeScriptModules.sortClassMembers = true
  });
