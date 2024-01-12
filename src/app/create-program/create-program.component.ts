import { Component, inject } from '@angular/core';
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
import { ErrorMessage } from '../models/models'
import { HttpErrorResponse } from '@angular/common/http';
import { interval } from 'rxjs';

@Component({
  selector: 'app-create-program',
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
    MatProgressBarModule
  ],
  templateUrl: './create-program.component.html',
  styleUrl: './create-program.component.css'
})
export class CreateProgramComponent {

  createProgramForm = new FormGroup({
    programName: new FormControl("", [
      Validators.required,
      Validators.pattern(/^[a-z][a-z0-9_]{1,24}$/)]),
    programId: new FormControl("", [
      Validators.required,
      Validators.pattern(/^[A-Z][A-Z0-9]{1}$/)]),
  })

  dialogRef = inject(MatDialogRef<CreateProgramComponent>)
  createService = inject(CreateProgramService)
  errorMessage: ErrorMessage | null = null
  isProcessing = false
  resultExportPath = ""
  secondsPassed: number = 0

  createProgram() {
    this.errorMessage = null
    this.dialogRef.disableClose = true
    this.isProcessing = true
    this.resultExportPath = ""
    const subscription = interval(1000).subscribe(x => this.secondsPassed = x)
    this.createService.postCreate(
      this.createProgramForm.get("programName")!!.value!!,
      this.createProgramForm.get("programId")!!.value!
    )
      .subscribe({
        next: (result) => {
          this.isProcessing = false
          this.resultExportPath = "file://" + result["export_path"]
          this.dialogRef.disableClose = false
          subscription.unsubscribe()
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error
          this.isProcessing = false
          this.dialogRef.disableClose = false
          subscription.unsubscribe()
        }
      })

  }
}
