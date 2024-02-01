import { Component, Inject, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxModule, MatCheckboxChange} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ArticleInputService } from '../services/article-input.service';
import { ArticleitemService } from '../services/articleitem.service';
import { ArtbaseService } from '../services/artbase.service';
import { ArtbaseItem, ArticleItem, PropertyItem, PropValueItem } from '../models/models';
import { RouterModule, Router } from '@angular/router';
import { WaitingCursorComponent } from './../waiting-cursor/waiting-cursor.component'
import { MatTooltipModule } from '@angular/material/tooltip';
import { PropclassEditorComponent } from './../propclass-editor/propclass-editor.component'
import { Artbase4proplassComponent } from './artbase4proplass/artbase4proplass.component'

@Component({
  selector: 'app-artbase-editor',
  standalone: true,
  imports: [CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
    RouterModule,
    WaitingCursorComponent,
    MatTooltipModule,
    PropclassEditorComponent,
    Artbase4proplassComponent
  ],
  templateUrl: './artbase-editor.component.html',
  styleUrl: './artbase-editor.component.css'
})
export class ArtbaseEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  private service = inject(ArticleInputService)
  private articleitemService = inject(ArticleitemService)
  private artbaseService = inject(ArtbaseService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  articleItem!: any
  isFetchingData = false

  ngAfterViewInit() {
    const elem = document.querySelector('.mat-sidenav-content')
    elem!!.scroll(
      {
        left: 0,
        top: 0,
        behavior: 'instant',
      }
    )
  }

  onToggleAll(propItem: PropertyItem, e: MatCheckboxChange) {
    propItem.setAllArtbase(e.checked)
    this.articleItem.edited = true
  }

  onToggle(valItem: PropValueItem, e: MatCheckboxChange) {
    this.articleItem.edited = true
  }

  /*
  setArtbaseOnStart() {
    this.articleItem.artbaseItems.forEach(item => {
      this.getPropItems(item.pClass).forEach(propItem => {
        if (propItem.property === item.property) {
          propItem.values.forEach(valueItem => {
            if (valueItem.value === item.value) {
              valueItem.isArtbase = true
            }
          })
        }
      })
    })
  }
   */

 /*
  setArtbaseOnLeave() {
    let newArtbase: ArtbaseItem[] = []
    // create new artbase items according to user selection
    this.articleItem.pClasses.forEach(pClass => {
      this.getPropItems(pClass).forEach(propItem => {
        propItem.values.forEach(valueItem => {
          if (valueItem.isArtbase) {
            newArtbase.push(new ArtbaseItem(this.articleItem.articleNr, pClass, propItem.property, valueItem.value))
            // ----- this.articleItem.edited = true
          }
        });
        // reset property Artbase
        propItem.setAllArtbase(false)
      })
    })
    
    this.articleItem.artbaseItems = newArtbase
    
    this.articleitemService.saveArticleItem(this.articleItem)
  }
 */

*ngOnDestroy() {
   // if (Boolean(this.articleItem))
    //  this.setArtbaseOnLeave()
  }

  getPropClasses() {
    if (!this.articleItem) return []
    else return this.articleItem.klassen
  }


  ngOnInit() {
    this.artbaseService.currentArticleItem$.subscribe(item => {
      if (!item) {
        this.router.navigate(['/'])
      }
      console.log("ArtbaseEditor INIT ::", item)
      console.log(item.klassen)
      this.articleItem = item
    })
    /**
    this.route.params.subscribe(async (params) => {
      const articleNr = params['articleNr']
      const program = params['program']

      if (!articleNr || !program)
        this.router.navigate(['/'])
      
        console.log("fetch Artbase", articleNr, program);
        
       
         * 
      const articleItem = this.service.programMap.getArticleRef(program, articleNr)
      console.log("ArtbaseEditorComponent articleItem", articleItem);

      
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
        
    }) */
  }

  getPropItems(pClass: string): PropertyItem[] {
    return this.service.programMap.getPropItems(this.articleItem.program, pClass)!!
  }
}
 