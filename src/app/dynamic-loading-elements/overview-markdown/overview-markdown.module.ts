import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewMarkdownComponent } from './overview-markdown.component';

@NgModule({
  imports: [CommonModule],
  declarations: [OverviewMarkdownComponent],
})
export class OverviewMarkdownModule {
  entry = OverviewMarkdownComponent;
}
