import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'any' //'root'
})
export abstract class BaseService {

  /*protected*/  baseUrl = environment.backendBaseUrl // "http://172.22.15.238:5000"

  protected async fetchAndParseFromUrl<T>(url: string, requestOptions: any = undefined): Promise<T | null> {
      const response = await fetch(url, requestOptions)
      if (response.ok) {
        if (response.status != 204)
          return await response.json()
        else
          return null 
      }
      console.log("fetchAndParseFromUrl ERROR", response.status, "::", response.statusText)
      return null
  }

  protected httpClient: HttpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar)

  async doBackendHealthcheck() {
    const url = this.baseUrl
    return await this.fetchAndParseFromUrl(url)
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
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body, 
    }
  }

  protected buildPatchRequestOptions(body: string) {
    return {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body, 
    }
  }

  protected buildPutRequestOptions(body: string) {
    return {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body, 
    }
  }

  protected buildDeleteRequestOptions(body: string = "") {
    return {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body, 
    }
  }

}
