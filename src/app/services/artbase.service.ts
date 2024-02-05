import { Injectable } from '@angular/core';
import { BaseService } from './base.service'
import { Observable, Subject, map, of, BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtbaseService extends BaseService {
  
  currentArticleItem$ = new BehaviorSubject<any>(null)
  async createArtbaseEntry(artbaseEntry: any) {
    const url = this.baseUrl + "/web_ofml/ocd/web_ocd_artbase"
    return this.fetchAndParseFromUrl(url, this.buildPostRequestOptions(JSON.stringify(artbaseEntry)))

  }

  async fetchArtbaseFromPropClass(pClass: string): Promise<any[]> {
    const articleNr = this.currentArticleItem$.value.article_nr
    const webProgram = this.currentArticleItem$.value.web_program_name
    const url = this.baseUrl + "/web_ofml/ocd/web_ocd_artbase?where=web_program_name=%22" + webProgram + "%22 AND article_nr = %22" + articleNr + "%22 AND prop_class = %22" + pClass + "%22"
    return await this.fetchAndParseFromUrl<any[]>(url) as any[]
  }

  async deleteArtbaseEntry(
    webProgramName: string,
    articleNr: string,
    propertyName: string,
    value: string | number) {
      const url = this.baseUrl + "/web_ofml/ocd/web_ocd_artbase?where=web_program_name=%22" + webProgramName + "%22 AND article_nr=%22" + articleNr + "%22 AND property = %22" + propertyName + "%22 AND prop_value = %22" + value + "%22"
      return this.fetchAndParseFromUrl(url, this.buildDeleteRequestOptions())
  }

}
