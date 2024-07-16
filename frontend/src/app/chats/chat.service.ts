import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {ChatItem} from "../shared/models/chat-item.model";
import {UserModel} from "../shared/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  protected apiUrl = environment.apiUrl;

  chatsFetch: BehaviorSubject<ChatItem[]> = new BehaviorSubject<ChatItem[]>([]);
  selectedChat: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isFetching: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  addChat: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  addNewCompanionSignal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  getUserData(){
    return this.http.get<{ chats: ChatItem[] }>(`${this.apiUrl}/chats`).pipe(
      tap(response => {
        this.chatsFetch.next(response['chats'])
      }),
      catchError(err => {
        return this.handleError('Failed to load data', err);
      })
      )
  }
  getAllUsers(): Observable<{}>{
    return this.http.get(`${this.apiUrl}/get_users`).pipe(
      map((user_fetch: any) => {
        return user_fetch['users']}),
      catchError(err => this.handleError('Failed to load data', err))
    )
  }

  createNewChat(user: UserModel){
    return this.http.put(`${this.apiUrl}/create_new_user`, {'user': user}).pipe(
      map(resp => {
        return resp;
      }),
      catchError(error => this.handleError('Failed to create chat with target user', error))
    )
  }


  private handleError(userFriendlyMessage: string, error: any): Observable<never> {
    if(error.status === 0){
      userFriendlyMessage = 'Server is not turned on';
    }
    return throwError(() => new Error(userFriendlyMessage));
  }

}
