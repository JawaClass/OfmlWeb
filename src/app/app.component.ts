import { Component, OnInit, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ExportProgramComponent } from './export-program/export-program.component';
import { SessionService } from './session/session.service';
import { BaseService } from './util/base.service';
import { map } from 'rxjs';
import { TaskDisplayService } from './tasks/task-display.service';


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

  taskDisplayService = inject(TaskDisplayService)
  sessionService = inject(SessionService)
  routesActivated$ = this.sessionService.currentSession$.pipe(
    map((session: any) => Boolean(session))
  )

  dialogOpener = inject(MatDialog)

  constructor() {
    afterNextRender(() => {
      console.log("APP COMP AFTER NEXT RENDER...");
    })
  }

  async ngOnInit() {
    console.log("BASE URL ::", BaseService.BASE_URL)
  }

  openExportProgramDialog() {
    this.dialogOpener.open(ExportProgramComponent, { minHeight: "50rem", width: "60ch" })
      .afterClosed()
      .subscribe((result: any) => {
      })
  }

}
