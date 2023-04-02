import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { AddEditModalComponent } from './add-edit-modal/add-edit-modal.component';
// import { SelectionModel } from '@angular/cdk/collections';
import { Ticket } from '../shared/model/ticket.model';
import { TicketService } from '../shared/services/ticket.service';
import { DisplayModalComponent } from './display-modal/display-modal.component';
import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';
import { TicketID } from '../shared/model/ticketId.model';
import { NgxCsvParser } from 'ngx-csv-parser';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

const NAMES: string[] = [];

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit, OnDestroy {
  userId = '';
  ticketSubs = new Subscription();
  tickets: TicketID[] = [];
  csvTickets: Ticket[] = [];
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

  dataSource: MatTableDataSource<TicketID>;
  // selection = new SelectionModel<Ticket>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    public authService: AuthService,
    private ngxCsvParser: NgxCsvParser
  ) {
    this.dataSource = new MatTableDataSource(this.tickets);
  }

  ngOnInit(): void {
    this.ticketSubs = this.ticketService.ticketChanged.subscribe(
      (newTickets) => {
        this.tickets = newTickets;
        this.dataSource = new MatTableDataSource(this.tickets);
        this.ticketService.tickets = this.tickets;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );

    this.authService.checkAuth().then((user) => {
      this.userId = user.uid;
      this.ticketService.userId = this.userId;

      this.ticketService.getTickets();
      this.authService.getUserData(this.userId);
    });
  }

  ngAfterViewInit() {}

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

  onIsUsedChanged(row: TicketID, isUsed: string) {
    this.snackBar.open(
      'Ticket Number: ' +
        row.id +
        ' has been changed to: ' +
        (isUsed === 'Yes' ? "'Used'" : "'Available'"),
      'close',
      { duration: 3000 }
    );
    this.ticketService.changeIsUsed(row.ticketId, isUsed);
  }

  onStatusChanged(row: TicketID, status: string) {
    this.snackBar.open(
      'Ticket Number: ' +
        row.id +
        ' has been changed with the new status: ' +
        "'" +
        status +
        "'",
      'close',
      { duration: 3000 }
    );
    this.ticketService.changeStatus(row.ticketId, status);
  }

  addNewTicket() {

    this.matDialog.open(AddEditModalComponent, {
      data: {
        isEdit: false,
        userId: this.userId,
      },
    });
  }
  onEdit(row: TicketID) {
    this.matDialog.open(AddEditModalComponent, {
      data: {
        userId: this.userId,
        ticketId: row.ticketId,
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

  onDelete(ticket: TicketID) {
    this.snackBar.open(
      'Ticket Number: ' + ticket.id + ' has been deleted',
      'close',
      {
        duration: 3000,
      }
    );
    this.ticketService.deleteTicket(ticket.ticketId);
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

  fileChangeListener($event: any): void {
    let files = $event.srcElement.files;
    this.ngxCsvParser
      .parse(files[0], { header: true, delimiter: ',' })
      .pipe()
      .subscribe((result: any) => {
        result.forEach(el => {
          this.csvTickets.push({
            id: el['id'],
            type: el['type'],
            dateReceived: el.receivedDate ? new Date(el.receivedDate) : null,
            dateResolved: el.resolvedDate ? new Date(el.resolvedDate) : null,
            isIt: el['isIt'],
            serviceModule: el['serviceModule'],
            deliveredToOrganization: el['deliveredToOrganization'],
            category: el['category'],
            impact: el['impact'],
            shortDescription: el['shortDescription'],
            status: el['status'],
            workingHours: el['workingHours'],
            isUsed: el['isUsed'],
          })
        });


        const filteredTickets = this.csvTickets.filter((newItem) => {
          return !this.tickets.find((existingItem) => existingItem.id === newItem.id);
        });

        filteredTickets.forEach(element => {
          this.ticketService.addNewTicket(element);
        });

        console.log(filteredTickets);
      });
  }

  deleteAllTicket(){
    this.ticketService.allTicketsToDelete = this.tickets;
    this.matDialog.open(DeleteModalComponent);
  }

  ngOnDestroy() {
    this.ticketSubs.unsubscribe();
  }
}
