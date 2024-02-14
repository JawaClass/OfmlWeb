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
export class ArtbaseEditorAllComponent {

  private service = inject(ArticleInputService)
  private articleitemService = inject(ArticleitemService)
  private router = inject(Router)
  private MOCK = [
    { property: "", value: "" }
  ]
  artbaseItems: SimpleArtbase[] = this.MOCK
  currentUserInput: SimpleArtbase = {
    property: "",
    value: "",
  }
  isLoading = false
  showArtbaseChangesResult = false
  resultMessage: any | null = null

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

  onPropertyInput(value: string) {
    this.currentUserInput.property = value.trim().length ? value : ""
  }

  resetChanges() {
    this.showArtbaseChangesResult = false
  }

  btnDisabled() {
    return (this.validArtbaseItems().length == 0) || 
    !this.isArtbaseItemValid(this.artbaseItems.length - 1) ||
    this.isLoading ||
    !this.isUnique()
  }

  btnAddDisabled() {
    return (this.artbaseItems.length > 0 && !this.isArtbaseItemValid(this.artbaseItems.length - 1)) || !this.isUnique() || this.isLoading
  }

  async setArtbaseValues() {
    this.isLoading = true
    this.resultMessage = await this.articleitemService.execBatachArtbaseAll(this.artbaseItems)
    this.isLoading = false
  }

  addEmptyItem() {
    this.artbaseItems.push({
      property: "",
      value: ""
    })
    this.currentUserInput.property = ""
  }

  addItem(item: PropertyAndValueItem) {
    const size = this.artbaseItems.length
    const newItem: SimpleArtbase = {
      property: item.propertyItem.property,
      value: item.propValueItem.value
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