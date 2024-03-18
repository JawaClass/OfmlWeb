import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HoldableDirective } from '../../../util/directives/holdable.directive';
import { ArticleitemService } from '../../articleitem.service';
import { ArtbaseService } from '../../artbase/artbase.service'; 
import { ArticleEditorComponent } from '../article-editor/article-editor.component';
import { ArticleManageService } from '../article-manage/article-manage.service';


@Component({
  selector: 'app-article-list-item',
  standalone: true,
  imports: [
    MatDialogModule,
    ArticleEditorComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    HoldableDirective
  ],
  templateUrl: './article-list-item.component.html',
  styleUrl: './article-list-item.component.css'
})
export class ArticleListItemComponent {

  @Input() article!: any
  @Output() onDeleted: EventEmitter<any> = new EventEmitter()
  @Output() onArtbaseSelected: EventEmitter<any> = new EventEmitter()
  dialogOpener = inject(MatDialog)
  router = inject(Router)
  artbaseService = inject(ArtbaseService)
  articleService = inject(ArticleitemService)

  articleManageService = inject(ArticleManageService)
  
  getShortText(article: any) {
    if (article["kurztext"]) 
      return article["kurztext"]["text"]
    else "KEIN KURZTEXT"
  }

  
  openEditArticle(article: any) {
    this.dialogOpener.open(ArticleEditorComponent, {
      data: article,
      width: '80ch',
    })
  }

  navigateToEditArtbase(articleItem: any) {
    this.artbaseService.currentArticleItem$.next(articleItem)
    this.articleManageService.setDetailView("artbase", articleItem)  
    // this.router.navigate(['/editor-artbase']);
    this.onArtbaseSelected.emit(articleItem)
  }

  async delete() {
    await this.articleService.deleteArticle(this.article)
    this.onDeleted.emit(this.article)
    this.articleService.showSnackbar(`${this.article.article_nr} gelöscht.`, 2500)
  }

}
