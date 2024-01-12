import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'any' //'root'
})
export abstract class BaseService {

  protected baseUrl = environment.backendBaseUrl // "http://172.22.15.238:5000"

  protected httpClient: HttpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar)

  protected buildPostRequestOptions(body: string) {
    return {
      method: 'POST',
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

  protected buildDeleteRequestOptions(body: string) {
    return {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body, 
    }
  }

}
