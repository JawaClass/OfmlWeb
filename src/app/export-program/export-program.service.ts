import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService, UrlBuilder } from '../util/base.service';

@Injectable({
  providedIn: 'root'
})
export class ExportProgramService extends BaseService {

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

  postCreate(params: any): Promise<Response> {
    const url = new UrlBuilder()
    .base(BaseService.BASE_URL)
    .resource("export_program/create")
    .build()
    return this.makeSafeFetch(url, this.buildPostRequestOptions(JSON.stringify(params)))
  }
}
