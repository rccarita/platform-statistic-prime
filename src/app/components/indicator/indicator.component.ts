import { CommonModule } from '@angular/common';
import { Component, OnChanges, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-indicator',
  standalone: true,
  imports: [
    RadioButtonModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './indicator.component.html',
})
export class IndicatorComponent implements OnChanges {

  listIndicators = input.required<any>();
  regionSelected = input.required<any>();
  thematicSelected = input.required<any>();
  zoneSelected = input.required<any>();
  indicatorSelected: any;
  paramsIndicator = output<any>();

  ngOnChanges(): void {
    const me = this;
    if (me.listIndicators()) {
      me.sortByIndicator();
    }
    me.selectFirstElement();
  }

  selectFirstElement() {
    const me = this;
    if (me.listIndicators() && me.thematicSelected() && me.zoneSelected()) {
      // Check if the currently selected indicator exits in the new scope.
      const selectedIndicatorExists = me.listIndicators().some(
        (item: any) =>
          item.tematica === me.thematicSelected() &&
          item.ambito === me.zoneSelected() &&
          item.indicador === me.indicatorSelected?.indicador
      );

      if (selectedIndicatorExists) {
        // If the selected indicator exits in the new scope, select it.
        const existingIndicator = me.listIndicators().find(
          (item: any) =>
            item.tematica === me.thematicSelected() &&
            item.ambito === me.zoneSelected() &&
            item.indicador === me.indicatorSelected?.indicador
        );

        if (existingIndicator) {
          me.indicatorSelected = existingIndicator;
          me.sendIndicatorParams();
        }
      } else {
        // If the selected indicator does not exits in the new scope, select the first one.
        const firstElement = me.listIndicators().find(
          (item: any) =>
            item.tematica === me.thematicSelected() &&
            item.ambito === me.zoneSelected()
        );
        if (firstElement) {
          me.indicatorSelected = firstElement;
          me.sendIndicatorParams();
        }
      }
    }
  }

  sendIndicatorParams() {
    const me = this;
    const indicatorData = {
      indicatorId: me.indicatorSelected.id_indicador,
      indicatorSeries: me.indicatorSelected.id_serie,
      indicatorZone: me.indicatorSelected.ambito,
      indicatorSource: me.indicatorSelected.fuente,
      indicatorUnit: me.indicatorSelected.unidad,
      indicatorName: me.indicatorSelected.indicador,
      indicatorAcronymName: me.indicatorSelected.unidad_sigla,
      indicatorDependency: me.indicatorSelected.dependencia,
    };
    me.paramsIndicator.emit(indicatorData);
  }


  sortByIndicator(): void {
    const me = this;
    if (me.listIndicators()) {
      me.listIndicators().sort(
        (a: { indicador: string }, b: { indicador: string }) => {
          const indicatorA = a.indicador.toLowerCase();
          const indicatorB = b.indicador.toLowerCase();
          return indicatorA.localeCompare(indicatorB);
        }
      );
    }
  }
}
