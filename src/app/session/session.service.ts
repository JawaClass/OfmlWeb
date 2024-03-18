import { Injectable, inject, Injector, OnInit } from '@angular/core';
import { BaseService, UrlBuilder } from '../util/base.service'
import { Session, SessionAndOwner, IArticleDuplicate, IArticleProgramTuple } from '../models/models'
import { BehaviorSubject, firstValueFrom, interval } from 'rxjs';
import { Router } from '@angular/router';
import { TaskDisplayService } from '../tasks/task-display.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionEditorComponent } from './session-editor/session-editor.component';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseService {

  public testOb$ = interval(1000)

  dialogOpener = inject(MatDialog)

  openEditSessionDialog(sessionAndOwner: SessionAndOwner, onClose?: () => void) {
    this.dialogOpener.open(SessionEditorComponent,
      {
        data: sessionAndOwner
      }
    ).afterClosed().subscribe(
      () => onClose ? onClose() : undefined
    )
  }

  private currentSessionSubject$ = new BehaviorSubject<Session | undefined>(undefined)
  public currentSession$ = this.currentSessionSubject$.asObservable()
  public articleDuplicates4Session$ = new BehaviorSubject<IArticleDuplicate[] | null>(null)
  private router = inject(Router)
  private taskDisplayService = inject(TaskDisplayService)

  constructor() {
    super()
    this.currentSession$.subscribe(() => {
      if (!this.hasSession()) {
        this.router.navigate(['/'])
      }
    })
  }

  public getCurrentSession() {
    return this.currentSessionSubject$.value
  }

  public hasSession() {
    return Boolean(this.getCurrentSession())
  }

  async mergeNewArticleWithProgram(articleNr: string, program: string, webProgramName: string) {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("deepcopy/ocd/merge")
      .param("article", articleNr)
      .param("program", program)
      .param("merge_with", webProgramName)
      .build()
    const result = await this.fetchAndParseFromUrl<any>({ url: url })
    this.taskDisplayService.addTask(result["result_id"], "Artikel hinzufügen", `${articleNr} (${program}) -> ${articleNr} (${webProgramName})`)

    return null
  }

  async mergeNewArticleWithProgramAsAlias(articleNr: string, program: string, webProgramName: string, mergeAsArticleNr: string) {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("deepcopy/ocd/merge_as")
      .param("article", articleNr)
      .param("program", program)
      .param("merge_with", webProgramName)
      .param("merge_as", mergeAsArticleNr)
      .build()
    const result = await this.fetchAndParseFromUrl<any>({ url: url })
    this.taskDisplayService.addTask(result["result_id"], "Artikel als Alias hinzufügen", `${articleNr} (${program}) -> ${mergeAsArticleNr} (${webProgramName})`)

    return null
  }

  async createSession(session: Session, articleAndPrograms: IArticleProgramTuple[]): Promise<any> {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("deepcopy/ocd")
      .build()
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
    const json = await this.fetchAndParseFromUrl(
      {
        url: url,
        requestOptions: requestOptions
      }
    )
    if (json) {
      this.setCurrentSession(Session.fromJSON(json))
      this.snackBar.open("Sitzung erstellt", "Ok", { duration: 2000 })
      return this.getCurrentSession()
    } else {
      // this.snackBar.open("Sitzung konnte nicht erstellt werdne", "Ok", { duration: 10_000 })
      this.setCurrentSession(undefined)
      return null
    }

  }

  async fetchAndSetArticleDuplicates(articleTokens: string[]) {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("ocd/article_compact")
      .param("articles", articleTokens.join(","))
      .build()
    const json = await this.fetchAndParseFromUrl<IArticleDuplicate[]>(
      {
        url: url
      }
    )
    this.articleDuplicates4Session$.next(json)
  }

  async setCurrentSession(session?: Session) {
    // console.log("setCurrentSession", session);

    if (session && session.id) {
      localStorage.setItem("sessionId", session.id!!.toString())
    } else {
      localStorage.removeItem("sessionId")
    }
    this.currentSessionSubject$.next(session)
  }

  async editSession(session: Session): Promise<Session> {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/session/update")
      .build()
    await this.fetchAndParseFromUrl(
      {
        url: url,
        requestOptions: this.buildPutRequestOptions(JSON.stringify(session))
      }
    )
    this.snackBar.open("Ihre Sitzung wurde geändert", "Ok", { duration: 2000 })
    return session
  }

  async deleteSession(session: Session): Promise<void> {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource(`deepcopy/ocd/${session.name}`)
      .build()
    await this.fetchAndParseFromUrl(
      {
        url: url,
        requestOptions: this.buildDeleteRequestOptions()
      }
    )
    if (session.id === this.getCurrentSession()?.id) {
      this.setCurrentSession(undefined)
      this.snackBar.open("Ihre Sitzung wurde gelöscht", "Ok", { duration: 2000 })
    }
  }

  async getAllSessionsWithOwner(): Promise<SessionAndOwner[]> {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_program/details")
      .param("order_by", "edit_date DESC")
      .build()

    const sessions: any[] = await this.fetchAndParseFromUrl(
      {
        url: url,
        throwError: true
      }
    ) as any[]

    return sessions.map(x => (
      {
        session: Session.fromJSON(x),
        owner: x["owner"]
      } as SessionAndOwner
    ))
  }

  async fetchSessionById(sessionId: number): Promise<Session | null> {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_program")
      .param("where", `id=${sessionId}`)
      .param("limit", 1)
      .build()

    const session = await this.fetchAndParseFromUrl(
      {
        url: url
      }
    )
    return Boolean(session) ? Session.fromJSON(session) : null
  }

  async fetchSessionByName(name: string): Promise<Session | null> {

    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/ocd/web_program")
      .param("where", `name="${name}"`)
      .param("limit", 1)
      .build()

    const session: any = await this.fetchAndParseFromUrl(
      {
        url: url
      }
    )
    return Boolean(session) ? Session.fromJSON(session) : null
  }

  async tryAutoSelectFromLastUsed() {

    const localSessionId = localStorage.getItem("sessionId")

    if (localSessionId) {
      const session = await this.fetchSessionById(Number.parseInt(localSessionId))
      if (session) {
        this.setCurrentSession(session)
        return true
      } else {
        localStorage.removeItem("sessionId")
      }
    }
    return false
  }


}
