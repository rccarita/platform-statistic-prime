import { CommonModule } from '@angular/common';
import { Component, OnChanges, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent implements OnChanges {

  listData = input.required<any>();
  selectedDependency = input.required<any>();
  selectedAcronymName = input.required<any>();
  selectedSource = input.required<any>();
  selectedUnit = input.required<any>();
  selectedIndicatorName = input.required<any>();
  columns!: any[];
  exportColumns!: any[];
  dataSource!: any[]

  ngOnChanges(): void {
    this.valuesTable();

    this.columns = [
      { field: 'periodo', header: 'Periodo', sortable: true },
      { field: 'valor', header: 'Valor', sortable: true }
    ];
    this.exportColumns = this.columns.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  valuesTable() {
    if (this.listData) {
      this.dataSource = this.listData().map((item: any) => ({
        periodo: item.periodo,
        valor: parseFloat(item.valor)
      }));
    }
  }
}
