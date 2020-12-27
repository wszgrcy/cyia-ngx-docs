import { Renderer2, ViewChild, OnChanges, Output, EventEmitter } from '@angular/core';
import { Component, OnInit, Input, SimpleChanges, ElementRef } from '@angular/core';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'doc-anchor',
  templateUrl: './doc-anchor.component.html',
  styleUrls: ['./doc-anchor.component.scss'],
})
export class DocAnchorComponent implements OnInit, OnChanges {
  @Input() ngInputProperty: { tag: string; content: string };
  @Input() nginputproperty: { tag: string; content: string };
  hostElement: HTMLElement;
  @ViewChild('anchorContainer', { static: true }) anchorContainer: ElementRef;

  href: string;
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private routerService: RouterService) {
    this.hostElement = elementRef.nativeElement;

    this.href = this.routerService.getPlainUrl();
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (typeof this.nginputproperty === 'string') {
      this.ngInputProperty = JSON.parse(this.nginputproperty);
    }
    const el = document.createElement(this.ngInputProperty.tag);
    el.id = this.ngInputProperty.content;
    el.innerText = this.ngInputProperty.content;
    this.renderer.appendChild(this.hostElement, el);
  }
}
