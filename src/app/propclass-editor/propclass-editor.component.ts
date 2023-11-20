import { Component, Input, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {PropClassService,  PropertyItem } from '../services/prop-class.service'
import { ToggleButtonComponent } from './../toggle-button/toggle-button.component'
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {FormsModule} from '@angular/forms';
import {MatExpansionModule, MatAccordion} from '@angular/material/expansion'; 

@Component({
  selector: 'app-propclass-editor',
  standalone: true,
  imports: [CommonModule,
    ToggleButtonComponent,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
  ],
  templateUrl: './propclass-editor.component.html',
  styleUrl: './propclass-editor.component.css'
})
export class PropclassEditorComponent implements OnInit, OnDestroy  {

  @Input() programNameInput!: string
  @Input() propClassNameInput!: string
 

propertyResult: PropertyItem[] = []

constructor(private route: ActivatedRoute,
  private service: PropClassService) {}

  onChangeAll(x: PropertyItem, event: any) {
  x.values.forEach(x => { x.active = event.checked })
}

ngOnDestroy(): void {
  this.service.saveChanges(this.programNameInput, this.propClassNameInput, this.propertyResult)
}

ngOnInit() {
  this.route.params.subscribe((params) => {
    this.programNameInput = params['programNameInput']
    this.propClassNameInput = params['propClassNameInput']
 
    this.service.getPropsResult(this.programNameInput, this.propClassNameInput).subscribe((x: PropertyItem[]) => {
      
      if (!this.service.hasChanges(this.programNameInput, this.propClassNameInput)) {
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
      
      
      console.log("SET ---- this.propertyResult = temp");
      

    })
  });
}

}
