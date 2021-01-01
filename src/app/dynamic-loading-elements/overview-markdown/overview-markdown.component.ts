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
  ViewChild,
  ComponentRef,
} from '@angular/core';
import md from 'markdown-it';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TableExtend } from './plugins/table.extend';
import { DynamicLoadingElementsService } from '../dynamic-loading-elements.service';
import { OnChanges, ElementRef, Renderer2, ViewContainerRef, ApplicationRef } from '@angular/core';
import { HeadingExtend } from './plugins/heading.extend';
import { StoreService } from '../../store/store.service';
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
  dynamicLoadingElementMap = new Map<number, string>();
  componentRefList: ComponentRef<any>[] = [];
  @ViewChild('container', { static: true }) containerElementRef: ElementRef<HTMLElement>;
  constructor(
    // private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private dynamicLoadingElementsService: DynamicLoadingElementsService,
    private storeService: StoreService,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private applicationRef: ApplicationRef
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
          const selector = 'code-highlight';
          this.dynamicLoadingElementsService.generateElement([{ selector: selector }]);
          this.storeService.getStore(ElementInputPropertyStore).ADD({
            index: this.dynamicLoadingElementsService.elementIndex,
            property: {
              content: str,
              languageId: lang,
            },
          });
          this.dynamicLoadingElementMap.set(this.dynamicLoadingElementsService.elementIndex, selector);
          return `<${selector} index="${this.dynamicLoadingElementsService.elementIndex++}"></${selector}>`;
        } catch (__) {}

        return '';
      },
    });
    mdres.use(TableExtend).use(HeadingExtend);
    // todo 可能需要改成index那种用第三方进行赋值
    mdres.renderer.rules.table_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      this.storeService.getStore(ElementInputPropertyStore).ADD({
        index: this.dynamicLoadingElementsService.elementIndex,
        property: token.attrs.reduce((pre, cur) => {
          pre[cur[0]] = cur[1];
          return pre;
        }, {}),
      });
      this.dynamicLoadingElementMap.set(this.dynamicLoadingElementsService.elementIndex, token.tag);
      return `<${token.tag} index="${this.dynamicLoadingElementsService.elementIndex++}">`;
    };
    // todo 可能需要改成index那种用第三方进行赋值
    mdres.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      this.storeService.getStore(ElementInputPropertyStore).ADD({
        index: this.dynamicLoadingElementsService.elementIndex,
        property: token.attrs.reduce((pre, cur) => {
          pre[cur[0]] = cur[1];
          return pre;
        }, {}),
      });
      this.dynamicLoadingElementMap.set(this.dynamicLoadingElementsService.elementIndex, token.tag);

      return `<${token.tag} index="${this.dynamicLoadingElementsService.elementIndex++}">`;
    };
    const content = mdres.render(this.content);
    const templateElement: HTMLTemplateElement = this.renderer2.createElement('template');
    templateElement.innerHTML = content;
    const replaceNodePromiseList = [];
    this.dynamicLoadingElementMap.forEach((value, key) => {
      const node = templateElement.content.querySelector(`[index="${key}"]`);
      replaceNodePromiseList.push(
        this.dynamicLoadingElementsService
          .generateElement([{ selector: value }])
          .then(([factory]) => {
            return factory(undefined, { index: key });
          })
          .then((ref) => {
            this.componentRefList.push(ref);
            this.applicationRef.attachView(ref.hostView);
            return ref.location.nativeElement as HTMLElement;
          })
          .then((element) => {
            return node.parentNode.replaceChild(element, node);
          })
      );
    });
    await Promise.all(replaceNodePromiseList);
    this.containerElementRef.nativeElement.appendChild(templateElement.content);
    await Promise.all(this.waitingLoadElement);
    this.cd.detectChanges();
    this.renderFinish.emit();
  }
  ngOnDestroy(): void {
    this.componentRefList.forEach((item) => item.destroy());
    this.componentRefList = undefined;
  }
}
