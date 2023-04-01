import { Component, OnInit } from '@angular/core';
import { AuthService } from './login/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'service-now-app';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.snackBar.open('You have successfully logged out.','close', {duration: 3000})
  }
}
