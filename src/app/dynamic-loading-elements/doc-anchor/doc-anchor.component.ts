import { Renderer2, ViewChild, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'doc-anchor',
  templateUrl: './doc-anchor.component.html',
  styleUrls: ['./doc-anchor.component.scss'],
})
export class DocAnchorComponent implements OnInit, OnChanges {
  @Input() ngInputProperty: { tag: string; content: string };
  hostElement: HTMLElement;
  @ViewChild('anchorContainer', { static: true }) anchorContainer: ElementRef;
  href: string;
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public router: Router
  ) {
    this.hostElement = elementRef.nativeElement;
    const urlTree = this.router.parseUrl(this.router.url);
    urlTree.fragment = undefined;
    this.href = urlTree.toString();
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    const el = document.createElement(this.ngInputProperty.tag);
    el.id = this.ngInputProperty.content;
    el.innerText = this.ngInputProperty.content;
    this.renderer.appendChild(this.hostElement, el);
  }
}
