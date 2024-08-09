import { Component, inject } from '@angular/core';
import { DataSelectRegionComponent } from './data-select-region/data-select-region.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ChartComponent } from '../../components/chart/chart.component';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { FileComponent } from '../../components/file/file.component';
import { IndicatorComponent } from '../../components/indicator/indicator.component';
import { Indicator } from '../../models/indicator.model';
import { SiniaService } from '../../services/sinia.service';
import { GeneralDataComponent } from './general-data/general-data.component';
import { BannersComponent } from './banners/banners.component';

@Component({
  selector: 'app-region-page',
  standalone: true,
  imports: [
    DataSelectRegionComponent,
    ChartComponent,
    IndicatorComponent,
    FileComponent,
    DataTableComponent,
    TabViewModule,
    ButtonModule,
    CommonModule,
    GeneralDataComponent,
    BannersComponent,
  ],
  templateUrl: './region-page.component.html',
  styleUrl: './region-page.component.scss'
})
export class RegionPageComponent {
  thematicChanged: boolean = false;
  thematicSelected?: string;
  thematicSelectedName?: string;
  regionSelected?: string;
  zoneSelected?: string;
  regionName?: string;
  listIndicators?: Indicator[];
  regionNid?: string;
  selectedIndicator?: string;
  selectedSeries?: string;
  selectedZone?: string;
  selectedSource?: string;
  selectedUnit?: string;
  selectedIndicatorName?: string;
  selectedAcronymName?: string;
  selectedDependency?: string;
  listData: any[] = [];
  listFiles: any[] = [];

  private siniaService = inject(SiniaService);

  ngOnInit(): void {
    this._loadIndicators();
  }

  onParamsSelected(params: any): void {
    const me = this;
    me.regionSelected = params.region.value;
    me.regionName = params.region.name;
    me.thematicSelected = params.thematic.value;
    me.thematicSelectedName = params.thematic.name;
    me.regionNid = params.region.nid;
    me.zoneSelected = me.regionSelected == '00' ? 'Nacional' : 'Departamental'
  }

  onImageChange() {
    this.thematicChanged = true;
    setTimeout(() => {
      this.thematicChanged = false;
    }, 1500);
  }

  receiveIndicatorParams(paramsIndicator: any): void {
    this.selectedIndicator = paramsIndicator.indicatorId;
    this.selectedSeries = paramsIndicator.indicatorSeries;
    this.selectedZone = paramsIndicator.indicatorZone;
    this.selectedSource = paramsIndicator.indicatorSource;
    this.selectedUnit = paramsIndicator.indicatorUnit;
    this.selectedIndicatorName = paramsIndicator.indicatorName;
    this.selectedAcronymName = paramsIndicator.indicatorAcronymName;
    this.selectedDependency = paramsIndicator.indicatorDependency;
    this._loadData();
    this._loadFiles();
  }

  _loadIndicators() {
    this.siniaService.getIndicator().subscribe({
      next: (indicators: Indicator[]) => {
        const indicatorMap = new Map<string, any>();
        indicators.forEach((indicator) => {
          const { id_indicador, ambito, tematica, id_serie } = indicator;
          const key = `${id_indicador}-${ambito}-${tematica}`;

          if (!indicatorMap.has(key) || +id_serie > +indicatorMap.get(key).id_serie) {
            indicatorMap.set(key, indicator);
          }
        });
        this.listIndicators = Array.from(indicatorMap.values());
      },
      error: (error: any) => {
        console.error('Error loading indicators:', error);
      }
    });
  }

  _loadData() {
    this.siniaService.getDataIndicator(this.regionName!)
      .subscribe({
        next: (res: any) => {
          this.listData = res[this.thematicSelected!][this.selectedSeries!].data;
        },
        error: (error: any) => {
          console.error('Error not found data:', error);
        }
      });
  }

  _loadFiles() {
    this.siniaService.getFile(this.selectedIndicator!).subscribe({
      next: (res: any) => {
        this.listFiles = res;
      },
      error: (error: any) => {
        console.error('Error loading files:', error);
      }
    });
  }
}
