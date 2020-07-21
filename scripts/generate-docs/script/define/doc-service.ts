import { DocMethod } from './doc-method';
import { SERVICE_DOC_TYPE } from '../const/doc-type';
import { DocBase } from './base';

export class DocService extends DocBase{
  id: string;
  aliases?: string[];
  name: string;
  description: string;
  methodList: DocMethod[];
  // propertyList:
  importLib: string;
  templatename: string;
  readonly docType: string = SERVICE_DOC_TYPE;
}
