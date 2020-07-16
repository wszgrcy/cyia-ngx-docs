import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
  ],
  declarations: [ToolbarComponent],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
