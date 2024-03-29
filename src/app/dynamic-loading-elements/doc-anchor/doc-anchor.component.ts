import { Renderer2, ViewChild, OnChanges, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit, Input, SimpleChanges, ElementRef } from '@angular/core';
import { RouterService } from '../../services/router.service';
import { StoreService } from '../../store/store.service';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { elementInputPropertySelector } from '../../store/selector/element-input.selector';
import { inputPropertyChange } from '../../utils/input-property-change';

@Component({
  selector: 'doc-anchor',
  templateUrl: './doc-anchor.component.html',
  styleUrls: ['./doc-anchor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocAnchorComponent implements OnInit, OnChanges {
  @Input() index: string;
  hostElement: HTMLElement;
  @ViewChild('anchorContainer', { static: true }) anchorContainer: ElementRef;

  href: string;
  @Input() content: string;
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private routerService: RouterService,
    private storeService: StoreService
  ) {
    this.hostElement = elementRef.nativeElement;

    this.href = this.routerService.getPlainUrl();
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (inputPropertyChange(changes.index, this.index)) {
      this.storeService
        .select(ElementInputPropertyStore)
        .pipe(elementInputPropertySelector(this.index))
        .subscribe((property) => {
          this.content = property.content;
          const el: HTMLElement = this.renderer.createElement(property.tag);
          this.renderer.setAttribute(el, 'id', property.content);
          this.renderer.setProperty(el, 'innerText', property.content);
          this.renderer.appendChild(this.hostElement, el);
        });
    }
  }
}
