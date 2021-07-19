import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm : FormGroup;
  isLoading = false;
  authStatusSub: Subscription;
  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.initForm()
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

  private initForm(){
    this.signupForm = new FormGroup({
      'email' : new FormControl(null, [Validators.required]),
      'password' : new FormControl(null, [Validators.required])
    });
  }

  onSubmit(){
    if(!this.signupForm.valid){
      return;
    }
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    this.isLoading = true;
    this.authService.createUser(email, password);

  }

}
