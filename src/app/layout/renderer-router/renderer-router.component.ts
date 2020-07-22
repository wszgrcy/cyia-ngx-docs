import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouterData } from '../../selector/router-data.selector';
import { DynamicLoadingElementsService } from '@dynamic-loading-elements/dynamic-loading-elements.service';
import { Observable, fromEvent } from 'rxjs';
import { RouterDataEntity } from '@resource-entity/router-data.entity';
import { map, filter, take } from 'rxjs/operators';
import * as docRenderer from '@rxactions/doc-renderer.actions';
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
    private store: Store,
    private dynamicLoadingElementsService: DynamicLoadingElementsService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {
    this.hostElement = this.elementRef.nativeElement;
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    this.store
      .pipe(
        selectRouterData,
        map((list) => {
          console.log('查询', this.router.url);
          return list[this.router.url.replace(/^\/doc/, '').replace(/#.*/, '')];
        }),
        filter((e) => !!e)
      )
      .subscribe(async (list: RouterDataEntity[]) => {
        this.store.dispatch(docRenderer.RESET({ link: this.router.url }));
        if (this.containerElement) {
          this.renderer.removeChild(this.hostElement, this.containerElement);
        }
        this.renderer.appendChild(
          this.hostElement,
          (this.containerElement = this.renderer.createElement('div'))
        );
        const elList = await this.registerElement(list);
        elList.forEach((el) => {
          this.renderer.appendChild(this.containerElement, el);
        });

        // doc 等待渲染完成
        await Promise.all(this.waittingRendererComplete);
        this.cd.detectChanges();
        this.store.dispatch(docRenderer.COMPLETE());
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
        (el as any).ngInputProperty = element.property;
      }
      if (element.children && element.children.length) {
        const childElList = await this.registerElement(element.children);
        childElList.forEach((childEl) => {
          this.renderer.appendChild(el, childEl);
        });
      }

      // await fromEvent(el, 'renderFinish').pipe(take(1)).toPromise();
      elList.push(el);
      if ('renderFinish' in el) {
        this.waittingRendererComplete.push(
          fromEvent(el, 'renderFinish').pipe(take(1)).toPromise() as any
        );
      }
    }
    return elList;
  }
}
