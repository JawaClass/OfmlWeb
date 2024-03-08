import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ArtbaseService } from '../artbase.service';
import { RouterModule, Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PropclassEditorComponent } from '../../property/propclass-editor/propclass-editor.component'
import { Artbase4proplassComponent } from './artbase4proplass/artbase4proplass.component'

@Component({
  selector: 'app-artbase-editor',
  standalone: true,
  imports: [CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
    RouterModule,
    MatTooltipModule,
    PropclassEditorComponent,
    Artbase4proplassComponent
  ],
  templateUrl: './artbase-editor.component.html',
  styleUrl: './artbase-editor.component.css'
})
export class ArtbaseEditorComponent implements OnInit {

  private artbaseService = inject(ArtbaseService)
  private router = inject(Router)

  articleItem!: any
  isFetchingData = false

  getPropClasses() {
    if (!this.articleItem) return []
    else return this.articleItem.klassen
  }

  ngOnInit() {
    this.artbaseService.currentArticleItem$.subscribe(item => {
      if (!item) {
        this.router.navigate(['/'])
      }
      this.articleItem = item
    })

  }

}
