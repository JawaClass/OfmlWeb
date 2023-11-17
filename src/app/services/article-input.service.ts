import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { eventNames } from 'process';

export interface ArticleCompact {
  article_nr: string
  series: string
  sql_db_program: string
  shorttext: string
}

export type Item = {
  article_nr: string;
  series: string;
  sql_db_program: string;
  shorttext: string;
  prop_class: string;
};

export type ProgramClassMap = {
  [propClass: string]: Item[];
};

export type ProgramMap = {
  [program: string]: ProgramClassMap;
};

export type Result = ProgramMap;

@Injectable({
  providedIn: 'root'
})
export class ArticleInputService {

  constructor(private http: HttpClient) { }

  private baseUrl = "http://localhost:5000"

  private fetchedArticles: Result = {}

  getFetchedArticles() {
    return this.fetchedArticles
  }
  setFetchedArticles(fetchedArticles: Result) {
    return this.fetchedArticles = fetchedArticles
  }

  getArticleCompact(articlenumbers: string[]): Observable<Result> { 
    const url = this.baseUrl + "/ocd/article_compact"
    return this.http.post<Result>(url, articlenumbers)
  }

  async getArticleCompact2(articlenumbers: string[]): Promise<ArticleCompact[]> {
    const api = "/ocd/article_compact"
    const data = await fetch(this.baseUrl + api, {
      method: "POST",
      body: JSON.stringify(articlenumbers)
    });
    return (await data.json()) ?? [];
  }

  getArticleTable(articlenumbers: string[]): Observable<any> { 
    const url = this.baseUrl + "/ocd/special/article_data"
    return this.http.post(url, articlenumbers)
    //return this.http.get(url, {responseType: 'json'}) 
  }

  getHelloWorld(): Observable<any> {
    const url = "http://192.168.178.191:5000/"
    return this.http.get<any>(url)
  }

  getStream(): Observable<any>  {
    /*
    working EventSoure Example
    see: https://developer.mozilla.org/en-US/docs/Web/API/EventSource?retiredLocale=de
    */
    const url = "http://192.168.178.191:5000/progress"

    var source = new Subject();

    const evtSource = new EventSource(url);

    const parseMyEvent = (evt: Event) => {
      
      const messageEvent = (evt as MessageEvent);  // <== This line is Important!!
      const value = messageEvent.data
      source.next(value)

    }

    evtSource.onmessage = parseMyEvent

    return source.asObservable()

  }
  
  postArticlesAndThenListen(articlenumbers: string[]): Observable<any>  {
    /*
    1. HTTP POST Request to store list of articlernumbers in session
    2. Listen to Server Side Events table by table
    */

    var source = new Subject()

    const urlPost = "http://192.168.178.191:5000/post_articlenumbers_to_session" 
    const urlGet = "http://192.168.178.191:5000/progress"
    const data = articlenumbers
    
    const parseMyEvent = (evt: Event) => {
      const messageEvent = (evt as MessageEvent);  // <== This line is Important!!    
      const value = messageEvent.data
      source.next(value)
    }

    this.http.post<any>(urlPost, data).subscribe(_ => {
      const evtSource = new EventSource(urlGet);
      evtSource.onmessage = parseMyEvent
    })
    
    return source.asObservable()

  }

  getTablesStreamed(articlenumbers: string[]): Observable<any> {
    console.log("getTablesStreamed")
    const url = this.baseUrl + "/stream"

    return new Observable<number>((observer) => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        console.log("onmessage!!")
        const number = parseInt(event.data, 10);
        observer.next(number);
      };

      eventSource.onerror = (error) => {
        console.log("onerror!!", error)
        eventSource.close();
        observer.error('Error occurred: ' + error);
      };

      return () => {
        // Cleanup when the component is destroyed
        eventSource.close();
      };
    });
  }

    //console.log("getTablesStreamed")
    //const url = this.baseUrl + "/stream_test"
    //return this.http.get<any>(url)
    //return this.http.post<any>(url, articlenumbers)
} 
 
