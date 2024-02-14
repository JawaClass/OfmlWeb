import { Component, Input, OnInit, OnDestroy, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ArticleInputService } from '../services/article-input.service';
import { PropertyitemService } from '../services/propertyitem.service';
import { RouterModule, Router } from '@angular/router';
import { PropertyClass, PropertyItem, PropValueItem } from '../models/models';
import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'
import { MatTooltipModule } from '@angular/material/tooltip';
import { getTextFromProperty } from '../models/helper';
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
    WaitingCursorComponent,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './propclass-editor.component.html',
  styleUrl: './propclass-editor.component.css'
})
export class PropclassEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() program!: string
  @Input() pClass!: string

  route = inject(ActivatedRoute)
  service = inject(ArticleInputService)
  propertyitemService = inject(PropertyitemService)
  router = inject(Router)

  propClass!: PropertyClass
  propItems!: PropertyItem[]
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
    return `# ${p.pos_prop} ${p.property} : ${this.getPropertyText(p)}`
  }

  
  getPropertyHeaderTextDetail(p: any) {
    return `[Scope=${p.scope}, Type=${p.prop_type}]`
  }

  getPropertyValueText(v: any) {
    if (!v) return "UNDEFINED ???"
    return `${v.value_from} : ${this.getPropertyText(v)}`
  }

  getPropertyText = (p: any) => getTextFromProperty(p)
  getProperties(): any[] {
    return this.pClassItem["properties"]
  }

  ngAfterViewInit() {
    /*const elem = document.querySelector('.mat-sidenav-content')
    elem!!.scroll(
      {
        left: 0,
        top: 0,
        behavior: 'instant',
      }
    )*/
  }

  async ngOnDestroy() {
    /**
     * if (this.propItems) {
      this.isLoading = true
      await this.propertyitemService.savePropertyItems(this.propItems, this.program, this.pClass)
      this.isLoading = false
    }
     */
  }

  async initialize() {
    if (!this.program || !this.pClass)
          this.router.navigate(['/'])

    this.isLoading = true
    const json = await this.service.fetchPropClassWithDetails(this.program, this.pClass)
    console.log("PROP_CLASS", this.program, this.pClass)
    console.log(json)
    this.pClassItem = json
    
    this.isLoading = false
  }

  async ngOnInit() {
    
    console.log("PropClassComponent::ngOnInit", this.program, this.pClass);
    if (!this.program && !this.pClass) {
      console.log("subscribe program and propclass from paramater...")
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
    setTimeout(() => {valItem["isUpdating"] = false}, 300)
  }

  async onToggleValue(valItem: any, event: any) {
    console.log("onToggleValue...", valItem.property, valItem.value_from);
    valItem.web_filter = !valItem.web_filter
    await this.patchPropertyValue(valItem)
  }

  isPropertyVisible(propItem: any) {
    return propItem.scope == "C"
  }

  getPropertyVisibleText(scope: string) {
    return scope == "C" ? "Sichtbar (C)": "Unsichtbar (G)"
  }
 
}
