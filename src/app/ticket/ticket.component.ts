import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { AddEditModalComponent } from './add-edit-modal/add-edit-modal.component';
// import { SelectionModel } from '@angular/cdk/collections';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';
import { DisplayModalComponent } from './display-modal/display-modal.component';
import { ApiService } from '../sservices/api.service';
import { AuthService } from '../login/auth.service';

const NAMES: string[] = [];

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit, OnDestroy {
  userId = '';
  ticketSubs = new Subscription();
  tickets: Ticket[] = [];
  userTickets: Observable<any[]>;
  displayedColumns: string[] = [
    'id',
    'type',
    'dateReceived',
    'dateResolved',
    'accumulatedDay',
    'isIt',
    'serviceModule',
    'deliveredToOrganization',
    'category',
    'impact',
    'shortDescription',
    'status',
    'workingHours',
    'isUsed',
    'actions',
  ];

  dataSource: MatTableDataSource<Ticket>;
  // selection = new SelectionModel<Ticket>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.tickets = this.ticketService.allTickets;
    this.dataSource = new MatTableDataSource(this.tickets);
  }

  ngOnInit(): void {
    this.ticketSubs = this.ticketService.ticketChanged.subscribe(
      (newTickets) => {
        this.tickets = newTickets;
        this.dataSource = new MatTableDataSource(this.tickets);
      }
    );

    this.authService.checkAuth().then((user) => {
      this.userId = user.uid;
    });



  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterTicket(type: string) {
    this.dataSource.filter = type.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onIsUsedChanged(id: string, isUsed: string) {
    this.snackBar.open(
      'Ticket Number: ' +
        id +
        ' has been changed to: ' +
        (isUsed === 'Yes' ? "'Used'" : "'Available'"),
      'close',
      { duration: 3000 }
    );
    this.ticketService.changeIsUsed(id, isUsed);
  }

  onStatusChanged(id: string, status: string) {
    this.snackBar.open(
      'Ticket Number: ' +
        id +
        ' has been changed with the new status: ' +
        "'" +
        status +
        "'",
      'close',
      { duration: 3000 }
    );
    this.ticketService.changeStatus(id, status);
  }

  addNewTicket() {
    this.matDialog.open(AddEditModalComponent, {
      data: {
        isEdit: false,
        userId: this.userId
      },
    });
  }
  onEdit(row: Ticket) {
    this.matDialog.open(AddEditModalComponent, {
      data: {
        userId: this.userId,
        isEdit: true,
        id: row.id,
        type: row.type,
        dateReceived: row.dateReceived,
        dateResolved: row.dateResolved,
        isIt: row.isIt,
        serviceModule: row.serviceModule,
        deliveredToOrganization: row.deliveredToOrganization,
        category: row.category,
        impact: row.impact,
        shortDescription: row.shortDescription,
        status: row.status,
        workingHours: row.workingHours,
        isUsed: row.isUsed,
      },
    });
  }

  onDelete(id: string) {
    this.snackBar.open('Ticket Number: ' + id + ' has been deleted', 'close', {
      duration: 3000,
    });
    this.ticketService.deleteTicket(id);
  }

  openDetails(ticket: Ticket) {
    this.snackBar.open(
      'Ticket Number: ' + ticket.id + ' has been copied to clipboard',
      'close',
      { duration: 3000 }
    );

    this.matDialog.open(DisplayModalComponent, {
      data: {
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
      },
    });
  }

  getDaysDiff(startDate: Date, endDate: Date) {
    if (startDate && endDate) {
      return Math.round(
        (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
      );
    } else {
      return 0;
    }
  }

  getSumOfCountedValues(): number {
    return this.tickets.reduce(function (acc, curr) {
      if (curr.isUsed === 'No') {
        return acc + +curr.workingHours;
      } else {
        return acc;
      }
    }, 0);
  }

  ngOnDestroy() {
    this.ticketSubs.unsubscribe();
  }
}
