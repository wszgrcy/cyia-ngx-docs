import { DocParameter } from './parameter';
import { ApiDoc } from 'dgeni-packages/typescript/api-doc-types/ApiDoc';
import { FileInfo } from 'dgeni-packages/typescript/services/TsParser/FileInfo';
import * as ts from 'typescript';
import { DECORATOR_DOC_TYPE } from '../const/doc-type';
import { DocBase } from './base';

export class BaseDoc extends DocBase{
  docType: string;
  name: string;
  id: string;
  aliases: string[];
  path: string;
  outputPath: string;
  content: string;
  // symbol: ts.Symbol;
  // declaration: ts.Declaration;
  fileInfo: FileInfo;
  startingLine: number;
  endingLine: number;
  description: string;
}
export class DocFunction extends BaseDoc {
  importLib: string;

  docParameters: DocParameter[];
  templatename: string;
}
export class DocDecorator extends DocFunction {
  readonly docType = DECORATOR_DOC_TYPE;
}
