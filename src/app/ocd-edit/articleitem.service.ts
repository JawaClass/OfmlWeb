import { Injectable, inject } from '@angular/core';
import { BaseService, UrlBuilder } from '../util/base.service';
import { SessionService } from '../session/session.service'

@Injectable({
  providedIn: 'root'
})
export class ArticleitemService extends BaseService {

  sessionService = inject(SessionService)

  async execBatachArtbaseAll(artbaseItems: any) {
    const webProgramName = this.sessionService.getCurrentSession()!!.name
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/batch/web_ocd_artbase/exec_artbase_all")
      .param("where", `web_program_name="${webProgramName}"`)
      .build()
    return this.fetchAndParseFromUrl<any>(
      {
        url: url,
        requestOptions: this.buildPostRequestOptions(JSON.stringify(artbaseItems))
      }
    )
  }

  async fetchArticlePrice(article: any) {
    const webProgramName = article["web_program_name"]
    const articleNr = article["article_nr"]
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_price")
      .param("where", `web_program_name="${webProgramName}" AND article_nr="${articleNr}" AND price_type="S" AND price_level="B"`)
      .param("limit", 1)
      .build()
    return await this.fetchAndParseFromUrl<any>(
      {
        url: url
      }
    )
  }

  async fetchArticleLongText(article: any) {
    const webProgramName = article["web_program_name"]
    const longTextNr = article["long_textnr"]
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_artlongtext")
      .param("where", `web_program_name="${webProgramName}" AND textnr="${longTextNr}" AND language="de"`)
      .param("order_by", "line_nr")
      .build()
    return await this.fetchAndParseFromUrl<any>(
      {
        url: url
      }
    )
  }

  async deleteArticle(articleItem: any) {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_article")
      .param("where", `db_key=${articleItem.db_key}`)
      .build()
    return await this.fetchAndParseFromUrl<any>(
      {
        url: url,
        requestOptions: this.buildDeleteRequestOptions()
      }
    )
  }

  async patchArticlePrice(patchItem: any) {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_price")
      .param("where", `db_key=${patchItem.db_key}`)
      .build()
    return await this.fetchAndParseFromUrl<any>(
      {
        url: url,
        requestOptions: this.buildPatchRequestOptions(JSON.stringify(patchItem))
      }
    )
  }

  async patchResourceByKey(table: string, dbKey: number, patchItem: any) {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource(`web_ofml/ocd/${table}`)
      .param("where", `db_key=${dbKey}`)
      .build()
    return await this.fetchAndParseFromUrl<any>(
      {
        url: url,
        requestOptions: this.buildPatchRequestOptions(JSON.stringify(patchItem))
      }
    )
  }

  async patchArticleShortText(patchItem: any) {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_artshorttext")
      .param("where", `db_key=${patchItem.db_key}`)
      .build()
    return await this.fetchAndParseFromUrl<any>(
      {
        url: url,
        requestOptions: this.buildPatchRequestOptions(JSON.stringify(patchItem))
      }
    )
  }

  async postArticleLongTextLine(item: any) {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_artlongtext")
      .build()
    return await this.fetchAndParseFromUrl<any>(
      {
        url: url,
        requestOptions: this.buildPostRequestOptions(JSON.stringify(item))
      }
    )
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
    // patch locallay 
    articleItem.long_textnr = patchItem["long_textnr"]

  }

  private async deleteArticleLongText(ids: number[]) {
    const idsJoined = ids.join(",")

    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_artlongtext")
      .param("where", `db_key IN (${idsJoined})`)
      .build()

    return await this.fetchAndParseFromUrl(
      {
        url: url,
        requestOptions: this.buildDeleteRequestOptions()
      }
    )
  }

}
