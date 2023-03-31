import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
// import { SelectionModel } from '@angular/cdk/collections';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';

const NAMES: string[] = [];

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class IncidentComponent implements OnInit, OnDestroy {
  ticketSubs = new Subscription();
  ticketDeletedSubs = new Subscription();
  tickets: Ticket[] = [];
  displayedColumns: string[] = [
    'id',
    'type',
    'isIt',
    'impact',
    'shortDescription',
    'status',
    'isUsed',
    'delete',
  ];
  dataSource: MatTableDataSource<Ticket>;
  // selection = new SelectionModel<Ticket>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // toggleAllRows() {
  //   if (this.isAllSelected()) {
  //     this.selection.clear();
  //     return;
  //   }

  //   this.selection.select(...this.dataSource.data);
  // }

  // /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: Ticket): string {
  //   console.log(row?.id);
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
  //     row.id + 1
  //   }`;
  // }

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar
  ) {
    this.tickets = this.ticketService.allTickets;
    this.dataSource = new MatTableDataSource(this.tickets);
  }

  ngOnInit(): void {
    this.ticketSubs = this.ticketService.ticketChanged.subscribe(
      (newTickets) => {
        this.tickets = newTickets;
      }
    );

    this.ticketDeletedSubs = this.ticketService.ticketDeleted.subscribe(
      (newTickets) => {
        this.tickets = newTickets;
        this.dataSource = new MatTableDataSource(this.tickets);
      }
    );
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

  filterTicket(type: string){
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

  onDelete(id: string) {
    this.snackBar.open(
      'Ticket Number: ' + id + ' has been deleted',
      'close',
      { duration: 3000 }
    );
    this.ticketService.deleteTicket(id);
  }

  onCopyToClipBoard(id: string) {
    this.snackBar.open(
      'Ticket Number: ' + id + ' has been copied to clipboard',
      'close',
      { duration: 3000 }
    );
  }

  ngOnDestroy() {
    this.ticketSubs.unsubscribe();
    this.ticketDeletedSubs.unsubscribe();
  }
}
