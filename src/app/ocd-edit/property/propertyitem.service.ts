import { Injectable, inject } from '@angular/core';
import { BaseService, UrlBuilder } from '../../util/base.service';
import { SessionService } from '../../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyitemService extends BaseService {
  
  private sessionService = inject(SessionService)

  async patchPropertyValue(patchItem: any) {
    //const url = this.baseUrl + "/web_ofml/ocd/web_ocd_propertyvalue?where=db_key=" + patchItem.db_key
    const url = new UrlBuilder()
    .base(BaseService.BASE_URL)
    .resource("web_ofml/ocd/web_ocd_propertyvalue")
    .param("where", `db_key=${patchItem.db_key}`)
    .build()
    return this.fetchAndParseFromUrl(
      {
        url: url,
        requestOptions: this.buildPatchRequestOptions(JSON.stringify(patchItem))
      }
    )
  }

  async patchProperty(patchItem: any) {
    //const url = this.baseUrl + "/web_ofml/ocd/web_ocd_property?where=db_key=" + patchItem.db_key
    const url = new UrlBuilder()
    .base(BaseService.BASE_URL)
    .resource("web_ofml/ocd/web_ocd_property")
    .param("where", `db_key=${patchItem.db_key}`)
    .build()
    return this.fetchAndParseFromUrl(
      {
        url: url, 
        requestOptions: this.buildPatchRequestOptions(JSON.stringify(patchItem))
      }
    )
  }

 
  async fetchPropClassWithDetails(program: string, pClass: string) {

    // MOVE to other service !!!!!!!!!!!!!!
    const programWeb: string = this.sessionService.getCurrentSession()?.name!!
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_propertyclass/details")
      .param("where", `web_program_name="${programWeb}" AND sql_db_program="${program}" AND prop_class="${pClass}"`)
      .param("limit", 1)
      .build()

    return await this.fetchAndParseFromUrl(
      {
        url: url,
        throwError: true
      }
    )
  }
}
