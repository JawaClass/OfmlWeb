import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PropSummaryComponent } from '../../property/prop-summary/prop-summary.component'
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { ArticleitemService } from '../../articleitem.service';


interface SimpleArtbase {
  property: string,
  value: string,
}

@Component({
  selector: 'app-artbase-editor-all',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, FormsModule, MatExpansionModule,
    MatButtonModule, MatDividerModule, MatIconModule, MatCheckboxModule, MatInputModule, FormsModule, MatFormFieldModule,
    PropSummaryComponent, MatChipsModule, MatBadgeModule
  ],
  templateUrl: './artbase-editor-all.component.html',
  styleUrl: './artbase-editor-all.component.css'
})
export class ArtbaseEditorAllComponent {

  private articleitemService = inject(ArticleitemService)
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

  deleteItem(idx: number) {
    this.artbaseItems.splice(idx, 1)
  }

} 