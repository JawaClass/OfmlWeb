import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-multiplier-item',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './price-multiplier-item.component.html',
  styleUrl: './price-multiplier-item.component.css'
})
export class PriceMultiplierItemComponent {
  @Input() priceItem: any
  @Input() pricingFactor: number = 1

  calculateNewPrice(currentPrice: number) {
    return currentPrice * this.pricingFactor 
  }

}
