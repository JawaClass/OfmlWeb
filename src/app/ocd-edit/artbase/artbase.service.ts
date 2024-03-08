import { Injectable } from '@angular/core';
import { BaseService, UrlBuilder } from '../../util/base.service'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtbaseService extends BaseService {
  
  currentArticleItem$ = new BehaviorSubject<any>(null)

  async createArtbaseEntry(artbaseEntry: any) {
    const url = new UrlBuilder()
    .base(BaseService.BASE_URL)
    .resource("web_ofml/ocd/web_ocd_artbase")
    .build()
    return this.fetchAndParseFromUrl(
      {
        url: url,
        requestOptions: this.buildPostRequestOptions(JSON.stringify(artbaseEntry))
      }
    )
  }

  async fetchArtbaseFromPropClass(pClass: string): Promise<any[]> {
    const articleNr = this.currentArticleItem$.value.article_nr
    const webProgramName = this.currentArticleItem$.value.web_program_name

    const url = new UrlBuilder()
    .base(BaseService.BASE_URL)
    .resource("web_ofml/ocd/web_ocd_artbase")
    .param("where", `web_program_name="${webProgramName}" AND article_nr="${articleNr}" AND prop_class="${pClass}"`)
    .build()

    return await this.fetchAndParseFromUrl<any[]>({
      url: url
    }) as any[]
  }

  async deleteArtbaseEntry(
    webProgramName: string,
    articleNr: string,
    propertyName: string,
    value: string | number) {
    
      const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_artbase")
      .param("where", `web_program_name="${webProgramName}" AND article_nr="${articleNr}" AND property="${propertyName}" AND prop_value="${value}"`)
      .build()

      return this.fetchAndParseFromUrl(
        {
          url: url,
          requestOptions: this.buildDeleteRequestOptions(),
          throwError: true
        }
      )
  }

}
