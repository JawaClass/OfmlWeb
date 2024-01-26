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

  postCreate(programName: string, programID: string, exports: any): Observable<any> {
    const url = this.baseUrl + "/program_creation/create"
    const programMap: ProgramMap = this.service.programMap
    return this.httpClient.post(url, {
      "programName": programName,
      "programID": programID,
      "articleItems": programMap.jsonify(),
      "propertyItems": programMap.jsonifyProperties(),
      "exports": exports
    })
  }
}
