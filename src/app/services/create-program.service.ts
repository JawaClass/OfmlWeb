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

  exportPathOptions = [
    ["TEST_ENV", "b://Testumgebung//EasternGraphics//kn"],
    ["DEFAULT", "b://ofml_development//Tools//ofml_datenmacher"]
  ]

  programName: null | string = null
  programId: null | string = null
  exportOcd = true
  exportOdb = true
  exportOas = true
  exportOam = true
  exportOfml = true
  exportGo = true
  exportRegistry = true
  buildEbase = true
  exportPath = this.exportPathOptions[0][0]

  postCreate(params: any): Observable<any> {
    const url = this.baseUrl + "/export_program/create"
    return this.httpClient.post(url, params)
  }
}
