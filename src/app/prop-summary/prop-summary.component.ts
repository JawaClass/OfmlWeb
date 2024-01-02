import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleInputService } from '../services/article-input.service';
import { inject } from '@angular/core';
import { PropertyAndValueItem, PropertyItem, PropValueItem, PropertyClass } from './../models/models'
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface PClassProperty {
  pClass: PropertyClass,
  propItems: PropertyItem[]
}

@Component({
  selector: 'app-prop-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatDividerModule,
    MatTableModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule],
  templateUrl: './prop-summary.component.html',
  styleUrl: './prop-summary.component.css'
})
export class PropSummaryComponent implements OnInit {

  service = inject(ArticleInputService)

  @Input("selectedProgram") selectedProgram: string = ""
  @Input("currentPropertyInput") currentPropertyInput: string = ""
  @Output() onValueSected = new EventEmitter<PropertyAndValueItem>()

  result: PClassProperty[] = []
  filteredResult: PClassProperty[] = []
  isLoading: boolean = false

  async ngOnInit(): Promise<void> {
    if (this.selectedProgram.length)
      await this.updateSummary()
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const changeSelectedProgram: SimpleChange = changes["selectedProgram"]
    const changeCurrentPropertyInput: SimpleChange = changes["currentPropertyInput"]
    if (changeSelectedProgram && !changeSelectedProgram.isFirstChange())
      this.updateSummary()
    if (changeCurrentPropertyInput && !changeCurrentPropertyInput.isFirstChange())
      this.filterResult()
  }

  selectPropertyValue(event: any, propItem: PropertyItem, valueItem: PropValueItem) {
    const item: PropertyAndValueItem = { propertyItem: propItem, propValueItem: valueItem }
    this.onValueSected.emit(item)
  }

  async updateSummary() {
    this.isLoading = true
    const propClasses = this.service.programMap.getPropClassesFromProgram(this.selectedProgram)

    const promises = propClasses.map(async (pClass) => {
      const propItems = await this.service.fetchProperties(this.selectedProgram, pClass.name)
      return { pClass, propItems } as PClassProperty;
    })

    this.result = await Promise.all(promises)
    this.filteredResult = this.result
    this.isLoading = false
  }

  filterResult() {
    if (this.currentPropertyInput.length) {
      const search = this.currentPropertyInput
      let filteredResult2: PClassProperty[] = []
      this.result.forEach((pClass: PClassProperty) => {
        const filtered = pClass.propItems.filter(pItem => pItem.property.startsWith(search) || pItem.propertyText.startsWith(search))
        if (filtered.length)
          filteredResult2.push(
            {
              pClass: pClass.pClass,
              propItems: filtered
            } as PClassProperty
          )
      })
      this.filteredResult = filteredResult2
    } else {
      this.filteredResult = this.result
    }
  }
}
