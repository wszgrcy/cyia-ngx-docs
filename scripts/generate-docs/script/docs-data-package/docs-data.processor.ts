import { DocsDataService } from './docs-data.service';
import { Processor } from 'dgeni';
import { HANDING_DOCS_DATA } from '../const/run-time';
import {
  MODULE_TAG,
  DECORATOR_TAG,
  SERVICE_TAG,
  VAR_TAG,
  TOKEN_TAG,
  COMPONENT_TAG,
  DIRECTIVE_TAG,
  FUNCTION_TAG,
  CLASS_TAG,
} from '../const/comment-tag';
import { TSconfigService } from './tsconfig.service';
import { JsdocTag } from '../define';
export function docsDataProcessor(docsDataService, tsconfigService) {
  return new DocsDataProcessor(docsDataService, tsconfigService);
}
class DocsDataProcessor implements Processor {
  name = 'docsDataProcessor';
  $runBefore = [HANDING_DOCS_DATA];
  constructor(private docsDataService: DocsDataService, private tsconfigService: TSconfigService) {}
  async $process(docs: any[]) {
    this.docsDataService.setDocTypes(docs);
    for (const doc of docs) {
      const tags = (doc.tags.tags as JsdocTag[]).map((item) => item.tagName);
      if (tags.includes(MODULE_TAG)) {
        this.docsDataService.addDocModule(doc);
      } else if (tags.includes(DECORATOR_TAG)) {
        this.docsDataService.addDocDecorator(doc);
      } else if (tags.includes(SERVICE_TAG)) {
        this.docsDataService.addDocService(doc);
      } else if (tags.includes(VAR_TAG)) {
      } else if (tags.includes(TOKEN_TAG)) {
      } else if (tags.includes(COMPONENT_TAG)) {
        this.docsDataService.addComponent(doc);
      } else if (tags.includes(DIRECTIVE_TAG)) {
        this.docsDataService.addDirective(doc);
      } else if (tags.includes(CLASS_TAG)) {
        this.docsDataService.addClass(doc);
      } else if (tags.includes(FUNCTION_TAG)) {
        this.docsDataService.addFunction(doc);
      }
    }
    return docs;
  }
}
