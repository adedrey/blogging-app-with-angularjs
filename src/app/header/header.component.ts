import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated : boolean =false;
  private authSubscription: Subscription;
  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      }
    )
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }

}
