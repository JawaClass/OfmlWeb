import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { UrlBuilder } from '../util/url-builder'
import { FetchBuilder } from '../util/fetch-builder'

export { UrlBuilder }
export { FetchBuilder }


@Injectable({
  providedIn: 'any'
})
export abstract class BaseService {

  public static BASE_URL = environment.backendBaseUrl

  protected httpClient: HttpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar)

  protected async makeSafeFetch(url: string, options?: any): Promise<Response> {
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        const message = response.statusText
        const status = response.status
        this.showSnackbar(`ERROR [1]: Aktion ${url} konnte nicht ausgeführt werden. [${status}] ${message}`, 10_000)
      }
      return response
    } catch (error: any) {
      this.showSnackbar(`ERROR [2]: Aktion ${url} konnte nicht ausgeführt werden. ${error.message}`, 10_000)
      return new Response(undefined, { status: 500, statusText: 'Unbekannter Fehler' })
    }
  }

  protected async fetchAndParseFromUrl<T>(init: {
    url: string,
    requestOptions?: any,
    throwError?: boolean
  }): Promise<T | null> {

    const response = await this.makeSafeFetch(init.url, init.requestOptions)

    if (response.ok) {
      const canParse = (response.status != 204)
      return canParse ? (await response.json()) : null
    }

    console.log("fetchAndParseFromUrl ERROR", response.status, "::", response.statusText)
    
    if (init.throwError) {
      throw new Error(`ERROR:${init.url} could'nt be fetched and parsed.`)
    } 

    return null
  }

  showSnackbar(message: string, millis: number) {
    this.snackBar.open(message, "Ok", { duration: millis })
  }

  async doBackendHealthcheck() {
    const url = BaseService.BASE_URL
    return await this.fetchAndParseFromUrl({ url: url })
  }

  async isBackendAvailable() {
    try {
      await this.doBackendHealthcheck()
      return true
    } catch (error) {
      return false
    }
  }

  protected buildPostRequestOptions(body: string) {
    const options = this.buildCrudOptions("POST")
    return { ...options, ...{ body: body } }
  }

  protected buildPatchRequestOptions(body: string) {
    const options = this.buildCrudOptions("PATCH")
    return { ...options, ...{ body: body } }
  }

  protected buildPutRequestOptions(body: string) {
    const options = this.buildCrudOptions("PUT")
    return { ...options, ...{ body: body } }
  }

  protected buildDeleteRequestOptions(body: string = "") {
    const options = this.buildCrudOptions("DELETE")
    return { ...options, ...{ body: body } }
  }

  private buildCrudOptions(method: string) {
    return {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  }

}
