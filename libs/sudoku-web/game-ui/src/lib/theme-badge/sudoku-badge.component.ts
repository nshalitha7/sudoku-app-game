import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-sudoku-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sudoku-badge.component.html',
  styleUrl: './sudoku-badge.component.css',
})
export class BadgeComponent {
  @Input() color: 'default' | 'danger' | 'success' = 'default';
}
