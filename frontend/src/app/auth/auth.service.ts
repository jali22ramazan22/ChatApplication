import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, Subject, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {ErrorService} from "../shared/services/error.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isFetching = new BehaviorSubject(false);
  protected APIurl = environment.apiUrl;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  login(userForm: any): Observable<{ username: string, token: string }> {
    return this.http.post<{ username: string, token: string }>(`${this.APIurl}/login`, userForm).pipe(
      map((echoData: { username: string, token: string }) => echoData),
      catchError(error => this.handleError('Invalid login or password', error))
    );
  }

  signup(userForm: any): Observable<any> {
    return this.http.post(`${this.APIurl}/signup`, userForm).pipe(
      map((echoData: any) => echoData.user),
      catchError(error => this.handleError('Signup failed', error))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.APIurl}/logout`, null).pipe(
      catchError(error => this.handleError('Logout failed', error))
    );
  }

  private handleError(userFriendlyMessage: string, error: any): Observable<never> {
    if(error.status === 0){
      userFriendlyMessage = 'Server is not turned on';
    }
    return throwError(() => new Error(userFriendlyMessage));
  }
}
