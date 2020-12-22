import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeHighlightComponent } from './code-highlight.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CodeHighlightComponent],
})
export class CodeHighlightModule {
  entry = CodeHighlightComponent;
}
