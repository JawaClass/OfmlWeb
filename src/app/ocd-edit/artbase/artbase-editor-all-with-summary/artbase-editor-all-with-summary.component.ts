import { Component, inject } from '@angular/core';
import { ArtbaseEditorAllComponent } from '../artbase-editor-all/artbase-editor-all.component'
import { PropSummaryComponent } from '../../property/prop-summary/prop-summary.component'
import { MatChipsModule } from '@angular/material/chips';
import { ArticleInputService } from '../../article-input.service';
import { first, map, tap } from 'rxjs';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artbase-editor-all-with-summary',
  standalone: true,
  imports: [
    ArtbaseEditorAllComponent,
    PropSummaryComponent,
    MatChipsModule,
    CommonModule
  ],
  templateUrl: './artbase-editor-all-with-summary.component.html',
  styleUrl: './artbase-editor-all-with-summary.component.css'
})
export class ArtbaseEditorAllWithSummaryComponent {

  service = inject(ArticleInputService)
  selectedProgram?: any = undefined

  programs$ = this.service.articleItemsSubjectBackend$.pipe(
    first(),
    map(
      (items: any[]) => Array.from(new Set(items.map(item => item.sql_db_program)))
    ),
    tap((programs: any[]) => this.selectedProgram = programs[0])
  )

}
