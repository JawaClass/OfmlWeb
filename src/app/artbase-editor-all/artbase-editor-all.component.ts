import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute } from '@angular/router';
import { PropertyEditorService } from '../services/property-editor.service';
import { PropClassService, PropertyItem } from '../services/prop-class.service';
import { ArticleInputService } from '../services/article-input.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { log } from 'console';

@Component({
  selector: 'app-artbase-editor-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artbase-editor-all.component.html',
  styleUrl: './artbase-editor-all.component.css'
})
export class ArtbaseEditorAllComponent {

  private articleInputService = inject(ArticleInputService)
  private propClassService = inject(PropClassService);
  private prop2PropertyItem: Map<string, PropertyItem> = new Map()
  
        
  ngOnInit() {

    const activeArray = this.articleInputService.getActiveArray()
    const programsMap = this.articleInputService.getFetchedArticles()
    const activePrograms = Object.keys(programsMap).filter((_, idx) => activeArray[idx])

    activePrograms.forEach( program => {
      // console.log("presentValues  program", program);
      Object.keys(programsMap[program]).forEach(pClass => {
          //console.log("presentValues  -->pClass", pClass);
          this.propClassService.getPropsResult(program, pClass).subscribe( (result: PropertyItem[]) => {
           // console.log("---->result", program, pClass, typeof result)
            
            result.forEach((propItem: PropertyItem)  => {

              if (!this.prop2PropertyItem.has(propItem.property_name) ) 
                this.prop2PropertyItem.set(propItem.property_name, propItem)
              else {
                
                const newValues = propItem.values

                newValues.forEach(value => {
                  const presentValues = this.prop2PropertyItem.get(propItem.property_name)!!.values
                  
                  if (!presentValues.find(v => v.v == value.v))
                    this.prop2PropertyItem.get(propItem.property_name)!!.values.push(value)

                })
                //const mergedValues = [ ...presentValues, ...newValues]

                }
             
            })
          })
      })
    })

    /*this.heroes$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = Number(params.get('programs'));
        return this.service.getHeroes();
      })
    );*/
  }

    

}
