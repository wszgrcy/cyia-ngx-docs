import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocTabsComponent } from './doc-tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [CommonModule, MatTabsModule, RouterModule],
  declarations: [DocTabsComponent],
  exports: [DocTabsComponent],
})
export class DocTabsModule {
  entry = DocTabsComponent;
}
