
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';




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
  
  applyForm = new FormGroup({
    textarea: new FormControl(''),
  });
  
  articlenumbers: string[] = []
  
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
   console.log("LOG: ", tokens)
    
   }
   
}
