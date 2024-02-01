import { Injectable, inject, Injector } from '@angular/core';
import { BaseService } from './base.service'
import { Session, SessionAndOwner, ArticleItem, ProgramMap, IArticleDuplicate, IArticleProgramTuple } from '../models/models'
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ArticleInputService } from './article-input.service';
import { ArticleitemService } from './articleitem.service';
import { PropertyitemService } from './propertyitem.service';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseService {

  private injector = inject(Injector)
  private articleItemService = () => this.injector.get(ArticleitemService)
  private propertyItemService = () => this.injector.get(PropertyitemService)
  private userService = () => this.injector.get(UserService)
  private articleService = inject(ArticleInputService)
  currentSession$ = new BehaviorSubject<Session | null>(null)
  articleDuplicates4Session$ = new BehaviorSubject<IArticleDuplicate[] | null>(null)
 
  async createSession(session: Session, articleAndPrograms: IArticleProgramTuple[]): Promise<void> {
    console.log("createSession...");
    
    const url = this.baseUrl + "/deepcopy/ocd/" //"/web_ofml/session/create"
    const requestOptions = this.buildPostRequestOptions(JSON.stringify(
      {
        name: session.name,
        owner_id: session.ownerId,
        is_public: session.isPublic,
        article_input: session.articleInput,
        articlenumbers_and_programs: articleAndPrograms.map(a => [a.article, a.program])
      }
      )
    )
    const response = await fetch(url, requestOptions)
    const createdSession: Session = await response.json()
    localStorage.setItem("sessionId", createdSession.id!!.toString())
    //await this.saveInitialArticleItems(session)
    this.snackBar.open("Sitzung erstellt", "Ok", { duration: 2000 })
    //return createdSession
  }

  async fetchArticleDuplicates(articleTokens: string[]) {
    console.log("fetchArticleDuplicates...")
    const url = this.baseUrl + "/ocd/article_compact?articles=" + articleTokens.join(",")
    const response = await fetch(url)
    const json: IArticleDuplicate[] = await response.json()
    console.log("json", json)
    this.articleDuplicates4Session$.next(json)
  }

  async setCurrentSession(session: Session) {
    console.log("setCurrentSession", session.name, session.id);
    this.currentSession$.next(session)
    localStorage.setItem('sessionId', session.id!!.toString())
    //await this.fetchAndSetSessionData()
  }


  async editSession(session: Session): Promise<Session> {
    const url = this.baseUrl + "/web_ofml/session/update"
    const currentUser = this.userService().currentUser$.value!!
    const currentUserId = currentUser.id!!
    // session.editUserId = currentUserId
    const requestOptions = this.buildPutRequestOptions(JSON.stringify(session))
    const response = await fetch(url, requestOptions)
    await response.json()
    await this.fetchAndSetSessionData()
    this.snackBar.open("Ihre Sitzung wurde geändert", "Ok", { duration: 2000 })
    return session
  }

  async deleteSession(session: Session): Promise<void> {
    const url = this.baseUrl + "/deepcopy/ocd/" + session.name  //"/web_ofml/session/delete"
    const requestOptions = this.buildDeleteRequestOptions()
    await fetch(url, requestOptions)
    if (session.id === this.currentSession$.value?.id) {
      this.articleService.clearMap()
      localStorage.removeItem("sessionId")
      this.snackBar.open("Ihre Sitzung wurde gelöscht", "Ok", { duration: 2000 })
    }
  }

  async getAllSessionsWithOwner(): Promise<SessionAndOwner[]> {
    const url = this.baseUrl + "/web_ofml/ocd/web_program/details"// "/web_ofml/session/all?with_user=1"
    const response = await fetch(url)
    const sessions: any[] = await response.json()
    console.log("sessions....");
    console.log(sessions);
    
    
    return sessions.map(x => (
      {
        session: Session.fromJSON(x), // Session.fromJSON(x["session"]),
        owner: x["owner"]
      } as SessionAndOwner
    ))
  }

  private async saveInitialArticleItems(session: Session) {
    this.articleService.fetchProgramMap(session.getInputTokens()).subscribe(async result => {
      await Promise.all(
        this.articleService.programMap
          .getAllActiveArticleRefs()
          .map(x => this.articleItemService().saveArticleItem(x)))
    })
  }

  async fetchSessionById(sessionId: number): Promise<Session | null> {

    const url = this.baseUrl + "/web_ofml/ocd/web_program?where=id=" + sessionId + "&limit=1"
    const response = await fetch(url)
    const session: any = await response.json()

    //console.log("fetchSessionById RESULT_______", session);
    
    if (session)
      return Session.fromJSON(session)
    else
      return null
    
  }

  async tryAutoSelectFromLastUsed() {
    
    const localSessionId = localStorage.getItem('sessionId')

    console.log("tryAutoSelectFromLastUsed ....", localSessionId)

    if (localSessionId) {
      const session = await this.fetchSessionById(Number.parseInt(localSessionId))
      if (session) {
        await this.setCurrentSession(session)
        return true
      } else {
        localStorage.removeItem("sessionId")
      }
    }
    return false
  }

  async fetchAndSetSessionData(): Promise<void> {
    return
    /**
     * const data = await Promise.all(
      [
        this.articleItemService().fetchArticleItems(),
        this.propertyItemService().fetchPropertyItems()
      ]
    )

    const articleItems = data[0]
    const propertyItems = data[1]

    this.articleService.programMap.updateWithItems(articleItems, propertyItems)
    this.articleService.behaviorSubjectProgramMap.next(this.articleService.programMap)
     */
  }

  async fetchArticleItems(): Promise<ArticleItem[]>  {
    return this.articleItemService().fetchArticleItems()
  }

  async fetchProgramMapOnly(articleNr: string, program: string): Promise<ArticleItem | undefined> {
    const value: ProgramMap = await this.articleService.fetchProgramMapOnly([articleNr])
    const maybeArticleItem = value.getArticleItemsMap().get(program.toLowerCase())?.get(articleNr)
    return maybeArticleItem
  }

  async saveArticleItem(articleItem: ArticleItem) { 
    return this.articleItemService().saveArticleItem(articleItem)
  }

  async removeArticleItem(articleItem: ArticleItem) { 
    return this.articleItemService().removeArticleItem(articleItem)
  }

}
