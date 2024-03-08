import { Component, Input, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SessionService } from '../session.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-merge-article-as-alias',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TextFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './merge-article-as-alias.component.html',
  styleUrl: './merge-article-as-alias.component.css'
})
export class MergeArticleAsAliasComponent {
  isLoading = false
  mergeResult: any | null = null
  service = inject(SessionService)
  @Input() sessionName!: string

  async addArticle(articleNr: string, program: string, newArticlrNrAlias: string) {
    this.mergeResult = null
    this.isLoading = true
    this.mergeResult = await this.service.mergeNewArticleWithProgramAsAlias(articleNr, program, this.sessionName, newArticlrNrAlias)
    this.isLoading = false
  }

}
