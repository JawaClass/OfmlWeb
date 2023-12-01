import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtbaseEditorService } from '../services/artbase-editor.service';
import { PropClassService } from '../services/prop-class.service';
import { ArticleInputService } from '../services/article-input.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { log } from 'console';
import assert from 'assert';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ArticleItem, ArtbaseItem, PropertyItem, PropValueItem } from '../models/models';
import { WaitingCursorComponent } from './../waiting-cursor/waiting-cursor.component'

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
    WaitingCursorComponent
  ],
  templateUrl: './artbase-editor-all.component.html',
  styleUrl: './artbase-editor-all.component.css'
})
export class ArtbaseEditorAllComponent implements OnInit, OnDestroy {

  private service = inject(ArticleInputService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  private MOCK = [
    { property: "", value: "", changeCounter: 0 }
    /*{ property: "F1", value: "WI" },
    { property: "F2", value: "WI" },
    { property: "F3", value: "KS" },
    { property: "F4", value: "AL" },*/
  ]
  artbaseItems: SimpleArtbase[] = this.MOCK
  artbaseChanges: ArtbaseItem[] = []
  artbaseItemsResultCopy: SimpleArtbase[] = [] 

  validArtbaseItems = () => this.artbaseItems.filter((_: SimpleArtbase, idx: number) => this.isArtbaseItemValid(idx))
  isArtbaseItemValid = (idx: number) => this.artbaseItems[idx].property.trim().length > 0 && this.artbaseItems[idx].value.trim().length > 0

  isFetchingData = false
  showArtbaseChangesResult = false

  resetChanges() {
    //this.isFetchingData = false
    this.showArtbaseChangesResult = false
    this.artbaseChanges = []
    this.artbaseItems.forEach(x => x.changeCounter = 0)
  }

  async addArtbaseItemsToAllArticles(enteredArtbaseItems: SimpleArtbase[]) {
    console.log("addArtbaseItemsToAllArticles:: enteredArtbaseItems =", enteredArtbaseItems);
    
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
              console.log("add ArtbaseItem", newEntry);
              this.artbaseChanges.push(newEntry)
              // window.alert("add ArtbaseItem: " + newEntry)
              artbaseItem.changeCounter += 1
            }
          })
        })
      })
    })
    //window.alert("Artbase changes: " + artbaseChanges)
  }

  btnDisabled() {
    return (this.validArtbaseItems().length == 0) || 
    !this.isArtbaseItemValid(this.artbaseItems.length - 1) ||
    this.isFetchingData 
  }

  btnAddDisabled() {
    return (this.artbaseItems.length > 0 && !this.isArtbaseItemValid(this.artbaseItems.length - 1))
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
    console.log("Destroy......");
  }

  async ngOnInit() {
    if (!this.service.hasProgramData())
      this.router.navigate(['/'])
    
  }

  addEmptyItem() {
    this.artbaseItems.push({
      property: "",
      value: "",
      changeCounter: 0
    })
  }

  deleteItem(idx: number) {
    this.artbaseItems.splice(idx, 1)
  }

  activePrograms = () => this.service.programMap.getActivePrograms()
} 