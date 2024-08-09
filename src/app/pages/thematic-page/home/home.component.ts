import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  thematic: any[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  isHovering: boolean = false;

  onMouseEnter(event: any, item: any) {
    if (event.target === event.currentTarget) {
      this.isHovering = true;
    }
  }

  onMouseLeave(event: any, item: any) {
    if (event.target === event.currentTarget) {
      this.isHovering = false;
    }
  }

  private loadData(): void {
    this.http.get('./assets/thematic.json').subscribe({
      next: (res: any) => {
        this.thematic = res.data;
        console.log(this.thematic);
      },
      error: (error) => {
        console.error('HTTP request error:', error);
      },
    });
  }
}
