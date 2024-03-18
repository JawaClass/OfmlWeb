import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupedList } from '../../../util/list-tools';
import { ArticleListItemComponent } from "../article-list-item/article-list-item.component";
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ArticleManageService } from '../article-manage/article-manage.service';

@Component({
  selector: 'app-article-list-over-classes',
  standalone: true,
  imports: [CommonModule, ArticleListItemComponent, MatCardModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './article-list-over-classes.component.html',
  styleUrl: './article-list-over-classes.component.css'
})
export class ArticleListOverClassesComponent {
  @Input() items!: { [x: string]: GroupedList }
  @Output() onEvent: EventEmitter<any> = new EventEmitter()

  articleManageService = inject(ArticleManageService)

  getKeys(obj: any) {
    return Array.from(Object.keys(obj))
  }

  selectPClass(pClass: string, program: string) {
    const data = {
      pClass: pClass,
      program: program
    }
    this.articleManageService.setDetailView("pClass", data)
  }
}
