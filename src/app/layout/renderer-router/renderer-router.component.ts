import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouterData } from '../../selector/router-data.selector';
import { DynamicLoadingElementsService } from '@dynamic-loading-elements/dynamic-loading-elements.service';
import { Observable } from 'rxjs';
import { RouterDataEntity } from '@resource-entity/router-data.entity';
import { map, filter } from 'rxjs/operators';
@Component({
  selector: 'app-renderer-router',
  templateUrl: './renderer-router.component.html',
  styleUrls: ['./renderer-router.component.scss'],
})
export class RendererRouterComponent implements OnInit {
  // routerData$: Observable<any[]>;
  hostElement: HTMLElement;
  containerElement: HTMLElement;
  constructor(
    private router: Router,
    private store: Store,
    private dynamicLoadingElementsService: DynamicLoadingElementsService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.hostElement = this.elementRef.nativeElement;
    this.router.onSameUrlNavigation = 'reload';
    console.log('重载');
  }

  ngOnInit() {
    this.store
      .pipe(
        selectRouterData,
        map((list) => list[this.router.url.replace(/^\/doc/, '')]),
        filter((e) => !!e)
      )
      .subscribe((list: RouterDataEntity[]) => {
        console.log('待渲染列表', list);
        this.dynamicLoadingElementsService.generateElement(list).then(() => {
          if (this.containerElement) {
            this.renderer.removeChild(this.hostElement, this.containerElement);
          }
          this.renderer.appendChild(
            this.hostElement,
            (this.containerElement = this.renderer.createElement('div'))
          );
          list.map((item) => {
            let el = document.createElement(item.selector);
            if (item.content) {
              el.innerText = item.content;
            }
            if (item.property) {
              (el as any).ngInputProperty = item.property;
            }
            this.renderer.appendChild(this.containerElement, el);
          });
        });
      });
  }
}
