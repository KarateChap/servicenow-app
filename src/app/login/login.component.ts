import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;
  authForm: FormGroup;
  isSignup = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar){
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit(){
    if(this.isSignup){
      this.isLoading = true;
      let formValue = {
        email: this.authForm.value.email,
        password: this.authForm.value.password,
        username: this.authForm.value.username
      }
      this.authService.register(formValue).then((data: any) => {
        console.log(data);
        this.isLoading = false;
        this.router.navigateByUrl('/tickets');
        this.authForm.reset();
        this.snackBar.open('Login Successfuly','close', {duration: 3000})
      })
      .catch(e => {
        this.isLoading = false;
        console.log(e);
        let msg: string = 'Could not sign you up, please try again.';
        if(e.code == 'auth/email-already-in-use'){
          msg = 'Email is already in use, please use another email.';
        }
        this.snackBar.open(msg,'close', {duration: 3000})
      })
    }

    else {
      this.isLoading = true;
      let formValue = {
        email: this.authForm.value.email,
        password: this.authForm.value.password,
      }

      this.authService.login(formValue.email, formValue.password).then(data => {
        console.log(data);
        this.isLoading = false;
        this.router.navigateByUrl('/tickets');
        this.authForm.reset();
        this.snackBar.open('Login Successfuly','close', {duration: 3000})
      })
      .catch(e => {
        this.isLoading = false;
        let msg: string = 'Could not sign you in, please try again.';
        if(e.code === 'auth/user-not-found') msg = 'Email address could not be found';
        else if (e.code === 'auth/wrong-password') msg = 'Please enter a correct password';

        this.snackBar.open(msg,'close', {duration: 3000})
      })
    }
  }

  toggleSignup(){
    this.isSignup = !this.isSignup;

    if(this.isSignup){
      this.authForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
      })
    }
    else {
      this.authForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
      })
    }
  }
}
