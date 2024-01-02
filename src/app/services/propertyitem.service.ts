import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { PropertyItem } from './../models/models'
import { SessionService } from './session.service'

@Injectable({
  providedIn: 'root'
})
export class PropertyitemService extends BaseService {

  private sessionService = inject(SessionService)

  async fetchPropertyItems(): Promise<PropertyItem[]> {
    const session = this.sessionService.currentSession$.value!!
    const sessionId = session!!.id
    const url = this.baseUrl + "/web_ofml/property_item/by_session_id/" + sessionId
    const response = await fetch(url)
    const property_items: any[] = await response.json()
    return property_items.map(item => PropertyItem.fromJSON(item["json"]))
  }

  async savePropertyItems(propertyItems: PropertyItem[], program: string, pClass: string): Promise<any> {
    const url = this.baseUrl + "/web_ofml/property_item/save_list"
    const session = this.sessionService.currentSession$.value
    const sessionId = session!!.id
    const requestOptions = this.buildPostRequestOptions(
      JSON.stringify({
        pClass: pClass,
        program: program,
        sessionId: sessionId,
        json: propertyItems.map(item => item.jsonify())
      })
    )
    await fetch(url, requestOptions)
    this.snackBar.open("Änderungen gespeichert " + pClass, "Ok", { duration: 1300 })
  }

}
