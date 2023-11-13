
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

import { ArticleInputService } from '../article-input.service';


@Component({
  selector: 'app-article-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './article-input.component.html',
  styleUrl: './article-input.component.css'
})
export class ArticleInputComponent {
  
  constructor(private articleInputService: ArticleInputService) {

  }

  DEFAULT_ARTICLES = `S6ALN
S6AP1000A
TLATRTL08800B2 
TLTN16880A
Q3HO1SE`


  applyForm = new FormGroup({
    textarea: new FormControl(this.DEFAULT_ARTICLES),
  });
  
  articlenumbers: string[] = []
  fetchedArticles: any[] = []
  hero = {
    "name": "HansiYeahXD"
  }
  
  submitApplication() {

   const regex: RegExp = /[ ;\r?\n]+/

    let tokens = this.applyForm.getRawValue().textarea!!.split(regex)
    if (tokens.length > 0) {
        if (tokens[0] == "")
          tokens.splice(0, 1)
        if (tokens.length > 0) {
          if (tokens[tokens.length - 1] == "")
            tokens.splice(tokens.length - 1, 1)
        }
    }
      
   this.articlenumbers = tokens

   /*
  this.articleInputService.getStream().subscribe(value => {
    console.log("article-input.component", value)
  }) 
*/

  this.articleInputService.postArticlesAndThenListen(this.articlenumbers).subscribe(value => {
    console.log("article-input.component", value)
  }) 

  }
   
}
