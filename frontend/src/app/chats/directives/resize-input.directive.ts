import {AfterViewInit, Directive, ElementRef, Input, OnChanges, OnInit, Renderer2} from "@angular/core";


@Directive({
  selector: '[resizeInput]',
  standalone: true
})
export class ResizeInputDirective implements OnInit, OnChanges, AfterViewInit {
  @Input() inputMessage!: string;

  private nativeHeight: number = 6;
  private nativeWidth: number = 50;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(){
    this.renderer.setStyle(this.el.nativeElement, 'height', `${this.nativeHeight}vh`);
    this.renderer.setStyle(this.el.nativeElement, 'width', `${this.nativeWidth}vw`);
    this.renderer.listen(this.el.nativeElement, 'input', (event) => this.resize(event.target.value));
  }

  ngOnChanges() {
    this.resize(this.inputMessage);
  }

  ngAfterViewInit(){
    this.renderer.setStyle(this.el.nativeElement, 'height', `${this.nativeHeight}vh`);
  }

  private resize(value: string) {
    if(value.length % 100 === 0 && this.nativeHeight < 10){
      this.nativeHeight += 2;
    }
    if(value.length === 0){
      this.nativeHeight = 6;
    }
    this.renderer.setStyle(this.el.nativeElement, 'height', `${this.nativeHeight}vh`);
  }


}
