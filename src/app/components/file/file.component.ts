import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './file.component.html',
})
export class FileComponent {
  listFiles = input.required<any>();
  properties = ['nombre', 'descripcion', 'finalidad', 'limitaciones', 'metodologia', 'fuente'];
}
