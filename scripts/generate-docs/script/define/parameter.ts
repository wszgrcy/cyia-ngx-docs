import { DocType } from './doc-type';

/**方法/函数/装饰器的参数 */
export class DocParameter {
  /**可选 */
  isOptional = false;
  defaultValue = '';
  type = 'any';
  /**如果为自己声明的类型,那么存在链接id */
  typeLink?: DocType;
  /**剩余参数 */
  isRestParam = false;
  /**有没有被装饰 */
  decorators?: any[];
  description = '';
  /**原始数据 */
  parameter: string;
  constructor(/**这个参数的参数名 */ public name: string) {}
}
