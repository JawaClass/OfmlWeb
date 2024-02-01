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
    MatTooltipModule
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
  
  getPropertyHeaderText(p: any) {
    return `# ${p.pos_prop} ${p.property} : ${this.getPropertyText(p)} (${p.scope})`
  }

  getPropertyValueText(v: any) {
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
        this.initialize()
      })
    } else {
      this.initialize()
    }
    

  }

  onChangeAll(propertyItem: PropertyItem, event: any) {
    //propertyItem.values.forEach((x: PropValueItem) => { x.active = event.checked })
    //this.propClass.edited = true
  }

}
