import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewMarkdownComponent } from './overview-markdown.component';
import { CyiaMonacoTextmateModule } from 'cyia-ngx-common/monaco-textmate';

@NgModule({
  imports: [CommonModule, CyiaMonacoTextmateModule.forRoot()],
  declarations: [OverviewMarkdownComponent],
})
export class OverviewMarkdownModule {
  entry = OverviewMarkdownComponent;
}
