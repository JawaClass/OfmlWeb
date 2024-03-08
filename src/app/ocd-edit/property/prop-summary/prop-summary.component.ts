import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleInputService } from '../../article-input.service';
import { inject } from '@angular/core';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PropclassViewerComponent } from '../propclass-viewer/propclass-viewer.component'
import { first, firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-prop-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatDividerModule,
    MatTableModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    PropclassViewerComponent
  ],
  templateUrl: './prop-summary.component.html',
  styleUrl: './prop-summary.component.css'
})
export class PropSummaryComponent implements OnInit {

  @Input("selectedProgram") selectedProgram: string = ""
  @Input("currentPropertyInput") currentPropertyInput: string = ""
  service = inject(ArticleInputService)
  data: any[] = []
  propClassNames: string[] = []

  async ngOnInit(): Promise<void> {
    this.data = await firstValueFrom(this.service.articleItems$.pipe(first())) || []
    this.updateSummary()
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const changeSelectedProgram: SimpleChange = changes["selectedProgram"]
    if (changeSelectedProgram && !changeSelectedProgram.isFirstChange())
      this.updateSummary()
  }

  async updateSummary() {
    const items = this.data.filter((item: any) => item.sql_db_program === this.selectedProgram)
    const pClassGroups = this.service.groupArticlesByClassName(items)
    this.propClassNames = Object.keys(pClassGroups)
  }

}
