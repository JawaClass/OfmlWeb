import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toggle-button',  
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css'
})
export class ToggleButtonComponent {

  @Input() color!: string
  @Input() text!: string
  @Output() myClick: EventEmitter<any> = new EventEmitter()
  toggle() {
    this.myClick.emit(1)
    if (this.color == "blue")
      this.color = "red"
    else
      this.color = "blue"
  }
}
