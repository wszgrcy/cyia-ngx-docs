import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ApplicationRef,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { DynamicLoadingElementsService } from '@dynamic-loading-elements/dynamic-loading-elements.service';
import { Observable, fromEvent } from 'rxjs';
import { RouterDataEntity } from '@resource-entity/router-data.entity';
import { map, filter, take } from 'rxjs/operators';
import { StoreService } from '../../store/store.service';
import { DocRendererStore } from '../../store/class/doc-renderer.store';
import { selectRouterData } from '@project-store';
import { RouterDataStore } from '../../store/class/router-data.store';
import { RouterService } from '../../services/router.service';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { DynamicLoadingComponent } from '../../types/dynamic-loading-element';
import { InputChange } from '../../utils/input-change';
@Component({
  selector: 'app-renderer-router',
  templateUrl: './renderer-router.component.html',
  styleUrls: ['./renderer-router.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RendererRouterComponent implements OnInit {
  waittingRendererComplete: Promise<void>[] = [];
  // routerData$: Observable<any[]>;
  hostElement: HTMLElement;
  containerElement: HTMLElement;
  componentRefList: ComponentRef<DynamicLoadingComponent>[] = [];
  oldComponentRefList: ComponentRef<DynamicLoadingComponent>[];
  constructor(
    private router: Router,
    private dynamicLoadingElementsService: DynamicLoadingElementsService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private storeService: StoreService,
    private routerService: RouterService,
    private applicationRef: ApplicationRef
  ) {
    this.hostElement = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.storeService
      .select(RouterDataStore)
      .pipe(
        selectRouterData,
        map((list) => {
          return list[this.routerService.getPlainUrl()];
        }),
        filter((e) => !!e)
      )
      .subscribe(async (list: RouterDataEntity[]) => {
        this.dynamicLoadingElementsService.elementIndex = 0;
        this.oldComponentRefList = this.componentRefList;
        this.componentRefList = [];
        InputChange.clear();
        this.storeService.getStore(DocRendererStore).RESET({ link: this.router.url });
        const elList = await this.registerElement(list);
        if (this.containerElement) {
          this.renderer.removeChild(this.hostElement, this.containerElement);
        }
        this.containerElement = this.renderer.createElement('div');
        elList.forEach((el) => {
          this.renderer.appendChild(this.containerElement, el);
        });
        this.renderer.appendChild(this.hostElement, this.containerElement);
        requestAnimationFrame(() => {
          this.oldComponentRefList.forEach((item) => item.destroy());
          this.oldComponentRefList = undefined;
        });
        this.componentRefList.forEach((ref) => this.applicationRef.attachView(ref.hostView));
        // doc 等待渲染完成
        await Promise.all(this.waittingRendererComplete);
        this.waittingRendererComplete = [];
        this.cd.detectChanges();
        this.storeService.getStore(DocRendererStore).COMPLETE();
        console.log('完全渲染完成');
      });
  }

  /**
   * 从列表中循环注册元素并创建元素
   *
   * @author cyia
   * @date 2020-07-19
   * @param list
   * @returns
   */
  async registerElement(list: RouterDataEntity[]) {
    const elList: HTMLElement[] = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      const factory = (await this.dynamicLoadingElementsService.generateElement([element]))[0];
      let el: HTMLElement;
      let childElementList: HTMLElement[] = [];
      if (element.children && element.children.length) {
        childElementList = await this.registerElement(element.children);
      }
      if (factory) {
        this.storeService
          .getStore(ElementInputPropertyStore)
          .ADD({ index: this.dynamicLoadingElementsService.elementIndex, property: element.property });
        const ref = factory(element.content || childElementList, { index: this.dynamicLoadingElementsService.elementIndex++ });
        el = ref.location.nativeElement;
        // todo 这里需要用父级
        this.componentRefList.push(ref);
        if (ref.instance.renderFinish) {
          this.waittingRendererComplete.push(ref.instance.renderFinish.pipe(take(1)).toPromise());
        }
      } else {
        el = this.renderer.createElement(element.selector);
        if (element.content) {
          el.innerText = element.content;
        }
        childElementList.forEach((childEl) => {
          this.renderer.appendChild(el, childEl);
        });
      }

      elList.push(el);
    }
    return elList;
  }
}
