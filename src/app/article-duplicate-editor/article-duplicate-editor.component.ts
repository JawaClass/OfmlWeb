import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticleInputService } from '../services/article-input.service';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateProgramComponent } from '../create-program/create-program.component'
import { ArticleItem, IArticleDuplicate, Session, IArticleProgramTuple } from '../models/models'
import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'
import { ArticleitemService } from '../services/articleitem.service' 
import { ArticleListComponent } from '../article-list/article-list.component'
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from '../services/session.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';


interface IArticleDuplicateToggle {
  item: IArticleDuplicate,
  active: boolean
}


@Component({
  selector: 'app-article-duplicate-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreateProgramComponent,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    WaitingCursorComponent,
    ArticleListComponent,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './article-duplicate-editor.component.html',
  styleUrl: './article-duplicate-editor.component.css'
})
export class ArticleDuplicateEditorComponent implements OnInit, AfterViewInit {
  
  sessionService = inject(SessionService)
  service = inject(ArticleInputService)
  articleitemService = inject(ArticleitemService)
  router = inject(Router)
  isProgramActive = (program: string) => this.activePrograms.has(program)
  toggleActive(program: string) {
    if (this.isProgramActive(program)) this.activePrograms.delete(program)
    else this.activePrograms.add(program)

    const active = this.isProgramActive(program)
    this.articles.forEach(a => {
      if (a.item.sql_db_program === program)
        a.active = active
    })

  }
  
  articles: IArticleDuplicateToggle[] = []
  articlesGroupedByArticleNr: any = {}
  articlesNrUnique: string[] = []
  activePrograms: Set<string> = new Set()
  session!: Session 
  isProcessing: boolean = false
  programs() {
    const p = this.articles.map(a => a.item.sql_db_program)
    const unqieue =  new Set(p)
    return Array.from(unqieue)
  }

  groupby(): object {
    return this.articles.reduce((x, y) => {
      if (x[y.item.article_nr]) x[y.item.article_nr].push(y)
      else x[y.item.article_nr] = [y]
      return x;
    	}, {} as any)
  }
  
  uniqueArticlesByArticleNr() {
    return Array.from(new Set(this.articles.map(a => a.item.article_nr)))
  }

  activeArticlesByArticleNr() {
    return this.articles.filter(a => a.active)//.map(a => a.item.article_nr)
  }

  uniqueActiveArticlesByArticleNr() {
    return Array.from(new Set(this.articles.filter(a => a.active).map(a => a.item.article_nr)))
  }

  async toggleArticle(article: IArticleDuplicateToggle) {
    article.active = !article.active
    //this.articlesGroupedByArticleNr = this.groupby()
    //this.articlesNrUnique = this.uniqueArticlesByArticleNr()
    //this.activePrograms = new Set(this.programs())
  }


  async ngAfterViewInit() {
    console.log("ArticleDuplicateEditorComponent ngAfterViewInit")
  }


  async ngOnInit() {
    
    console.log("ArticleDuplicateEditorComponent ngOnInit")
    console.log(this.sessionService.articleDuplicates4Session$.value)
    this.session = this.sessionService.currentSession$.value!
    console.log(this.session)
    this.sessionService.articleDuplicates4Session$.subscribe(articles => {
        
        console.log("subscribe:", articles)
        if (articles) {
          this.articles = articles.map(a => ({item: a, active: true} as IArticleDuplicateToggle))
          this.articlesGroupedByArticleNr = this.groupby()
          this.articlesNrUnique = this.uniqueArticlesByArticleNr()
          this.activePrograms = new Set(this.programs())
        }
        
        
              
    })
  }

  async confirmSelection() {
    const articleAndPrograms: IArticleProgramTuple[] = this.activeArticlesByArticleNr()
    .map( a=> ({article: a.item.article_nr, program: a.item.sql_db_program}) as IArticleProgramTuple)
    this.isProcessing = true
    await this.sessionService.createSession(this.session, articleAndPrograms)
    await this.service.setWebOcdArticleWithDetailsFromBackend()
    this.isProcessing = false
      /*const activePrograms = this.service.programMap.getActivePrograms()
      
      await Promise.all(
        this.getAllArticleRefs()
        .filter(item => !activePrograms.includes(item.program))
        .map(item => this.removeArticleItem(item))
      )
      
      this.service.programMap.clearInActivePrograms()
      this.service.programMap.clearEmptyPrograms()

      

      this.service.behaviorSubjectProgramMap.next(this.service.programMap)*/
      
      this.router.navigate(['/'])
  }
 
  async removeArticleItem(articleItem: ArticleItem) {
    this.service.programMap.removeArticleItem(articleItem)
    await this.articleitemService.removeArticleItem(articleItem)
  }

  selectionIsValid() {
    const noDuplicates = (this.activeArticlesByArticleNr().length - this.uniqueActiveArticlesByArticleNr().length) == 0
    return noDuplicates
  }

  getPropClasses = (program: string) => this.service.programMap.getPropClassesFromProgram(program)
  getArticleItems = (program: string, pClass: string) => this.service.programMap.getArticlesFromPropClass(program, pClass)
  notUniqueArticles = () => this.service.programMap.notUniqueArticles()
  getAllActiveArticleRefs = () => this.service.programMap.getAllActiveArticleRefs()
  getAllArticleRefs = () => this.service.programMap.getAllArticleRefs()
  
}
