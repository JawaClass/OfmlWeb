import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service'
import { User } from '../models/models'
import { BehaviorSubject } from 'rxjs';
import { ArticleInputService } from './article-input.service';
import { SessionService } from '../services/session.service'


@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  currentUser$ = new BehaviorSubject<User | null>(null)
  sessionService = inject(SessionService)
  articleInputService = inject(ArticleInputService)

  logout() {
    localStorage.clear()
    this.currentUser$.next(null)
    this.sessionService.currentSession$.next(null)
    this.articleInputService.clearMap()
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
    const url = this.baseUrl + "/web_ofml/user/create"
    const requestOptions = this.buildPostRequestOptions(JSON.stringify({
      "email": email
    }))
    console.log("signUpUser", url, email);
    
    const response = await fetch(url, requestOptions)
    const user: User = await response.json()
    console.log("feteched User:::", user);
    this.login(user)
    return user
  }

}
