import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { BaseService } from './base.service'
import { ProgramMap, ArtbaseItem, ArticleItem, PropertyItem, PropValueItem } from './../models/models'

@Injectable({
  providedIn: 'root'
})
export class ArticleInputService extends BaseService {

  programMap: ProgramMap = new ProgramMap()

  hasProgramData = () => this.programMap.size > 0

  fetchProgramMap(articlenumbers: string[]): Observable<ProgramMap> {

    const url = this.baseUrl + "/ocd/article_compact"
    return this.http.post<ProgramMap>(url, articlenumbers)
      .pipe(map((result: Object) => {
        this.programMap = new ProgramMap(result)
        return this.programMap
      }))
  }

  async fetchAndSetArtbase(articleItem: ArticleItem): Promise<void> {
    if (articleItem.artbaseFetched)
      return

    const url = this.baseUrl + "/ocd/table/" + articleItem.program + "/ocd_artbase/article_nr/" + articleItem.articleNr
    console.log("getArtbase :: ", url);
    const response = await fetch(url)
    console.log("response", response);
    const items = await response.json()
    console.log("items", items);
    articleItem.artbaseItems = items.map((x: any) => new ArtbaseItem(x["article_nr"], x["prop_class"], x["property"], x["prop_value"]))
    articleItem.artbaseFetched = true
  }

  async fetchPropertiesFromArticleItem(articleItem: ArticleItem): Promise<PropertyItem[][]> {

    const props: PropertyItem[][] = await Promise.all(articleItem.pClasses.map(pClass => {
      const storedPropertyItems = this.programMap.getPropItems(articleItem.program, pClass)
      return Boolean(storedPropertyItems) ? storedPropertyItems!! : this.fetchProperties(articleItem.program, pClass)

    }))
    return props
  }

  async fetchProperties(program: string, pClass: string): Promise<PropertyItem[]> {


    const storedPropItems = this.programMap.getPropItems(program, pClass)
    if (Boolean(storedPropItems))
      return storedPropItems!!

    // set key in map indicating properties are currently getting fetched
    // without this artbase-all fetches the same pClass for EVERY article!!!
    this.programMap.setPropItems(program, pClass, []) 

    const url = this.baseUrl + "/ocd/props_compact/" + program + "/" + pClass
    //console.log("fetchProperties", url);

    const response = await fetch(url)
    const items = await response.json()
    const propItems = items.map((item: any) =>
      new PropertyItem(item["property_name"],
        item["prop_text"],
        item["values"].map((valItem: any) => new PropValueItem(valItem["v"], valItem["text"], true, false)),
        true)
    )

    this.programMap.setPropItems(program, pClass, propItems)
    //console.log("propItems", program, pClass);
    return propItems

  }

  /*getArticleTable(articlenumbers: string[]): Observable<any> {
    const url = this.baseUrl + "/ocd/special/article_data"
    return this.http.post(url, articlenumbers)
  }*/
}
/*
getHelloWorld(): Observable<any> {
  const url = "http://192.168.178.191:5000/"
  return this.http.get<any>(url)
}

getStream(): Observable<any> {
  
  //working EventSoure Example
  // see: https://developer.mozilla.org/en-US/docs/Web/API/EventSource?retiredLocale=de
  
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

postArticlesAndThenListen(articlenumbers: string[]): Observable<any> {
  
  //1. HTTP POST Request to store list of articlernumbers in session
  // 2. Listen to Server Side Events table by table
  

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


getPropClassesForArticles(program: string, article: string): string[] {
  const propClassesProgram: string[] = Object.keys(this.fetchedArticles[program])
  let propClassesArticle: string[] = []
  propClassesProgram.forEach(pClass => {
    const articleItems: Item[] = this.fetchedArticles[program][pClass]
    articleItems.forEach((articleItem: Item) => {

      if (articleItem.article_nr === article) {
        propClassesArticle.push(pClass)
      }

    })
  })
  return propClassesArticle
}

}
*/
