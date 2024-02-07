import { Component, afterNextRender, inject } from '@angular/core';
import { SaveScrollPositionService } from '../services/save-scroll-position.service'; 


@Component({
  selector: 'app-save-scroll-position',
  standalone: true,
  imports: [],
  templateUrl: './save-scroll-position.component.html',
  styleUrl: './save-scroll-position.component.css'
})
export class SaveScrollPositionComponent {

  
  private _service = inject(SaveScrollPositionService)

  ngAfterViewInit() {
    this.restoreScrollPos() 
  }

  ngOnDestroy() {
    this.storeScrollPos()
  }
  
  protected storeScrollPos() {
    /*afterNextRender(() => {
      const elem = document.querySelector('.mat-sidenav-content')
      this._service.scrollY = elem!!.scrollTop
    }
    )*/
  }

  protected restoreScrollPos() {
    /*afterNextRender(() => {
      const elem = document.querySelector('.mat-sidenav-content')
      elem!!.scroll(
        {
        left: 0,
        top: this._service.scrollY,
        behavior: 'instant',
      }
      )
    })*/
    
  }

}
