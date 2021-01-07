import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocCodeExampleComponent } from './doc-code-example.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CodeHighlightModule } from '../code-highlight/code-highlight.module';

@NgModule({
  imports: [CommonModule, MatCardModule, MatExpansionModule, MatIconModule, MatButtonModule, MatTabsModule, CodeHighlightModule],
  declarations: [DocCodeExampleComponent],
  exports: [DocCodeExampleComponent],
})
export class DocCodeExampleModule {
  entry = DocCodeExampleComponent;
}
