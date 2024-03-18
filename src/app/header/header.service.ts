import { Injectable } from '@angular/core';
import { from, interval, shareReplay, timer } from 'rxjs';
import { BaseService } from '../util/base.service';
import { UrlBuilder } from '../util/url-builder';

@Injectable({
  providedIn: 'root'
})
export class HeaderService extends BaseService {

  infos$ = interval(1000) 

  
  public miscData$ = from(this.fetchAndSetMiscData()).pipe(
    shareReplay(1)
  )

  private async fetchMiscData(): Promise<any> {    
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("misc/all")
      .build()

    const misc = await this.fetchAndParseFromUrl(
      {
        url: url,
        throwError: true
      }
    )
    console.log("misc", misc);
    if (!misc) { throw new Error("Data Error") }
    return misc
  }

  private async fetchAndSetMiscData() {
    const misc = await this.fetchMiscData()
    const timestamp = misc["init_tables"]
    const oldTimestamp = localStorage.getItem("timestamp_db")
    if (oldTimestamp !== timestamp) {
      this.snackBar.open("Neuer OFML Datenstand aktiv vom " + timestamp, "Ok", {duration: 10000})
    }
    localStorage.setItem("timestamp_db", timestamp)
    const path = misc["path"]
    return {
      timestamp: timestamp, path: path
    }
  }


}
