import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { computeImgPath } from "./shared/functions/computeImgPath";
import { ChatComponent } from "./chats/components/chat/chat.component";
import { ChatListComponent } from "./chats/components/chat-list/chat-list.component";
import { ChatHolderComponent } from "./chats/components/chat-holder/chat-holder.component";
import { CdkPortal, PortalModule } from "@angular/cdk/portal";
import { ErrorComponentComponent } from "./shared/components/error-component/error-component.component";
import {ErrorService} from "./shared/services/error.service";
import {AbsoluteOverlayComponent} from "./shared/components/absolute-overlay/absolute-overlay.component";
import {AddChatComponent} from "./chats/components/add-chat/add-chat.component";
import {ChatService} from "./chats/chat.service";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, ChatListComponent, ChatHolderComponent, ErrorComponentComponent, AbsoluteOverlayComponent, AddChatComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent{
  constructor(
    private errorService: ErrorService,
    private chatService: ChatService
  ) {}


  get addChat(){
    return this.chatService.addChat.getValue();
  }
  get selectedChat(){
    return this.chatService.selectedChat.getValue()
  }

  get errorMessage(){
    return this.errorService.$errorMessage.getValue();
  }

  protected readonly computeImgPath = computeImgPath;
}
