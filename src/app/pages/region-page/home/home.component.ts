import { Component, ViewChild, ElementRef } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import { HttpClient } from '@angular/common/http';
import { Polygon } from '@arcgis/core/geometry';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import { regionByColors } from './region-colors-hexadecimal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  private mapView: MapView | undefined;
  private highlightLayer: GraphicsLayer | undefined;
  listDepartment: any;

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.http.get('assets/region.json').subscribe({
      next: (data: any) => {
        this.listDepartment = data.data;
      },
      error: (error) => {
        console.error('There was an error in the request:', error);
      }
    });

  }

  ngAfterViewInit(): void {
    const map = new Map({
      basemap: 'streets-vector'
    });
    const isMobile = window.innerWidth <= 768;

    this.mapView = new MapView({
      container: this.mapViewEl.nativeElement,
      map,
      zoom: 5,
      center: [-75.5377, -9.1900],
      ui: {
        components: []
      },
      constraints: {
        minZoom: isMobile ? 4 : 5,
        maxZoom: isMobile ? 4 : 5, 
      }

    });
    this.highlightLayer = new GraphicsLayer();
    map.add(this.highlightLayer);

    this.http.get('assets/geoData/peru.geojson').subscribe((data: any) => {
      const graphicsLayer = new GraphicsLayer();
      data.features.forEach((feature: any) => {
        const region = feature.properties.NOMBDEP.toString();
        const symbol = new SimpleFillSymbol({
          color: regionByColors[region],
          outline: {
            color: [0, 0, 0, 0.5],
            width: 1
          }
        });

        if (feature.geometry.type === 'MultiPolygon') {
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
          const polygon = new Polygon({
            rings: feature.geometry.coordinates,
          });

          const graphic = new Graphic({
            geometry: polygon,
            symbol: symbol,
            attributes: feature.properties,
          });

          graphicsLayer.add(graphic);
        }
      });
      map.add(graphicsLayer);
      this.mapView!.on('pointer-move', (event: any) => {
        this.highlightDepartment(event);
      });
      this.mapView!.on("click", (event: any) => {
        this.handleDepartmentClick(event);
      });
    },
      (error: any) => {
        console.error('There was an error in the request:', error);
      }
    );
  }
  private highlightDepartment(event: any) {
    this.mapView!.hitTest(event).then((response: any) => {
      this.highlightLayer!.removeAll();

      if (response.results.length > 0) {
        const graphic = response.results[0].graphic;

        this.highlightLayer!.add(
          new Graphic({
            geometry: graphic.geometry,
            symbol: new SimpleFillSymbol({
              color: [255, 0, 0, 0.5],
              outline: {
                color: [255, 0, 0],
                width: 2
              }
            })
          })
        );
      }
    });
  }
  handleDepartmentClick(event: any) {
    this.mapView!.hitTest(event).then((response: any) => {
      if (response.results.length > 0) {
        const graphic = response.results[0].graphic;
        const regionCode = graphic.attributes.CCDD;
        if (regionCode >= "01" && regionCode <= "25") {
          const url = `./informacion/regiones?region=${regionCode}`;
          window.location.href = url;
        }
      }
    });
  }
}
