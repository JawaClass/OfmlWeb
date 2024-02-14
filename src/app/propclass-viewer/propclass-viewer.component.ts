import { Component } from '@angular/core';
import { PropclassEditorComponent } from '../propclass-editor/propclass-editor.component'
import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ArticleInputService } from '../services/article-input.service';
import { PropertyitemService } from '../services/propertyitem.service';
import { RouterModule, Router } from '@angular/router';
import { PropertyClass, PropertyItem, PropValueItem } from '../models/models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getTextFromProperty } from '../models/helper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-propclass-viewer',
  standalone: true,
  imports: [
    WaitingCursorComponent,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatProgressSpinnerModule

  ],
  templateUrl: './propclass-viewer.component.html',
  styleUrl: './propclass-viewer.component.css'
})
export class PropclassViewerComponent extends PropclassEditorComponent {

}
