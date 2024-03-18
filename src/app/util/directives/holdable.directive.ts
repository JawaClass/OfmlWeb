import { Directive, ElementRef, HostListener, Output, EventEmitter, Renderer2, Input, inject } from '@angular/core';

@Directive({
  selector: '[appHoldable]',
  standalone: true
})
export class HoldableDirective {

  readonly intervalMillisDefault = 100
  readonly timeToPassDefault = 3000

  @Output() holdTime: EventEmitter<number> = new EventEmitter()
  @Output() holdFinished: EventEmitter<void> = new EventEmitter()
  @Input() intervalMillis: number = this.intervalMillisDefault
  @Input() timeToPass: number = this.timeToPassDefault
  private hasFinished = false
  timePassed: number = 0
  cancelId: any = null
  progressElementRef: any = null

  elementRef = inject(ElementRef)
  renderer = inject(Renderer2)

  createProgress(): void {
    this.progressElementRef = this.renderer.createElement('progress')
    this.renderer.setAttribute(this.progressElementRef, 'value', '0')
    this.renderer.setAttribute(this.progressElementRef, 'max', this.timeToPass.toString())
    this.renderer.setStyle(this.progressElementRef, "clip-path", "circle(50% at center)")
    this.renderer.appendChild(this.elementRef.nativeElement, this.progressElementRef)
  }

  destoryProgress() {
    this.renderer.removeChild(this.elementRef.nativeElement, this.progressElementRef)
  }

  emit(interval: number) {
    this.holdTime.emit(this.timePassed)
    this.renderer.setAttribute(this.progressElementRef, 'value', this.timePassed.toString())
    this.timePassed += interval

    if (this.timePassed >= this.timeToPass) {
      this.hasFinished = true
      //this.renderer.setStyle(this.progressElementRef, "background-color", "green")
      this.holdFinished.emit()
      this.destoryProgress()
    } else {
      this.cancelId = setTimeout(() => this.emit(interval), interval)
    }
  }

  @HostListener("mousedown", ["$event"])
  onMouseDown(event: any) {
    //if (this.hasFinished) return
    this.createProgress()
    this.emit(this.intervalMillis)
  }

  @HostListener("mouseup", ["$event"])
  onMouseUp(event: any) {
    //if (this.hasFinished) return
    this.timePassed = 0
    this.destoryProgress()
    clearTimeout(this.cancelId)
  }

}
