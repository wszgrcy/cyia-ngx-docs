import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutComponent } from './flex-layout.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FlexLayoutComponent],
})
export class FlexLayoutModule {
  entry = FlexLayoutComponent;
}
