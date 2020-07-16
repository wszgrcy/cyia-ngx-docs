import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceDescriptionComponent } from './service-description.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ServiceDescriptionComponent],
})
export class ServiceDescriptionModule {
  entry = ServiceDescriptionComponent;
}
