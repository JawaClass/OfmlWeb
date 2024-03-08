import { Component } from '@angular/core';
import { PropclassEditorComponent } from '../propclass-editor/propclass-editor.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-propclass-viewer',
  standalone: true,
  imports: [
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
