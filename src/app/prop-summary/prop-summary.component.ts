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
import { PropclassViewerComponent } from '../propclass-viewer/propclass-viewer.component'

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
    MatProgressSpinnerModule,
    PropclassViewerComponent
  ],
  templateUrl: './prop-summary.component.html',
  styleUrl: './prop-summary.component.css'
})
export class PropSummaryComponent implements OnInit {

  service = inject(ArticleInputService)
  data: any[] = []
  @Input("selectedProgram") selectedProgram: string = ""
  @Input("currentPropertyInput") currentPropertyInput: string = ""
  @Output() onValueSected = new EventEmitter<PropertyAndValueItem>()

  result: PClassProperty[] = []
  filteredResult: PClassProperty[] = []
  isLoading: boolean = false
  propClassNames: string[] = []
  async ngOnInit(): Promise<void> {
    this.data = await this.service.getWebOcdArticleWithDetails()
    this.updateSummary()
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const changeSelectedProgram: SimpleChange = changes["selectedProgram"]
    const changeCurrentPropertyInput: SimpleChange = changes["currentPropertyInput"]

    if (changeSelectedProgram && !changeSelectedProgram.isFirstChange())
      this.updateSummary()
//    if (changeCurrentPropertyInput && !changeCurrentPropertyInput.isFirstChange())
  //    this.filterResult()
  }

  selectPropertyValue(event: any, propItem: PropertyItem, valueItem: PropValueItem) {
    const item: PropertyAndValueItem = { propertyItem: propItem, propValueItem: valueItem }
    this.onValueSected.emit(item)
  }

  async updateSummary() {
    const items = this.data.filter((item:any) => item.sql_db_program === this.selectedProgram).map((item:any) => item)
    console.log("PropSummaryComponent", items);
    const pClassGroups = this.service.groupArticlesByClassName(items)
    this.propClassNames = Object.keys(pClassGroups)
    console.log("propClassNames", this.propClassNames)    
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
