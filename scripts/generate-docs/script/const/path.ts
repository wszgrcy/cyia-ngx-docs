import * as path from 'path';
/**模板路径 */
export const TEMPLATE_PATH = path.resolve(__dirname, '../../template');
/** 默认导入依赖包名 */
export const IMPORT_PATH = 'cyia-ngx-common';
/** 项目路径 */
export const PROJECT_PATH = path.resolve(process.cwd(), '../cyia-ngx-common');
/**library路径,tsconfig使用 */
export const LIB_PATH = path.resolve(PROJECT_PATH, './lib');
/**源码路径 */
export const SOURCECODE_PATH = path.resolve(LIB_PATH, './src');
/**准备生成文档的一些文件 */
export const TO_BE_GENERATED_FILES = [
  './repository/decorator/index.ts',
  './repository/type/**/*',
  './repository/repository.service.ts',
  './repository/repository.module.ts',
  './loading-hint/loading-hint.module.ts',
  './loading-hint/loading-hint.decorator.ts',
  './loading-hint/loading-hint.service.ts',
  './loading-hint/type.ts',
];
// console.log('项目路径', PROJECT_PATH);
// console.log('库路径', LIB_PATH);
// console.log('源码路径', SOURCECODE_PATH);
