/**
 * jsdoc 的标记
 */
/** 变量 */
export const CLASS_TAG = 'docs-class';
/** 变量 */
export const VAR_TAG = 'docs-var';
/** token */
export const TOKEN_TAG = 'docs-token';
/** 组件 */
export const COMPONENT_TAG = 'docs-component';
/** 指令 */
export const DIRECTIVE_TAG = 'docs-directive';
/** 函数 */
export const FUNCTION_TAG = 'docs-function';
/** 装饰器 */
export const DECORATOR_TAG = 'docs-decorator';
/** 服务 */
export const SERVICE_TAG = 'docs-service';
/** 模块 */
export const MODULE_TAG = 'docs-module';
/** 简介页面 */
export const OVERVIEW_TAG = 'docs-overview';
/** 实例页面 */
export const EXAMPLE_TAG = 'docs-example';
/** 所有额外增加的tag */
export const ALL_EXTEND_TAG = [
  /** ng 部分 */
  COMPONENT_TAG,
  DIRECTIVE_TAG,
  SERVICE_TAG,
  MODULE_TAG,
  /** 页面引用部分 */
  OVERVIEW_TAG,
  EXAMPLE_TAG,
  /** 通用部分 */
  VAR_TAG,
  FUNCTION_TAG,
  DECORATOR_TAG,
  TOKEN_TAG,
  CLASS_TAG,
];
