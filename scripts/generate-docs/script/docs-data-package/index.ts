import { Package } from 'dgeni';
import { BasePackage } from '../base-package';
import { docsDataProcessor } from './docs-data.processor';
import { MODULE_TAG, SERVICE_TAG, DECORATOR_TAG, OVERVIEW_TAG } from '../const/comment-tag';
import { docsDataService } from './docs-data.service';
import { tsconfigService } from './tsconfig.service';
import { Host } from 'dgeni-packages/typescript/services/ts-host/host';
import { TypeFormatFlags } from 'typescript';
/**从代码中获得注释并整理 */
export const DOCS_DATA_PACKAGE = new Package('docs-data-package', [BasePackage])
  .factory(docsDataService)
  .factory(tsconfigService)
  .processor(docsDataProcessor)
  .config(function (tsHost: Host) {
    tsHost.typeFormatFlags =
      TypeFormatFlags.AllowUniqueESSymbolType | TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
  })
  .config(function (parseTagsProcessor: any) {
    parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat([
      { name: MODULE_TAG },
      { name: SERVICE_TAG },
      { name: DECORATOR_TAG },
      { name: OVERVIEW_TAG },
    ]);
  });
