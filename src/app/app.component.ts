import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import { ProgressService } from './services/progress.service';
import { WaitingCursorComponent } from './waiting-cursor/waiting-cursor.component'
import { MatIconModule } from '@angular/material/icon'; 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, RouterLink, RouterLinkActive, WaitingCursorComponent, MatIconModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OfmlWeb';
  
  service = inject(ProgressService)
  location = inject(Location)
  router = inject(Router)

  showBtnGoPack() {
    return this.router.url !== "/"
  }

  goBackPage() {
    this.location.back()
  }
}
