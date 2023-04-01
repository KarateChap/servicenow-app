import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-display-modal',
  templateUrl: './display-modal.component.html',
  styleUrls: ['./display-modal.component.css'],
})
export class DisplayModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DisplayModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar: MatSnackBar
  ) {}

  copyToClipBoard(text: string){
    this.snackBar.open(
      "'" + text + "'" + ' has been copied to clipboard',
      'close',
      { duration: 3000 }
    );
  }
}
