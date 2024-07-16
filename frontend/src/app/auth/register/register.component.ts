import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../auth.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {catchError, Subscription, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserModel} from "../../shared/models/user.model";
import {ErrorService} from "../../shared/services/error.service";
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',

})
export class RegisterComponent{

  registrationForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}


  onSubmit() {
    this.authService.isFetching.next(true);
    this.authService.signup(this.registrationForm.getRawValue()).subscribe({
      next: (user: UserModel) => {
        this.authService.isFetching.next(false);
        this.onNavigateToLogin();
      },
      error: (err) => {
        this.errorService.$errorMessage.next(err);
        this.authService.isFetching.next(false);
      },
      complete: () => {
        this.authService.isFetching.next(false);
      }
    })
  }

  onNavigateToLogin() {
    this.router.navigate(['../login'], { relativeTo: this.route });
  }

}
