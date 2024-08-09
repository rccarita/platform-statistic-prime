import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [],
  templateUrl: './banners.component.html',
})
export class BannersComponent {
  @Input() data: any;

  redirect(contentType: string): void {
    const baseUrl = 'https://sinia.minam.gob.pe/search?content_type=';
    const url = `${baseUrl}${contentType}&descriptores_tematicos=${this.data}`;
    window.open(url, '_blank');
  }
}
