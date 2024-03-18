import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupedList } from '../../../util/list-tools';
import { ArticleListItemComponent } from "../article-list-item/article-list-item.component";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-article-list-over-articles',
    standalone: true,
    templateUrl: './article-list-over-articles.component.html',
    styleUrl: './article-list-over-articles.component.css',
    imports: [CommonModule, ArticleListItemComponent, MatCardModule, MatIconModule, MatButtonModule]
})
export class ArticleListOverArticlesComponent {
  @Input() items!: GroupedList
  @Output() onEvent = new EventEmitter<any>()

  getKeys(obj: any) {
    return Array.from(Object.keys(obj))
  }
  
}
