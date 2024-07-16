import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from "@angular/core";

@Directive({
  selector: '[progressBarChange]',
  standalone: true
})
export class ProgressBarChangeDirective implements OnChanges{
  @Input() public progress!: number;
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {

  }

  ngOnChanges() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.progress}%`);
  }


}
