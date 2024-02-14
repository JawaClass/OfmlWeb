import { Component, Input, inject } from '@angular/core';
import { ArtbaseEditorAllComponent } from '../artbase-editor-all/artbase-editor-all.component'
import { PropSummaryComponent } from '../prop-summary/prop-summary.component'
import { MatChipsModule } from '@angular/material/chips';
import { ArticleInputService } from '../services/article-input.service';

@Component({
  selector: 'app-artbase-editor-all-with-summary',
  standalone: true,
  imports: [
    ArtbaseEditorAllComponent,
    PropSummaryComponent,
    MatChipsModule
  ],
  templateUrl: './artbase-editor-all-with-summary.component.html',
  styleUrl: './artbase-editor-all-with-summary.component.css'
})
export class ArtbaseEditorAllWithSummaryComponent {

  service = inject(ArticleInputService)
  programs: string[] = []
  selectedProgram: any = ""

  async ngOnInit() {
     const data = await this.service.getWebOcdArticleWithDetails()
     this.programs = Array.from(new Set(data.map((item: any) => item.sql_db_program)))
     this.selectedProgram = this.programs[0]
  }
}
