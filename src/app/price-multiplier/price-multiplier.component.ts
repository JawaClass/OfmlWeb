import { Component, inject } from '@angular/core';
import { PriceMultiplierService } from '../services/price-multiplier.service';
import { PriceMultiplierItemComponent } from '../price-multiplier-item/price-multiplier-item.component'
import { MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-price-multiplier',  
  standalone: true,
  imports: [
    PriceMultiplierItemComponent,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './price-multiplier.component.html',
  styleUrl: './price-multiplier.component.css'
})
export class PriceMultiplierComponent {
  displayedColumns = [
    ["article_nr", "Artikelnummer", ""],
    ["sql_db_program", "Program", ""],
    ["price", "Preis", ""],
    ["newPrice", "Preis Neu Vorschau)", ""],
    ["price_level", "Preislevel", ""],
    ["price_type", "Preistyp", ""],
    ["date_from", "gültig von", ""],
    ["date_to", "gültig bis", ""],
  ]
  columns = this.displayedColumns.map(item => item[0])
  service = inject(PriceMultiplierService)
  priceItems: any[] = []
  filteredPriceItems: any[] = []
  pricingFactor = 1.00
  async ngOnInit() {
    this.priceItems = await this.service.fetchPrices()
    for (const item of this.priceItems) {
      item["newPrice"] = item["price"]
    }
    this.filteredPriceItems = this.priceItems
  }

  showItem(item: any) {
    for (const column of this.displayedColumns) { 
      const name = column[0]
      const filterValue = column[2]
      if (filterValue.length == 0)
        continue

      const regexPattern = new RegExp(`^${filterValue.toUpperCase()}`)
      
      if (!(regexPattern.test(item[name].toUpperCase())))
        return false
    }
    return true
  }

  filterPriceItems() {
    this.filteredPriceItems = this.priceItems.filter((item: any) => this.showItem(item))
  }

  onPricingFactorChange() {
    for (const item of this.filteredPriceItems) {
      item["newPrice"] = item["price"] * this.pricingFactor
    }
    this.service.snackBar.open(`${this.filteredPriceItems.length} Preis(e) lokal angepasst`, "OK", {duration: 5000})
  }

  isFilterActive() {
    for (const column of this.displayedColumns) {
      if (column[2].length > 0) return true
    }
    return false
  }

  calculatePercentageChange(element: any) {
    return 100 * ((element["newPrice"] - element["price"]) / element["price"])
  }

  savePrices() {

  }
}
