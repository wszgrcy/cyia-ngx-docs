import { Route, LoadChildren, LoadChildrenCallback } from '@angular/router';
import { NgModuleFactory } from '@angular/core';
interface SelectorRoute extends Route {
  // [k in keyof Route]: Route[k];
  selector: string;
  //   loadChildren: () => Promise<any>;
  loadChildren: LoadChildrenCallback;
}
export const LAZY_ROUTES: SelectorRoute[] = [
  {
    path: 'lazyLoader/doc-tabs',
    selector: 'doc-tabs',
    loadChildren: () =>
      import('@dynamic-loading-elements/doc-tabs/doc-tabs.module').then(
        (e) => e.DocTabsModule
      ),
  },
  {
    path: 'lazyLoader/overview-markdown',
    selector: 'overview-markdown',
    loadChildren: () =>
      import(
        '@dynamic-loading-elements/overview-markdown/overview-markdown.module'
      ).then((e) => e.OverviewMarkdownModule),
  },
  {
    path: 'lazyLoader/service-name',
    selector: 'service-name',
    loadChildren: () =>
      import('@dynamic-loading-elements/service-name/service-name.module').then(
        (e) => e.ServiceNameModule
      ),
  },
  {
    path: 'lazyLoader/service-description',
    selector: 'service-description',
    loadChildren: () =>
      import(
        '@dynamic-loading-elements/service-description/service-description.module'
      ).then((e) => e.ServiceDescriptionModule),
  },
  {
    path: 'lazyLoader/method-table',
    selector: 'method-table',
    loadChildren: () =>
      import('@dynamic-loading-elements/method-table/method-table.module').then(
        (e) => e.MethodTableModule
      ),
  },
  {
    path: 'lazyLoader/property-table',
    selector: 'property-table',
    loadChildren: () =>
      import(
        '@dynamic-loading-elements/property-table/property-table.module'
      ).then((e) => e.PropertyTableModule),
  },
  {
    path: 'lazyLoader/decorator-name',
    selector: 'decorator-name',
    loadChildren: () =>
      import(
        '@dynamic-loading-elements/decorator-name/decorator-name.module'
      ).then((e) => e.DecoratorNameModule),
  },
  {
    path: 'lazyLoader/decorator-description',
    selector: 'decorator-description',
    loadChildren: () =>
      import(
        '@dynamic-loading-elements/decorator-description/decorator-description.module'
      ).then((e) => e.DecoratorDescriptionModule),
  },
  {
    path: 'lazyLoader/doc-catalog',
    selector: 'doc-catalog',
    loadChildren: () =>
      import('@dynamic-loading-elements/doc-catalog/doc-catalog.module').then(
        (e) => e.DocCatalogModule
      ),
  },
  {
    path: 'lazyLoader/flex-layout',
    selector: 'flex-layout',
    loadChildren: () =>
      import('@dynamic-loading-elements/flex-layout/flex-layout.module').then(
        (e) => e.FlexLayoutModule
      ),
  },
  {
    path: 'lazyLoader/doc-content',
    selector: 'doc-content',
    loadChildren: () =>
      import('@dynamic-loading-elements/doc-content/doc-content.module').then(
        (e) => e.DocContentModule
      ),
  },
  {
    path: 'lazyLoader/doc-anchor',
    selector: 'doc-anchor',
    loadChildren: () =>
      import('@dynamic-loading-elements/doc-anchor/doc-anchor.module').then(
        (e) => e.DocAnchorModule
      ),
  },
  {
    path: 'lazyLoader/base-table',
    selector: 'base-table',
    loadChildren: () =>
      import('../components/base-table/base-table.module').then(
        (e) => e.BaseTableModule
      ),
  },
];
