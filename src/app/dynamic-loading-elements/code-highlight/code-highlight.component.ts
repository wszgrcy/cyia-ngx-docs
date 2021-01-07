import { Component, ElementRef, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { MonacoService } from '../../services/monaco.service';
import { StoreService } from '../../store/store.service';
import { inputPropertyChange } from '../../utils/input-property-change';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { elementInputPropertySelector } from '../../store/selector/element-input.selector';
@Component({
  selector: 'code-highlight',
  templateUrl: './code-highlight.component.html',
  styleUrls: ['./code-highlight.component.scss'],
})
export class CodeHighlightComponent implements OnInit {
  @Input() index;
  @Input() languageId: string;
  @Input() content: string;
  @ViewChild('container', { static: true }) containerElementRef: ElementRef<HTMLDivElement>;
  constructor(private monacoService: MonacoService, private renderer: Renderer2, private storeService: StoreService) {}

  ngOnInit() {}
  async ngOnChanges(changes: SimpleChanges) {
    if (inputPropertyChange(changes.index, this.index)) {
      this.storeService
        .select(ElementInputPropertyStore)
        .pipe(elementInputPropertySelector(this.index))
        .subscribe(async (result) => {
          const monaco = await this.monacoService.monacoPromise;
          await this.monacoService.waitInit;
          await this.monacoService.registerLanguage(result.languageId);
          const languageId = await this.monacoService.getLanguageId(result.languageId);
          const render = await monaco.editor.colorize(result.content, languageId, {});
          this.renderer.setProperty(this.containerElementRef.nativeElement, 'innerHTML', render);
        });
    }
    if (this.content && this.languageId) {
      const monaco = await this.monacoService.monacoPromise;
      await this.monacoService.waitInit;
      await this.monacoService.registerLanguage(this.languageId);
      const languageId = await this.monacoService.getLanguageId(this.languageId);
      const render = await monaco.editor.colorize(this.content, languageId, {});
      this.renderer.setProperty(this.containerElementRef.nativeElement, 'innerHTML', render);
    }
  }
}
