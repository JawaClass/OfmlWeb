import { Component, Input, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropclassEditorComponent } from '../../../property/propclass-editor/propclass-editor.component'
import { ArtbaseService } from '../../artbase.service';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface ArtbaseValueContainer {
  item: any,
  isArtbase: boolean
}

@Component({
  selector: 'app-artbase4proplass',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './artbase4proplass.component.html',
  styleUrl: './artbase4proplass.component.css'
})
export class Artbase4proplassComponent extends PropclassEditorComponent {
  
  @Input() override program!: string
  @Input() override pClass!: string
  @Input() articleItem!: any
  private artbaseService = inject(ArtbaseService)

  private isValItemArtbase(valItem: any, artbase: any[]) {
    return artbase.find(item => item.property === valItem.property && item.prop_value === valItem.value_from)
  }

  getArtbaseItems4Property(propItem: any) {
    return propItem.values.filter((item: any) => item.isArtbase)
  }

  override async ngOnInit() {
    console.log("Artbase4proplassComponent::ngOnInit")
    await super.ngOnInit()
    const artbase4PropClass = await this.artbaseService.fetchArtbaseFromPropClass(this.pClass)
    const properties4PropClass = this.getProperties()
    properties4PropClass.forEach(propItem => {
      propItem.values = propItem.values
      .map((valueItem: any) => (
        {
          item: valueItem,
          isArtbase: this.isValItemArtbase(valueItem, artbase4PropClass)
        }
      ) as ArtbaseValueContainer)
    })
  }
  private makeArtbaseEntry(
    articleNr: string,
    pClass: string,
    property: string,
    value: string | number,
    sqlProgram: string,
    webProgram: string) {
      return {
        "article_nr": articleNr,
        "prop_class": pClass,
        "property": property,
        "prop_value": value,
        "sql_db_program": sqlProgram,
        "web_program_name": webProgram,
        "web_filter": 0,
      }
  }

  async onArtbaseValueChange(artbaseValueItem: any) {
    artbaseValueItem["isUpdating"] = true
    if (artbaseValueItem.isArtbase) {
      await this.artbaseService.createArtbaseEntry(
        this.makeArtbaseEntry(
          this.articleItem.article_nr,
          artbaseValueItem.item.prop_class,
          artbaseValueItem.item.property,
          artbaseValueItem.item.value_from,
          artbaseValueItem.item.sql_db_program,
          artbaseValueItem.item.web_program_name
          )
      )
    } else {
      await this.artbaseService.deleteArtbaseEntry(
        artbaseValueItem.item.web_program_name,
        this.articleItem.article_nr,
        artbaseValueItem.item.property, 
        artbaseValueItem.item.value_from
        )
    }
    setTimeout(() => {artbaseValueItem["isUpdating"] = false}, 300)
  }

  async setAllArtbaseValues(propItem: any, artbaseValue: boolean, event: any) {
    event.stopPropagation()
    console.log("setAllArtbaseValues.....");
    const promises: any[] = []
    propItem.values.forEach((artbaseValueItem: any) => {
      if (artbaseValueItem.isArtbase !== artbaseValue) {
        artbaseValueItem.isArtbase = artbaseValue
        promises.push(this.onArtbaseValueChange(artbaseValueItem))
      }
    })
    await Promise.all(promises)
  }

}
