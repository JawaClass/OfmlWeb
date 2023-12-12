import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
import { MatToolbarModule} from '@angular/material/toolbar'; 
import { ArticleInputService } from './services/article-input.service';
import { WaitingCursorComponent } from './waiting-cursor/waiting-cursor.component'
import { MatIconModule } from '@angular/material/icon'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component'
import { shared_data } from './shared-data'
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { SaveChangesService } from './services/save-changes.service';
import { Interface } from 'readline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule,
    RouterLink, RouterLinkActive, WaitingCursorComponent,
    MatIconModule, RouterModule, MatDialogModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'OfmlWeb'
  timestamp = ""
  path = ""
  ownerText = ""
  sessionName = ""
  sessionNames: string[] = []
  
  service = inject(ArticleInputService)
  saveChangesService = inject(SaveChangesService)
  location = inject(Location)
  router = inject(Router)
  dialogOpener = inject(MatDialog)
  
  save() {
    console.log("save...");
    
  }

  showBtnGoPack() {
    return this.router.url !== "/"
  }

  goBackPage() {
    this.location.back()
  }

  async deleteSession(e: Event, name: string) {
    e.stopImmediatePropagation()
    console.log("deleteSession ", name)
    this.sessionNames = this.sessionNames.filter(x => x !== name)
    await this.saveChangesService.deleteSession(name)
  }

  async selectSession(name: string) {
    
    console.log("selectSession :::", name)
    this.setSessionName(name)
    await this.saveChangesService.fetchAndSetSessionData()
  }

  newSessionName() {
    const date = new Date()
    const name = date.toLocaleString().replace(", ", "_")
    return name
  }

  setSessionName(name: string) {
    this.sessionName = shared_data["sessionName"] = name
  }

  getOwnerStorage = () => localStorage.getItem('owner')
  setOwnerStorage = (name: string) => localStorage.setItem('owner', name)

  setOwner(owner: string) {
    this.ownerText = shared_data["owner"] = owner
  }

  async ngOnInit(): Promise<void> {

    this.setSessionName(this.newSessionName())

    console.log("INIT ::: owener=", this.getOwnerStorage())
    const owner = this.getOwnerStorage()
    if (owner) {

      this.setOwner(owner) 

    } else {

      this.dialogOpener.open(LoginComponent)
      .afterClosed()
      .subscribe((result: any) => {
        
        if (result && result["userName"]) {
          this.setOwnerStorage(result["userName"])
          this.setOwner(result["userName"]) 
        } 
      })

    }
    
    const misc = await this.service.fetchMiscData()
    this.timestamp = misc["init_tables"]
    this.path = misc["path"]
    console.log("APP-Component:::", this.timestamp)

    this.sessionNames = await this.saveChangesService.fetchSessionNames()
    this.sessionNames.push(this.sessionName)
    console.log("sessionNames :::", this.sessionNames);
    
    
  }

}
