export class DocType {
  name: string;
  description: string;
  // type: string;
  extraDocTypeList: DocType[];
  propertyList: { name: string; type: string; description: string, default?: string }[] = [];
  constructor() {}
}
