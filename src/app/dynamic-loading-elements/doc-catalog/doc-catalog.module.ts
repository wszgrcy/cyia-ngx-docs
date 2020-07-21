import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocCatalogComponent } from './doc-catalog.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  declarations: [DocCatalogComponent],
})
export class DocCatalogModule {
  entry = DocCatalogComponent;
}
