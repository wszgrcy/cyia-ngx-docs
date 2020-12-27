import { Component, OnInit, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  constructor(
    private router: Router,
    private dynamicLoadingElementsService: DynamicLoadingElementsService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private storeService: StoreService,
    private routerService: RouterService
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
        this.storeService.getStore(DocRendererStore).RESET({ link: this.router.url });
        if (this.containerElement) {
          this.renderer.removeChild(this.hostElement, this.containerElement);
        }
        this.renderer.appendChild(this.hostElement, (this.containerElement = this.renderer.createElement('div')));
        const elList = await this.registerElement(list);
        elList.forEach((el) => {
          this.renderer.appendChild(this.containerElement, el);
        });

        // doc 等待渲染完成
        await Promise.all(this.waittingRendererComplete);
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
      await this.dynamicLoadingElementsService.generateElement([element]);
      const el: HTMLElement = this.renderer.createElement(element.selector);
      if (element.content) {
        el.innerText = element.content;
      }
      if (element.property) {
        this.storeService
          .getStore(ElementInputPropertyStore)
          .ADD({ index: this.dynamicLoadingElementsService.elementIndex, property: element.property });
        (el as any).index = this.dynamicLoadingElementsService.elementIndex++;
      }
      if (element.children && element.children.length) {
        const childElList = await this.registerElement(element.children);
        childElList.forEach((childEl) => {
          this.renderer.appendChild(el, childEl);
        });
      }

      elList.push(el);
      const waitElement = this.dynamicLoadingElementsService.waitElementRenderFinish(el);
      if (waitElement) {
        this.waittingRendererComplete.push(waitElement);
      }
    }
    return elList;
  }
}
