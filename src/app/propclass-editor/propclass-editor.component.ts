import { Component, Input, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {PropClassService, Result } from '../services/prop-class.service'

@Component({
  selector: 'app-propclass-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './propclass-editor.component.html',
  styleUrl: './propclass-editor.component.css'
})
export class PropclassEditorComponent implements OnInit  {
@Input() programNameInput!: string
@Input() propClassNameInput!: string

propertyResult: Result = []

constructor(private route: ActivatedRoute,
  private service: PropClassService) {}

ngOnInit() {
  this.route.params.subscribe((params) => {
    this.programNameInput = params['programNameInput']
    this.propClassNameInput = params['propClassNameInput']

    this.service.getPropsResult(this.programNameInput, this.propClassNameInput).subscribe((x: Result) => {

      console.log("getPropsResult")
      console.log(x[0])
      this.propertyResult = x

    })



  });
}

}
