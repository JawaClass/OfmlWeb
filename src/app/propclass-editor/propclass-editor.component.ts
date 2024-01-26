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

  ngAfterViewInit() {
    const elem = document.querySelector('.mat-sidenav-content')
    elem!!.scroll(
      {
        left: 0,
        top: 0,
        behavior: 'instant',
      }
    )
  }

  async ngOnDestroy() {
    if (this.propItems) {
      this.isLoading = true
      await this.propertyitemService.savePropertyItems(this.propItems, this.program, this.pClass)
      this.isLoading = false
    }
  }

  async ngOnInit() {
    this.isLoading = true
    if (!this.service.hasProgramData())
      this.router.navigate(['/'])

    this.route.params.subscribe(async (params) => {
      this.program = params['program']
      this.pClass = params['propClass']
      
      await this.service.fetchProperties(this.program, this.pClass)
      this.propClass = this.service.programMap.getPropClass(this.program, this.pClass)!!
      this.propItems = this.service.programMap.getPropItems(this.program, this.pClass)!!
      this.propClass.seen = true
      this.isLoading = false
    })

  }

  onChangeAll(propertyItem: PropertyItem, event: any) {
    propertyItem.values.forEach((x: PropValueItem) => { x.active = event.checked })
    this.propClass.edited = true
  }

}
