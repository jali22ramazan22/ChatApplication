import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../environments/environment";
import {ChatService} from "./chat.service";
import {BehaviorSubject, interval, Observable, take, tap, throwError} from "rxjs";
import {UserStatus} from "../shared/models/user-status.model";
import {ErrorService} from "../shared/services/error.service";

//TODO: Connect the error service to error handling logic in this service
@Injectable({
  providedIn: 'root'
})
export class ChatConnectionWsService {
  private socket$: WebSocketSubject<any> | undefined;
  public messageEvent$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public companionOnline$: BehaviorSubject<UserStatus | undefined> =
    new BehaviorSubject<UserStatus | undefined>(undefined);
  public typing$ = new BehaviorSubject<boolean>(false);

  constructor(private chatService: ChatService, private errorService: ErrorService) {
  }

  establishConnection() {
    let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const direction = `${environment.wsUrl}/ws/chats/?chat=${this.chatService.selectedChat
      .getValue().conversation}&token=Bearer ${token}`;
    this.socket$ = webSocket(direction);
    this.socket$.subscribe({
      next: msg => {
        switch (msg.type) {
          case 'user_status':
            this.companionOnline$.next({ user: msg.user, status: msg.status === 'online' });
            return;
          case 'chat_message':
            this.messageEvent$.next(msg);
            return;
          case 'send_typing_status':
            this.typing$.next(true);
            setTimeout(() => {
              this.typing$.next(false);
            }, 5000);
            return;
        }
      },
      error: err => {
        this.errorService.$errorMessage.next('The connection is interrupted by server');
      },
      complete: () => console.log('Complete')
    });
  }

  sendSocket(message: any, typing?: any) {
    if(!this.socket$){
      return;
    }
    if(typing){
      this.socket$.next({
        typing: typing,
      })
      return;
    }
    this.socket$.next({
        message: message
      });

  }

  get socket(){
    return this.socket$;
  }

  disconnectSocket() {
    if(this.socket$){
      this.socket$.complete();
    }
  }

}
