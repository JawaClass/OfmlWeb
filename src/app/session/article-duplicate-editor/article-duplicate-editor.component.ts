import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticleInputService } from '../../ocd-edit/article-input.service';
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
//import { CreateProgramComponent } from '../create-program/create-program.component'
import { IArticleDuplicate, Session, IArticleProgramTuple } from '../../models/models'
//import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'
//import { ArticleitemService } from '../services/articleitem.service' 
//import { ArticleListComponent } from '../article-list/article-list.component'
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from '../session.service';
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
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './article-duplicate-editor.component.html',
  styleUrl: './article-duplicate-editor.component.css'
})
export class ArticleDuplicateEditorComponent implements OnInit {

  sessionService = inject(SessionService)
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

  showAll = true
  articles: IArticleDuplicateToggle[] = []
  articlesGroupedByArticleNr: any = {}
  articlesNrUnique: string[] = []
  activePrograms: Set<string> = new Set()
  session!: Session
  isProcessing: boolean = false
  programs() {
    const p = this.articles.map(a => a.item.sql_db_program)
    const unqieue = new Set(p)
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
    return this.articles.filter(a => a.active)
  }

  uniqueActiveArticlesByArticleNr() {
    return Array.from(new Set(this.articles.filter(a => a.active).map(a => a.item.article_nr)))
  }

  sameActiveLength(articleNr: string) {
    return this.articlesGroupedByArticleNr[articleNr].filter((a: any) => a.active)
  }

  async ngOnInit() {

    console.log("ArticleDuplicateEditorComponent ngOnInit")
    console.log(this.sessionService.articleDuplicates4Session$.value)
    this.session = this.sessionService.getCurrentSession()!!//currentSession$.value!
    console.log(this.session)
    this.sessionService.articleDuplicates4Session$.subscribe(articles => {

      console.log("subscribe:", articles)
      if (articles) {
        this.articles = articles.map(a => ({ item: a, active: true } as IArticleDuplicateToggle))
        this.articlesGroupedByArticleNr = this.groupby()
        this.articlesNrUnique = this.uniqueArticlesByArticleNr()
        this.activePrograms = new Set(this.programs())
      }
    })
  }

  async confirmSelection() {
    const articleAndPrograms: IArticleProgramTuple[] = this.activeArticlesByArticleNr()
      .map(a => ({ article: a.item.article_nr, program: a.item.sql_db_program }) as IArticleProgramTuple)
    this.isProcessing = true
    const createdSession = await this.sessionService.createSession(this.session, articleAndPrograms)
    this.sessionService.setCurrentSession(createdSession)//currentSession$.next(createdSession)
    this.isProcessing = false
    this.router.navigate(['/'])
  }

  selectionIsValid() {
    const noDuplicates = (this.activeArticlesByArticleNr().length - this.uniqueActiveArticlesByArticleNr().length) == 0
    return noDuplicates && this.activeArticlesByArticleNr().length && this.activePrograms.size
  }


}
