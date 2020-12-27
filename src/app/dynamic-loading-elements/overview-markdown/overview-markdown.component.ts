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
import { OnChanges } from '@angular/core';
import { HeadingExtend } from './plugins/heading.extend';
import { StoreService } from '../../store/store.service';
import { CodeHighlightStore } from '@project-store';
@Component({
  selector: 'overview-markdown',
  templateUrl: './overview-markdown.component.html',
  styleUrls: ['./overview-markdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewMarkdownComponent implements OnInit, OnChanges {
  waitingLoadElement: Promise<void[]>[] = [];
  @Input() ngInputProperty;
  rendererValue: SafeHtml;
  @Input() @Output() renderFinish = new EventEmitter();
  codeIndex = 0;
  constructor(
    private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private dynamicLoadingElements: DynamicLoadingElementsService,
    private storeService: StoreService
  ) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.ngInputProperty && changes['ngInputProperty']) {
      this.renderer();
    }
  }

  async renderer() {
    const mdres = md({
      html: true,
      highlight: (str, lang) => {
        try {
          this.dynamicLoadingElements.generateElement([{ selector: 'code-highlight' }]);
          this.storeService.getStore(CodeHighlightStore).GENERATE({
            index: this.codeIndex,
            content: str,
            languageId: lang,
          });
          return `<code-highlight index="${this.codeIndex++}"></code-highlight>`;
        } catch (__) {}

        return '';
      },
    });
    mdres.use(TableExtend).use(HeadingExtend);
    // todo 可能需要改成index那种用第三方进行赋值
    mdres.renderer.rules.table_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const attrStr = token.attrs.map((item) => `${item[0]}='${item[1]}'`).join(' ');
      this.waitingLoadElement.push(this.dynamicLoadingElements.generateElement([{ selector: 'base-table' }]));
      return `<${token.tag} ${attrStr}>`;
    };
    // todo 可能需要改成index那种用第三方进行赋值
    mdres.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const attrStr = token.attrs.map((item) => `${item[0]}='${item[1]}'`).join(' ');
      this.waitingLoadElement.push(this.dynamicLoadingElements.generateElement([{ selector: 'doc-anchor' }]));
      return `<${token.tag} ${attrStr}>`;
    };
    this.rendererValue = this.domSanitizer.bypassSecurityTrustHtml(mdres.render(this.ngInputProperty));
    await Promise.all(this.waitingLoadElement);
    this.cd.detectChanges();
    this.renderFinish.emit();
  }
}
