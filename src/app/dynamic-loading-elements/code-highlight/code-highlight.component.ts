import { Component, ElementRef, Input, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';
import { GENERATE } from '@rxreducers';
import { filter, map } from 'rxjs/operators';
import { MonacoService } from '../../services/monaco.service';
import * as monaco from 'monaco-editor';
@Component({
  selector: 'code-highlight',
  templateUrl: './code-highlight.component.html',
  styleUrls: ['./code-highlight.component.scss'],
})
export class CodeHighlightComponent implements OnInit {
  @Input() index: number;
  constructor(private store: Store, private monacoService: MonacoService, private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.store
      .pipe(
        select(createFeatureSelector('codeHighlight')),
        map((item: any[]) => item[this.index]),
        filter((e) => e)
      )
      .subscribe(async (result) => {
        await this.monacoService.waitInit;
        await this.monacoService.registerLanguage(result.languageId);
        let render = await monaco.editor.colorize(result.content, 'typescript', { tabSize: 4 });
        let divEl: HTMLDivElement = this.renderer.createElement('div');
        divEl.innerHTML = render;
        this.renderer.appendChild(this.elementRef.nativeElement, divEl);
      });
  }
}
