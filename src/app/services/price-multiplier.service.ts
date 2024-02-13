import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { SessionService } from './session.service'

@Injectable({
  providedIn: 'root'
})
export class PriceMultiplierService extends BaseService {

  sessionService = inject(SessionService)

  async fetchPrices(): Promise<any> {
    const webProgram = this.sessionService.currentSession$.value!.name
    const url = this.baseUrl + `/web_ofml/ocd/web_ocd_price?where=web_program_name="${webProgram}"`
    return await this.fetchAndParseFromUrl<any>(url)
  }
}
