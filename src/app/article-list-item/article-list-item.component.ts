import { Component, inject, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ArticleComponent } from '../article/article.component';
import { Router } from '@angular/router';
import { ArtbaseService } from '../services/artbase.service'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-article-list-item',
  standalone: true,
  imports: [
    MatDialogModule,
    ArticleComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './article-list-item.component.html',
  styleUrl: './article-list-item.component.css'
})
export class ArticleListItemComponent {

  @Input() article!: any
  dialogOpener = inject(MatDialog)
  router = inject(Router)
  artbaseService = inject(ArtbaseService)

  
  getShortText(article: any) {
    if (article["kurztext"]) 
      return article["kurztext"]["text"]
    else "KEIN KURZTEXT"
  }

  
  openEditArticle(article: any) {
    this.dialogOpener.open(ArticleComponent, {
      data: article,
      width: '35vw',
    })
  }

  navigateToEditArtbase(articleItem: any) {
    //this.storeScrollPos()
    this.artbaseService.currentArticleItem$.next(articleItem)
    this.router.navigate(['/editor-artbase']);
  }

}
