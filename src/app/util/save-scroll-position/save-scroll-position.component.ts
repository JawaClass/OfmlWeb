import { Component, afterNextRender, inject } from '@angular/core';
import { SaveScrollPositionService } from './save-scroll-position.service';

@Component({
  selector: 'app-save-scroll-position',
  standalone: true,
  imports: [],
  template: ``
})
export class SaveScrollPositionComponent {

  private scrollingRestored = false
  private _service = inject(SaveScrollPositionService)

  ngAfterViewChecked() {
    if (this.scrollingRestored)
      return
    if (this._service.scrollY < 0)
      return
    if (typeof window !== 'undefined')
      this.restoreScrollPos()
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined')
      this.storeScrollPos()
  }

  protected storeScrollPos() {
    this._service.scrollY = this.getScrollPos()
  }
  private getScrollElem() {
    return document.querySelector('.mat-sidenav-content')
  }

  private getScrollPos() {
    const elem = this.getScrollElem()
    return elem!!.scrollTop
  }

  protected restoreScrollPos() {
    const oldPos = this.getScrollPos()
    const elem = this.getScrollElem()
    const command = {
      left: 0,
      top: this._service.scrollY,
      behavior: undefined,
    } as any
    elem!!.scroll(command)
    const newPos = this.getScrollPos()
    if (oldPos !== newPos) {
      this.scrollingRestored = true
    }
  }
}
