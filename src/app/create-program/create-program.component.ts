import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ArticleInputService } from '../services/article-input.service';
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

import { ToggleButtonComponent } from './../toggle-button/toggle-button.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'
import {ClipboardModule} from '@angular/cdk/clipboard'; 

@Component({
  selector: 'app-create-program',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule, MatDividerModule, MatIconModule, MatCheckboxModule, MatCardModule, MatChipsModule, MatInputModule, FormsModule, MatFormFieldModule,
    ToggleButtonComponent, WaitingCursorComponent, ClipboardModule
  ],
  templateUrl: './create-program.component.html',
  styleUrl: './create-program.component.css'
})
export class CreateProgramComponent {

  newProgramName: string = ""
  newProgramID: string = ""
  createService = inject(CreateProgramService)
  service = inject(ArticleInputService)

  isProcessing = false
  
  resultExportPath = ""
   
  isValidForm() {
    return /^[a-z][a-z0-9_]+$/.test(this.newProgramName) &&
           /^[A-Z][A-Z0-9]{1}$/.test(this.newProgramID)
  }

  createProgram() {
    console.log("createProgram");
    this.isProcessing = true
    this.resultExportPath = ""
    this.createService.postCreate(this.newProgramName, this.newProgramID, this.service.programMap)
    .subscribe({
      next: (result) => {
        console.log("createProgram returned!!!!!!");
        
        this.isProcessing = false
        this.resultExportPath = "file://" + result["export_path"]
      },
      error: (err) => {
        
        this.isProcessing = false
        this.resultExportPath = "Es ist ein Fehler aufgetrten! " + err["message"]
        console.log(err);
        
        
      }
   });

/*
    .subscribe({
      next: {},
      error: {}
      /*(result: any)=> {
        console.log("createProgram returned!!!!!!");
        
        this.isProcessing = false
        this.resultExportPath = "file://" + result["export_path"]
      }
    })*/
    
  }
}
