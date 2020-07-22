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
import { take } from 'rxjs/operators';
import { OnChanges } from '@angular/core';
import { HeadingExtend } from './plugins/heading.extend';
import hljs from 'highlight.js';
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
  constructor(
    private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private dynamicLoadingElements: DynamicLoadingElementsService
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
        if (lang && hljs.getLanguage(lang)) {
          try {
            const hl = hljs.highlight(lang, str, true);
            console.log(hl);
            return `<pre class="hljs"><code class="language-${lang}">${hl.value}</code></pre>`;
          } catch (__) {}
        }

        return ''; // use external default escaping
      },
    });
    mdres.use(TableExtend).use(HeadingExtend);

    mdres.renderer.rules.table_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const attrStr = token.attrs.map((item) => `${item[0]}='${item[1]}'`).join(' ');
      console.log(attrStr);
      this.waitingLoadElement.push(this.dynamicLoadingElements.generateElement([{ selector: 'base-table' }]));
      return `<${token.tag} ${attrStr}>`;
    };
    mdres.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const attrStr = token.attrs.map((item) => `${item[0]}='${item[1]}'`).join(' ');
      // console.log('添加');
      this.waitingLoadElement.push(this.dynamicLoadingElements.generateElement([{ selector: 'doc-anchor' }]));
      return `<${token.tag} ${attrStr}>`;
    };
    this.rendererValue = this.domSanitizer.bypassSecurityTrustHtml(mdres.render(this.ngInputProperty));
    await Promise.all(this.waitingLoadElement);
    // console.log('初始化完成');
    this.cd.detectChanges();
    // console.log(document.querySelector('doc-anchor'));
    // this.waitRenderFinish();
    this.renderFinish.emit();
  }
  // async waitRenderFinish() {
  //   const list = document.querySelectorAll('doc-anchor,base-table');
  //   for (let i = 0; i < list.length; i++) {
  //     const element = list[i];
  //     console.dir(element);
  //     // debugger;
  //     if ('renderFinish' in element) {
  //       console.log('有');
  //     }
  //   }
  // }
}
