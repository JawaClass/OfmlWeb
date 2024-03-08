import { Injectable, Injector, OnInit, inject } from '@angular/core';
import { Observable, map, BehaviorSubject, firstValueFrom } from 'rxjs';
import { BaseService, UrlBuilder } from '../util/base.service'
import { SessionService } from '../session/session.service';
import { Session } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class ArticleInputService extends BaseService {

  public isLoading = false

  private articleItemsSubject$ = new BehaviorSubject<any[] | undefined>(undefined)

  public articleItems$ = this.articleItemsSubject$.asObservable()

  alternativeView = false

  filter = {
    "program": "",
    "pClass": "",
    "article": "",
  }

  private injector = inject(Injector)

  sessionService = () => this.injector.get(SessionService)

  constructor() {
    super()
    /*
    when session changes do reload articleItems
    */

    this.sessionService().currentSession$.subscribe(
      {
        next: async (session?: Session) => {
          if (session) {
            await this.reloadArticleItems()
          } else {
            this.articleItemsSubject$.next(undefined)
          }
        },
        error: () => {
          console.log("ERROR: ArticleInputService currentSession$.subscribe(...) ");
        }
      }
    )
  }

  public overwriteArticleItems(articleItems: any[]) {
    this.articleItemsSubject$.next(articleItems)
  }

  public getCurrentArticleItems() {
    return this.articleItemsSubject$.value
  }

  public async reloadArticleItems() {
    this.isLoading = true
    this.articleItemsSubject$.next([])
    const articleItems = await this.fetchArticleItemsFromServer()
    this.articleItemsSubject$.next(articleItems)
    this.isLoading = false
  }

  private async fetchArticleItemsFromServer(): Promise<any[]> {
    const webProgramName: string = this.sessionService().getCurrentSession()?.name!!
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_article/details")
      .param("where", `web_program_name="${webProgramName}"`)
      .build()
    return await this.fetchAndParseFromUrl(
      {
        url: url,
        throwError: true
      }
    ) as any[]
  }

  async fetchWebOcdArticleWithDetails(): Promise<any[]> {
    const webProgramName: string = this.sessionService().getCurrentSession()!!.name
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_ocd_article/details")
      .param("where", `web_program_name="${webProgramName}"`)
      .build()
    const response = await fetch(url)
    const json: any = await response.json()
    return json
  }

  async fetchMiscData(): Promise<any> {
    // MOVE TO OTHER SERVICE !!!!
    //const url = this.baseUrl + "/misc/all"
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("misc/all")
      .build()
    //const response = await fetch(url)
    //const misc: any = await response.json()
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

  groupArticlesByClassName(articles: any[]) {
    let groups: any = {}
    articles.forEach((a: any) => {
      a["klassen"].forEach((pClass: any) => {
        const pClassName: string = pClass["prop_class"]
        if (groups[pClassName]) {
          groups[pClassName].push(a)
        } else {
          groups[pClassName] = [a]
        }
      })
    })
    return groups
  }

  /*
  public webOcdArticleWithDetails: any[] = []

  async getWebOcdArticleWithDetails() {
    if (this.webOcdArticleWithDetails.length == 0) {
      await this.setWebOcdArticleWithDetailsFromBackend()
    }
    return this.webOcdArticleWithDetails
  }

  async setWebOcdArticleWithDetailsFromBackend() {
    const data = await this.fetchWebOcdArticleWithDetails()
    this.webOcdArticleWithDetails = data
  }

  clearWebOcdArticleWithDetailsFromBackend() {
    this.webOcdArticleWithDetails = []
  }
*/
}