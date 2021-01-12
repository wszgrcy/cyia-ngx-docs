import { Package } from 'dgeni';
import { docsDataPackageFactory } from '../docs-data-package';
import { TEMPLATE_PATH } from '../const/path';
import { SERVICE_DOC_TYPE, MODULE_DOC_TYPE, DECORATOR_DOC_TYPE, API_DOC_TYPE, NAVIGATION_DOC_TYPE, JSON_TYPE } from '../const/doc-type';
import { exportSpecifiedDocsProcessor } from './export-specified-docs.processor';
import { DocModule } from '../define/doc-module';
import { mergeApiDocsProcess } from './merge-api-docs.processor';
import { EXAMPLE_DOC_TYPE } from '../const/doc-type';
import { GenerateDocConfig } from '../define/generate-doc-config';
export function buildPackageFactory(config: GenerateDocConfig) {
  return (
    new Package('build-package', [docsDataPackageFactory(config)])
      // .processor(exportSpecifiedDocsProcessor)
      .processor(mergeApiDocsProcess)
      .config(function (templateFinder) {
        // doc 设置查找模板
        templateFinder.templateFolders = [
          TEMPLATE_PATH,
          // path.resolve(TEMPLATE_PATH, 'type-page'),
          // path.resolve(TEMPLATE_PATH, 'common'),
          // path.resolve(TEMPLATE_PATH, 'service-page'),
          // path.resolve(TEMPLATE_PATH, 'decorator-page'),
          // path.resolve(TEMPLATE_PATH, 'overview-page'),
          // path.resolve(TEMPLATE_PATH, 'api-page'),
        ];
        templateFinder.templatePatterns = ['${doc.templatename}', 'doc.template.json'];
      })
      .config(function (computePathsProcessor) {
        // doc 输出路径计算
        computePathsProcessor.pathTemplates = [
          {
            docTypes: [EXAMPLE_DOC_TYPE],
            pathTemplate: '${name}',
            getOutputPath: (doc: DocModule) => {
              return `module/${doc.folder}/${doc.folder}.example.json`;
            },
          },
          {
            docTypes: [MODULE_DOC_TYPE],
            pathTemplate: '${name}',
            // outputPathTemplate: '${name}.decorator.html',
            getOutputPath: (doc: DocModule) => {
              return `module/${doc.folder}/${doc.folder}.overview.json`;
            },
          },
          {
            docTypes: [API_DOC_TYPE],
            pathTemplate: '${name}',
            // outputPathTemplate: '${name}.decorator.html',
            getOutputPath: (doc: DocModule) => {
              return `module/${doc.folder}/${doc.folder}.api.json`;
            },
          },
          {
            docTypes: [NAVIGATION_DOC_TYPE],
            pathTemplate: 'navigation.template.json',

            // outputPathTemplate: '${name}.decorator.html',
            getOutputPath: (doc: DocModule) => {
              return `${doc.name}.json`;
            },
          },
          {
            docTypes: [JSON_TYPE],
            pathTemplate: 'doc.template.json',
            // outputPathTemplate: '${name}.decorator.html',
            getOutputPath: (doc: DocModule) => {
              return `${doc.name}.json`;
            },
          },
        ];
      })
      .config(function (templateEngine) {
        // templateEngine.tags.push(new MarkdownNunjucksExtension());
        templateEngine.config.autoescape = false;
        templateEngine.filters = [
          {
            name: 'json',
            process: (item: any, space: number = 4) => {
              if (item == null) {
                throw new Error('变量不能为null或undefined');
              }
              return JSON.stringify(item, undefined, space);
            },
          },
        ];
      })
  );
}
