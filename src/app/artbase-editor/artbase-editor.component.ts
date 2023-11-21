import { Component, Inject, Input, OnInit, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyEditorService } from '../services/property-editor.service';
import { PropClassService, PropertyItem, PropValueItem } from '../services/prop-class.service';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {FormsModule} from '@angular/forms';
import {MatExpansionModule, MatAccordion} from '@angular/material/expansion'; 
import { ArticleInputService, Result, Item } from '../services/article-input.service';
import { log } from 'node:console';

type PropClass2PropsMap = Map<string, PropertyItem[]>

@Component({
  selector: 'app-artbase-editor',
  standalone: true,
  imports: [CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
  ],
  templateUrl: './artbase-editor.component.html',
  styleUrl: './artbase-editor.component.css'
})
export class ArtbaseEditorComponent implements OnInit, OnDestroy  { 

  @Input() programNameInput!: string
  @Input() articleInput!: string
  @Input() propClassInput!: string

  propClass2PropsMap: PropClass2PropsMap = new Map()
  artbase: any[] = []
  propClass2Prop2Values: Map<string, Map<string, any[]>> = new Map()

  private service = inject(PropertyEditorService);
  private route = inject(ActivatedRoute)
  private propClassService = inject(PropClassService)
  private articleInputService = inject(ArticleInputService)
  
  ngOnDestroy(): void {
    
    console.log("Artbase :: ngOnDestroy");
    
    Array.from(this.propClass2PropsMap.keys()).forEach( (pClass: string) => {
      console.log("k", pClass)
      this.propClassService.saveChanges(this.programNameInput, pClass, this.propClass2PropsMap.get(pClass)!!)
    });

    //console.log("this.propClass2PropsMap.keys() 2", typeof Object.keys(this.propClass2PropsMap));
    
    /*this.propClass2PropsMap.keys().forEach(pClass => {
      this.propClassService.saveChanges(this.programNameInput, this.propClassNameInput, this.propertyResult)
    });*/
    
  }


getPropsResult(pClass: string) {

  // console.log("getPropsResult for Class=", pClass);
 

  this.propClassService
  .getPropsResult(this.programNameInput, pClass)
  .subscribe((x: PropertyItem[]) => {
    
    
    if (!this.propClassService.hasChanges(this.programNameInput, pClass)) {
      let temp: PropertyItem[] = []
      x.forEach( a => {
        a.active = true
        a.values.forEach(b => {b.active = true})
        temp.push(new PropertyItem(a.property_name, a.prop_text, a.values, a.active)) 
        a.values.forEach(v => {

          const isArtbase = Boolean(
            this.propClass2Prop2Values.
          get(pClass)?.get(a.property_name)?.find(x => x.prop_value == v.v)
          )
          // console.log("isArtbase", pClass, a.property_name, v.v, isArtbase);
          
          v.isArtbase = isArtbase
        })

      })
      this.propClass2PropsMap.set(pClass, temp)
    } else {
      this.propClass2PropsMap.set(pClass, x)
    }

    console.log("Got properties for", pClass);
    

  })

}
  
ngOnInit() {
  this.route.params.subscribe((params) => {
    this.programNameInput = params['programNameInput']
      this.articleInput = params['articleInput']
      this.propClassInput = params['propClassInput']

      this.service.getArtbase(this.programNameInput, this.articleInput).subscribe( (result: any[]) => {
        this.artbase = result

        this.artbase.forEach(row => {
          if (!this.propClass2Prop2Values.has(row.prop_class))
            this.propClass2Prop2Values.set(row.prop_class, new Map())
          
          if (!this.propClass2Prop2Values.get(row.prop_class)!!.has(row.property))
            this.propClass2Prop2Values.get(row.prop_class)!!.set(row.property, [])
          
            this.propClass2Prop2Values.get(row.prop_class)!!.get(row.property)!!.push(row)
            console.log("PUSH::", row.prop_class, row.property, row);
            
        })

      console.log("propClass2Prop2Values ::: ", this.propClass2Prop2Values)
        console.log("artbase:::", this.artbase)
        
        // get all the propClasses from the data we already have fetched for this article and this program
        const pClasses = this.articleInputService.
        getPropClassesForArticles(this.programNameInput, this.articleInput)
        // console.log("propClassesArticle", pClasses);
        pClasses.forEach(x => { this.getPropsResult(x) })


    
      }) 

      
 
  });
}


 /* ngOnInit(): void {
    console.log("PropertyEditorComponent::ngOnInit", this.programNameInput, this.articleInput);
    
    this.route.params.subscribe((params) => {
      this.programNameInput = params['programNameInput']
      this.articleInput = params['articleInput']
      this.propClassInput = params['propClassInput']
      
      this.service.getArtbase(this.programNameInput, this.articleInput).subscribe( result => {
        this.values = result
        console.log("ARTBASE");
        console.log(result);
        
        
      }) 

      this.service.getPropsResult(this.programNameInput, this.propClassInput).subscribe( (result: any) => {
       
        const nestedValues = new Map<string, any[]>();
        result.forEach((element: any) => {
          const prop = element["property"]
          console.log(element["scope"]);
          
          if (!nestedValues.has(prop))
            nestedValues.set(prop, [])
            nestedValues.get(prop)?.push(element)
          
        });
       
        
        this.nestedValues = nestedValues
      })
    
    });


   
  }
  */

}
