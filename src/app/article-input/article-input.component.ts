
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { ArticleInputService, Result } from '../services/article-input.service';
import {RouterModule, Router } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {MatCardModule} from '@angular/material/card'; 
import {MatChipsModule} from '@angular/material/chips'; 
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { ToggleButtonComponent } from './../toggle-button/toggle-button.component'
import {  DEFAULT_ARTICLES } from  './mock-data'
 
@Component({
  selector: 'app-article-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule, MatDividerModule, MatIconModule, MatCheckboxModule, MatCardModule, MatChipsModule, MatInputModule, FormsModule, MatFormFieldModule, 
    ToggleButtonComponent,
  ],
  templateUrl: './article-input.component.html',
  styleUrl: './article-input.component.css'
})
export class ArticleInputComponent implements OnInit {
  
  activeArray: boolean[] = []
  applyForm = new FormGroup({
    textarea: new FormControl(DEFAULT_ARTICLES), 
  });
  
  fetchedArticles: Result = {}
  
  constructor(
    private articleInputService: ArticleInputService,
    private router: Router
    ) {}

    ngOnInit() {
      this.fetchedArticles = this.articleInputService.getFetchedArticles()
      this.activeArray = this.articleInputService.getActiveArray()
    }
    getLastPropClassEdit() {
      return this.articleInputService.getLastPropClassEdit()
    }
    
  
    
  getIterActivePrograms() {
    const keys = Object.keys(this.fetchedArticles).filter((value, idx) => this.activeArray[idx]);
    console.log("keys", keys)
    return keys
  }

  getCountActiveArticlesAll =() => this.getCountActiveArticles()[0]
  getCountActiveArticlesUnique =() => this.getCountActiveArticles()[1]

  getCountActiveArticles() {
    const programs = this.getIterActivePrograms()
    const seen: Set<string> = new Set();
    let cntAll = 0
    let cntUnique = 0
    programs.forEach(p => {
      const propClasses = Object.keys(this.fetchedArticles[p])
      propClasses.forEach(c => {
        const propClass = this.fetchedArticles[p][c]
        propClass.forEach(a => 
          {
            cntAll += 1
            const article = a.article_nr
            if (!seen.has(article))
              cntUnique += 1
            seen.add(article)
          }
          )
      })
    })

    return [cntAll, cntUnique]
  }

  getIterAllPrograms() {
    const keys = Object.keys(this.fetchedArticles)
    return keys
  }

  getProgramClassMap(program: string) {
    const keys = Object.keys(this.fetchedArticles[program])
    return keys
  } 

  submitApplication() {

   const regex: RegExp = /[ ;\r?\n]+/

    let tokens = this.applyForm
    .getRawValue().textarea!!.split(regex)
    if (tokens.length > 0) {
        if (tokens[0] == "")
          tokens.splice(0, 1)
        if (tokens.length > 0) {
          if (tokens[tokens.length - 1] == "")
            tokens.splice(tokens.length - 1, 1)
        }
    }
      
   this.articleInputService
   .getArticleCompact(tokens)
   .subscribe(
    (result: Result) => {
    this.activeArray = Object.keys(result).map(x => true)
    this.fetchedArticles = result
    this.articleInputService.setFetchedArticles(result)
    this.articleInputService.setActiveArray(this.activeArray)
    
    for (const program in result) {
      console.log("program:", program)
      const programClassMap = result[program]
      console.log(programClassMap)
    }


  }) 

  }
  
  changeActiveProgram(idx: number) {
    this.activeArray[idx] = !this.activeArray[idx]
    this.articleInputService.setActiveArray(this.activeArray)
  }

  navigateToEditPropClass(program: string, propClass: string) {
    this.articleInputService.setLastPropClassEdit(program, propClass)
    console.log("navigateToEditPropClass", program, propClass)
    this.router.navigate(['/editor-propclass', { 
      "programNameInput": program,
      "propClassNameInput": propClass
     }]);
  }

  navigateToEditArtbase(program: string, article: string, propClass: string) {
    this.articleInputService.setLastPropClassEdit(program, article)
    this.router.navigate(['/editor', { 
      "programNameInput": program,
      "articleInput": article,
      "propClassInput": propClass
     }]);
  }

}
