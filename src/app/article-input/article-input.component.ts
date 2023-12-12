
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ArticleInputService } from '../services/article-input.service';
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

import { ToggleButtonComponent } from './../toggle-button/toggle-button.component'
import { DEFAULT_ARTICLES } from './mock-data'

import { CreateProgramComponent } from './../create-program/create-program.component'
import { ArticleItem } from './../models/models'
import { ProgressService } from '../services/progress.service';
import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'
import { SaveChangesService } from '../services/save-changes.service'; 


@Component({
  selector: 'app-article-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreateProgramComponent,
    RouterModule,
    MatButtonModule, MatDividerModule, MatIconModule, MatCheckboxModule, MatCardModule, MatChipsModule, MatInputModule, FormsModule, MatFormFieldModule,
    ToggleButtonComponent, WaitingCursorComponent
  ],
  templateUrl: './article-input.component.html',
  styleUrl: './article-input.component.css'
})
export class ArticleInputComponent {
  progressService = inject(ProgressService)
  service = inject(ArticleInputService)
  saveChangesService = inject(SaveChangesService)
  router = inject(Router)
  textAreaArticles: string = DEFAULT_ARTICLES
  getActivePrograms = () => this.service.programMap.getActivePrograms()
  getAllPrograms = () => this.service.programMap.getAllPrograms()
  isProgramActive = (program: string) => this.service.programMap.isActive(program)
  toggleActive = (program: string) => this.service.programMap.toggleActive(program)
  getPropClasses = (program: string) => this.service.programMap.getPropClassesFromProgram(program)
  getArticleItems = (program: string, pClass: string) => this.service.programMap.getArticlesFromPropClass(program, pClass)
  notUniqueArticles = () => this.service.programMap.notUniqueArticles()
  removeArticleItem = (artcleItem: ArticleItem) => this.service.programMap.removeArticleItem(artcleItem)
  isLoading = () => this.progressService.isLoading() 
  getAllActiveArticleRefs = () => this.service.programMap.getAllActiveArticleRefs()
  

  private persistArticleItemPromises = new Map<string, any[]>()
  
  onInputChangeArticle(articleItem: ArticleItem) {

    const delayPersist = 5000

    this.persistArticleItemPromises.get(articleItem.articleNr)
    ?.forEach(timeoutId => clearTimeout(timeoutId))

    const timeoutId = setTimeout(async (item: ArticleItem) => {

      console.log("write articleItem to Database!", item)
      // TODO: is not awaited
      await this.saveChangesService.saveArticleItem(item)
      
    }, delayPersist, articleItem)

    if (!this.persistArticleItemPromises.get(articleItem.articleNr))
      this.persistArticleItemPromises.set(articleItem.articleNr, [])
    
    this.persistArticleItemPromises.get(articleItem.articleNr)!!.push(timeoutId)

  }

  getInputTokens() {
    const regex: RegExp = /[ ;\r?\n]+/

    let tokens = this.textAreaArticles.split(regex)
    if (tokens.length > 0) {
      if (tokens[0] == "")
        tokens.splice(0, 1)
      if (tokens.length > 0) {
        if (tokens[tokens.length - 1] == "")
          tokens.splice(tokens.length - 1, 1)
      }
    }
    return tokens
  }

  disableSubmitBtn() {
    return this.getInputTokens().length == 0
  }

  async submitQueryArticles() {

    const tokens = this.getInputTokens()
    
    this.progressService.startLoading()
    this.service.fetchProgramMap(tokens).subscribe(async _ => { 
      this.progressService.stopLoading()
      const items = this.service.programMap.getAllActiveArticleRefs()
      console.log("fetched Articles:::", items)
      await Promise.all(items.map(item => this.saveChangesService.saveArticleItem(item)))
      
      
     })
    
  }

  navigateToEditArtbase(program: string, articleNr: string, pClass: string) {
    this.router.navigate(['/editor', {
      "program": program,
      "articleNr": articleNr
    }]);
  }

  navigateToEditPropClass(program: string, pClass: string) {
    this.router.navigate(['/editor-propclass', {
      "program": program,
      "propClass": pClass
    }]);
  }


  navigateToEditArtbaseAll() {
    this.router.navigate(['/editor-all']);
  }

}
