import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MethodTableComponent } from './method-table.component';
import { MatTable, MatTableModule } from '@angular/material/table';
@NgModule({
  imports: [CommonModule, MatTableModule],
  declarations: [MethodTableComponent],
})
export class MethodTableModule {
  entry = MethodTableComponent;
}
