import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from './shared/services/ticket.service';

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
    private snackBar: MatSnackBar,
    public ticketService: TicketService
  ) {}

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.snackBar.open('You have successfully logged out.','close', {duration: 3000})
  }
}
