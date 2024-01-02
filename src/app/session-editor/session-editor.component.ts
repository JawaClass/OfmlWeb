import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SessionAndOwner } from '../models/models'
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from '../services/session.service'

export enum EditorMode {
  Create = 'CREATE',
  Edit = 'EDIT',
}

@Component({
  selector: 'app-session-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TextFieldModule
  ],
  templateUrl: './session-editor.component.html',
  styleUrl: './session-editor.component.css'
})
export class SessionEditorComponent {

  sessionAndOwner!: SessionAndOwner
  editorMode: EditorMode
  textResource: any

  service = inject(SessionService)
  dialogRef = inject(MatDialogRef<SessionEditorComponent>)

  constructor(@Inject(MAT_DIALOG_DATA) session: SessionAndOwner) {
    this.sessionAndOwner = session
    this.editorMode = this.sessionAndOwner.session.id ? EditorMode.Edit : EditorMode.Create
    this.textResource = {
      "header": this.isEditMode() ? "Sitzung editieren" : "Sitzung anlegen",
      "button": this.isEditMode() ? "Änderungen bestätigten" : "Sitzung erstellen",
      "checkbox": this.sessionAndOwner.session.isPublic ? "öffentliches Projekt" : "privates Projekt"
    }
  }

  isEditMode = () => this.editorMode == EditorMode.Edit
  isCreateMode = () => this.editorMode == EditorMode.Create
  geUser = () => this.sessionAndOwner.owner.email

  private async createNewSession() {
    const session = await this.service.createSession(this.sessionAndOwner.session)
    this.dialogRef.close({
      session: session
    })
  }

  private async editSession() {

  }

  async saveSession() {
    switch (this.editorMode) {
      case EditorMode.Create:
        await this.createNewSession()
        break
      case EditorMode.Edit:
        await this.editSession()
        break
    }
  }

  signupFormValid() {
    const namelen = this.sessionAndOwner.session.name.trim().length
    const tokens = this.sessionAndOwner.session.getInputTokens()
    return namelen > 2 && namelen < 25 && tokens.length
  }
}
