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
import { Subscription } from 'rxjs';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { ArticleListItemComponent } from '../article-list-item/article-list-item.component'
import { SaveScrollPositionComponent } from '../../../util/save-scroll-position/save-scroll-position.component';
import { PriceMultiplierComponent } from '../../price/price-multiplier/price-multiplier.component'
import { ArticleitemService } from '../../articleitem.service';
import { ArticleInputService } from '../../article-input.service';
import { ArtbaseService } from '../../artbase/artbase.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
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
    PriceMultiplierComponent
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent extends SaveScrollPositionComponent {

  artbaseService = inject(ArtbaseService)
  service = inject(ArticleInputService)
  articleitemService = inject(ArticleitemService)
  router = inject(Router)
  persistArticleItemPromises = new Map<string, any[]>()
  dialogOpener = inject(MatDialog)
  filter = this.service.filter
  isLoading = () => this.service.isLoading

  // data from backend
  articleListBackend: any[] = []
  // filtered data
  articleList: any[] = []
  // grouped based on 
  articleListGroupedBy: any = {}
  program2pClass2ArticlesMap: any = {}
  subscription$: Subscription | null = null

  testArticleAgainstFilter(articlrNr: string) {
    const filter = this.filter.article.toUpperCase()
    const regexPattern = new RegExp(`^${filter}`)
    return regexPattern.test(articlrNr.toUpperCase())
  }

  testProgramAgainstFilter(program: string) {
    const filter = this.filter.program.toUpperCase()
    const regexPattern = new RegExp(`^${filter}`)
    return regexPattern.test(program.toUpperCase())
  }

  resetData() {
    this.articleListBackend = []
    this.articleList = []
    this.articleListGroupedBy = {}
    this.program2pClass2ArticlesMap = {}
  }
  get alternativeView() {
    return this.service.alternativeView
  }

  set alternativeView(value: boolean) {
    this.service.alternativeView = value
  }

  setAlternativeView = (v: boolean) => this.service.alternativeView = v

  groupListbyKey(list: any[], key: string): object {
    return list.reduce((x, y) => {
      if (x[y[key]]) x[y[key]].push(y)
      else x[y[key]] = [y]
      return x;
    }, {} as any)
  }

  getGroupKeys = (obj: object) => Object.keys(obj)

  onFilterSet() {
    this.setArticlesFromBackendData()
  }
  resetFilter() {
    this.filter.program = ''
    this.filter.pClass = ''
    this.filter.article = ''
    this.setArticlesFromBackendData()
  }

  async setArticlesFromBackendData() {

    this.articleList = this.articleListBackend.filter((item: any) =>
      this.testArticleAgainstFilter(item.article_nr) &&
      this.testProgramAgainstFilter(item.sql_db_program)
    )

    this.articleListGroupedBy = this.groupListbyKey(this.articleList, "sql_db_program")
    this.program2pClass2ArticlesMap = {}
    this.getGroupKeys(this.articleListGroupedBy).forEach(program => {
      this.program2pClass2ArticlesMap[program] = {}
      //console.log("this.articleListGroupedBy[program]", program , this.articleListGroupedBy[program]);

      // console.log("1) groupArticlesByClassName", this.articleListGroupedBy[program]);
      const pClassGroups = this.service.groupArticlesByClassName(this.articleListGroupedBy[program])
      //console.log("2) pClassGroups", pClassGroups);

      this.getGroupKeys(pClassGroups).forEach(pClass => {
        this.program2pClass2ArticlesMap[program][pClass] = []
        pClassGroups[pClass].forEach((article: any) => {
          //console.log("push article", article.article_nr, article.sql_db_program, article.web_program_name)

          this.program2pClass2ArticlesMap[program][pClass].push(article)
        })
      })
    })
  }

  ngOnInit() {

    this.service.articleItems$.subscribe(
      {
        next: (artilceItems?: any[]) => {
          if (artilceItems) {
            this.articleListBackend = artilceItems
            this.setArticlesFromBackendData()
          }
        },
        error: () => {
          console.log("ERROR: article-list.componenent :: getArticleItemsObservable");
        }
      }
    )
  }

  async onArticledDeleted(event: any) {
    const filtered: any[] = this.service
      .getCurrentArticleItems()
      ?.filter((item: any) => item.db_key !== event.db_key) || []
    this.service.overwriteArticleItems(filtered)
  }

}