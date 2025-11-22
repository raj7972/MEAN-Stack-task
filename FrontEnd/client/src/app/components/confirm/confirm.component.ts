import { Component } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  reservationId = '';
  loading = false;
  message: string | null = null;
  error: string | null = null;

  constructor(private svc: InventoryService) {}

  confirm() {
    this.message = null;
    this.error = null;

    if (!this.reservationId) {
      this.error = "Please enter Reservation ID";
      return;
    }

    this.loading = true;

    this.svc.confirmStock(this.reservationId).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res.message;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || "Failed to confirm stock";
      }
    });
  }
}
