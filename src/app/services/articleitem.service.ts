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

  async fetchArticleLongText(article: any) {
    const web_program_name = article["web_program_name"]
    const long_textnr = article["long_textnr"]
    const url = this.baseUrl +  "/web_ofml/ocd/web_ocd_artlongtext?where=web_program_name=%22" + web_program_name +"%22%20AND%20textnr=%22"+long_textnr+"%22 AND language = \"de\" "
    console.log("url...", url);
    const textItems = await this.fetchAndParseFromUrl<any>(url)
    return textItems.sort((a: any, b: any) => {
      if(a["line_nr"] < b["line_nr"]) { return -1; }
      if(a["line_nr"] > b["line_nr"]) { return 1; }
      return 0;
  })

  }

  async patchArticlePrice(patchItem: any) {
    const url = this.baseUrl +  "/web_ofml/ocd/web_ocd_price?where=db_key=" + patchItem.db_key
    return await this.fetchAndParseFromUrl<any>(url, this.buildPatchRequestOptions(JSON.stringify(patchItem)))
  }

  async patchResourceByKey(table: string, dbKey: number, patchItem: any) {
    const url = this.baseUrl +  "/web_ofml/ocd/" + table + "?where=db_key=" + dbKey
    return await this.fetchAndParseFromUrl<any>(url, this.buildPatchRequestOptions(JSON.stringify(patchItem)))
  }

  async patchArticleShortText(patchItem: any) {
    const url = this.baseUrl +  "/web_ofml/ocd/web_ocd_artshorttext?where=db_key=" + patchItem.db_key
    return await this.fetchAndParseFromUrl<any>(url, this.buildPatchRequestOptions(JSON.stringify(patchItem)))
  }
  async postArticleLongTextLine(item: any) {
    const url = this.baseUrl +  "/web_ofml/ocd/web_ocd_artlongtext"
    return await this.fetchAndParseFromUrl<any>(url, this.buildPostRequestOptions(JSON.stringify(item)))
  }

  async patchArticleLongText(
    articleItem: any,
    oldLongTextItems: any[],
    longTextNew: string) {
    // delete old long text
    const oldIDs = oldLongTextItems?.map((line: any) => line.db_key)
    if (oldIDs && oldIDs.length) {
      await this.deleteArticleLongText(oldIDs)
    } 
    // patch long_textnr in article table
    const patchItem = {
      "long_textnr": "LONGTEXTNR_" + articleItem.article_nr
    }
    await this.patchResourceByKey("web_ocd_article", articleItem.db_key, patchItem)
    // insert new long text
    const lines = longTextNew.split("\n")
    const items = lines.map((text, idx) => ({
      "textnr": patchItem["long_textnr"],
      "language": "de",
      "line_nr": idx + 1,
      "line_fmt": "\\",
      "text": text,
      "sql_db_program": articleItem.sql_db_program,
      "web_program_name": articleItem.web_program_name,
      "web_filter": 0
    }))
    const createdArtlongTextItems = await Promise.all(items.map(item => this.postArticleLongTextLine(item)))
    console.log("createdItems...", createdArtlongTextItems)
    // patch local
    articleItem.long_textnr = patchItem["long_textnr"]

  }

  private async deleteArticleLongText(ids: number[]) {
    const idsJoined = ids.join(",")
    const url = this.baseUrl +  "/web_ofml/ocd/web_ocd_artlongtext?where=db_key IN (" + idsJoined +")"
    console.log("deleteArticleLongText", url)
    return await this.fetchAndParseFromUrl(url, this.buildDeleteRequestOptions())
    
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
