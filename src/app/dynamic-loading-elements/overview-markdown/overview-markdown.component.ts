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
@Component({
  selector: 'overview-markdown',
  templateUrl: './overview-markdown.component.html',
  styleUrls: ['./overview-markdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ceshi',
    rendererFinish: 'true',
  },
})
export class OverviewMarkdownComponent implements OnInit, OnChanges {
  waitingLoadElement: Promise<void[]>[] = [];
  @Input() ngInputProperty;
  rendererValue: SafeHtml;
  @Input() @Output() rendererFinish = new EventEmitter();
  constructor(
    private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private dynamicLoadingElements: DynamicLoadingElementsService
  ) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.rendererFinish);
    this.renderer();
  }

  async renderer() {
    const mdres = md({
      html: true,
    });
    mdres.use(TableExtend);
    mdres.renderer.rules.table_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const attrStr = token.attrs.map((item) => `${item[0]}='${item[1]}'`).join(' ');
      console.log(attrStr);
      this.waitingLoadElement.push(this.dynamicLoadingElements.generateElement([{ selector: 'base-table' }]));
      return `<${token.tag} ${attrStr}>`;
    };
    await Promise.all(this.waitingLoadElement);
    this.rendererValue = this.domSanitizer.bypassSecurityTrustHtml(mdres.render(this.ngInputProperty));
    // console.log(this.value, this.rendererValue);
    this.cd.detectChanges();

    console.log('结束');
    this.rendererFinish.emit();
  }
  // @HostBinding('rendererFinish')
  // rendererFinish1() {
  //   return this.rendererFinish.pipe(take(1)).toPromise();
  // }
}
