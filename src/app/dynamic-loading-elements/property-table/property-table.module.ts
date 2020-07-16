import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyTableComponent } from './property-table.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule
  ],
  declarations: [PropertyTableComponent]
})
export class PropertyTableModule { 
  entry=PropertyTableComponent
}
