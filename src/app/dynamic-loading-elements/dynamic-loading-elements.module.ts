import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DynamicLoadingElementsService } from './dynamic-loading-elements.service';
import { LAZY_ROUTES } from '@dynamic-loading-elements/dynamic-loading-elements.const';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(LAZY_ROUTES)],
  exports: [],
  providers: [DynamicLoadingElementsService],
})
export class DynamicLoadingElementsModule {}
