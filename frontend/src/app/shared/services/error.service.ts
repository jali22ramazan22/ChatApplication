import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  $errorMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor() {
  }
}
