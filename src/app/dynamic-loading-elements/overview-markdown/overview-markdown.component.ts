import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import md from 'markdown-it';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TableExtend } from './plugins/table.extend';
import { DynamicLoadingElementsService } from '../dynamic-loading-elements.service';
import { OnChanges, ElementRef } from '@angular/core';
import { HeadingExtend } from './plugins/heading.extend';
import { StoreService } from '../../store/store.service';
import { CodeHighlightStore } from '@project-store';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { inputPropertyChange } from '../../utils/input-property-change';
import { elementInputPropertySelector } from '../../store/selector/element-input.selector';
@Component({
  selector: 'overview-markdown',
  templateUrl: './overview-markdown.component.html',
  styleUrls: ['./overview-markdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewMarkdownComponent implements OnInit, OnChanges {
  @Input() index;
  waitingLoadElement: Promise<void[]>[] = [];
  @Input() content: string;
  rendererValue: SafeHtml;
  @Input() @Output() renderFinish = new EventEmitter();
  constructor(
    private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private dynamicLoadingElements: DynamicLoadingElementsService,
    private storeService: StoreService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (inputPropertyChange(changes.index, this.index)) {
      this.storeService
        .select(ElementInputPropertyStore)
        .pipe(elementInputPropertySelector(this.index))
        .subscribe((property) => {
          this.content = property;
          this.renderer();
        });
    }
  }

  async renderer() {
    const mdres = md({
      html: true,
      highlight: (str, lang) => {
        try {
          this.dynamicLoadingElements.generateElement([{ selector: 'code-highlight' }]);
          this.storeService.getStore(CodeHighlightStore).GENERATE({
            index: this.dynamicLoadingElements.elementIndex,
            content: str,
            languageId: lang,
          });
          return `<code-highlight index="${this.dynamicLoadingElements.elementIndex++}"></code-highlight>`;
        } catch (__) {}

        return '';
      },
    });
    mdres.use(TableExtend).use(HeadingExtend);
    // todo 可能需要改成index那种用第三方进行赋值
    mdres.renderer.rules.table_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      console.log('token', token);
      this.waitingLoadElement.push(this.dynamicLoadingElements.generateElement([{ selector: 'base-table' }]));
      this.storeService.getStore(ElementInputPropertyStore).ADD({
        index: this.dynamicLoadingElements.elementIndex,
        property: token.attrs.reduce((pre, cur) => {
          pre[cur[0]] = cur[1];
          return pre;
        }, {}),
      });
      return `<${token.tag} index="${this.dynamicLoadingElements.elementIndex++}">`;
    };
    // todo 可能需要改成index那种用第三方进行赋值
    mdres.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      this.waitingLoadElement.push(this.dynamicLoadingElements.generateElement([{ selector: 'doc-anchor' }]));
      this.storeService.getStore(ElementInputPropertyStore).ADD({
        index: this.dynamicLoadingElements.elementIndex,
        property: token.attrs.reduce((pre, cur) => {
          pre[cur[0]] = cur[1];
          return pre;
        }, {}),
      });
      return `<${token.tag} index="${this.dynamicLoadingElements.elementIndex++}">`;
    };
    this.rendererValue = this.domSanitizer.bypassSecurityTrustHtml(mdres.render(this.content));
    await Promise.all(this.waitingLoadElement);
    this.cd.detectChanges();
    this.renderFinish.emit();
  }
}
