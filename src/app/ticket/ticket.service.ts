import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ticket } from './ticket.model';
import { ApiService } from '../sservices/api.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  ticketChanged: Subject<Ticket[]> = new Subject();
  ticketAddOrDeleted: Subject<Ticket[]> = new Subject();
  public userTickets: Observable<any>;
  public tickets: Ticket[] = [
    {
      id: 'INC0128231',
      type: 'INCIDENT',
      dateReceived: new Date('2023-03-31'),
      dateResolved: new Date(),
      isIt: 'Zycus',
      serviceModule: 'iContract',
      deliveredToOrganization: 'DESIGN TO DELIVERY',
      category: '',
      impact: 'Low',
      shortDescription: 'PU TS User ID Creation',
      status: 'In Progress',
      workingHours: 1,
      isUsed: 'No',
    },
    {
      id: 'ENCH0128154',
      type: 'ENHANCEMENT',
      dateReceived: new Date('2023-03-31'),
      dateResolved: new Date(),
      isIt: 'Coupa',
      serviceModule: 'OneBuy-Coupa - Purchasing',
      deliveredToOrganization: 'IT & Data France',
      category: 'Standard',
      impact: 'Medium',
      shortDescription: 'Coupa Document Reassignment',
      status: 'Resolved',
      workingHours: 2,
      isUsed: 'No',
    },
    {
      id: 'INC11546842',
      type: 'INCIDENT',
      dateReceived: new Date('2023-03-31'),
      dateResolved: new Date(),
      isIt: 'Coupa',
      serviceModule: 'OneBuy-Coupa - Purchasing',
      deliveredToOrganization: 'IT & Data France',
      category: 'Standard',
      impact: 'High',
      shortDescription: 'Coupa Document Reassignment',
      status: 'Closed',
      workingHours: 2,
      isUsed: 'No',
    },
    {
      id: 'INC115464232',
      type: 'INCIDENT',
      dateReceived: new Date('2023-03-31'),
      dateResolved: new Date(),
      isIt: 'Coupa',
      serviceModule: 'OneBuy-Coupa - Purchasing',
      deliveredToOrganization: 'IT & Data France',
      category: 'Standard',
      impact: 'Top',
      shortDescription: 'Coupa Document Reassignment',
      status: 'Closed',
      workingHours: 2,
      isUsed: 'No',
    },
  ];

  constructor(private apiService: ApiService, private firestore: Firestore) {}

  get allTickets() {
    return [...this.tickets];
  }

  changeIsUsed(id: string, isUsed: string) {
    const index = this.tickets.findIndex((item) => item.id === id);
    this.tickets[index].isUsed = isUsed;
    this.ticketChanged.next(this.tickets);
  }

  changeStatus(id: string, status: string) {
    const index = this.tickets.findIndex((item) => item.id === id);
    this.tickets[index].status = status;
    this.ticketChanged.next(this.tickets);
  }

  addNewTicket(newTicket: Ticket, userId) {
    // let ticketWithId = { userId: userId, ...newTicket };
    // this.tickets.push(newTicket);
    // this.ticketChanged.next(this.tickets);
    this.apiService.addDocument(`tickets/${userId}/data`, newTicket);
  }

  editTicket(ticket: Ticket) {
    const index = this.tickets.findIndex((item) => item.id === ticket.id);
    if (index !== -1) {
      this.tickets[index] = ticket;
      this.ticketChanged.next(this.tickets);
    }
  }

  deleteTicket(id: string) {
    const index = this.tickets.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.tickets.splice(index, 1);
      this.ticketChanged.next(this.tickets);
    }
  }
}
