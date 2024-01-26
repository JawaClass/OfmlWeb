import { Injectable, inject, Injector } from '@angular/core';
import { BaseService } from './base.service'
import { Session, SessionAndOwner, ArticleItem, ProgramMap } from '../models/models'
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

  async setCurrentSession(session: Session) {
    localStorage.setItem('sessionId', session.id!!.toString())
    this.currentSession$.next(session)
    await this.fetchAndSetSessionData()
  }

  async createSession(session: Session): Promise<Session> {
    const url = this.baseUrl + "/web_ofml/session/create"
    const requestOptions = this.buildPostRequestOptions(JSON.stringify(session))
    const response = await fetch(url, requestOptions)
    const createdSession: Session = await response.json()
    this.currentSession$.next(createdSession)
    localStorage.setItem("sessionId", createdSession.id!!.toString())
    await this.saveInitialArticleItems(session)
    this.snackBar.open("Sitzung erstellt", "Ok", { duration: 2000 })
    return createdSession
  }

  async editSession(session: Session): Promise<Session> {
    const url = this.baseUrl + "/web_ofml/session/update"
    const currentUser = this.userService().currentUser$.value!!
    const currentUserId = currentUser.id!!
    session.editUserId = currentUserId
    const requestOptions = this.buildPutRequestOptions(JSON.stringify(session))
    const response = await fetch(url, requestOptions)
    await response.json()
    this.currentSession$.next(session)
    await this.fetchAndSetSessionData()
    this.snackBar.open("Ihre Sitzung wurde geändert", "Ok", { duration: 2000 })
    return session
  }

  async deleteSession(session: Session): Promise<void> {
    const url = this.baseUrl + "/web_ofml/session/delete"
    const requestOptions = this.buildDeleteRequestOptions(JSON.stringify({ id: session.id }))
    await fetch(url, requestOptions)
    if (session.id === this.currentSession$.value?.id) {
      this.articleService.clearMap()
      localStorage.removeItem("sessionId")
      this.currentSession$.next(null)
      this.snackBar.open("Ihre Sitzung wurde gelöscht", "Ok", { duration: 2000 })
    }
  }

  async getAllSessionsWithOwner(): Promise<SessionAndOwner[]> {
    const url = this.baseUrl + "/web_ofml/session/all?with_user=1"
    const response = await fetch(url)
    const sessions: any[] = await response.json()
    return sessions.map(x => (
      {
        session: Session.fromJSON(x["session"]),
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
    const url = this.baseUrl + "/web_ofml/session/by_id/" + sessionId
    const response = await fetch(url)
    const session: any = await response.json()

    console.log("fetchSessionById RESULT_______", session);
    if (session)
      return Session.fromJSON(session)
    else
      return null
  }

  async tryAutoSelectFromLastUsed() {
    const localSessionId = localStorage.getItem('sessionId')
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

    const data = await Promise.all(
      [
        this.articleItemService().fetchArticleItems(),
        this.propertyItemService().fetchPropertyItems()
      ]
    )

    const articleItems = data[0]
    const propertyItems = data[1]

    this.articleService.programMap.updateWithItems(articleItems, propertyItems)
    this.articleService.behaviorSubjectProgramMap.next(this.articleService.programMap)
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
