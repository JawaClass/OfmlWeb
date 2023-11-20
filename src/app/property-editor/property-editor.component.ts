import { Component, Input, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyEditorService } from '../services/property-editor.service';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-editor.component.html',
  styleUrl: './property-editor.component.css'
})
export class PropertyEditorComponent implements OnInit  { 

  @Input() programNameInput!: string
  @Input() articleInput!: string
  @Input() propClassInput!: string
  values: any = []
  nestedValues = new Map<string, any[]>();

  private service = inject(PropertyEditorService);
  private route = inject(ActivatedRoute)
  
  isSelected(property: string, value: string) {
    //console.log("isSelected", property, value);
    // console.log(this.values);
    return false
    
  }

  ngOnInit(): void {
    console.log("PropertyEditorComponent::ngOnInit", this.programNameInput, this.articleInput);
    
    this.route.params.subscribe((params) => {
      this.programNameInput = params['programNameInput']
      this.articleInput = params['articleInput']
      this.propClassInput = params['propClassInput']
      
      this.service.getArtbase(this.programNameInput, this.articleInput).subscribe( result => {
        this.values = result
        console.log("ARTBASE");
        //console.log(result);
        
        
      })

      this.service.getArtbase(this.programNameInput, this.propClassInput).subscribe( (result: any) => {
       
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
  

}
