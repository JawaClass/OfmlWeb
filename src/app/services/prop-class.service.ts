import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type } from 'os';
import { Observable } from 'rxjs';

export type PropValueItem = {
  v: string;
  text: string;
};

export type PropertyItem = {
  property_name: string;
  prop_text: string;
  values: PropValueItem[]
};

export type Result = PropertyItem[]

@Injectable({
  providedIn: 'root'
})
export class PropClassService {
  constructor(private http: HttpClient) { }

  baseUrl = "http://172.22.15.238:5000"

  getPropsResult(program: string, propClass: string): Observable<Result> {
    const url = this.baseUrl + "/ocd/props_compact/"+program+"/" + propClass
    return this.http.get<Result>(url)
  }

}
