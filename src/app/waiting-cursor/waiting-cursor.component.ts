import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-waiting-cursor',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './waiting-cursor.component.html',
  styleUrl: './waiting-cursor.component.css'
})
export class WaitingCursorComponent {

}
