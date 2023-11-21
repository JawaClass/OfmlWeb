import { Component, Inject, Input, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyEditorService } from '../services/property-editor.service';
import { PropClassService, PropertyItem } from '../services/prop-class.service';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {FormsModule} from '@angular/forms';
import {MatExpansionModule, MatAccordion} from '@angular/material/expansion'; 
import { ArticleInputService, Result, Item } from '../services/article-input.service';

@Component({
  selector: 'app-property-editor',
  standalone: true,
  imports: [CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
  ],
  templateUrl: './property-editor.component.html',
  styleUrl: './property-editor.component.css'
})
export class PropertyEditorComponent implements OnInit  { 

  @Input() programNameInput!: string
  @Input() articleInput!: string
  @Input() propClassInput!: string
  //values: any = []
  //nestedValues = new Map<string, any[]>();
  propertyResult: PropertyItem[] = []

  private service = inject(PropertyEditorService);
  private route = inject(ActivatedRoute)
  private propClassService = inject(PropClassService)
  private articleInputService = inject(ArticleInputService)
  
  isSelected(property: string, value: string) {
    //console.log("isSelected", property, value);
    // console.log(this.values);
    return false
    
  }

getPropsResult(pClass: string) {

  console.log("getPropsResult for Class=", pClass);
 

  this.propClassService
  .getPropsResult(this.programNameInput, pClass)
  .subscribe((x: PropertyItem[]) => {
    
   /*
    if (!this.propClassService.hasChanges(this.programNameInput, pClass)) {
      let temp: PropertyItem[] = []
      x.forEach( a => {
        a.active = true
        a.values.forEach(b => {b.active = true})
        temp.push(new PropertyItem(a.property_name, a.prop_text, a.values, a.active)) 
      })
      this.propertyResult = temp
    } else {
      this.propertyResult = x
    }
    
    */

    console.log("Got properties for", pClass);
    

  })

}
  
ngOnInit() {
  this.route.params.subscribe((params) => {
    this.programNameInput = params['programNameInput']
      this.articleInput = params['articleInput']
      this.propClassInput = params['propClassInput']

       // get all the propClasses from the data we already have fetched for this article and this program
      const pClasses = this.articleInputService.getPropClassesForArticles(this.programNameInput, this.articleInput)
      console.log("propClassesArticle", pClasses);
      pClasses.forEach(x => { this.getPropsResult(x) })
 
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
