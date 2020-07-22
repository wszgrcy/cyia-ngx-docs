import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownLinkComponent } from './markdown-link.component';
import { RouterModule } from '@angular/router';
/**
 * todo 暂时未进行关联
 */
@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [MarkdownLinkComponent],
})
export class MarkdownLinkModule {}
