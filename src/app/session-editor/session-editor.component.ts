import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ArticleItem, SessionAndOwner, Session, User } from '../models/models'
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from '../services/session.service'
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { MergeArticleComponent } from '../merge-article/merge-article.component'
import { MergeArticleAsAliasComponent } from '../merge-article-as-alias/merge-article-as-alias.component'
 
interface AlteredArticleItem {
  articleItem: ArticleItem;
  deleted: boolean;
  added: boolean
}

enum EditorMode {
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
    TextFieldModule,
    MatIconModule,
    MatDividerModule,
    MergeArticleComponent,
    MergeArticleAsAliasComponent
  ],
  templateUrl: './session-editor.component.html',
  styleUrl: './session-editor.component.css'
})
export class SessionEditorComponent implements OnInit {

  selected = ""
  sessionAndOwner!: SessionAndOwner
  editorMode: EditorMode
  textResource: any

  service = inject(SessionService)
  dialogRef = inject(MatDialogRef<SessionEditorComponent>)

  articleItems: AlteredArticleItem[] = []
  addArticleFailed = false

  formErrorMessage: string = ""

  router = inject(Router)

  constructor(@Inject(MAT_DIALOG_DATA) sessionAndOwner: SessionAndOwner) {
    this.editorMode = sessionAndOwner.session.id ? EditorMode.Edit : EditorMode.Create
    if (this.editorMode === EditorMode.Edit) {
      const sessionCopy = sessionAndOwner.session //Session.fromJSON(JSON.parse(JSON.stringify(sessionAndOwner.session)))
      this.sessionAndOwner = {session: sessionCopy, owner: sessionAndOwner.owner}
    } else {
      this.sessionAndOwner = sessionAndOwner
    }
    //this.sessionAndOwner.session.articleInput = "TLTN16880A TLTN20880A WPBTN WPBTT Q3HO1WE Q3HO2WE"
    //this.sessionAndOwner.session.name = "test_dasdkflk"
    this.textResource = {
      "header": this.isEditMode() ? `Sitzung editieren [${sessionAndOwner.session.id}]` : "Sitzung anlegen",
      "button": this.isEditMode() ? "Änderungen bestätigten" : "Mit Sitzung erstellen fortfahren",
      "checkbox": this.sessionAndOwner.session.isPublic ? "öffentliches Projekt" : "privates Projekt"
    }
  }

  async ngOnInit() {
    this.dialogRef.disableClose = true
    if (this.isEditMode()) {
      await this.service.setCurrentSession(this.sessionAndOwner.session)
      this.articleItems = []
    }
  }


  isEditMode = () => this.editorMode == EditorMode.Edit
  isCreateMode = () => this.editorMode == EditorMode.Create
  geUser = () => this.sessionAndOwner.owner.email

  private async createNewSession() {
    //const session = await this.service.createSession(this.sessionAndOwner.session)
    this.dialogRef.close({
      session: undefined
    })
    const articleTokens = this.sessionAndOwner.session.getInputTokens()

    console.log("createNewSession::articleTokens... articleTokens")
    console.log(articleTokens)
    this.service.currentSession$.next(this.sessionAndOwner.session)
    await this.service.fetchArticleDuplicates(articleTokens)
    
    this.router.navigate(['/duplicates', { }])
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
