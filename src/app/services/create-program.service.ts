import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BaseService } from './base.service';
import { ProgramMap } from './../models/models'

@Injectable({
  providedIn: 'root'
})
export class CreateProgramService extends BaseService {

  postCreate(programName: string, programID: string, programMap: ProgramMap): Observable<any> {

    console.log("CreateProgramService::postCreate");
    
    const url = this.baseUrl + "/ocd/create"

    return this.http.post(url, {
      "programName": programName,
      "programID": programID,
      "articleItems": programMap.jsonify(),
      "propertyItems": programMap.jsonifyProperties()
    })
  }

}
