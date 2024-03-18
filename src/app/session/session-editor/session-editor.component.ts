import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SessionAndOwner } from '../../models/models'
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from '../session.service'
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { MergeArticleComponent } from '../merge-article/merge-article.component'
import { MergeArticleAsAliasComponent } from '../merge-article-as-alias/merge-article-as-alias.component'

enum EditorMode {
  Create = 'CREATE',
  Edit = 'EDIT',
}

type SelectMode = "merge_as" | "merge"

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
    TextFieldModule,
    MatIconModule,
    MatDividerModule,
    MergeArticleComponent,
    MergeArticleAsAliasComponent
  ],
  templateUrl: './session-editor.component.html',
  styleUrl: './session-editor.component.css'
})
export class SessionEditorComponent {

  selected: SelectMode = "merge_as"
  sessionAndOwner!: SessionAndOwner
  editorMode: EditorMode
  textResource: any

  service = inject(SessionService)
  dialogRef = inject(MatDialogRef<SessionEditorComponent>)


  addArticleFailed = false

  formErrorMessage: string = ""

  router = inject(Router)

  constructor(@Inject(MAT_DIALOG_DATA) sessionAndOwner: SessionAndOwner) {
    this.editorMode = sessionAndOwner.session.id ? EditorMode.Edit : EditorMode.Create
    if (this.editorMode === EditorMode.Edit) {
      const sessionCopy = sessionAndOwner.session
      this.sessionAndOwner = { session: sessionCopy, owner: sessionAndOwner.owner }
    } else {
      this.sessionAndOwner = sessionAndOwner
    }

    this.textResource = {
      "header": this.isEditMode() ? `Sitzung editieren [${sessionAndOwner.session.id}]` : "Sitzung anlegen",
      "button": this.isEditMode() ? "Änderungen bestätigten" : "Mit Sitzung erstellen fortfahren",
      "checkbox": this.sessionAndOwner.session.isPublic ? "öffentliches Projekt" : "privates Projekt"
    }

  }

  isEditMode = () => this.editorMode == EditorMode.Edit
  isCreateMode = () => this.editorMode == EditorMode.Create
  geUser = () => this.sessionAndOwner.owner.email

  private async createNewSession() {
    const articleTokens = this.sessionAndOwner.session.getInputTokens()
    this.service.setCurrentSession(this.sessionAndOwner.session)
    await this.service.fetchAndSetArticleDuplicates(articleTokens)
    this.router.navigate(['/duplicates', {}])
    this.dialogRef.close({
      session: this.sessionAndOwner.session
    })
  }

  private async editSession() {
    const session = this.sessionAndOwner.session
    this.dialogRef.close({
      session: session
    })
  }

  async saveSession() {
    const sessionOrNull = await this.service.fetchSessionByName(this.sessionAndOwner.session.name)
    console.log("sessionOrNull 4 name", this.sessionAndOwner.session.name, ":::", sessionOrNull)
    if (sessionOrNull) {
      this.formErrorMessage = "Name bereits vergeben."
      return
    }

    switch (this.editorMode) {
      case EditorMode.Create:
        await this.createNewSession()
        break
      case EditorMode.Edit:
        await this.editSession()
        break
    }
  }

  isFormValid() {
    const namelen = this.sessionAndOwner.session.name.trim().length
    const tokens = this.sessionAndOwner.session.getInputTokens()
    return namelen > 2 && namelen < 25 && tokens.length
  }

}
