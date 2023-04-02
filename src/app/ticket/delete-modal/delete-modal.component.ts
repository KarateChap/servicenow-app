import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'src/app/shared/services/ticket.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {

  constructor(private ticketService: TicketService, public dialogRef: MatDialogRef<DeleteModalComponent>){

  }
  deleteAllTickets(){
    this.ticketService.deleteAllTickets();
    this.dialogRef.close();
  }
}
