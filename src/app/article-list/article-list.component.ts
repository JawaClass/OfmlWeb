import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleItem, PropertyClass } from './../models/models'
import { RouterModule, Router } from '@angular/router';
import { ArticleitemService } from '../services/articleitem.service'; 
import { ArticleInputService } from '../services/article-input.service'; 
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
import { CreateProgramComponent } from '../create-program/create-program.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ArticleComponent } from '../article/article.component';

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
    MatExpansionModule
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent implements OnInit, AfterViewInit {

  service = inject(ArticleInputService)
  articleitemService = inject(ArticleitemService)
  router = inject(Router)
  persistArticleItemPromises = new Map<string, any[]>()
  dialogOpener = inject(MatDialog)

  filter = this.service.filter

   
  storeScrollPos() {
    const elem = document.querySelector('.mat-sidenav-content')
    this.service.scrollY = elem!!.scrollTop
  }

  restoreScrollPos() {
    const elem = document.querySelector('.mat-sidenav-content')
    elem!!.scroll(
      {
        left: 0,
        top: this.service.scrollY,
        behavior: 'instant',
      }
    )
  }

  ngAfterViewInit() {
    this.restoreScrollPos() 
  }

  async ngOnInit() {
    
    this.service.behaviorSubjectProgramMap.subscribe(_ => {
      if (this.notUniqueArticles().length) {
        this.navigateToEditDuplicates()  
      }
    })
  }

  allFilteredArticles() {
    const a = this.getActivePrograms().map(program => this.getFilteredPropClasses(program).map(pClass => this.getFilteredArticleItems(pClass))).flat(3)
    console.log("allFilteredArticles", a.length, a);
    return a
  }

  getActivePrograms()  {
    const programFilter = this.filter.program.toUpperCase()
    const regexPattern = new RegExp(`^${programFilter}`)
    return this.service.programMap.getActivePrograms().filter(p => regexPattern.test(p.toUpperCase()) && this.getFilteredPropClasses(p).length)
  }

  getPropClasses(program: string)  {
    return this.service.programMap.getPropClassesFromProgram(program)
  }

  getFilteredPropClasses(program: string) {
    const pClasses: PropertyClass[] = this.service.programMap.getPropClassesFromProgram(program)
    return pClasses.filter(pClass => this.getFilteredArticleItems(pClass).length)
  }
  getFilteredArticleItems(pClass: PropertyClass) {
    const articleFilter = this.filter.article.toUpperCase()
    const regexPattern = new RegExp(`^${articleFilter}`)
    return pClass.articleItems.filter(item => regexPattern.test(item.articleNr.toUpperCase()))
  }

  notUniqueArticles = () => this.service.programMap.notUniqueArticles()

  onInputChangeArticle(articleItem: ArticleItem) {

    const delayPersist = 2000

    this.persistArticleItemPromises.get(articleItem.articleNr)
    ?.forEach(timeoutId => clearTimeout(timeoutId))

    const timeoutId = setTimeout(async (item: ArticleItem) => {

      console.log("write articleItem to Database!", item)
      
      
      await this.articleitemService.saveArticleItem(item)
      
    }, delayPersist, articleItem)

    if (!this.persistArticleItemPromises.get(articleItem.articleNr))
      this.persistArticleItemPromises.set(articleItem.articleNr, [])
    
    this.persistArticleItemPromises.get(articleItem.articleNr)!!.push(timeoutId)

  }

  navigateToEditArtbase(program: string, articleNr: string, pClass: string) {
    this.storeScrollPos()
    this.router.navigate(['/editor', {
      "program": program,
      "articleNr": articleNr
    }]);
  }

  navigateToEditPropClass(program: string, pClass: string) {
    this.storeScrollPos()
    this.router.navigate(['/editor-propclass', {
      "program": program,
      "propClass": pClass
    }]);
  }

  navigateToEditDuplicates() {
    this.router.navigate(['/duplicates', { }]);
  }

  navigateToEditArtbaseAll() {
    this.service.scrollY = 0
    this.router.navigate(['/editor-all']);
  }

  openCreateProgramDialog() {
    this.dialogOpener.open(CreateProgramComponent)
        .afterClosed()
        .subscribe((result: any) => {
        })
  }

  openEditArticle(articleItem: ArticleItem) {
    this.dialogOpener.open(ArticleComponent, {
      data: articleItem,
      width: '35vw',
    })
  }
}
