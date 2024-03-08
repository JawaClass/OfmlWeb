import { Component, inject } from '@angular/core';
import { ArtbaseEditorAllComponent } from '../artbase-editor-all/artbase-editor-all.component'
import { PropSummaryComponent } from '../../property/prop-summary/prop-summary.component'
import { MatChipsModule } from '@angular/material/chips';
import { ArticleInputService } from '../../article-input.service';
import { first, firstValueFrom } from 'rxjs';

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
    const data = await firstValueFrom(this.service.articleItems$.pipe(first())) || []
    this.programs = Array.from(new Set(data.map((item: any) => item.sql_db_program)))
    this.selectedProgram = this.programs[0]
  }
}
