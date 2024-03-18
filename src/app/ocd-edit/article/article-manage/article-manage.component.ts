import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListComponent } from "../article-list/article-list.component";
import { ArticleManageService } from './article-manage.service';
import { ArtbaseEditorComponent } from "../../artbase/artbase-editor/artbase-editor.component";
import { PropclassEditorComponent } from "../../property/propclass-editor/propclass-editor.component";
import { HeaderService } from '../../../header/header.service';
import { ArticleControlBarComponent } from "../article-control-bar/article-control-bar.component";
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-article-manage',
    standalone: true,
    templateUrl: './article-manage.component.html',
    styleUrl: './article-manage.component.css',
    imports: [CommonModule, ArticleListComponent, ArtbaseEditorComponent, PropclassEditorComponent, ArticleControlBarComponent, MatDividerModule]
})
export class ArticleManageComponent {

  service = inject(ArticleManageService)
  headerService = inject(HeaderService)
  currentDetailView$ = this.service.currentDetailView$

  miscData$ = this.headerService.miscData$

}
