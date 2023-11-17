import { Component, Input, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCompact } from '../services/article-input.service'
@Component({
  selector: 'app-property-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-editor.component.html',
  styleUrl: './property-editor.component.css'
})
export class PropertyEditorComponent {
  @Input({required: true}) articleCompact!: ArticleCompact;

  constructor() {
    console.log("PropertyEditorComponent.constructor()", this.articleCompact)
  }

  ngOnInit() {
    console.log("PropertyEditorComponent.ngOnInit()", this.articleCompact)
 }

}
