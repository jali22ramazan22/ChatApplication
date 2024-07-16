import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { computeImgPath } from '../../../shared/functions/computeImgPath';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ChatService } from '../../chat.service';
import { ErrorService } from '../../../shared/services/error.service';
import { UserModel } from '../../../shared/models/user.model';
import { TransformNamePipe } from '../../../shared/pipes/transform-name.pipe';

@Component({
  selector: 'app-add-chat',
  standalone: true,
  imports: [
    ButtonComponent,
    TransformNamePipe,

  ],
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.css']
})
export class AddChatComponent implements OnInit, OnDestroy {
  @ViewChild('button') button!: ButtonComponent;
  usersArr?: UserModel[];
  isFetching: boolean = false;
  private subscriptions: Subscription[] = [];
  // I do not know why it's called twice
  constructor(private chatService: ChatService, private errorService: ErrorService) {

  }

  ngOnInit() {
    this.isFetching = true;
    const sub = this.chatService.getAllUsers()
      .subscribe({
        next: (value: any) => {
          this.usersArr = value;
          this.isFetching = false;
        },
        error: err => {
          this.isFetching = false;
          this.errorService.$errorMessage.next(err);
        },
        complete: () => {
          this.isFetching = false;
        }
      });
    this.subscriptions.push(sub);
  }

  onClose() {
    this.chatService.addChat.next(false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  protected readonly computeImgPath = computeImgPath;

  onAddUserChat(user: UserModel) {
      if(!this.button.condition){
        console.log('Adding user...');
        this.button.condition = true;
        console.log(user);
        this.chatService.createNewChat(user)
          .subscribe(resp => {
              this.chatService.addNewCompanionSignal$.next(true);
          });
      } else{
        this.errorService.$errorMessage.next('Already added!');
      }
  }
}
