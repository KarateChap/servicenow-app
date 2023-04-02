import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from 'src/app/shared/services/ticket.service';

@Component({
  selector: 'app-display-modal',
  templateUrl: './display-modal.component.html',
  styleUrls: ['./display-modal.component.css'],
})
export class DisplayModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DisplayModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar: MatSnackBar,
    private ticketService: TicketService
  ) {}

  copyToClipBoard(text: string) {
    this.snackBar.open(
      "'" + text + "'" + ' has been copied to clipboard',
      'close',
      { duration: 3000 }
    );
  }

  markAsUsed() {
    this.ticketService.changeIsUsed(this.data.ticketId, 'Yes');
    this.dialogRef.close();
  }
}
