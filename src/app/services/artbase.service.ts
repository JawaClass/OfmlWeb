import { Injectable } from '@angular/core';
import { BaseService } from './base.service'
import { Observable, Subject, map, of, BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtbaseService extends BaseService {
  
  currentArticleItem$ = new BehaviorSubject<any>(null)

  async fetchArtbaseFromPropClass(pClass: string) {
    const articleNr = this.currentArticleItem$.value.article_nr
    const webProgram = this.currentArticleItem$.value.web_program_name
    const url = this.baseUrl + "/web_ofml/ocd/web_ocd_artbase?where=web_program_name=%22" + webProgram + "%22 AND article_nr = %22" + articleNr + "%22 AND prop_class = %22" + pClass + "%22"
    return this.fetchAndParseFromUrl(url)
  }
}
