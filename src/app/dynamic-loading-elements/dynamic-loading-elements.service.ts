import {
  Injectable,
  NgModuleFactory,
  Compiler,
  Injector,
  ComponentFactoryResolver,
  CompilerFactory,
  ComponentFactory,
  ComponentRef,
} from '@angular/core';
import { LAZY_ROUTES } from './dynamic-loading-elements.const';
import { DynamicLoadingElement } from '@project-types';
import { fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import { InputChange } from '../utils/input-change';
import { DynamicLoadingComponent } from '../types/dynamic-loading-element';
@Injectable({
  providedIn: 'root',
})
export class DynamicLoadingElementsService {
  elementIndex = 0;
  loadedElement: { [name: string]: Promise<ReturnType<DynamicLoadingElementsService['createElementFactory']>> } = {};
  constructor(private compiler: Compiler, private injector: Injector, private componentFactoryResolver: ComponentFactoryResolver) {}

  private async _loadingElement(selector: string) {
    const findElemkent = LAZY_ROUTES.find((item) => item.selector === selector);
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
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(moduleRef.instance.entry);
    const factory = this.createElementFactory(injector, componentFactory);
    return factory;
  }
  private createElementFactory(injector: Injector, componentFactory: ComponentFactory<any>) {
    return (content: string | HTMLElement[], parameters: { [name: string]: any }) => {
      let nodes: any[][];
      if (typeof content === 'string') {
        nodes = [[document.createTextNode(content)]];
      } else {
        nodes = [content];
      }
      const componentRef: ComponentRef<DynamicLoadingComponent> = componentFactory.create(injector, nodes);
      for (const key in parameters) {
        if (Object.prototype.hasOwnProperty.call(parameters, key)) {
          const element = parameters[key];
          componentRef.instance[key] = element;
        }
      }
      if (componentRef.instance.ngOnChanges) {
        componentRef.instance.ngOnChanges(InputChange.create(componentRef.instance, parameters));
      }
      return componentRef;
    };
  }
  async generateElement(list: DynamicLoadingElement[]): Promise<ReturnType<DynamicLoadingElementsService['createElementFactory']>[]> {
    return Promise.all(
      list.map((item) => {
        if (this.loadedElement[item.selector]) {
          return this.loadedElement[item.selector];
        }
        this.loadedElement[item.selector] = this._loadingElement(item.selector);
        return this.loadedElement[item.selector];
      })
    );
  }
}
