import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PropClassService } from '../services/prop-class.service'
import { ToggleButtonComponent } from './../toggle-button/toggle-button.component'
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ArticleInputService } from '../services/article-input.service';
import { RouterModule, Router } from '@angular/router';
import { PropertyItem, PropValueItem } from '../models/models';
import { WaitingCursorComponent } from '../waiting-cursor/waiting-cursor.component'


@Component({
  selector: 'app-propclass-editor',
  standalone: true,
  imports: [CommonModule,
    ToggleButtonComponent,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule, RouterModule, WaitingCursorComponent
  ],
  templateUrl: './propclass-editor.component.html',
  styleUrl: './propclass-editor.component.css'
})
export class PropclassEditorComponent implements OnInit {

  @Input() program!: string
  @Input() pClass!: string

  route = inject(ActivatedRoute)
  service = inject(ArticleInputService)
  private router = inject(Router)

  emptyPlaceholder = ""
  isLoading = false

  async ngOnInit() {
    if (!this.service.hasProgramData())
      this.router.navigate(['/'])

    this.route.params.subscribe(async (params) => {
      this.program = params['program']
      this.pClass = params['propClass']
      this.service.programMap.getPropClass(this.program, this.pClass)!!.seen = true
      this.isLoading = true
      await this.service.fetchProperties(this.program, this.pClass)
      this.isLoading = false
      if (this.getPropItems()?.length == 0)
        this.emptyPlaceholder = "Leere Klasse"

    })

  }

  getPropItems = () => this.service.programMap.getPropItems(this.program, this.pClass)

  onChangeAll(x: PropertyItem, event: any) {
    x.values.forEach((x: PropValueItem) => { x.active = event.checked })
  }

  onMatCheckBoxClick(event: PointerEvent | MouseEvent) {
    event.stopPropagation()
  }

}
