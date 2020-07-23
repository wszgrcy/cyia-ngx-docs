import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyTableComponent } from './property-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [CommonModule, MatTableModule, MatExpansionModule],
  declarations: [PropertyTableComponent],
})
export class PropertyTableModule {
  entry = PropertyTableComponent;
}
