import {Component, Input, OnInit} from '@angular/core';
import {ErrorService} from "../../services/error.service";
import {Subscription} from "rxjs";
import {ProgressBarChangeDirective} from "../../directives/progress-bar-change.directive";

@Component({
  selector: 'app-error-component',
  standalone: true,
  imports: [ProgressBarChangeDirective],
  templateUrl: './error-component.component.html',
  styleUrl: './error-component.component.css'
})
export class ErrorComponentComponent implements OnInit{
  progress: number = 0;
  myError: string = '';
  constructor(private errorService: ErrorService) {

  }
  ngOnInit() {
      const interval = setInterval(() => {
        if (this.progress > 100) {
          clearInterval(interval);
          this.onHideMessage();
        } else {
          this.progress += 1;
        }
      }, 25);
  }
  get errorMessage(){
    return this.errorService.$errorMessage.getValue();
  }
  onHideMessage() {
    this.errorService.$errorMessage.next('');
  }
}
