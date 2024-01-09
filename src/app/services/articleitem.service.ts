import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { ArticleItem } from './../models/models'
import { SessionService } from './session.service'

@Injectable({
  providedIn: 'root'
})
export class ArticleitemService extends BaseService {

  sessionService = inject(SessionService)

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
