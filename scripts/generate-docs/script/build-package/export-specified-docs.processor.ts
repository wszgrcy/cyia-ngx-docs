import { Processor, DocCollection } from 'dgeni';
import { DECORATOR_DOC_TYPE, SERVICE_DOC_TYPE, MODULE_DOC_TYPE } from '../const/doc-type';
import { DocsDataService } from '../docs-data-package/docs-data.service';
const ALLOW_OUT_DOCS = [DECORATOR_DOC_TYPE, SERVICE_DOC_TYPE, MODULE_DOC_TYPE];

export function exportSpecifiedDocsProcessor(docsDataService) {
  return new ExportSpecifiedDocsProcessor(docsDataService);
}

/**
 * @description 导出指定的文档
 * @class ExportSpecifiedDocsProcessor
 * @deprecated 应该是用合并代替全部导出
 */
class ExportSpecifiedDocsProcessor implements Processor {
  name = 'exportSpecifiedDocsProcessor';
  $runBefore = ['adding-extra-docs'];
  $process(docs: DocCollection) {
    return this.docsDataService.getAll();
    // .concat(this.serviceService.getAll());
  }
  constructor(private docsDataService: DocsDataService) {}
}
