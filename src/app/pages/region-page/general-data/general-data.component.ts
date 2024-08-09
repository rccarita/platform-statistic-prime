import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import { Polygon } from '@arcgis/core/geometry';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import * as Highcharts from 'highcharts';
import Point from '@arcgis/core/geometry/Point';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import { SiniaService } from '../../../services/sinia.service';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-data',
  standalone: true,
  imports: [
    HighchartsChartModule,
    CommonModule,
  ],
  templateUrl: './general-data.component.html',
  styleUrl: './general-data.component.scss'
})
export class GeneralDataComponent {
  Highcharts: typeof Highcharts = Highcharts;
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  private mapView: MapView | undefined;
  @Input() geoLocationSelected?: any;
  generalDataList: any[] = [];
  chart: any;
  location: any;
  chartOptions: Highcharts.Options = {};
  chartOptions2: Highcharts.Options = {};

  male: any;
  female: any;
  urbanPopulation: any;
  ruralPopulation: any;

  constructor(private siniaService: SiniaService, private http: HttpClient) { }
  ngOnChanges(): void {
    if (this.geoLocationSelected) {
      this.getGeneralData();
    }
  }
  getGeneralData() {
    if (this.geoLocationSelected) {
      this.siniaService.getGeneralData(this.geoLocationSelected).subscribe((data: any) => {
        this.generalDataList = data;
        this.loadData();
      });
    }
  }
  
  loadData() {
    this.generalDataList?.map((item: any) => {
      this.male = item.male;
      this.female = item.female;
      this.ruralPopulation = item.ruralPopulation;
      this.urbanPopulation = item.urbanPopulation;
      this.renderChart();
      this.viewMap();
    });
  }
  renderChart() {
    this.chartOptions = {
      chart: {
        type: 'pie',
        width: 270,
        height: 330,
      },
      title: {
        text: 'Población por Área',
        style: {
          fontSize: '15px',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: '600',
        },
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f} %</b>',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
        },
      },


      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format:
              '<div style="background-color:#fff; padding: 5px; border-radius: 5px; color: #000; font-size: 12px; font-family: Roboto, sans-serif;"><b>{point.percentage:.1f} %</b></div>',
            useHTML: true,
            distance: -35,
          },
          showInLegend: true,
        },
      },

      credits: {
        enabled: false,
      },
      colors: ['rgb(4,82,153,0.5)', 'rgb(4,82,153)'],
      series: [
        {
          type: 'pie',
          name: 'Poblacion',
          data: [
            ['Pob. Urbana', this.urbanPopulation],
            ['Pob. Rural', this.ruralPopulation],
          ],
        },
      ],
    };

    this.chartOptions2 = {
      chart: {
        type: 'pie',
        width: 270,
        height: 330,
      },
      title: {
        text: 'Población por sexo',
        style: {
          fontSize: '15px',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: '600',
        },
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        style: {
          fontFamily: 'Roboto, sans-serif',
          fontSize: '12px',
        },
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format:
              '<div style="background-color:#fff; padding: 5px; border-radius: 5px; color: #000; font-size: 12px; font-family: Roboto, sans-serif;"><b>{point.percentage:.1f} %</b></div>',
            useHTML: true,
            distance: -35,
          },
          showInLegend: true,
        },
      },
      credits: {
        enabled: false,
      },
      colors: ['rgb(4,82,153,0.5)', 'rgb(4,82,153)'],
      series: [
        {
          type: 'pie',
          name: 'Poblacion',
          data: [
            ['Femenino', this.female],
            ['Masculino', this.male],
          ],
        },
      ],
    };
  }
  viewMap(): void {
    if (this.mapView) {
      this.mapView.destroy();
      this.mapView == null;
    }
    const map = new Map({
      basemap: 'satellite',
    });

    this.http
      .get('./assets/data-location.json')
      .toPromise()
      .then((data: any) => {
        const coordinates: any[] = [];

        Object.keys(data).forEach(key => {
          this.location = data[this.geoLocationSelected].data[0];
        });
        this.mapView = new MapView({
          container: this.mapViewEl.nativeElement,
          map,
          zoom: this.location.zoom,
          center: [this.location.x, this.location.y],
          ui: {
            components: [],
          },
          constraints: {
            minZoom: this.location.zoom,
            maxZoom: this.location.zoom,
            rotationEnabled: false,
          },
        });
      });


    this.http
      .get('./assets/geoData/peru.geojson')
      .toPromise()
      .then((data: any) => {
        const graphicsLayer = new GraphicsLayer();

        const symbol = new SimpleFillSymbol({
          outline: {
            color: [255, 255, 255],
            width: 2,
          },
        });

        data.features.forEach((feature: any) => {
          if (
            feature.properties.CCDD === this.geoLocationSelected
          ) {
            if (feature.geometry.type === 'MultiPolygon') {
              // Si es un MultiPolygon (caso de Puno), procesa los polígonos internos
              feature.geometry.coordinates.forEach((polygonCoordinates: any) => {
                const polygon = new Polygon({
                  rings: polygonCoordinates,
                });

                const graphic = new Graphic({
                  geometry: polygon,
                  symbol: symbol,
                });

                graphicsLayer.add(graphic);
              });
            } else if (feature.geometry.type === 'Polygon') {
              // Si es un Polygon (otros departamentos), procesa como un solo polígono
              const polygon = new Polygon({
                rings: feature.geometry.coordinates,
              });

              const graphic = new Graphic({
                geometry: polygon,
                symbol: symbol,
              });

              graphicsLayer.add(graphic);
            }
          }
        });

        this.mapView!.map.add(graphicsLayer);
      });

    this.http
      .get('./assets/data-coordinates.json')
      .toPromise()
      .then((data: any) => {
        const departments = data as { name: string; x: number; y: number }[];

        const graphicsLayer = new GraphicsLayer();

        departments.forEach((department) => {
          const point = new Point({
            x: department.x,
            y: department.y,
            spatialReference: this.mapView!.spatialReference,
          });

          const textSymbol = new TextSymbol({
            text: department.name,
            color: 'black',
            font: {
              size: 8,
              weight: 'bold',
            },
            haloColor: 'white',
            haloSize: 1,
          });

          const graphic = new Graphic({
            geometry: point,
            symbol: textSymbol,
          });

          graphicsLayer.add(graphic);
        });

        this.mapView!.map.add(graphicsLayer);
      });
  }
}
