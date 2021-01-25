import { AngularJsonConfig } from '../../utils/angular-json-config';

export interface GenerateDocConfig {
  tsConfigPath?: string;
  /** library路径,tsconfig使用 */
  libraryPath?: string;
  /** 源码路径 */
  sourcePath?: string;
  /**  默认导入依赖包名  */
  projectName?: string;
  /** 准备生成文档的一些文件 */
  generateDocFileList?: string[];

  angularJsonConfig?: AngularJsonConfig;
}
