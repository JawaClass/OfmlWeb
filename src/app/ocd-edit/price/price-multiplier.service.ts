import { Injectable, inject } from '@angular/core';
import { BaseService, UrlBuilder } from '../../util/base.service';
import { SessionService } from '../../session/session.service'

@Injectable({
  providedIn: 'root'
})
export class PriceMultiplierService extends BaseService {

  sessionService = inject(SessionService)

  async fetchPrices(): Promise<any> {
    const webProgram = this.sessionService.getCurrentSession()!!.name
    const url = new UrlBuilder()
    .base(BaseService.BASE_URL)
    .resource("web_ofml/ocd/web_ocd_price")
    .param("where", `web_program_name="${webProgram}"`)
    .build()
    return await this.fetchAndParseFromUrl<any>(
      {
        url: url
      }
    )
  }

  async savePrices(patchItems: any[]) {
    const url = new UrlBuilder()
    .base(BaseService.BASE_URL)
    .resource("web_ofml/ocd/batch/web_ocd_price")
    .build()
    
    return await this.fetchAndParseFromUrl<any>(
      {
        url: url,
        requestOptions: this.buildPatchRequestOptions(JSON.stringify(patchItems))
      }
    )
  }
}
