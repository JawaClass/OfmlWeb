import { Injectable, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'any' //'root'
})
export abstract class BaseService implements OnInit {
  
  ngOnInit(): void {
    console.log("BaseService INIT........");
  }

  protected baseUrl = "http://172.22.15.238:5000"

  constructor(protected http: HttpClient) {
    console.log("BaseService construcotr........");
  }


}
