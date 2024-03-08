import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { getShortTextFromArticle, getArticleLongText } from '../../../models/helper'
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArticleitemService } from '../../articleitem.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    ClipboardModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.css'
})
export class ArticleEditorComponent implements OnInit {
  
  longTextItem: any
  priceItem: any
  articleItem!: any
  articleitemService = inject(ArticleitemService)
  dialogRef = inject(MatDialogRef<ArticleEditorComponent>)
  articleForm = new FormGroup({
    articleNr: new FormControl("", [
      Validators.required,
    ]),
    articleNrAlias: new FormControl("", [
    ]),
    articlePrice: new FormControl(0, [
      Validators.required,
      Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)
    ]),
    shortText: new FormControl("", [
      Validators.required,
    ]),
    longText: new FormControl("", [
    ]),
  })

  constructor(@Inject(MAT_DIALOG_DATA) articleItem: any) {
    this.articleItem = articleItem
  }

  async ngOnInit() {
    this.articleForm.controls.articleNr.setValue(this.articleItem.article_nr)
    this.articleForm.controls.shortText.setValue(getShortTextFromArticle(this.articleItem))
    const [priceItem, artLongTextItem] = await Promise.all(
      [
        this.articleitemService.fetchArticlePrice(this.articleItem),
        this.articleitemService.fetchArticleLongText(this.articleItem)
      ]
    )
    this.priceItem = priceItem
    this.longTextItem = artLongTextItem
    this.articleForm.controls.articlePrice.setValue(parseFloat(this.priceItem["price"]))
    this.articleForm.controls.longText.setValue(getArticleLongText(this.longTextItem).join("\n"))
  }

  async submitArticleChanges() {
    
    await this.articleitemService.patchArticlePrice({
      "db_key": this.priceItem.db_key,
      "price": Number(this.articleForm.controls.articlePrice.value)
    })

    await this.articleitemService.patchArticleShortText({
      "db_key": this.articleItem.kurztext.db_key,
      "text": this.articleForm.controls.shortText.value
    })
    this.articleItem.kurztext.text = this.articleForm.controls.shortText.value

    await this.articleitemService.patchArticleLongText(
      this.articleItem,
      this.longTextItem,
      this.articleForm.controls.longText.value as string
      )

    this.dialogRef.close()
  }
} 

