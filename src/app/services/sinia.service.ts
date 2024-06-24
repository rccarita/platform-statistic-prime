import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Indicator } from '../models/indicator.model';
import { CollectionResponse } from '../models/collection-response';
import { DEPARTMENTS } from './departaments';
import { File } from '../models/file.model';
import { CollectionResponseType } from '../models/collection-response-type';
import { RegionData } from '../models/region-data.model';
import { Region } from '../models/region.model';
import { Thematic } from '../models/thematic';

@Injectable({
  providedIn: 'root'
})
export class SiniaService {

  private urlIndicators = 'assets/indicators.json';
  private urlFile = 'assets/file.json';
  private urlGeneralData = 'assets/region-data.json';
  private urlRegion = 'assets/region.json';
  private urlThematic = 'assets/thematic.json';
  private regions = DEPARTMENTS;

  private removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  private geoLocationMap: Record<string, string> = this.regions.reduce((map: Record<string, string>, region) => {
    const fileName = 'assets/data/' + this.removeAccents(region) + '.json';
    map[region] = fileName;
    return map;
  }, {});

  private http = inject(HttpClient);

  getIndicator(): Observable<Indicator[]> {
    return this.http
      .get<CollectionResponse<Indicator>>(this.urlIndicators)
      .pipe(map(response => response.SNA09.data));
  }

  getFile(indicatorId: string): Observable<File[]> {
    return this.http
      .get<CollectionResponseType<File>>(this.urlFile)
      .pipe(map(response => response[indicatorId].data));
  }

  getRegion(): Observable<Region> {
    return this.http.get<Region>(this.urlRegion);
  }

  getThematic(): Observable<Thematic> {
    return this.http.get<Thematic>(this.urlThematic);
  }

  getGeneralData(region: string): Observable<RegionData[]> {
    return this.http
      .get<CollectionResponseType<RegionData>>(this.urlGeneralData)
      .pipe(map(response => response[region].data));
  }

  getDataIndicator(nameGeoLocSelected: string): Observable<any> {
    const geoLocationSelected = nameGeoLocSelected;
    if (geoLocationSelected in this.geoLocationMap) {
      return this.http.get(this.geoLocationMap[geoLocationSelected]);
    } else {
      console.error('GeoLocation not found');
      return new Observable();
    }
  }
}
