import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MethodTableComponent } from './method-table.component';
import { MatTable, MatTableModule } from '@angular/material/table';
import { DocsChipModule } from '../../components/docs-chip/docs-chip.module';
@NgModule({
  imports: [CommonModule, MatTableModule, DocsChipModule],
  declarations: [MethodTableComponent],
})
export class MethodTableModule {
  entry = MethodTableComponent;
}
