import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtbaseEditorService } from '../services/artbase-editor.service';
import { PropClassService } from '../services/prop-class.service';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { ArticleInputService } from '../services/article-input.service';
import { log } from 'node:console';
import { ArtbaseItem, ArticleItem, PropertyItem } from '../models/models';
import { RouterModule, Router } from '@angular/router';
import { WaitingCursorComponent } from './../waiting-cursor/waiting-cursor.component'
//type PropClass2PropsMap = Map<string, PropertyItem[]>

@Component({
  selector: 'app-artbase-editor',
  standalone: true,
  imports: [CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
    RouterModule,
    WaitingCursorComponent,
  ],
  templateUrl: './artbase-editor.component.html',
  styleUrl: './artbase-editor.component.css'
})
export class ArtbaseEditorComponent implements OnInit, OnDestroy {

  private service = inject(ArticleInputService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  articleItem!: ArticleItem
  isFetchingData = false

  setArtbaseOnStart() {
    this.articleItem.artbaseItems.forEach(item => {
      this.getPropItems(item.pClass).forEach(propItem => {
        if (propItem.property === item.property) {
          propItem.values.forEach(valueItem => {
            if (valueItem.value === item.value) {
              valueItem.isArtbase = true
            }
          });
        }
      })
    })
  }

  setArtbaseOnLeave() {
    let newArtbase: ArtbaseItem[] = []
    // create new artbase items according to user selection
    this.articleItem.pClasses.forEach(pClass => {
      this.getPropItems(pClass).forEach(propItem => {
        propItem.values.forEach(valueItem => {
          if (valueItem.isArtbase) {
            newArtbase.push(new ArtbaseItem(this.articleItem.articleNr, pClass, propItem.property, valueItem.value))
          }
        });
        // reset property Artbase
        propItem.setAllArtbase(false)
      })
    })
    this.articleItem.artbaseItems = newArtbase
  }

  ngOnDestroy(): void {
    if (Boolean(this.articleItem))
      this.setArtbaseOnLeave()
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      const articleNr = params['articleNr']
      const program = params['program']
      const articleItem = this.service.programMap.getArticleRef(program, articleNr)
      console.log("ArtbaseEditorComponent articleItem", articleItem);

      if (!Boolean(articleItem))
        this.router.navigate(['/'])
      else {
        this.articleItem = articleItem!!
        this.articleItem.seen = true
        console.log("fetch start");
        this.isFetchingData = true
        await this.service.fetchAndSetArtbase(this.articleItem)
        await this.service.fetchPropertiesFromArticleItem(this.articleItem)
        this.isFetchingData = false
        console.log("fetch end");
        this.setArtbaseOnStart()
      }
    })
  }

  getPropItems(pClass: string): PropertyItem[] {
    return this.service.programMap.getPropItems(this.articleItem.program, pClass)!!
  }
}

/*


  propClass2PropsMap: PropClass2PropsMap = new Map()
  // propClass -> Prop -> Values
  artbase: Map<string, Map<string, any[]>> = new Map()

  ngOnDestroy(): void {

    //console.log("Artbase :: ngOnDestroy");
    let tempChanges: ArtbaseItem[] = []
    Array.from(this.propClass2PropsMap.keys()).forEach((pClass: string) => {
      //console.log("k", pClass)
      const changes: PropertyItem[] = Array.from(this.propClass2PropsMap.get(pClass)!!)
      console.log("changes", changes);
      changes.forEach(pItem => {
        pItem.values.forEach(value => {
          if (value.isArtbase) {

            const artbaseItem: ArtbaseItem = {
              article_nr: this.article,
              prop_class: pClass,
              prop_value: value.v,
              property: pItem.property_name
            }
            tempChanges.push(artbaseItem)

          }
        })
      })

    });

    this.service.saveChanges(this.program, this.article, tempChanges)
  }


  getPropsResult(pClass: string) {

    this.propClassService
      .getPropsResult(this.program, pClass)
      .subscribe((xOrig: PropertyItem[]) => {
        let x = xOrig//structuredClone(xOrig)

        let temp: PropertyItem[] = []
        x.forEach(a => {
          temp.push(new PropertyItem(a.property_name, a.prop_text, a.values, a.active))
          a.values.forEach(v => {

            const isArtbase = Boolean(
              this.artbase.
                get(pClass)?.get(a.property_name)?.find(x => x.prop_value == v.v)
            )

            v.isArtbase = isArtbase
          })

        })
        this.propClass2PropsMap.set(pClass, temp)

      })

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.program = params['program']
      this.article = params['article']

      this.service.getArtbase(this.program, this.article).subscribe((artbase: ArtbaseItem[]) => {

        console.log("artbase entries....", artbase.length);

        artbase.forEach((row: ArtbaseItem) => {

          if (!this.artbase.has(row.prop_class))
            this.artbase.set(row.prop_class, new Map())

          if (!this.artbase.get(row.prop_class)!!.has(row.property))
            this.artbase.get(row.prop_class)!!.set(row.property, [])

          this.artbase.get(row.prop_class)!!.get(row.property)!!.push(row)
          console.log("PUSH artbase::", row.prop_class, row.property, row);

        })

        //console.log("propClass2Prop2Values ::: ", this.propClass2Prop2Values)

        // get all the propClasses from the data we already have fetched for this article and this program
        const pClasses = this.articleInputService.
          getPropClassesForArticles(this.program, this.article)
        // console.log("propClassesArticle", pClasses);
        pClasses.forEach(x => { this.getPropsResult(x) })

      })
    });
  }*/
//}
