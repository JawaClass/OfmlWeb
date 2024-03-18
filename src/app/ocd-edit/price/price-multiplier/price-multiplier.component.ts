import { Component, inject } from '@angular/core';
import { PriceMultiplierService } from '../price-multiplier.service';
import { PriceMultiplierItemComponent } from '../price-multiplier-item/price-multiplier-item.component'
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Subject, debounceTime } from 'rxjs';

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
  isLoading = false
  filterPriceItems$ = new Subject<void>()

  async ngOnInit() {

    this.filterPriceItems$.pipe(
      debounceTime(200)
    ).subscribe(
      () => this.filteredPriceItems = this.priceItems.filter((item: any) => this.showItem(item))
    )

    await this.fetchPrices()

  }

  async fetchPrices() {
    this.priceItems = await this.service.fetchPrices()
    for (const item of this.priceItems) {
      item["newPrice"] = item["price"]
    }

    this.filterPriceItems()
  }

  showItem(item: any) {
    for (const column of this.displayedColumns) {
      const name = column[0]
      const filterPattern = column[2]
      if (filterPattern.length == 0)
        continue

      const regexPattern = new RegExp(`^${filterPattern.toUpperCase()}`)

      if (!(regexPattern.test(item[name].toUpperCase())))
        return false
    }
    return true
  }


  filterPriceItems() {
    this.filterPriceItems$.next()
  }

  onPricingFactorChange() {
    for (const item of this.filteredPriceItems) {
      item["newPrice"] = item["price"] * this.pricingFactor
    }
    this.service.snackBar.open(`${this.filteredPriceItems.length} Preis(e) lokal angepasst`, "OK", { duration: 5000 })
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

  getPriceItemsWithPriceChanges() {
    return this.filteredPriceItems.filter((item: any) => item.price !== item.newPrice)
  }

  async savePrices() {
    this.isLoading = true
    const changedItems = this.getPriceItemsWithPriceChanges().map((item: any) => (
      {
        "db_key": item.db_key,
        "price": item.newPrice
      }
    ))
    if (changedItems) {
      await this.service.savePrices(changedItems)
      await this.fetchPrices()
    }
    this.service.snackBar.open(`${changedItems.length} Preis(e) persistiert.`, "OK", { duration: 5000 })
    this.isLoading = false
  }
}
