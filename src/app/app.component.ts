import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WaitingCursorComponent } from './waiting-cursor/waiting-cursor.component'
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from './services/session.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule,
    RouterLink, RouterLinkActive, WaitingCursorComponent,
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

  ngOnInit(): void {
    this.sessionService.currentSession$.subscribe(session => {
      this.routesActivated = (session !== null)
    })
  }

}
