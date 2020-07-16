import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorDescriptionComponent } from './decorator-description.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DecoratorDescriptionComponent],
})
export class DecoratorDescriptionModule {
  entry = DecoratorDescriptionComponent;
}
