import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subscription, map, take, merge, BehaviorSubject, Subject, first } from 'rxjs';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { ArticleListItemComponent } from '../article-list-item/article-list-item.component'
import { SaveScrollPositionComponent } from '../../../util/save-scroll-position/save-scroll-position.component';
import { PriceMultiplierComponent } from '../../price/price-multiplier/price-multiplier.component'
import { ArticleitemService } from '../../articleitem.service';
import { ArticleInputService, ArtilceItemsFilter, EMPTY_FILTER } from '../../article-input.service';
import { ArtbaseService } from '../../artbase/artbase.service';
import { ArticleListOverArticlesComponent } from "../article-list-over-articles/article-list-over-articles.component";
import { ArticleListOverClassesComponent } from "../article-list-over-classes/article-list-over-classes.component";

@Component({
  selector: 'app-article-list',
  standalone: true,
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css',
  imports: [
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    ArticleListItemComponent,
    PriceMultiplierComponent,
    ArticleListOverArticlesComponent,
    ArticleListOverClassesComponent
  ]
})
export class ArticleListComponent extends SaveScrollPositionComponent {

  service = inject(ArticleInputService)
  alternativeView$ = this.service.alternativeView$

  articleItemsGroupedByProgram$ = this.service.articleItemsGroupedByProgram$
  articleItemsGroupedByProgramAndClass$ = this.service.articleItemsGroupedByProgramAndClass$

}
