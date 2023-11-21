import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { log } from 'node:console';
@Injectable({
  providedIn: 'root'
})
export class PropertyEditorService {

  baseUrl = "http://172.22.15.238:5000"

  constructor(private http: HttpClient) { }

  getArtbase(program: string, article: string) {
    const url = this.baseUrl + "/ocd/table/" + program + "/ocd_artbase/article_nr/" + article
    console.log("getArtbase :: ", url);
    return this.http.get(url)
  }

  getPropsResult(program: string, propClass: string){
    const url = this.baseUrl + "/ocd/props_compact/"+program+"/" + propClass
    console.log("getPropsResult :: ", url);
    return this.http.get(url)
  }

  /*getPropValues(program: string, propClass: string) {
    const url = this.baseUrl + "/ocd/table/" + program + "/ocd_propertyvalue/prop_class/" + propClass
    
    return this.http.get(url)
  }*/

}
