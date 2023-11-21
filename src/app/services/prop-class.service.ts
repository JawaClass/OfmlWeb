import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type } from 'os';
import { Observable, of } from 'rxjs';

export interface PropValueItem {
  v: string,
  text: string,
  active: boolean;
  isArtbase: boolean;
};
 

export class PropertyItem { 
    
  constructor(
    public property_name: string,
    public prop_text: string,
    public values: PropValueItem[],
    public active: boolean,
  ) {}

    public getActiveValues() {
      return this.values.filter(a => a.active)
    }
  
}
 
@Injectable({
  providedIn: 'root'
})
export class PropClassService {
  constructor(private http: HttpClient) { }

  baseUrl = "http://172.22.15.238:5000"

  private changes = new Map<string, Map<string, PropertyItem[]>>()

  saveChanges(program: string, propClass: string, changes: PropertyItem[]) {
    if (!this.changes.has(program))
      this.changes.set(program, new Map<string, PropertyItem[]>())
      
    this.changes.get(program)!!.set(propClass, changes)
    //console.log("Save::", this.hasChanges(program, propClass))
  }

  hasChanges(program: string, propClass: string): boolean {
    return Boolean(this.changes.get(program)?.get(propClass))
  }

  getPropsResult(program: string, propClass: string): Observable<PropertyItem[]> {

    // if [program][propClass] in changes return changes otherwise ...
    //console.log("getPropsResult -- hasChanges", this.hasChanges(program, propClass))
    
    if (this.hasChanges(program, propClass))
      return of(this.changes.get(program)!!.get(propClass)!!)

    const url = this.baseUrl + "/ocd/props_compact/"+program+"/" + propClass
    return this.http.get<PropertyItem[]>(url)
  }

}
