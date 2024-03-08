import { Injectable, inject } from '@angular/core';
import { BaseService, UrlBuilder } from '../util/base.service'
import { User } from '../models/models'
import { BehaviorSubject } from 'rxjs';
import { SessionService } from './session.service'


@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  currentUser$ = new BehaviorSubject<User | null>(null)
  sessionService = inject(SessionService)

  logout() {
    localStorage.clear()
    this.currentUser$.next(null)
    this.sessionService.setCurrentSession(undefined)
  }

  login(user: User) {
    this.currentUser$.next(user)
    localStorage.setItem("email", user.email)
  }

  async loginByEmail(email: string) {
    const user: User = await this.signinOrSignUpUserByEmail(email)
    this.login(user)
  }

  emailLocalStorage = () => localStorage.getItem("email")

  async tryAutoLogin() {
    const emailMaybe = this.emailLocalStorage()
    console.log("tryAutoLogin :::", emailMaybe)

    if (emailMaybe) {
      await this.loginByEmail(emailMaybe)
      return true
    }
    return false
  }

  async signinOrSignUpUserByEmail(email: string): Promise<User> {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("web_ofml/user/create")
      .build()
    const requestOptions = this.buildPostRequestOptions(
      JSON.stringify(
        {
          "email": email
        }
      )
    )
    const user = await this.fetchAndParseFromUrl<User>(
      {
        url: url,
        requestOptions: requestOptions,
        throwError: true
      }
    ) as User
    this.login(user)
    return user
  }

}
