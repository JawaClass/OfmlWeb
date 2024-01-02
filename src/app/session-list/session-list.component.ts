import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionAndOwner, Session, User } from '../models/models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SessionEditorComponent } from '../session-editor/session-editor.component'
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HoldableDirective } from '../directives/holdable.directive';
import { SessionService } from '../services/session.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    HoldableDirective
  ],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.css',
})
export class SessionListComponent implements OnInit {

  sessionService = inject(SessionService)
  userService = inject(UserService)
  sessions: SessionAndOwner[] = []
  currentSession!: Session | null
  currentUser!: User

  dialogRef = inject(MatDialogRef<SessionListComponent>)
  dialogOpener = inject(MatDialog)

  async ngOnInit() {
    this.sessions = await this.sessionService.getAllSessionsWithOwner()
    this.currentSession = this.sessionService.currentSession$.value
    this.currentUser = this.userService.currentUser$.value!!
  }

  openCreateSessionDialog = () => this.openEditSessionDialog(
    { session: Session.emptyOne(this.currentUser.id!!), owner: this.currentUser } as SessionAndOwner
  )

  openEditSessionDialog(session: SessionAndOwner) {
    this.dialogOpener.open(SessionEditorComponent,
      {
        data: session
      }).afterClosed()
      .subscribe((result: any) => {
        this.dialogRef.close({
          session: this.sessionService.currentSession$.value
        })
      })
  }

  async selectSession(item: SessionAndOwner) {
    this.sessionService.setCurrentSession(item.session)
    this.dialogRef.close({ session: item.session })
  }

  async deleteSession(item: SessionAndOwner) {
    this.sessions = this.sessions.filter(x => x.session.id !== item.session.id)
    await this.sessionService.deleteSession(item.session)
  }
}
