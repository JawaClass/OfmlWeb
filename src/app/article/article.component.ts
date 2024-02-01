import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProgramService } from '../services/create-program.service';
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
import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogRef } from '@angular/material/dialog';
 

import { HttpErrorResponse } from '@angular/common/http';
import { interval } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ArticleItem, SessionAndOwner, Session, User } from '../models/models'
import { getShortTextFromArticle, getLongTextFromArticle } from '../models/helper'

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from '../services/session.service'
import { ArticleitemService } from '../services/articleitem.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-article',
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
    WaitingCursorComponent,
    ClipboardModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {

  articleItem!: any
  articleitemService = inject(ArticleitemService)
  dialogRef = inject(MatDialogRef<ArticleComponent>)
  articleForm = new FormGroup({
    articleNr: new FormControl("", [
      Validators.required,
    ]),
    articlePrice: new FormControl(0, [
      Validators.required,
      Validators.pattern(/^[0-9]+(\.[0-9]+)?$/) // (\.[0-9]+)?
    ]),
    shortText: new FormControl("", [
      Validators.required,
    ]),
    longText: new FormControl("", [
      // Validators.required,
    ]),
  })

  constructor(@Inject(MAT_DIALOG_DATA) articleItem: any) {
    this.articleItem = articleItem
    this.articleForm.controls.articleNr.setValue(this.articleItem.article_nr)
    this.articleForm.controls.shortText.setValue(getShortTextFromArticle(this.articleItem))
    this.articleForm.controls.longText.setValue(getLongTextFromArticle(this.articleItem).join("\n"))
  }

  async ngOnInit() {
    const priceItem = await this.articleitemService.fetchArticlePrice(this.articleItem)
    const price = parseFloat(priceItem["price"])
    this.articleForm.controls.articlePrice.setValue(price)
  }

  async submitArticleChanges() {
    this.articleItem.articleNrAlias = this.articleForm.controls.articleNr.value!!
    this.articleItem.shorttext = this.articleForm.controls.shortText.value!!
    console.log("submitArticleChanges", this.articleItem.price, typeof this.articleItem.price, "===>", this.articleForm.controls.articlePrice.value!!, typeof this.articleForm.controls.articlePrice.value!!);
    
    this.articleItem.price = Number(this.articleForm.controls.articlePrice.value!!) // form value is string?
    this.articleItem.longText = this.articleForm.controls.longText.value!!.split("\n")
    await this.articleitemService.saveArticleItem(this.articleItem)
    this.dialogRef.close()
  }
} 

