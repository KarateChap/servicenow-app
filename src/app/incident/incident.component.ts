import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface ticketData {
  id: string;
  isIt: string;
  impact: string;
  shortDescription: string;
  status: string;
  isUsed: boolean;
}

const NAMES: string[] = [];

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css'],
})
export class IncidentComponent {
  displayedColumns: string[] = [
    'select',
    'id',
    'isIt',
    'impact',
    'shortDescription',
    'status',
  ];
  dataSource: MatTableDataSource<ticketData>;
  selection = new SelectionModel<ticketData>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ticket: ticketData[] = [
    {
      id: 'INC0128237',
      isIt: 'Zycus',
      impact: 'Low',
      shortDescription: 'PU TS User ID Creation',
      status: 'In-Progress',
      isUsed: false,
    },
    {
      id: 'INC0128241',
      isIt: 'Coupa',
      impact: 'Medium',
      shortDescription: 'Change the contracting Party',
      status: 'Waiting For',
      isUsed: false,
    },
    {
      id: 'INC0128257',
      isIt: 'SAP Themis',
      impact: 'High',
      shortDescription: 'Create Purchase Order',
      status: 'Resolved',
      isUsed: true,
    },
  ];

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ticketData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  constructor() {
    this.dataSource = new MatTableDataSource(this.ticket);
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
}
