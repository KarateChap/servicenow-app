import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ticket } from '../model/ticket.model';
import { ApiService } from './api.service';
import { map, Observable, of, switchMap } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  query,
  CollectionReference,
  Firestore,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { TicketID } from '../model/ticketId.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  userId: string;
  ticketChanged: Subject<TicketID[]> = new Subject();
  allTicketsToDelete: TicketID[] = [];
  userTickets: TicketID[] = [];
  tickets: Ticket[] = [];

  constructor(private apiService: ApiService, private firestore: Firestore) {}

  changeIsUsed(ticketId: string, isUsed: string) {
    const docInstance = doc(this.firestore, 'tickets', ticketId);
    const updateData = {
      isUsed: isUsed,
    };
    updateDoc(docInstance, updateData)
      .then(() => {
        console.log('Data Updated');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  changeStatus(ticketId: string, status: string) {
    const docInstance = doc(this.firestore, 'tickets', ticketId);
    const updateData = {
      status: status,
    };

    updateDoc(docInstance, updateData)
      .then(() => {
        console.log('Data Updated');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addNewTicket(ticket: Ticket) {
    let newTicket = { userId: this.userId, ...ticket };
    const collectionInstance = collection(this.firestore, 'tickets');
    addDoc(collectionInstance, newTicket)
      .then(() => {
        console.log('Data Saved Successfully');
        console.log(newTicket);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTickets() {
    let newTicket: TicketID;
    let collectionInstance: any = collection(this.firestore, 'tickets');
    const q = query(collectionInstance, where('userId', '==', this.userId));
    collectionInstance = q;

    collectionData(collectionInstance, { idField: 'ticketId' }).subscribe(
      (data) => {
        this.userTickets = [];
        data.forEach((ticket) => {
          let receivedTimestamp = ticket['dateReceived'];
          let resolvedTimestamp = ticket['dateResolved'];
          let receivedDate: any;
          let resolvedDate: any;
          if(receivedTimestamp !== null){
            receivedDate = receivedTimestamp.toDate();
          }
          if(resolvedTimestamp !== null){
            resolvedDate = resolvedTimestamp.toDate();
          }


          newTicket = {
            ticketId: ticket['ticketId'],
            userId: ticket['userId'],
            id: ticket['id'],
            type: ticket['type'],
            dateReceived: receivedDate,
            dateResolved: resolvedDate,
            isIt: ticket['isIt'],
            serviceModule: ticket['serviceModule'],
            deliveredToOrganization: ticket['deliveredToOrganization'],
            category: ticket['category'],
            impact: ticket['impact'],
            shortDescription: ticket['shortDescription'],
            status: ticket['status'],
            workingHours: ticket['workingHours'],
            isUsed: ticket['isUsed'],
          };

          this.userTickets.push(newTicket);
        });
          console.log(this.userTickets)
          this.userTickets.sort((a, b) => {
            if(a.dateReceived !== undefined && b.dateReceived !== undefined){
              return b.dateReceived.getTime() - a.dateReceived.getTime()
            }
            return 0;
          });
          this.ticketChanged.next(this.userTickets);
      }
    );
  }

  editTicket(ticketId: string, ticket: Ticket) {
    const docInstance = doc(this.firestore, 'tickets', ticketId);
    const updateData = {
      id: ticket.id,
      type: ticket.type,
      dateReceived: ticket.dateReceived,
      dateResolved: ticket.dateResolved,
      isIt: ticket.isIt,
      serviceModule: ticket.serviceModule,
      deliveredToOrganization: ticket.deliveredToOrganization,
      category: ticket.category,
      impact: ticket.impact,
      shortDescription: ticket.shortDescription,
      status: ticket.status,
      workingHours: ticket.workingHours,
      isUsed: ticket.isUsed,
    };

    updateDoc(docInstance, updateData)
      .then(() => {
        console.log('Data Updated');
      })
      .catch((err) => {
        console.log(err);
      });
  }


  deleteTicket(ticketId: string){
    const docInstance = doc(this.firestore, 'tickets', ticketId);
    deleteDoc(docInstance).then(() => {
      console.log('Data Deleted');
    }).catch((err) => {
      console.log(err);
    })
  }

  deleteAllTickets(){
    this.allTicketsToDelete.forEach(element => {
      this.deleteTicket(element.ticketId);
    });
    this.allTicketsToDelete = [];
  }
}
