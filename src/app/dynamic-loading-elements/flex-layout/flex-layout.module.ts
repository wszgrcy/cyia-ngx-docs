import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutComponent } from './flex-layout.component';
import { FlexLayoutModule as AFlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [CommonModule, AFlexLayoutModule],
  declarations: [FlexLayoutComponent],
})
export class FlexLayoutModule {
  entry = FlexLayoutComponent;
}
