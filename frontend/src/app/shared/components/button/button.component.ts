import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent implements OnInit{
  @ViewChild('buttonRef') buttonRef: ElementRef | undefined;
  private _condition: boolean = false;
  @Input() label!: string | undefined;
  @Input()
  set condition(value: boolean) {
    this._condition = value;
    this.label = this._condition ? this.desiredLabel : this.label;
    if(this.buttonRef){
      this.buttonRef.nativeElement.disabled = this._condition;
    }
  }
  @Input() desiredLabel?: string;
  constructor() {

  }

  ngOnInit(){

  }

  get condition(){
    return this._condition;
  }

  get disabled(){
    if(this.buttonRef){
      return !!this.buttonRef.nativeElement.disabled;
    }
    return false;
  }

}
