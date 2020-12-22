import { Injectable, NgModuleFactory, Compiler, Injector } from '@angular/core';
import { LAZY_ROUTES } from './dynamic-loading-elements.const';
import { createCustomElement } from '@angular/elements';
import { DynamicLoadingElement } from '@project-types';
@Injectable({
  providedIn: 'root',
})
export class DynamicLoadingElementsService {
  loadedElement: { [name: string]: boolean } = {};
  constructor(private compiler: Compiler, private injector: Injector) {}

  private async _loadingElement(rendererData: DynamicLoadingElement) {
    if (this.loadedElement[rendererData.selector]) {
      return;
    }
    this.loadedElement[rendererData.selector] = true;
    const findElemkent = LAZY_ROUTES.find((item) => item.selector === rendererData.selector);
    if (!findElemkent) {
      return;
    }
    const module = await findElemkent.loadChildren();
    let ngModuleFactory: NgModuleFactory<any>;
    if (module instanceof NgModuleFactory) {
      ngModuleFactory = module;
    } else {
      ngModuleFactory = await this.compiler.compileModuleAsync(module);
    }
    const moduleRef = ngModuleFactory.create(this.injector);
    const injector = moduleRef.injector;
    const customElementComponent = moduleRef.instance.entry;
    const CustomElement = createCustomElement(customElementComponent, {
      injector,
    });
    try {
      customElements.define(rendererData.selector, CustomElement);
    } catch (error) {
      console.error(error);
    }
    this.loadedElement[rendererData.selector] = true;
    return customElements.whenDefined(rendererData.selector);
  }

  async generateElement(list: DynamicLoadingElement[]) {
    return Promise.all(list.map((item) => this._loadingElement(item)));
  }
}
