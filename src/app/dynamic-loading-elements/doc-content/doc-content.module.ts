import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocContentComponent } from './doc-content.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DocContentComponent],
})
export class DocContentModule {
  entry = DocContentComponent;
}
