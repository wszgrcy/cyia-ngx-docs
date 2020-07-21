import { NAVIGATION_DOC_TYPE } from '../const/doc-type';

export class DocNavigation {
  sideNavToJson: SideNav[];
  id: string;
  name: string;
  aliases: string[];
  docType = NAVIGATION_DOC_TYPE;
  templatename:string
}

export class SideNav {
  title: string;
  children?: SideNav[];
  url: string;
  router?: boolean = true;
  tabs?: { title: string; url: string; contentCatalog?: boolean }[];
}
