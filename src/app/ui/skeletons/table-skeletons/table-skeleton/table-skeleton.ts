import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [NgFor],
  templateUrl: './table-skeleton.html',
  styleUrls: ['./table-skeleton.css'],
})
export class TableSkeletonComponent {
  @Input() rows = 8;

  items(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }
}
