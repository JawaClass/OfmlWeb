import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { MatExpansionModule } from '@angular/material/expansion';
import { Subscription, map, take, merge, BehaviorSubject, Subject, first } from 'rxjs';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { ArticleInputService, EMPTY_FILTER } from '../../article-input.service';

@Component({
  selector: 'app-article-control-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatTooltipModule, MatIconModule, MatButtonModule, MatDialogModule, MatCheckboxModule, RouterModule],
  templateUrl: './article-control-bar.component.html',
  styleUrl: './article-control-bar.component.css'
})
export class ArticleControlBarComponent {

  service = inject(ArticleInputService)

  
  artilceItemsSize$ = this.service.articleItems$.pipe(
    map(items => items.length)
  )
  
  filter$ = this.service.filter$$

  alternativeView$ = this.service.alternativeView$


  toggleView() {
    this.service.toggleView()
  }
  resetFilter() {
    this.service.setFilter$.next(EMPTY_FILTER); // Emit the updated data
  }

  
  onFilterSet(article?: string, program?: string) {
    
    this.service.filter$$.pipe(
      map(lastFilter => {
        return {
          article: article === undefined ? lastFilter.article : article,
          program: program === undefined ? lastFilter.program : program
        }
      }),
      take(1)
    ).subscribe(updatedData => {
      this.service.setFilter$.next(updatedData); // Emit the updated data
    });

  }

}
