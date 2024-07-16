import {AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ChatService} from "../../chat.service";
import {Observable, Subscription} from "rxjs";
import {TransformNamePipe} from "../../../shared/pipes/transform-name.pipe";
import {ErrorService} from "../../../shared/services/error.service";
import {NgClass, NgStyle} from "@angular/common";
import {computeImgPath} from "../../../shared/functions/computeImgPath";
import {ChatItem, Message} from "../../../shared/models/chat-item.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [TransformNamePipe, NgStyle, NgClass, RouterLink],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  chatList: any[] = [];
  selectedChat: ChatItem | null = null;
  chatFetchingSubscription: Subscription = new Subscription();
  constructor(private chatService: ChatService, private errorService: ErrorService) {}

  private getUserDataHandling(getUserData: Observable<any>): Subscription {
    return getUserData.subscribe({
      next: (value: any) => {
        this.chatList = value['chats'];
        this.chatService.isFetching.next(false);
      },
      error: err => {
        this.errorService.$errorMessage.next(err.message);
        this.chatService.isFetching.next(false);
      }
    });
  }


  ngOnInit() {
    this.chatService.isFetching.next(true);
    this.chatFetchingSubscription = this.getUserDataHandling(this.chatService.getUserData())
    this.chatService.addNewCompanionSignal$.subscribe(
      (val) => {
        if(val){
          this.chatService.isFetching.next(true);
          this.chatFetchingSubscription = this.getUserDataHandling(this.chatService.getUserData())
        }
      }
    )

  }

  onSelectChat(chat: any){
    if(this.chatService.selectedChat.getValue() === chat){
      this.chatService.selectedChat.next(null);
      this.selectedChat = null;
      return;
    }
    this.chatService.selectedChat.next(chat);
    this.chatService.addChat.next(false);
    this.selectedChat = chat;
  }

  last_message(chat: any){
    let query_chat: ChatItem | undefined =
      this.chatService.chatsFetch.getValue()
        .find(chatIt => chatIt.conversation === chat.conversation);
    if(query_chat){
      return query_chat.message[query_chat.message.length - 1];
    }
    return null;
  }

  get fetchingStatus(){
    return this.chatService.isFetching.getValue();
  }

  ngOnDestroy(): void {
    this.chatFetchingSubscription.unsubscribe();
  }

  protected readonly computeImgPath = computeImgPath;

  onAddChat() {
    this.chatService.addChat.next(true);
  }
}
