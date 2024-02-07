import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleItem, PropertyClass } from './../models/models'
import { RouterModule, Router } from '@angular/router';
import { ArticleitemService } from '../services/articleitem.service'; 
import { ArticleInputService } from '../services/article-input.service'; 
import { ArtbaseService } from '../services/artbase.service'; 
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
import { SaveScrollPositionComponent } from '../save-scroll-position/save-scroll-position.component';


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
    ArticleListItemComponent
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

  // data from backend
  articleListBackend: any[] = []
  // filtered data
  articleList: any[] = []
  // grouped based on 
  articleListGroupedBy: any = {}
  program2pClass2ArticlesMap: any = {}
  subscription$: Subscription | null = null

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

  groupArticlesByClassName(articles: any[]) {
    let groups: any = {}
    articles.forEach((a: any) => {
      a["klassen"].forEach((pClass: any) => {
        const pClassName: string = pClass["prop_class"]
        if (groups[pClassName]) {
          groups[pClassName].push(a)
        } else {
          groups[pClassName] = [a]
        }
      })
    })
    return groups
  }

  

  onFilterSet() {
    this.setArticlesFromBackendData()
  }
  resetFilter() {
    this.filter.program =''
    this.filter.pClass=''
    this.filter.article=''
    this.setArticlesFromBackendData()
  }

  async setArticlesFromBackendData() {
    
    this.articleList = this.articleListBackend.filter((item: any) =>
    this.testArticleAgainstFilter(item.article_nr) && this.testProgramAgainstFilter(item.sql_db_program))
    
    this.articleListGroupedBy = this.groupListbyKey(this.articleList, "sql_db_program")
    this.program2pClass2ArticlesMap = {} 
    this.getGroupKeys(this.articleListGroupedBy).forEach(program => {
      this.program2pClass2ArticlesMap[program] = {} 
      //console.log("this.articleListGroupedBy[program]", program , this.articleListGroupedBy[program]);
      
      console.log("1) groupArticlesByClassName", this.articleListGroupedBy[program]);
      const pClassGroups = this.groupArticlesByClassName(this.articleListGroupedBy[program])
      console.log("2) pClassGroups", pClassGroups);
      
      this.getGroupKeys(pClassGroups).forEach(pClass => {
        this.program2pClass2ArticlesMap[program][pClass] = [] 
        pClassGroups[pClass].forEach((article: any) => {
          //console.log("push article", article.article_nr, article.sql_db_program, article.web_program_name)
          
          this.program2pClass2ArticlesMap[program][pClass].push(article)
        })
      })
    })
  }
  async ngOnInit() {
    this.resetData()
    this.subscription$ = this.service.sessionService().currentSession$.subscribe(async (sessionOrNull: any) => {
      if (sessionOrNull) {
        this.articleListBackend = await this.service.fetchWebOcdArticleWithDetails()
        console.log("this.articleListBackend LEN", this.articleListBackend.length)
        this.setArticlesFromBackendData()
      }
    })
  }

  navigateToEditPropClass(program: string, pClass: string) {
    this.storeScrollPos()
    this.router.navigate(['/editor-propclass', {
      "program": program,
      "propClass": pClass
    }]);
  }

  navigateToEditArtbaseAll() {
    this.service.scrollY = 0
    this.router.navigate(['/editor-all']);
  }

}
