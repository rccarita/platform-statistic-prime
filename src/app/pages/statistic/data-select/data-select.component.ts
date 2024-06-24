import { Component, OnInit, inject, output } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SiniaService } from '../../../services/sinia.service';
import { Region } from '../../../models/region.model';
import { Thematic } from '../../../models/thematic';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-data-select',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './data-select.component.html',
})
export class DataSelectComponent implements OnInit {

  regionList!: Region[];
  thematicList!: Thematic[];
  selectedRegion: string = '00';
  selectedThematic: string = '12';
  filterValueThematic?: string;
  selectionChange = output<any>();

  private siniaService = inject(SiniaService);

  ngOnInit(): void {
    this._loadData();
  }

  _loadData(): void {
    forkJoin({
      region: this.siniaService.getRegion(),
      thematic: this.siniaService.getThematic(),
    }).subscribe({
      next: (res: any) => {
        this.regionList = res.region.data;
        this.thematicList = res.thematic.data;

        this.onSelectionChange();
      },
      error: error => {
        console.error('Error fetching regions:', error);
      }
    })
  }

  protected onSelectionChange(): void {
    const me = this;
    const regionObject = me.regionList.find(item => item.value === me.selectedRegion);
    const thematicObject = me.thematicList.find(item => item.value === me.selectedThematic);
    const params = {
      region: regionObject,
      thematic: thematicObject,
    };
    me.selectionChange.emit(params);
  }

  getImageUrl(thematic: any): string {
    return `assets/img/${thematic.value}.png`;
  }

  resetFunction(options: any): void {
    options.reset();
    this.filterValueThematic = '';
  }

  customFilterFunction(event: KeyboardEvent, options: any): void {
    options.filter(event);
  }
}
