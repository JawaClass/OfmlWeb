import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleInputService } from '../services/article-input.service';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ArticleItem, ArtbaseItem, PropertyItem, PropValueItem, PropertyAndValueItem } from '../models/models';
import { WaitingCursorComponent } from './../waiting-cursor/waiting-cursor.component'
import { ArticleitemService } from '../services/articleitem.service';
import { PropSummaryComponent } from '../prop-summary/prop-summary.component'
import { MatChipsModule } from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge'; 
 

interface SimpleArtbase {
  property: string,
  value: string,
  changeCounter: number
}

@Component({
  selector: 'app-artbase-editor-all',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, FormsModule, MatExpansionModule,
    MatButtonModule, MatDividerModule, MatIconModule, MatCheckboxModule, MatInputModule, FormsModule, MatFormFieldModule,
    WaitingCursorComponent, PropSummaryComponent, MatChipsModule, MatBadgeModule
  ],
  templateUrl: './artbase-editor-all.component.html',
  styleUrl: './artbase-editor-all.component.css'
})
export class ArtbaseEditorAllComponent implements OnInit, OnDestroy {

  private service = inject(ArticleInputService)
  private articleitemService = inject(ArticleitemService)
  private router = inject(Router)

  activePrograms = this.service.programMap.getActivePrograms()
  selectedProgram = ""

  private MOCK = [
    { property: "", value: "", changeCounter: 0 }
  ]
  artbaseItems: SimpleArtbase[] = this.MOCK
  artbaseChanges: ArtbaseItem[] = []
  artbaseItemsResultCopy: SimpleArtbase[] = [] 

  isUnique() {
    const seen: any = {}
    for (const item of this.artbaseItems) {
      if (seen[item.property] && seen[item.property] === item.value)
        return false
        seen[item.property] = item.value
    }
    return true
  }

  validArtbaseItems = () => this.artbaseItems.filter((_: SimpleArtbase, idx: number) => this.isArtbaseItemValid(idx))
  isArtbaseItemValid(idx: number): boolean {
    const prop = this.artbaseItems[idx].property
    const value = this.artbaseItems[idx].value
    return prop.trim().length > 0 && value.trim().length > 0 && prop === prop.toUpperCase() && value === value.toUpperCase()
  }

  isFetchingData = false
  showArtbaseChangesResult = false

  currentUserInput: SimpleArtbase = {
    property: "",
    value: "",
    changeCounter: -1, // nod needed
  }

  onPropertyInput(value: string) {
    this.currentUserInput.property = value.trim().length ? value : ""
  }

  resetChanges() {
    this.showArtbaseChangesResult = false
    this.artbaseChanges = []
    this.artbaseItems.forEach(x => x.changeCounter = 0)
  }

  async addArtbaseItemsToAllArticles(enteredArtbaseItems: SimpleArtbase[]) {
    
    // collected articleItems that get updated
    let affectedArticleItems = new Map()
     
    this.service.programMap.getAllActiveArticleRefs().forEach((articleItem: ArticleItem) => {
      articleItem.pClasses.forEach((pClass: string) => {
        this.service.programMap.getPropItems(articleItem.program, pClass)?.forEach((propItem: PropertyItem) => {
          enteredArtbaseItems.forEach((artbaseItem: SimpleArtbase) => {
            if (propItem.active && /* property on pClass is active */
              artbaseItem.property == propItem.property && /* found property */
              propItem.values.find((x: PropValueItem) => x.active && x.value == artbaseItem.value) && /* property has this value and its active */
              articleItem.artbaseItems.find((x: ArtbaseItem) =>  
                x.property === artbaseItem.property &&
                x.value === artbaseItem.value
              ) === undefined /*  property/value combo is not yet in artbase */
            ) {
              const newEntry = new ArtbaseItem(articleItem.articleNr, pClass, artbaseItem.property, artbaseItem.value)
              articleItem.artbaseItems.push(newEntry)
              articleItem.edited = true
              
              if (!affectedArticleItems.has(articleItem.articleNr)) {
                affectedArticleItems.set(articleItem.articleNr, articleItem)
              }
              
              this.artbaseChanges.push(newEntry)
              artbaseItem.changeCounter += 1
            }
          })
        })
      })
    })
    
    await Promise.all(Array.from([...affectedArticleItems.values()]).map(item => this.articleitemService.saveArticleItem(item)))
  }

  btnDisabled() {
    return (this.validArtbaseItems().length == 0) || 
    !this.isArtbaseItemValid(this.artbaseItems.length - 1) ||
    this.isFetchingData ||
    !this.isUnique()
  }

  btnAddDisabled() {
    return (this.artbaseItems.length > 0 && !this.isArtbaseItemValid(this.artbaseItems.length - 1)) || !this.isUnique()
  }

  async updateAll() {
    this.resetChanges()
    const enteredArtbaseItems = this.validArtbaseItems()

    if (enteredArtbaseItems.length > 0) {
      console.log("addArtbaseItemsToAllArticles YES");
      this.isFetchingData = true

      let promises: Promise<any>[] = []
      this.service.programMap.getAllActiveArticleRefs().forEach((articleItem: ArticleItem) => {
        promises.push(this.service.fetchAndSetArtbase(articleItem))
        promises.push(this.service.fetchPropertiesFromArticleItem(articleItem))
      })
      await Promise.all(promises)
      
      await this.addArtbaseItemsToAllArticles(enteredArtbaseItems)

      this.isFetchingData = false
    } else {
      console.log("addArtbaseItemsToAllArticles NO");
    }

    this.showArtbaseChangesResult = true
    this.artbaseItemsResultCopy = structuredClone(this.artbaseItems)

  }

  async ngOnDestroy() {
    if (!this.service.hasProgramData())
      this.router.navigate(['/'])
  }

  async ngOnInit() {
    if (!this.service.hasProgramData())
      this.router.navigate(['/'])
    
      this.selectedProgram = this.activePrograms[0]
  }

  addEmptyItem() {
    this.artbaseItems.push({
      property: "",
      value: "",
      changeCounter: 0
    })
    this.currentUserInput.property = ""
  }

  addItem(item: PropertyAndValueItem) {
    const size = this.artbaseItems.length
    const newItem: SimpleArtbase = {
      property: item.propertyItem.property,
      value: item.propValueItem.value,
      changeCounter: 0
    }
    if (this.isArtbaseItemValid(size-1))  
      this.artbaseItems.push(newItem)
    else 
      this.artbaseItems[size-1] = newItem
  }

  deleteItem(idx: number) {
    this.artbaseItems.splice(idx, 1)
  }

} 