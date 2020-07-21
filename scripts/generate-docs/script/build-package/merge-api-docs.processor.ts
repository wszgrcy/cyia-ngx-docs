import { DocsDataService } from '../docs-data-package/docs-data.service';
import { Processor } from 'dgeni';
import { MODULE_DOC_TYPE, API_DOC_TYPE, NAVIGATION_DOC_TYPE } from '../const/doc-type';
import { DocBase, ElementItem } from '../define/base';
import * as fs from 'fs';
import { DocService } from '../define/doc-service';
import { DocModule } from '../define/doc-module';
import { DocDecorator } from '../define/function';
import { DocNavigation } from '../define/navigation';
export function mergeApiDocsProcess(docsDataService) {
  return new MergeApiDocsProcess(docsDataService);
}
export class MergeApiDocsProcess implements Processor {
  constructor(private docsDataService: DocsDataService) {}
  name = 'mergeApiDocsProcess';
  $runBefore = ['adding-extra-docs'];
  $process(docs): any[] {
    const services: DocService[] = this.docsDataService.getDocServices().map((item) => {
      item.toJson = [
        {
          selector: 'doc-anchor',
          // content: item.name,
          property: {
            tag: 'h3',
            content: item.name,
          },
        },
        { selector: 'p', content: item.description },

        { selector: 'method-table', property: item.methodList },
      ];
      return item;
    });
    const decorators: DocDecorator[] = this.docsDataService.getDocDecorators().map((item) => {
      item.toJson = [
        {
          selector: 'doc-anchor',
          // content: item.name,
          property: {
            tag: 'h3',
            content: item.name,
          },
        },
        { selector: 'p', content: item.description },
        { selector: 'property-table', property: item.docParameters },
      ];
      return item;
    });
    const modules: DocModule[] = this.docsDataService.getDocModules();
    let navigation = this.getNavigation(modules);
    return [
      ...modules.map((module) => {
        return {
          ...module,
          toJson: [
            {
              selector: 'flex-layout',
              property: { flexList: ['1 1 0', '0 0 130px'] },
              children: [
                {
                  selector: 'doc-content',
                  children: [
                    this.getTabsElement(module.folder, 'overview'),
                    { selector: 'overview-markdown', property: fs.readFileSync(module.markdownPath).toString() },
                  ],
                },
                { selector: 'doc-catalog', property: { selector: 'doc-content' } },
              ],
            },
          ],
        };
      }),
      ...(modules.map((item) => {
        let servicesFilter = services.filter((item) => item.importLib === item.importLib);
        let decoratorsFilter = decorators.filter((item) => item.importLib === item.importLib);
        //   obj.path = 'api';
        // obj.name = item.name;
        return {
          name: item.name,
          folder: item.folder,
          docType: API_DOC_TYPE,
          templatename: 'api',
          toJson: [
            {
              selector: 'flex-layout',
              property: { flexList: ['1 1 0', '0 0 130px'] },
              children: [
                {
                  selector: 'doc-content',
                  children: ([
                    this.getTabsElement(item.folder, 'api'),
                    {
                      selector: 'doc-anchor',
                      property: {
                        tag: 'h2',
                        content: '服务',
                      },
                    },
                  ] as DocBase['toJson'])
                    .concat(...servicesFilter.map(({ toJson }) => toJson))
                    .concat([
                      {
                        selector: 'doc-anchor',
                        property: {
                          tag: 'h2',
                          content: '装饰器',
                        },
                      },
                    ])
                    .concat(...decoratorsFilter.map(({ toJson }) => toJson)),
                },
                { selector: 'doc-catalog', property: { selector: 'doc-content' } },
              ],
            },
          ],
        };
      }) as DocBase[]),
      navigation,
    ];
  }
  mergeApiDocs() {}

  getNavigation(modules: DocModule[]) {
    let docNavigation = new DocNavigation();
    docNavigation.id = 'navigation';
    docNavigation.aliases = ['navigation'];
    docNavigation.name = 'navigation';
    docNavigation.templatename = 'navigation.template.json';
    docNavigation.sideNavToJson = modules.map((module) => {
      return {
        title: module.name,
        url: 'overview/' + module.folder,
        // tabs: [
        //   // { title: '简介', url: `module/${module.templatename}/overview`, contentCatalog: true },
        //   // { title: '接口', url: `module/${module.templatename}/api`, contentCatalog: true },
        // ],
      };
    });
    return docNavigation;
  }
  getTabsElement(name: string, prefix: 'overview' | 'api'): ElementItem {
    return {
      selector: 'doc-tabs',
      property: [
        { title: '简介', url: `overview/${name}`, selected: prefix == 'overview' ? true : false },
        { title: '接口', url: `api/${name}`, selected: prefix == 'api' ? true : false },
      ],
    };
  }
}
