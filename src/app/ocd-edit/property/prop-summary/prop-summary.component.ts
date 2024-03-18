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
import { BehaviorSubject, filter, first, firstValueFrom, map, take } from 'rxjs';

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
export class PropSummaryComponent {

  @Input("selectedProgram") selectedProgram: string = ""
  @Input("currentPropertyInput") currentPropertyInput: string = ""
  service = inject(ArticleInputService)
  propClassNames$ = new BehaviorSubject<string[]>([])

  async ngOnChanges(changes: SimpleChanges): Promise<void> {

    this.service.articleItemsSubjectBackend$.pipe(
      map((items: any[]) => items.filter(item => item.sql_db_program === this.selectedProgram)),
      first()
    ).subscribe((items: any[]) => {

      console.log("ngOnChanges...", items)
      const pClasses = Object.keys(this.service.groupArticlesByClassName(items))
      this.propClassNames$.next(pClasses)

    })

  }

}
