import {Component, OnDestroy, OnInit} from '@angular/core';
import {computeImgPath} from "../../../shared/functions/computeImgPath";
import {FormsModule} from "@angular/forms";
import {ResizeInputDirective} from "../../directives/resize-input.directive";
import {ChatService} from "../../chat.service";
import {ChatItem, Message} from "../../../shared/models/chat-item.model";
import {ChatConnectionWsService} from "../../chat-connection-ws.service";
import {Subscription} from "rxjs";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    ResizeInputDirective,
    NgStyle
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',

})
export class ChatComponent implements OnInit, OnDestroy{
    chatSubscriptions: Subscription[] = []
    selectedChat: ChatItem | null = null;
    inputMessage: string = '';
    authUsername: string | null = '';
    constructor(private chatService: ChatService, private chatWSService: ChatConnectionWsService){
    }

  ngOnInit() {
    this.authUsername = typeof window !== 'undefined' ? localStorage.getItem('username') : null
    this.chatService.selectedChat.subscribe(
      (selectedChat: ChatItem | null) => {
        if (selectedChat !== null) {

          this.chatWSService.establishConnection();
          this.selectedChat = selectedChat;
        } else {
          this.chatWSService.disconnectSocket();
          this.selectedChat = null;
        }
      }
    );

    const messageSubscription: Subscription = this.chatWSService.messageEvent$?.subscribe(
        {
          next: (val: any) => {
            if(!val){
             return
            }
              const formatedMessage: Message ={
                from_user: val.from,
                message_text: val.message,
              }
            this.selectedChat?.message.push(formatedMessage);
          }
        }
      )
      const companionStatusSubscription: Subscription = this.chatWSService.companionOnline$.subscribe(
        val => {
          if(val === undefined && this.selectedChat){
            this.selectedChat.status = false;
          }
          else if(this.selectedChat && val && val.user === this.selectedChat.companion){
            this.selectedChat.status = val.status;
          }

        }
      )
      const typingStatusSubscription = this.chatWSService.typing$.subscribe(
        val => {
          if(!this.selectedChat){
            return;
          }
          this.selectedChat.typing = val;
        }
      )


      this.chatSubscriptions.push(messageSubscription);
      this.chatSubscriptions.push(companionStatusSubscription);
      this.chatSubscriptions.push(typingStatusSubscription);
    }


    onSendMessage(){
      if(this.inputMessage === '') {
        return;
      }
      const formatedMessage: Message = {
        from_user: this.authUsername? this.authUsername: '',
        message_text: this.inputMessage,
      }

      this.chatWSService.sendSocket(this.inputMessage);
      this.inputMessage = '';
    }

    onHandleTyping(){
        let api = {
          user: this.authUsername,
          typing: true
        }
        this.chatWSService.sendSocket('', api);

    }

  ngOnDestroy() {
      this.chatWSService.disconnectSocket();
      this.chatSubscriptions.forEach(sub => {
        sub.unsubscribe();
      })
  }

  get chatMsgHistory(): Message[] | any[] {
    return this.selectedChat ? this.selectedChat.message : [];
  }

  protected readonly computeImgPath = computeImgPath;
}
