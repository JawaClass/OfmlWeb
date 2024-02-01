import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { ArticleItem } from './../models/models'
import { SessionService } from './session.service'

@Injectable({
  providedIn: 'root'
})
export class ArticleitemService extends BaseService {

  sessionService = inject(SessionService)

  async fetchArticlePrice(article: any) {
    const web_program_name = article["web_program_name"]
    const article_nr = article["article_nr"]
    const url = this.baseUrl +  "/web_ofml/ocd/web_ocd_price?where=web_program_name=%22" + web_program_name +"%22%20AND%20article_nr=%22"+article_nr+"%22%20AND%20price_type=%22S%22%20AND%20price_level=%22B%22&limit=1"
    return await this.fetchAndParseFromUrl<any>(url)
  }
 
  async fetchArticlePriceAndLongtext(articleItem: ArticleItem) {
    const url = this.baseUrl + "/ocd/longtext_and_price/" + articleItem.articleNr + "/" + articleItem.program
    const response = await fetch(url)
    const json: any = await response.json()
    console.log("fetchArticlePriceAndLongtext RESULT :::", json, json["price"], json["longtext"]);
    return json
  }

  async fetchArticleItems(): Promise<ArticleItem[]> {
    const session = this.sessionService.currentSession$.value!!
    console.log("fetchArticleItems :::", session.id, session.name);
    const url = this.baseUrl + "/web_ofml/article_item/by_session_id/" + session.id
    const response = await fetch(url)
    const article_items: any[] = await response.json()
    return article_items.map(item => ArticleItem.fromJSON(item["json"]))
  }

  async saveArticleItem(articleItem: ArticleItem): Promise<any> {
    const url = this.baseUrl + "/web_ofml/article_item/save"
    const session = this.sessionService.currentSession$.value!!
    const requestOptions = this.buildPostRequestOptions(
      JSON.stringify({
        sessionId: session.id,
        articleNr: articleItem.articleNr,
        program: articleItem.program,
        json: articleItem.jsonify()
      })
    )
    await fetch(url, requestOptions)
    this.snackBar.open("Änderungen gespeichert " + articleItem.articleNr, "Ok", { duration: 1300 })
  }

  async removeArticleItem(articleItem: ArticleItem): Promise<void> {
    const url = this.baseUrl + "/web_ofml/article_item/delete"
    const session = this.sessionService.currentSession$.value
    const sessionId = session!!.id
    const requestOptions = this.buildDeleteRequestOptions(JSON.stringify({
      article: articleItem.articleNr,
      program: articleItem.program,
      sessionId: sessionId
    }))
    await fetch(url, requestOptions)
  }

}
