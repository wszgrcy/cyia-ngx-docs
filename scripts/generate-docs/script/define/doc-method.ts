import { DocParameter } from './parameter';

export class DocMethod {
  name: string;
  description: string;
  docParameters: DocParameter[];
  returnType: string;
}
