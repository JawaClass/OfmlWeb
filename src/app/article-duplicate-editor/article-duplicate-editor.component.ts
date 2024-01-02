import { Component, inject } from '@angular/core';
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
import { ArticleItem } from '../models/models'
import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'
import { ArticleitemService } from '../services/articleitem.service' 
import { ArticleListComponent } from '../article-list/article-list.component'
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
  ],
  templateUrl: './article-duplicate-editor.component.html',
  styleUrl: './article-duplicate-editor.component.css'
})
export class ArticleDuplicateEditorComponent {
  
  service = inject(ArticleInputService)
  articleitemService = inject(ArticleitemService)
  router = inject(Router)
  getAllPrograms = () => this.service.programMap.getAllPrograms()
  isProgramActive = (program: string) => this.service.programMap.isActive(program)
  toggleActive = (program: string) => this.service.programMap.toggleActive(program)
  
  async confirmSelection() {

      const activePrograms = this.service.programMap.getActivePrograms()
      
      await Promise.all(
        this.getAllArticleRefs()
        .filter(item => !activePrograms.includes(item.program))
        .map(item => this.removeArticleItem(item))
      )
      
      this.service.programMap.clearInActivePrograms()
      this.service.programMap.clearEmptyPrograms()

      

      this.service.behaviorSubjectProgramMap.next(this.service.programMap)
      
      this.router.navigate(['/'])
  }
 
  async removeArticleItem(articleItem: ArticleItem) {
    this.service.programMap.removeArticleItem(articleItem)
    await this.articleitemService.removeArticleItem(articleItem)
  }

  selectionIsValid() {
    const noDuplicates = this.notUniqueArticles().length == 0
    return noDuplicates
  }

  getPropClasses = (program: string) => this.service.programMap.getPropClassesFromProgram(program)
  getArticleItems = (program: string, pClass: string) => this.service.programMap.getArticlesFromPropClass(program, pClass)
  notUniqueArticles = () => this.service.programMap.notUniqueArticles()
  getAllActiveArticleRefs = () => this.service.programMap.getAllActiveArticleRefs()
  getAllArticleRefs = () => this.service.programMap.getAllArticleRefs()
  
}
