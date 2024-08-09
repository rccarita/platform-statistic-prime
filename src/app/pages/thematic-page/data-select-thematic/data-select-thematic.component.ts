import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { forkJoin } from 'rxjs';
import { Region } from '../../../models/region.model';
import { Thematic } from '../../../models/thematic';
import { SiniaService } from '../../../services/sinia.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data-select-thematic',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './data-select-thematic.component.html',
  styleUrl: './data-select-thematic.component.scss'
})
export class DataSelectThematicComponent {

  regionList!: Region[];
  thematicList!: Thematic[];
  selectedRegion: string = '00';
  selectedThematic: string = '';
  filterValueThematic?: string;
  selectionChange = output<any>();

  private siniaService = inject(SiniaService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tematica']) {
        this.selectedThematic = params['tematica'];
      }
      this._loadData();
    });
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
