import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorNameComponent } from './decorator-name.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DecoratorNameComponent],
})
export class DecoratorNameModule {
  entry = DecoratorNameComponent;
}
