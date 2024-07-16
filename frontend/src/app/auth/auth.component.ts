import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit{
  isFetching = false;
  constructor(private authService: AuthService){
  }

  ngOnInit() {
    this.authService.isFetching.subscribe(isFetching => {
      this.isFetching = isFetching;
    })
  }

}
