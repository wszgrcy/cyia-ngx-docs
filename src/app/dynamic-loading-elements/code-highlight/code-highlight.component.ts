import { Component, ElementRef, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { MonacoService } from '../../services/monaco.service';
import { StoreService } from '../../store/store.service';
import { CodeHighlightStore } from '@project-store';
@Component({
  selector: 'code-highlight',
  templateUrl: './code-highlight.component.html',
  styleUrls: ['./code-highlight.component.scss'],
})
export class CodeHighlightComponent implements OnInit {
  @Input() index: number;
  @ViewChild('container', { static: true }) containerElementRef: ElementRef<HTMLDivElement>;
  constructor(
    private monacoService: MonacoService,
    private renderer: Renderer2,
    private storeService: StoreService
  ) {}

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.storeService
      .select(CodeHighlightStore)
      .pipe(
        map((item: any[]) => item[this.index]),
        filter((e) => e)
      )
      .subscribe(async (result) => {
        const monaco = await this.monacoService.monacoPromise;
        await this.monacoService.waitInit;
        await this.monacoService.registerLanguage(result.languageId);
        const languageId = await this.monacoService.getLanguageId(result.languageId);
        const render = await monaco.editor.colorize(result.content, languageId, {});
        this.renderer.setProperty(this.containerElementRef.nativeElement, 'innerHTML', render);
      });
  }
}
