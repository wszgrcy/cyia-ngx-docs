import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftSidenavMenuComponent } from './nav-menu.component';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LeftSidenavMenuComponent, NavItemComponent],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
  ],
  exports: [LeftSidenavMenuComponent],
  providers: [],
})
export class LeftSidenavMenuModule {}
