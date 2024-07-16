import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {computeImgPath} from "../../../shared/functions/computeImgPath";
import {AuthService} from "../../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat-holder',
  standalone: true,
  imports: [],
  templateUrl: './chat-holder.component.html',
  styleUrl: './chat-holder.component.css',

})
export class ChatHolderComponent implements OnInit{
    username?: string | null;

    constructor(private authService: AuthService, private router: Router){

    }

    ngOnInit() {
      this.username = typeof window !== 'undefined' ? localStorage.getItem('username'): null;
    }

    onLogout(){
      this.authService.logout()
        .subscribe(
          {
            next: () => {
              this.destructAllLocalData();
              this.router.navigate(['auth/login'])
            },
            error: () => {
              alert('Server is not working')
            }
          }
        )
    }

    private destructAllLocalData(){
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  protected readonly computeImgPath = computeImgPath;
}
