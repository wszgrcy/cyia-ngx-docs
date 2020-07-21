import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocAnchorComponent } from './doc-anchor.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, MatIconModule, RouterModule],
  declarations: [DocAnchorComponent],
})
export class DocAnchorModule {
  entry = DocAnchorComponent;
}
