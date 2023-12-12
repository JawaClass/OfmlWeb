import { Component, OnInit, Input, SimpleChanges, SimpleChange  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleInputService } from '../services/article-input.service';
import { inject } from '@angular/core';
import { ProgramMap, ArtbaseItem, ArticleItem, PropertyItem, PropValueItem, PropertyClass } from './../models/models'
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider'; 

interface PClassProperty {
  pClass: PropertyClass,
  propItems: PropertyItem[]
}

@Component({
  selector: 'app-prop-summary',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatDividerModule],
  templateUrl: './prop-summary.component.html',
  styleUrl: './prop-summary.component.css'
})
export class PropSummaryComponent implements OnInit {

  service = inject(ArticleInputService)

  @Input() selectedProgram: string = ""
  @Input() currentPropertyInput: string = ""

  result: PClassProperty[] = []

  filteredResult: PClassProperty[] = []

  async ngOnInit(): Promise<void> {
    if (this.selectedProgram.length)
      await this.updateSummary()
  }

  async updateSummary() {
    const propClasses = this.service.programMap.getPropClassesFromProgram(this.selectedProgram);

    const promises = propClasses.map(async (pClass) => {
      const propItems = await this.service.fetchProperties(this.selectedProgram, pClass.name);
      return { pClass, propItems } as PClassProperty;
    });

    this.result = await Promise.all(promises);
    this.filteredResult = this.result
    console.log(this.result);
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {

    console.log("ngOnChanges:::::::", changes) 

    const changeSelectedProgram: SimpleChange = changes["selectedProgram"]
    const changeCurrentPropertyInput: SimpleChange = changes["currentPropertyInput"]
    
    if (changeSelectedProgram && !changeSelectedProgram.isFirstChange()) {
      this.updateSummary()
    }

    if (changeCurrentPropertyInput && !changeCurrentPropertyInput.isFirstChange() && this.currentPropertyInput.length) {
      console.log("CHANGHED changeCurrentPropertyInput:::", changeCurrentPropertyInput.currentValue, "vs.?", this.currentPropertyInput);
      
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
