import { DocMethod } from './doc-method';
import { CLASS_DOC_TYPE, SERVICE_DOC_TYPE } from '../const/doc-type';
import { DocBase } from './base';

export class DocClass extends DocBase {
  id: string;
  aliases?: string[];
  name: string;
  description: string;
  /** 方法列表 */
  methodList: DocMethod[];
  // propertyList:
  /** 引入的包名 */
  importLib: string;
  templatename: string = 'class';
  readonly docType: string = CLASS_DOC_TYPE;
}
