import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {map, Subscription} from "rxjs";
import {AuthService} from "../auth.service";
import {ErrorService} from "../../shared/services/error.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  form = new FormGroup({
    username: new FormControl('', {validators: [Validators.required]}),
    password: new FormControl('', {validators: [Validators.required]}),
  })

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    // TODO: write the validators for the form
  }


  onSubmit(){
    this.authService.isFetching.next(true);
    this.authService.login(this.form.value).subscribe({
        next: (resp) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('username', resp.username);
        },
        error: (err) => {
          this.errorService.$errorMessage.next(err);
          this.authService.isFetching.next(false);
        },
        complete: () => {
          this.authService.isFetching.next(false);
          this.onNavigateToChats();
        }
      })
  }

  onNavigateToChats(){
    this._router.navigate(['chats/']);
  }
  onNavigateToRegister() {
      this._router.navigate(['../register'], {relativeTo: this._route})
  }


}
