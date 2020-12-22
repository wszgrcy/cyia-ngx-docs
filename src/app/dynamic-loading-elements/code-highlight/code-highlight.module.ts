import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeHighlightComponent } from './code-highlight.component';
import { CyiaMonacoTextmateModule } from 'cyia-ngx-common/monaco-textmate';

@NgModule({
  imports: [CommonModule],
  declarations: [CodeHighlightComponent],
})
export class CodeHighlightModule {
  entry = CodeHighlightComponent;
}
