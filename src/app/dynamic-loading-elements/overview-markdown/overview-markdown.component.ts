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
import * as monaco from 'monaco-editor';
import { HttpClient } from '@angular/common/http';
import { CyiaMonacoTextmateService } from 'cyia-ngx-common/monaco-textmate';
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
    private httpClient: HttpClient,
    private service: CyiaMonacoTextmateService
  ) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.ngInputProperty && changes['ngInputProperty']) {
      this.renderer();
    }
  }

  async renderer() {
    this.service.setMonaco(monaco);
    await this.service.init();
    const themeList = await this.service.getThemeList();
    const theme = await this.service.defineTheme(themeList[1]);
    monaco.editor.setTheme(theme);
    await this.service.manualRegisterLanguage('typescript');
    const mdres = md({
      html: true,
      highlight: (str, lang) => {
        try {
          const divEl = document.createElement('div');
          divEl.classList.add('monaco-editor');
          divEl.innerHTML = str;
          divEl.setAttribute('data-lang', 'typescript');
          const codeIndex = this.codeIndex;

          monaco.editor.colorizeElement(divEl, { tabSize: 4, theme: theme }).then(() => {
            setTimeout(() => {
              document.querySelector(`#code-${codeIndex}`).appendChild(divEl);
            }, 100);
          });
          return `<pre class="hljs" id="code-${this.codeIndex++}"></pre>`;
        } catch (__) {}

        return '';
      },
    });
    mdres.use(TableExtend).use(HeadingExtend);

    mdres.renderer.rules.table_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const attrStr = token.attrs.map((item) => `${item[0]}='${item[1]}'`).join(' ');
      this.waitingLoadElement.push(this.dynamicLoadingElements.generateElement([{ selector: 'base-table' }]));
      return `<${token.tag} ${attrStr}>`;
    };
    mdres.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const attrStr = token.attrs.map((item) => `${item[0]}='${item[1]}'`).join(' ');
      this.waitingLoadElement.push(this.dynamicLoadingElements.generateElement([{ selector: 'doc-anchor' }]));
      return `<${token.tag} ${attrStr}>`;
    };
    this.rendererValue = this.domSanitizer.bypassSecurityTrustHtml(mdres.render(this.ngInputProperty));
    await Promise.all(this.waitingLoadElement);
    this.cd.detectChanges();
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
  //     }
  //   }
  // }
}
