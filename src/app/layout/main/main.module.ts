import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LeftSidenavMenuModule } from '../navigation/nav-menu/nav-menu.module';
import { RendererRouterComponent } from '../renderer-router/renderer-router.component';
import { RendererRouterModule } from '../renderer-router/renderer-router.module';
import { DynamicLoadingElementsModule } from '../../dynamic-loading-elements/dynamic-loading-elements.module';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([{ path: '**', component: RendererRouterComponent }]),
    MatSidenavModule,
    LeftSidenavMenuModule,
    RendererRouterModule,
    DynamicLoadingElementsModule,
  ],
  declarations: [MainComponent],
  exports: [MainComponent],
})
export class MainModule {}
