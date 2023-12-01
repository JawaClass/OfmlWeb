import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap, retry } from 'rxjs';
import { BaseService} from './base.service'


@Injectable({
  providedIn: 'root'
})
export class PropClassService extends BaseService {
/*
  // program -> pClass -> PropertyItem[]
  changes = new Map<string, Map<string, PropertyItem[]>>()

  saveChanges(program: string, propClass: string, changes: PropertyItem[]) {
    if (!this.changes.has(program))
      this.changes.set(program, new Map<string, PropertyItem[]>())

    this.changes.get(program)!!.set(propClass, changes)
    //console.log("Save::", this.hasChanges(program, propClass))
  }

  hasChanges(program: string, propClass: string): boolean {
    return Boolean(this.changes.get(program)?.get(propClass))
  }

  getChanges(program: string, propClass: string): PropertyItem[] {
    return this.changes.get(program)!!.get(propClass)!!
  }

  getPropsResult(program: string, propClass: string): Observable<PropertyItem[]> {

    if (this.hasChanges(program, propClass))
      return of(this.changes.get(program)!!.get(propClass)!!)

    const url = this.baseUrl + "/ocd/props_compact/" + program + "/" + propClass
    return this.http.get<PropertyItem[]>(url).pipe(map(items => items.map(
      item => item = new PropertyItem(item.property_name, item.prop_text, item.values, true).setAllActive()
    )))

  }
*/
}
