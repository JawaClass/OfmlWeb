import { AfterViewInit, Component, OnChanges, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SessionListComponent } from '../session/session-list/session-list.component'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { Session, User } from '../models/models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../session/login/login.component'
import { ArticleInputService } from '../ocd-edit/article-input.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../session/user.service';
import { TaskDisplayListComponent } from '../tasks/task-display-list/task-display-list.component';
import { TaskDisplayService } from '../tasks/task-display.service';
import { HeaderService } from './header.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule,
    RouterLink, RouterLinkActive,
    MatIconModule, RouterModule, MatDialogModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    MatSelectModule, MatSidenavModule, MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  

  headerService = inject(HeaderService)
  // timestamp = ""
  // path = ""

  currentUser: User | null = null
  currentSession: Session | null = null
  userService = inject(UserService)
  sessionService = inject(SessionService)   
  location = inject(Location)
  router = inject(Router)
  dialogOpener = inject(MatDialog)

  miscData$ = this.headerService.miscData$

  openEditSessionDialog() {
    const sessionOwner = {session: this.currentSession!!, owner: this.currentUser!!}
    this.sessionService.openEditSessionDialog(sessionOwner, () => {})
  }

  getSessionText() {
    return this.currentSession ? `[${this.currentSession.id}] ${this.currentSession.name}` : "Sitzungen"
  } 

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

  

  
  constructor() {
    // this.headerService.infos$.subscribe(x => console.log("headerService.infos$:::", x))
  }
  
  async ngOnInit() {
    
    this.userService.currentUser$.subscribe( (user: any) => {
      setTimeout(() => {
        this.currentUser = user
      })
    } )
    this.sessionService.currentSession$.subscribe( (session: any) => {
      setTimeout(() => {
        this.currentSession = session
      })
    })
    
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

  openTaskDisplay() {
    let dialogRef = this.dialogOpener.open(TaskDisplayListComponent, { 
    maxWidth: "80ch",
    maxHeight: "90vh",
    position: {bottom: '10px', right: "10px"}
  });
  }

}
