import { Component, Input, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropclassEditorComponent } from './../../propclass-editor/propclass-editor.component'
import { ArtbaseService } from '../../services/artbase.service';

@Component({
  selector: 'app-artbase4proplass',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artbase4proplass.component.html',
  styleUrl: './artbase4proplass.component.css'
})
export class Artbase4proplassComponent extends PropclassEditorComponent {
  
  @Input() override program!: string
  @Input() override pClass!: string
  @Input() articleItem!: any
  private artbaseService = inject(ArtbaseService)
  

  override async ngOnInit() {
    console.log("Artbase4proplassComponent::ngOnInit")
    await super.ngOnInit()
    
    const artbase4PropClass = await this.artbaseService.fetchArtbaseFromPropClass(this.pClass)
    console.log("artbase4PropClass", artbase4PropClass);
    
    // call 2 promises 
    // 1. propclass from PropclassEditorComponent::ngOnInit
    // 2. localhost:5000/web_ofml/ocd/web_ocd_artbase?where=web_program_name="TEST_2" AND article_nr = "WPBTT" AND prop_class = "TischBESPRECHUNG_Masse"
  }
}
