import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { log } from 'node:console';
import { Observable, map, of } from 'rxjs';
import { BaseService} from './base.service'

@Injectable({
  providedIn: 'root'
})
export class ArtbaseEditorService extends BaseService { }

  
/*
  // ArtbaseChanges :: program -> article -> ArtbaseItem[]
  changes: Map<string, Map<string, ArtbaseItem[]>> = new Map()

  hardCodedChanges: Map<string, Map<string, ArtbaseItem[]>> = new Map()

  saveChanges(program: string, article: string, changes: ArtbaseItem[]) {
    // make sure mapping path exists
    if (!this.changes.has(program))
      this.changes.set(program, new Map())

    // add changes to map
    this.changes.get(program)!!.set(article, changes)
  }

  hasChanges(program: string, article: string) {
    return Boolean(this.changes.get(program)?.get(article))
  }

  getArtbase(program: string, article: string): Observable<ArtbaseItem[]> {

    // check if article has entrie in hard-coded artbase 
    // and add entries to this artbase
    // and then remove the entries from hard-coded artbase for this article so it can be overwritten

    // has hard-coded entries?
    const hardCodedArtbase = this.hardCodedChanges.get(program)?.get(article)
    const hasHardCodedChanges = Boolean(hardCodedArtbase)
    console.log("getArtbase for", program, article, "hardCodedArtbase:::")
    console.log(hardCodedArtbase)

    let artbase: Observable<ArtbaseItem[]>
    if (this.hasChanges(program, article)) {
      artbase = of(this.changes.get(program)!!.get(article)!!)
    } else {
      const url = this.baseUrl + "/ocd/table/" + program + "/ocd_artbase/article_nr/" + article
      console.log("getArtbase :: ", url);
      artbase = this.http.get<ArtbaseItem[]>(url)
    }

    if (!hasHardCodedChanges)
      return artbase
    else
      return artbase.pipe(map((entries: ArtbaseItem[]) => {
        this.hardCodedChanges.get(program)?.delete(article)
        const updatedArtbase = [...entries, ...hardCodedArtbase as ArtbaseItem[]]
        // TODO: make updatedArtbase unique by
        
        prop_class: string
        property: string
        prop_value: string

        combination
        
        return updatedArtbase
      }))
  }

  getPropsResult(program: string, propClass: string) {
    const url = this.baseUrl + "/ocd/props_compact/" + program + "/" + propClass
    console.log("getPropsResult :: ", url);
    return this.http.get(url)
  }

}
*/