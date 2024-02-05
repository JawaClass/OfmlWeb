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
import { HttpErrorResponse } from '@angular/common/http';
import { interval } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from '../services/session.service';
import { Session } from '../models/models';
import {MatSelectModule} from '@angular/material/select';

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
    MatProgressBarModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './create-program.component.html',
  styleUrl: './create-program.component.css'
})
export class CreateProgramComponent {

  exportPathOptions = [
    "Testumgebung", "B://ofml_development//Tools//ofml_datenmacher"
  ]

  currentSession = inject(SessionService).currentSession$.value as Session

  createProgramForm = new FormGroup({
    programName: new FormControl(this.currentSession.name.toLowerCase().replace(" ", "_"), [
      Validators.required,
      Validators.pattern(/^[a-z][a-z0-9_]{1,24}$/)]),
    programId: new FormControl("", [
      Validators.required,
      Validators.pattern(/^[A-Z][A-Z0-9]{1}$/)]),
    exportOcd: new FormControl(true),
    exportOdb: new FormControl(true),
    exportOas: new FormControl(true),
    exportOam: new FormControl(true),
    exportOfml: new FormControl(true),
    exportGo: new FormControl(true),
    exportRegistry: new FormControl(true),
    buildEbase: new FormControl(true),
    exportPath: new FormControl(this.exportPathOptions[0]),
  })

  buildCurrentExportPath() {
    const root = this.createProgramForm.get("exportPath")!!.value!
    const folder = this.createProgramForm.get("programName")!!.value!
    return root + "//" + folder
  }

  dialogRef = inject(MatDialogRef<CreateProgramComponent>)
  createService = inject(CreateProgramService)
  httpErrorResponse: HttpErrorResponse | null = null
  isProcessing = false
  resultExportPath = ""
  secondsPassed: number = 0

  createProgram() {
    this.secondsPassed = 0
    this.httpErrorResponse = null
    this.dialogRef.disableClose = true
    this.isProcessing = true
    this.resultExportPath = ""
    const subscription = interval(1000).subscribe(x => this.secondsPassed = x)

    const params = {
      "web_program_name": this.currentSession.name,
      "program_name": this.createProgramForm.get("programName")!!.value!!,
      "program_id": this.createProgramForm.get("programId")!!.value!,
      "export_path": this.createProgramForm.get("exportPath")!!.value!,
      "export_ocd": this.createProgramForm.get("exportOcd")!!.value!,
      "export_oam": this.createProgramForm.get("exportOam")!!.value!,
      "export_oas": this.createProgramForm.get("exportOas")!!.value!,
      "export_ofml": this.createProgramForm.get("exportOfml")!!.value!,
      "export_go": this.createProgramForm.get("exportGo")!!.value!,
      "export_odb": this.createProgramForm.get("exportOdb")!!.value!,
      "export_registry": this.createProgramForm.get("exportRegistry")!!.value!,
      "build_ebase": this.createProgramForm.get("buildEbase")!!.value!,
    }
    this.createService.postCreate(params)
      .subscribe({
        next: (result) => {
          this.isProcessing = false
          this.resultExportPath = "file://" + result["export_path"]
          this.dialogRef.disableClose = false
          subscription.unsubscribe()
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          //console.log("createProgram HttpErrorResponse::", err.error);
          //console.error('Error:', err.error); // The error details provided by the server
          //console.error('Status:', err.status); // The HTTP status code
          //console.error('Status Text:', err.statusText); // The status text
          this.httpErrorResponse = httpErrorResponse
          this.isProcessing = false
          this.dialogRef.disableClose = false
          subscription.unsubscribe()
        }
      })

  }
}
