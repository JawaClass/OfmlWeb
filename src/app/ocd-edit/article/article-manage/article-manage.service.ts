import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type DETAIL_VIEW = "artbase" | "pClass" | undefined

export type ViewData = {
  type: DETAIL_VIEW,
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class ArticleManageService {

  private currentDetailView$$ = new BehaviorSubject<ViewData | undefined>(undefined)

  public currentDetailView$ = this.currentDetailView$$.asObservable()

  public setDetailView(type: DETAIL_VIEW, data: any) {
    this.currentDetailView$$.next(
      {
        type: type,
        data: data
      }
    )
  }

}
