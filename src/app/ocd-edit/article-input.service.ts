import { Injectable, Injector, OnInit, inject } from '@angular/core';
import { Observable, map, BehaviorSubject, firstValueFrom, Subject, combineLatest, tap, switchMap, from, of, scan, startWith, shareReplay, pipe, first, throttleTime, share, mergeMap, concatMap, concat, concatWith, concatAll, exhaustMap, debounceTime } from 'rxjs';
import { BaseService, UrlBuilder } from '../util/base.service'
import { SessionService } from '../session/session.service';
import { Session } from '../models/models';
import { TaskDisplayService } from '../tasks/task-display.service';

import { GroupedList, groupListbyKey } from '../util/list-tools'

export interface ArtilceItemsFilter {
  article: string,
  program: string
}

export const EMPTY_FILTER = {
  article: "",
  program: ""
}

@Injectable({
  providedIn: 'root'
})
export class ArticleInputService extends BaseService {

  private tasksService = inject(TaskDisplayService)
  private injector = inject(Injector)

  sessionService = () => this.injector.get(SessionService)

  public articleItemsSubjectBackend$ = new BehaviorSubject<any[]>([])

  public setFilter$ = new BehaviorSubject<ArtilceItemsFilter>(EMPTY_FILTER)

  public filter$$ = this.setFilter$.pipe(
    shareReplay(1)
  )


  //private articleItems: any[] = []
  public toggleView() {
    this.alternativeView$$.next()
    this.articleItems$.pipe(
      first()
    ).subscribe(items => this.articleItemsSubject$.next(items))
  }

  private alternativeView$$ = new Subject<void>()
  public alternativeView$ = this.alternativeView$$.pipe(
    scan((state, curr) => !state, true),
    startWith(true)
  );
  private reload$ = new BehaviorSubject(undefined)
  public isLoading$ = new BehaviorSubject(false)

  /* Subject that holds the articleItems.
  Subject is empty at the start and wont emit the first value until a client explictly emitted.
  */
  //private articleItemsSubject$ = new Subject<any[]>()
  private articleItemsSubject$ = new BehaviorSubject<any[]>([])

  /* Simple Observable of articleItemsSubject$.
  Also creates side-effect and stores local copy of data.
  */
  articleItems$ = this.articleItemsSubject$.asObservable()
    .pipe(
      //tap(items => this.articleItems = items)
      shareReplay(1) // store the latest articleItems for anyone to subscribe 
    )

  public articleItemsGroupedByProgram$ = this.articleItems$
    .pipe(
      map((items: any[]) => groupListbyKey(items, "sql_db_program")),
    )

  public articleItemsGroupedByProgramAndClass$: Observable<{ [x: string]: GroupedList }> = this.articleItemsGroupedByProgram$
    .pipe(
      map((groups: GroupedList) => Object.keys(groups)
        .map(groupKey => {
          const itemsOfProgram: any[] = groups[groupKey]
          return { [groupKey]: this.groupArticlesByClassName(itemsOfProgram) }
        }
        ).reduce(
          (obj, item) => Object.assign(obj, item), {})
      )
    )


  

  constructor() {
    super()
    /* keep subscribed to newTasksArrived$ */
    this.tasksService.newTasksArrived$.subscribe(
      () => this.reload$.next(undefined)
    )
    /* keep subscribed to currentSession$ */
    this.sessionService().currentSession$.subscribe(
      (session?: Session) => {
        if (session) { this.reload$.next(undefined) }
        else { this.articleItemsSubject$.next([]) }
      },
    )
    /* keep subscribed to reload$ */
    this.reload$.pipe(
      tap(() => this.isLoading$.next(true)),
      switchMap(() => from(this.fetchArticleItemsFromServer()))
    ).subscribe(
      (items: any[]) => {
        this.articleItemsSubject$.next(items)
        this.articleItemsSubjectBackend$.next(items)
        this.isLoading$.next(false)
      }
    )
    /* listen to filter changes, irgnore too fast changes, switchMap the filter$ to the items$ and push the new items */
    this.filter$$.pipe(
      debounceTime(200),
      switchMap(
        (itemsFilter: ArtilceItemsFilter) => this.articleItemsSubjectBackend$
          .pipe(
            map((items: any[]) => items.filter(item => this.testArticleAgainstFilter(item.article_nr, itemsFilter) && this.testProgramAgainstFilter(item.sql_db_program, itemsFilter))),
            first() /* this is very important to place here! only take first of the mapped high order observable, otherwise infinite loop! */
          ))
    ).subscribe(items => {
      console.log("concatMap items:::", items);
      this.articleItemsSubject$.next(items)
    }
    )
  }

  private testArticleAgainstFilter(articlrNr: string, itemsFilter: ArtilceItemsFilter) {
    const filter = itemsFilter.article.toUpperCase()
    const regexPattern = new RegExp(`^${filter}`)
    return regexPattern.test(articlrNr.toUpperCase())
  }

  private testProgramAgainstFilter(program: string, itemsFilter: ArtilceItemsFilter) {
    const filter = itemsFilter.program.toUpperCase()
    const regexPattern = new RegExp(`^${filter}`)
    return regexPattern.test(program.toUpperCase())
  }

  public overwriteArticleItems(articleItems: any[]) {
    this.articleItemsSubject$.next(articleItems)
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

  public groupArticlesByClassName(items: any[]): GroupedList {
    let groups: any = {}
    items.forEach((a: any) => {

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

}