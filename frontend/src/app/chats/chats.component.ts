import {Component} from '@angular/core';
import {ChatComponent} from "./components/chat/chat.component";
import {ChatListComponent} from "./components/chat-list/chat-list.component";
import {ChatHolderComponent} from "./components/chat-holder/chat-holder.component";
import {ErrorComponentComponent} from "../shared/components/error-component/error-component.component";

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    ChatComponent,
    ChatListComponent,
    ChatHolderComponent,
    ErrorComponentComponent
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css',
})
export class ChatsComponent {

}
