import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceNameComponent } from './service-name.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ServiceNameComponent],
})
export class ServiceNameModule {
  entry = ServiceNameComponent;
}
