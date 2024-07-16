import {Injectable} from "@angular/core";
import {HttpHandler, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (request.url.endsWith('/signup') || request.url.endsWith('/register')) {
      return next.handle(request);
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if(!token){
      return next.handle(request);
    }
    let jwtToken = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    }
    )

    return next.handle(jwtToken);
  }
}
