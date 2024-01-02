import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ArticleInputService } from '../services/article-input.service';
import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component'
import { SessionListComponent } from '../session-list/session-list.component'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { Session, User } from '../models/models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../services/user.service';
import { SessionService } from '../services/session.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule,
    RouterLink, RouterLinkActive, WaitingCursorComponent,
    MatIconModule, RouterModule, MatDialogModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    MatSelectModule, MatSidenavModule, MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  title = 'OfmlWeb'
  timestamp = ""
  path = ""
  
  currentUser: User | null = null
  currentSession: Session | null = null

  userService = inject(UserService)
  sessionService = inject(SessionService)
    
  service = inject(ArticleInputService)
  location = inject(Location)
  router = inject(Router)
  dialogOpener = inject(MatDialog)

  logout = () => this.userService.logout()

  openLoginDialog() {
    this.dialogOpener.open(LoginComponent)
      .afterClosed()
      .subscribe(async (result: any) => {

        if (result && result["email"]) {
          this.openSessionList()
        }
      })
  }

  openSessionList = () => this.dialogOpener.open(SessionListComponent)

  async fetchAndSetMiscData() {
    const misc = await this.service.fetchMiscData()
    this.timestamp = misc["init_tables"]
    this.path = misc["path"]
  }

  async ngOnInit() {

    this.userService.currentUser$.subscribe( user => this.currentUser = user )
    this.sessionService.currentSession$.subscribe( session => this.currentSession = session)

    await this.fetchAndSetMiscData()

    // to avoid SSR clash
    if (typeof window !== 'undefined') {
      const succ = await this.userService.tryAutoLogin()
      console.log("succ - tryAutoLogin", succ)
      
      if (!succ) {
        this.openLoginDialog()
      } else {
        const succ = await this.sessionService.tryAutoSelectFromLastUsed()
        if (!succ) this.openSessionList()
      }
    } 
 
  }
}
