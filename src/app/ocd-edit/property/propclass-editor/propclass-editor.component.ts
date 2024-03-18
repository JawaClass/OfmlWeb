import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { PropertyitemService } from '../propertyitem.service';
import { RouterModule, Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getTextFromProperty } from '../../../models/helper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-propclass-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
    RouterModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './propclass-editor.component.html',
  styleUrl: './propclass-editor.component.css'
})
export class PropclassEditorComponent implements OnInit {

  @Input() program!: string
  @Input() pClass!: string


  async ngOnChanges(changes: SimpleChanges) {
    await this.init()
  }

  route = inject(ActivatedRoute)
  propertyitemService = inject(PropertyitemService)
  router = inject(Router)
  isLoading = false
  pClassItem!: any

  getActiveValuesFromProperty(propItem: any) {
    return propItem.values.filter((v: any) => v.web_filter === 0)
  }

  getPropertyClassText(pClassItem: any) {
    if (pClassItem.text)
      return pClassItem.text.text
    else
      return ""
  }

  getPropertyHeaderTextMain(p: any) {
    return `#${p.pos_prop} ${p.property} : ${this.getPropertyText(p)}`
  }


  getPropertyHeaderTextDetail(p: any) {
    return `${p.scope} ${p.prop_type}`
  }

  getPropertyValueText(v: any) {
    if (!v) return "UNDEFINED ???"
    return `${v.value_from} : ${this.getPropertyText(v)}`
  }

  getPropertyText = (p: any) => getTextFromProperty(p)
  getProperties(): any[] {
    return this.pClassItem["properties"]
  }

  private async init() {
    if (!this.program || !this.pClass)
      this.router.navigate(['/'])

    this.isLoading = true
    const json = await this.propertyitemService.fetchPropClassWithDetails(this.program, this.pClass)

    this.pClassItem = json

    this.isLoading = false
  }

  async initialize() {
    await this.init()
  }

  async ngOnInit() {
    if (!this.program && !this.pClass) {
      this.route.params.subscribe(async (params) => {
        this.program = params['program']
        this.pClass = params['propClass']
        await this.initialize()
      })
    } else {
      await this.initialize()
    }
  }

  async setAllValuesFilter(propItem: any, filterValue: boolean, event: any) {
    event.stopPropagation()
    propItem.values.forEach((valItem: any) => {
      valItem.web_filter = filterValue
    })
    const promises = propItem.values.map((valItem: any) => {
      this.patchPropertyValue(valItem)
    })
    await Promise.all(promises)
  }

  async onTogglePropertyScope(propItem: any, event: any) {
    // disable property (set scope = G)
    // activate property (set scope = C)
    event.stopPropagation()
    console.log("onChangeFilterAll", propItem.web_filter)

    if (propItem.scope == "C") {
      propItem.scope = "G"
    } else {
      propItem.scope = "C"
    }

    const patch = {
      "db_key": propItem.db_key,
      "scope": propItem.scope
    }

    await this.propertyitemService.patchProperty(patch)
  }

  private async patchPropertyValue(valItem: any) {
    const patch = {
      "db_key": valItem.db_key,
      "web_filter": valItem.web_filter
    }
    valItem["isUpdating"] = true
    await this.propertyitemService.patchPropertyValue(patch)
    setTimeout(() => { valItem["isUpdating"] = false }, 300)
  }

  async onToggleValue(valItem: any, event: any) {
    valItem.web_filter = !valItem.web_filter
    await this.patchPropertyValue(valItem)
  }

  isPropertyVisible(propItem: any) {
    return propItem.scope == "C"
  }

  getPropertyVisibleText(scope: string) {
    return scope == "C" ? "Sichtbar (C)" : "Unsichtbar (G)"
  }

}
