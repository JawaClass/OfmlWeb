import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderComponent } from './header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateProgramComponent } from './create-program/create-program.component';
import { SessionService } from './session/session.service';
import { BaseService } from './util/base.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule,
    RouterLink, RouterLinkActive,
    MatIconModule, RouterModule, MatDialogModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    MatSelectModule, MatSidenavModule, MatButtonModule,
    MatTooltipModule, HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  sessionService = inject(SessionService)
  routesActivated = true
  dialogOpener = inject(MatDialog)

  async ngOnInit() {
    console.log("BASE URL ::", BaseService.BASE_URL)
    this.sessionService.currentSession$.subscribe((session: any) => {
      this.routesActivated = Boolean(session)
    })
  }


  openCreateProgramDialog() {
    this.dialogOpener.open(CreateProgramComponent, { height: '95%', })
      .afterClosed()
      .subscribe((result: any) => {
      })
  }

}
