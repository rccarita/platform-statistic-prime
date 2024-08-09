import { Component, OnChanges, input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { saveAs } from 'file-saver';
import ExportingModule from 'highcharts/modules/exporting';
import noDataToDisplay from 'highcharts/modules/no-data-to-display';
import { CommonModule } from '@angular/common';
ExportingModule(Highcharts);
noDataToDisplay(Highcharts);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnChanges {

  lisData = input.required<any[]>();
  selectedRegionName = input.required<any>();
  selectedAcronymName = input.required<any>();
  selectedSource = input.required<any>();
  selectedUnit = input.required<any>();
  selectedIndicatorName = input.required<any>();

  isLoading: boolean = false;
  hasError: boolean = false;
  chart: any;
  categories: any[] = [];
  values: any[] = [];

  ngOnChanges(): void {
    this.drawData();
  }

  clearChartContainer() {
    const chartContainer = document.getElementById('chartContainer');
    if (chartContainer) {
      chartContainer.innerHTML = '';
    }
  }

  drawData() {
    const me = this;
    me.clearChartContainer();
    me.isLoading = true;

    setTimeout(() => {
      me.categories = [];
      me.values = [];
      me.lisData()?.map((item: any) => {
        me.categories.push(item.periodo);
        me.values.push(parseFloat(item.valor));
      });

      let chartContainer = document.getElementById('chartContainer');
      if (chartContainer) {
        me.renderChart();
      } else {
        me.recreateChart();
      }
      me.isLoading = false;
    }, 300);
  }

  renderChart() {
    const me = this;
    me.chart = Highcharts.chart('chartContainer', {
      chart: {
        scrollablePlotArea: {
          minWidth: 0,
          scrollPositionX: 0,
          scrollPositionY: 0,
        },
        animation: {
          duration: 2000,
        },
        backgroundColor: '#fff',
        type: 'line',
      },
      title: {
        text:
          me.selectedRegionName() +
          ': ' +
          me.selectedIndicatorName(),
        align: 'center',
        widthAdjust: -120,
        style: {
          fontSize: '14px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontFamily: "Inter var",
        },
      },
      xAxis: {
        categories: me.categories,
        title: {
          text: 'Años',
          style: {
            fontFamily: "Inter var",
          }
        },
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: "Inter var",
          },
        },
      },
      yAxis: {
        title: {
          text: me.selectedUnit(),
          style: {
            fontFamily: "Inter var",
          }
        },
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: "Inter var",
          },
        },
      },
      series: [
        {
          data: me.values || [],
          color: '#79b340',
          dataLabels: {
            enabled: true,
            style: {
              fontFamily: "Inter var",
              color: '#696969',
            },
          },
        },
      ],
      lang: {
        noData:
          "<div class='text-center'><br>No se dispone de información para el ámbito seleccionado.</div>",
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#666666',
          fontFamily: "Inter var",
        },
        position: {
          align: 'center',
          verticalAlign: 'middle',
        },
      },
      credits: {
        enabled: true,
        text: 'Fuente: ' + this.selectedSource(),
        href: false,
        style: {
          fontFamily: "Inter var",
        }
      },
      legend: {
        enabled: false,
      },
      exporting: {
        buttons: {
          first: {
            symbol: 'menuball',
            menuItems: [
              {
                text: "<i class='fa fa-bar-chart' style='color:red;font-size:20px'></i> Ver como Barra",
                onclick: () => {
                  me.changeChartType('column');
                },
              },
              {
                text: "<i class='fa fa-line-chart' style='color:blue;font-size:20px'></i> Ver como Línea",
                onclick: () => {
                  me.changeChartType('line');
                },
              },
              {
                text: "<i class='fa fa-area-chart' style='color:green;font-size:20px'></i> Ver como Área",
                onclick: () => {
                  me.changeChartType('area');
                },
              },
            ],
          },
          contextButton: {
            menuItems: [
              {
                text: "<i class='fa fa-print' style='color:grey;font-size:20px'></i> Imprimir",
                textKey: 'printChart',
                onclick: () => {
                  me.chart.print();
                },
              },
              {
                text: "<i class='fa fa-file-image' style='color:blue;font-size:20px'></i> Descargar como PNG",
                textKey: 'downloadPNG',
                onclick: () => {
                  me.chart.exportChart({ type: 'image/png' });
                },
              },
              {
                text: "<i class='fa fa-file-excel' style='color:green;font-size:20px'></i> Descargar como CSV",
                textKey: 'downloadSVG',
                onclick: () => {
                  me.downloadCSV(me.chart.series);
                },
              },
              {
                text: "<i class='fa fa-file-pdf' style='color:red;font-size:20px'></i> Descargar como PDF",
                textKey: 'downloadPDF',
                onclick: () => {
                  me.chart.exportChart({ type: 'application/pdf' });
                },
              },
            ],
          },
        },
      },
      accessibility: {
        enabled: false,
      },
    } as any);
  }

  changeChartType(chartType: string) {
    this.chart.update({
      chart: {
        type: chartType,
      },
    });
  }

  convertToCSV(series: Highcharts.SeriesOptionsType[]) {
    const header = `Periodo,${this.selectedAcronymName()}\n`;
    const rows = series
      .map((s: any) =>
        s.data.map((d: any) => `${d.category},${d.y}`).join('\n')
      )
      .join('\n');
    return header + rows;
  }

  downloadCSV(series: Highcharts.SeriesOptionsType[]) {
    const currentDate = new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const fileName = `data-${currentDate}.csv`;
    const csv = this.convertToCSV(series);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, fileName);
  }

  recreateChart() {
    const me = this;
    if (me.chart) {
      me.chart.redraw(false);
      while (me.chart.series.length > 0) {
        me.chart.series[0].remove(false);
      }
      me.chart.addSeries({
        data: me.values,
        color: '#79b340',
        dataLabels: {
          enabled: true,
          style: {
            color: '#696969',
            fontFamily: "Inter var",
          },
        },
      });
      me.chart.update({
        title: {
          text:
            me.selectedRegionName() +
            ': ' +
            me.selectedIndicatorName(),
        },
        xAxis: {
          categories: me.categories,
        },
        yAxis: {
          title: {
            text: me.selectedUnit(),
          },
        },
        credits: {
          enabled: true,
          text: 'Fuente: ' + me.selectedSource(),
          href: false,
        },
      });
      me.chart.redraw(true);
    }
  }
}