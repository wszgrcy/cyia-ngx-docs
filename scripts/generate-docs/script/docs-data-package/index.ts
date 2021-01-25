import { Package } from 'dgeni';
import { BasePackage } from '../base-package';
import { docsDataProcessor } from './docs-data.processor';
import { ALL_EXTEND_TAG } from '../const/comment-tag';
import { docsDataService } from './docs-data.service';
import { tsconfigService } from './tsconfig.service';
import { Host } from 'dgeni-packages/typescript/services/ts-host/host';
import { TypeFormatFlags } from 'typescript';
import { GenerateDocConfig } from '../define/generate-doc-config';
import { configServiceFactory } from './config.service';
export function docsDataPackageFactory(config: GenerateDocConfig) {
  return new Package('docs-data-package', [BasePackage])
    .factory(configServiceFactory(config))
    .factory(docsDataService)
    .factory(tsconfigService)
    .processor(docsDataProcessor)
    .config(function (tsHost: Host) {
      tsHost.typeFormatFlags = TypeFormatFlags.AllowUniqueESSymbolType | TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
    })
    .config(function (parseTagsProcessor: any) {
      parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat(ALL_EXTEND_TAG.map((name) => ({ name: name })));
    });
}
