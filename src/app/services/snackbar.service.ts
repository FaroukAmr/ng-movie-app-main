import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string, duration: number = 5000) {
    this.snackBar.open(message, 'Close', {
      duration: duration,
    });
  }
}
