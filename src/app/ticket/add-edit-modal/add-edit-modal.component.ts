import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ticket } from '../ticket.model';
import { TicketService } from '../ticket.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-modal',
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.css'],
})
export class AddEditModalComponent {
  ticketForm: FormGroup;

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data

  ) {
    if (!data.isEdit) {

      this.ticketForm = new FormGroup({
        id: new FormControl('', [Validators.required]),
        type: new FormControl('incident', [Validators.required]),
        dateReceived: new FormControl(new Date, [Validators.required]),
        dateResolved: new FormControl(),
        isIt: new FormControl('zycus', [Validators.required]),
        serviceModule: new FormControl('SAP Themis ERP - Purchasing', [Validators.required]),
        deliveredToOrganization: new FormControl('DESIGN TO DELIVERY', [Validators.required]),
        category: new FormControl(''),
        impact: new FormControl('low', [Validators.required]),
        shortDescription: new FormControl('', [Validators.required]),
        status: new FormControl('submitted', [Validators.required]),
        workingHours: new FormControl(''),
        isUsed: new FormControl('no', [Validators.required]),
      });
    } else {




      this.ticketForm = new FormGroup({
        id: new FormControl(data.id, [Validators.required]),
        type: new FormControl(data.type.toLowerCase(), [Validators.required]),
        dateReceived: new FormControl(data.dateReceived, [Validators.required]),
        dateResolved: new FormControl(data.dateResolved, [Validators.required]),
        isIt: new FormControl(
          data.isIt.toLowerCase().replace(/\s(.)/g, function (match, group1) {
            return group1.toUpperCase();
          }),
          [Validators.required]
        ),
        serviceModule: new FormControl(data.serviceModule, [Validators.required]),
        deliveredToOrganization: new FormControl(data.deliveredToOrganization, [Validators.required]),
        category: new FormControl(data.category.toLowerCase().replace(/\s(.)/g, function (match, group1) {
          return group1.toUpperCase();
        })),
        impact: new FormControl(data.impact.toLowerCase(), [
          Validators.required,
        ]),
        shortDescription: new FormControl(data.shortDescription, [
          Validators.required,
        ]),
        status: new FormControl(
          data.status.toLowerCase().replace(/\s(.)/g, function (match, group1) {
            return group1.toUpperCase();
          }),
          [Validators.required]
        ),
        workingHours: new FormControl(data.workingHours),
        isUsed: new FormControl(data.isUsed.toLowerCase(), [
          Validators.required,
        ]),
      });
      this.ticketForm.controls['id'].disable();
    }
  }

  onSubmit() {

    if (!this.data.isEdit) {
      let newTicket: Ticket = {
        id: this.ticketForm.value.id.toUpperCase(),
        type: this.ticketForm.value.type.toUpperCase(),
        dateReceived: this.ticketForm.value.dateReceived,
        dateResolved: this.ticketForm.value.dateResolved,
        isIt: this.capitalizedEachWord(this.ticketForm.value.isIt),
        serviceModule: this.ticketForm.value.serviceModule,
        deliveredToOrganization: this.ticketForm.value.deliveredToOrganization,
        category: this.capitalizedEachWord(this.ticketForm.value.category),
        impact:
          this.ticketForm.value.impact.charAt(0).toUpperCase() +
          this.ticketForm.value.impact.slice(1),
        shortDescription: this.ticketForm.value.shortDescription,
        status: this.capitalizedEachWord(this.ticketForm.value.status),
        workingHours: this.ticketForm.value.workingHours,
        isUsed:
          this.ticketForm.value.isUsed.charAt(0).toUpperCase() +
          this.ticketForm.value.isUsed.slice(1),
      };

      this.ticketService.addNewTicket(newTicket, this.data.userId);

      this.snackBar.open(
        'Ticket Number: ' + newTicket.id + ' has been added.',
        'close',
        { duration: 3000 }
      );
    } else {
      let ticket: Ticket = {
        id: this.ticketForm.getRawValue().id.toUpperCase(),
        type: this.ticketForm.value.type.toUpperCase(),
        dateReceived: this.ticketForm.value.dateReceived,
        dateResolved: this.ticketForm.value.dateResolved,
        isIt: this.capitalizedEachWord(this.ticketForm.value.isIt),
        serviceModule: this.ticketForm.value.serviceModule,
        deliveredToOrganization: this.ticketForm.value.deliveredToOrganization,
        category: this.capitalizedEachWord(this.ticketForm.value.category),
        impact:
          this.ticketForm.value.impact.charAt(0).toUpperCase() +
          this.ticketForm.value.impact.slice(1),
        shortDescription: this.ticketForm.value.shortDescription,
        status: this.capitalizedEachWord(this.ticketForm.value.status),
        workingHours: this.ticketForm.value.workingHours,
        isUsed:
          this.ticketForm.value.isUsed.charAt(0).toUpperCase() +
          this.ticketForm.value.isUsed.slice(1),
      };

      this.ticketService.editTicket(ticket);

      this.snackBar.open(
        'Ticket Number: ' + ticket.id + ' has been edited.',
        'close',
        { duration: 3000 }
      );
    }

    this.dialogRef.close();
  }

  capitalizedEachWord(text: string): string {
    const words = text.split(/(?=[A-Z])/);
    const formattedWords = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return formattedWords;
  }
}
