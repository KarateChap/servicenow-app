import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ticket } from './ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  ticketChanged: Subject<Ticket[]> = new Subject();
  ticketDeleted: Subject<Ticket[]> = new Subject();
  tickets: Ticket[] = [
    {
      id: 'INC0128231',
      type: 'INCIDENT',
      isIt: 'Zycus',
      impact: 'Low',
      shortDescription: 'PU TS User ID Creation',
      status: 'In-Progress',
      isUsed: 'No',
    },
    {
      id: 'INC0128241',
      type: 'ENHANCEMENT',
      isIt: 'Coupa',
      impact: 'Medium',
      shortDescription: 'Change the contracting Party',
      status: 'Acceptance Test',
      isUsed: 'No',
    },
    {
      id: 'INC0128252',
      type: 'INCIDENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'To Be Reworked',
      isUsed: 'Yes',
    },
    {
      id: 'INC0128253',
      type: 'INCIDENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Resolved',
      isUsed: 'Yes',
    },
    {
      id: 'INC0128254',
      type: 'INCIDENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Draft',
      isUsed: 'Yes',
    },
    {
      id: 'INC0128255',
      type: 'INCIDENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Closed',
      isUsed: 'No',
    },
    {
      id: 'INC0128256',
      type: 'INCIDENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Submitted',
      isUsed: 'Yes',
    },
    {
      id: 'INC0128257',
      type: 'INCIDENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Resolved',
      isUsed: 'Yes',
    },
    {
      id: 'INC0128258',
      type: 'ENHANCEMENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Draft',
      isUsed: 'Yes',
    },
    {
      id: 'INC0128259',
      type: 'INCIDENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Closed',
      isUsed: 'No',
    },
    {
      id: 'INC0128210',
      type: 'ENHANCEMENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Submitted',
      isUsed: 'Yes',
    },
    {
      id: 'INC0128211',
      type: 'INCIDENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Resolved',
      isUsed: 'Yes',
    },
    {
      id: 'INC0128212',
      type: 'ENHANCEMENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Draft',
      isUsed: 'Yes',
    },
    {
      id: 'INC0128213',
      type: 'INCIDENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Closed',
      isUsed: 'No',
    },
    {
      id: 'INC0128214',
      type: 'ENHANCEMENT',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Submitted',
      isUsed: 'Yes',
    },

  ];

  constructor() {}

  get allTickets(){
    return [...this.tickets];
  }

  changeIsUsed(id: string, isUsed: string){
    const index = this.tickets.findIndex(item => item.id === id);
    this.tickets[index].isUsed = isUsed;
    this.ticketChanged.next(this.tickets);
  }

  changeStatus(id: string, status: string){
    const index = this.tickets.findIndex(item => item.id === id);
    this.tickets[index].status = status;
    this.ticketChanged.next(this.tickets);
  }

  deleteTicket(id: string){
    const index = this.tickets.findIndex(item => item.id === id);
    if(index !== -1){
      this.tickets.splice(index, 1);
      this.ticketDeleted.next(this.tickets);
    }
  }
}
