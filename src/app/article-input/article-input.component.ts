
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { ArticleInputService, ArticleCompact, Result } from '../services/article-input.service';
import {RouterModule, Router } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

export type ActiveProgram = {
  program: string,
  isActive: boolean,
}

@Component({
  selector: 'app-article-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule, MatDividerModule, MatIconModule
  ],
  templateUrl: './article-input.component.html',
  styleUrl: './article-input.component.css'
})
export class ArticleInputComponent implements OnInit {
  
  ngOnInit() {

    console.log("ArticleInputComponent:::ngOnInit", this.articleInputService.getFetchedArticles())
    this.fetchedArticles = this.articleInputService.getFetchedArticles()

  }

  constructor(
    private articleInputService: ArticleInputService,
    private router: Router
    ) {}

  DEFAULT_ARTICLES = `
  B4TAX248840A
  B4TNX12880A
  B4TNX14880A
  B4TNX16880A
  B4TNX18880A
  B4TNX20880A
  B4TZHZX1
  B4TZRLX12A
  B4TZRLX16A
  B4TZRLX18A
  BTSR0A
  BTSTB14880A
  COCNX08610A
  COCNX08640A
  COCNX08810A
  COCNX08840A
  COCNX12830A
  COCNX12840A
  COCNXSIKI6
  COCNXSIKI8
  COCNZTQ
  COCSX09810A
  COCSX09840A
  PNESBFI30W
  PNEZR03
  PNEZR04
  S6AR08400A
  S6AR10400A
  S6SADV112140A
  S6SAV108110A
  S6SAV108750A
  S6SAV110110A
  S6SAV110750A
  S6SAV112110A
  S6SAV112750A
  S6SAV116110A
  S6SAV116750A
  S6SLV108750A
  S6SLV110750A
  S6SLV116750A
  S6T1AK610180A
  S6T1AK612180A
  S6TA08180A
  S6TA08210A
  S6TA10180A
  S6TA10210A
  S6TA12180A
  S6TA12210A
  S6TR08110A
  S6TR08140A
  S6TR08180A
  S6TR08210A
  S6TR08750A
  S6TR10110A
  S6TR10140A
  S6TR10180A
  S6TR10210A
  S6TR10750A
  S6TR12110A
  S6TR12140A
  S6TR12180A
  S6TR12210A
  S6TR12750A
  S8ASV10408012A
  S8ASWV10408012A
  S8ZTQ4224
  TLTA248840A
  WPABH
  WPAPTDB
  WPAPTN
  WPBTB
  WPBTN
  WPKTS
  WPTZCPULI
  WPTZKKMKW
  WPTZRWBLD
  WPTZSMPC
  WPZESD
  WPZESZ
  WPZESZMOD  
`


  applyForm = new FormGroup({
    textarea: new FormControl(this.DEFAULT_ARTICLES),
  });
  
  fetchedArticles: Result = {}
  activePrograms: ActiveProgram[] = []

  getIter() {
    const keys = Object.keys(this.fetchedArticles)
    console.log("keys", keys)
    return keys
  }

  getProgramClassMap(program: string) {
    const keys = Object.keys(this.fetchedArticles[program])
    return keys
  } 

  
  deleteArticle(article: ArticleCompact, idx: number) {
    //this.fetchedArticles.splice(idx, 1)
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
    this.fetchedArticles = result
    this.articleInputService.setFetchedArticles(result)
    this.activePrograms = this.getIter().map(x => ({
      program:x,
      isActive: true
    }))

    for (const program in result) {
      console.log("program:", program)
      const programClassMap = result[program]
      console.log(programClassMap)
    }


  }) 

  }
   

  navigateToEditPropClass(program: string, propClass: string) {
    console.log("navigateToEditPropClass", program, propClass)
    this.router.navigate(['/editor-propclass', { 
      "programNameInput": program,
      "propClassNameInput": propClass
     }]);
  }
}
