import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { BaseService } from './base.service'
import { ProgramMap, ArtbaseItem, ArticleItem, PropertyItem, PropValueItem } from './../models/models'
import { shared_data } from '../shared-data'
import { ArticleInputService } from '../services/article-input.service';
import { inject } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SaveChangesService extends BaseService {

  service = inject(ArticleInputService)
   
  async deleteSession(name: string): Promise<void> {
    const owner = shared_data.owner
    const url = this.baseUrl + "/ocd/create/delete_session/" + owner + "/" + name

    const requestOptions = this.buildDeleteRequestOptions(name)

    await fetch(url, requestOptions)
  }

   async fetchSessionNames(): Promise<string[]> {
    const owner = shared_data.owner
    if (!owner) return []
    
    const url = this.baseUrl + "/ocd/create/fetch/sessions/" + owner
    const response = await fetch(url)
    const sessions: string[] = await response.json()
    return sessions
   }

  async savePropertyItems(propertyItems: PropertyItem[], program: string, pClass: string): Promise<any> {
    const url = this.baseUrl + "/ocd/create/save/property_items"

    const owner = shared_data.owner
    const sessionName = shared_data.sessionName

    const requestOptions = this.buildPostRequestOptions(
      JSON.stringify({
        owner: owner,
        sessionName: sessionName,
        program: program,
        pClass: pClass,
        propertyItems: propertyItems.map(item => item.jsonify()) 
      })
    )

    await fetch(url, requestOptions)

  }
  async fetchAndSetSessionData(): Promise<void> {
    console.log("SERVICE : fetchAndSetSessionData____:");
    
    const data = await Promise.all(
      [
        this.fetchArticleItems(),
        this.fetchPropertyItems()
      ]
    )

    const articleItems = data[0]
    const propertyItems = data[1] 
    //console.log("articleItems:: ", articleItems)
    //console.log("propertyItems:: ", propertyItems)
    articleItems.forEach(item => {
      console.log(item)
    })

    propertyItems.forEach(item => {
      console.log(item)
    })
    
    this.service.programMap.updateWithItems(articleItems, propertyItems)
  }

  async fetchPropertyItems(): Promise<PropertyItem[]> {
    const owner = shared_data.owner
    const sessionName = shared_data.sessionName
    const url = this.baseUrl + "/ocd/create/fetch/property_items/" + owner + "/" + sessionName
    const response = await fetch(url)
    const property_items: any[] = await response.json()
    return property_items.map(item => PropertyItem.fromJSON(item))
  }

  async fetchArticleItems(): Promise<ArticleItem[]> {
    const owner = shared_data.owner
    const sessionName = shared_data.sessionName
    const url = this.baseUrl + "/ocd/create/fetch/article_item/" + owner + "/" + sessionName
    console.log("fetchArticleItems ::", url)
    const response = await fetch(url)
    const article_items: any[] = await response.json()
    return article_items.map(item => ArticleItem.fromJSON(item))
  }

  async saveArticleItem(articleItem: ArticleItem): Promise<any> {
    const url = this.baseUrl + "/ocd/create/save/article_item"
    
    const owner = shared_data.owner
    const sessionName = shared_data.sessionName

    console.log("saveArticleItem :: url", url)
    
    const requestOptions = this.buildPostRequestOptions(
      JSON.stringify({
        owner: owner,
        sessionName: sessionName,
        article: articleItem.articleNr,
        articleItem: articleItem.jsonify()
      })
    )
    console.log("ArticleItem::jsonify", requestOptions.body)

    await fetch(url, requestOptions)
    console.log("ArticleItem Saved!!!", articleItem.articleNr, articleItem.articleNrAlias);
    

  }

  private buildPostRequestOptions(body: string) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body, 
    }
  }

  private buildDeleteRequestOptions(body: string) {
    return {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body, 
    }
  }

}
