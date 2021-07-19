import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm : FormGroup;
  isLoading = false;
  authStatusSub : Subscription;
  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.initForm()
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      (authStatus) => {
        this.isLoading = false;
      }
    )
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
  private initForm(){
    this.loginForm = new FormGroup({
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'password' : new FormControl(null, [Validators.required])
    });
  }

  onSubmit(){
    // console.log(this.loginForm);
    if(!this.loginForm.valid){
      return;
    }

    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.isLoading = true;
    this.authService.loginUser(email, password);
  }

}
