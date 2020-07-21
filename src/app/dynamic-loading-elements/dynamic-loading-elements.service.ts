import {
  Injectable,
  ComponentFactoryResolver,
  NgModuleFactory,
  Compiler,
  Injector,
} from '@angular/core';
import { LAZY_ROUTES } from './dynamic-loading-elements.const';
import { createCustomElement } from '@angular/elements';
import { selectRouterData } from '../selector/router-data.selector';
@Injectable({
  providedIn: 'root',
})
export class DynamicLoadingElementsService {
  loadedElement = {};
  // loadingElement = {};
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,

    private compiler: Compiler,
    private injector: Injector
  ) {}

  private async _loadingElement(rendererData) {
    if (this.loadedElement[rendererData.selector]) { return; }
    this.loadedElement[rendererData.selector] = true;
    const findElemkent = LAZY_ROUTES.find(
      (item) => item.selector == rendererData.selector
    );
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
    moduleRef.injector;
    const injector = moduleRef.injector;
    const customElementComponent = moduleRef.instance.entry;
    // if (this.loadedElement[rendererData.selector]) return;
    const CustomElement = createCustomElement(customElementComponent, {
      injector,
    });
    // console.log(rendererData.selector);
    // if (this.loadedElement[rendererData.selector]) return;
    try {
      customElements!.define(rendererData.selector, CustomElement);
    } catch (error) {
      console.log('报错', error);
    }
    this.loadedElement[rendererData.selector] = true;
    return customElements.whenDefined(rendererData.selector).then(() => {});
  }

  async generateElement(list: any[]) {
    return Promise.all(list.map((item) => this._loadingElement(item)));
  }
  private async aot() {}
}
