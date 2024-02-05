import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { ProgramMap } from './../models/models'
import { ArticleInputService } from './article-input.service'

@Injectable({
  providedIn: 'root'
})
export class CreateProgramService extends BaseService {

  private service = inject(ArticleInputService)

  postCreate(params: any): Observable<any> {
    const url = this.baseUrl + "/program_creation/create"
    return this.httpClient.post(url, params)
  }
}
