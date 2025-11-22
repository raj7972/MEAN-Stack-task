import { Component } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css']
})
export class ReleaseComponent {

  reservationId = '';
  loading = false;
  message: string | null = null;
  error: string | null = null;

  constructor(private svc: InventoryService) {}

  release() {
    this.message = null;
    this.error = null;

    if (!this.reservationId) {
      this.error = 'Please enter Reservation ID';
      return;
    }

    this.loading = true;

    this.svc.releaseReservation(this.reservationId).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res.message || 'Reservation released successfully';
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to release reservation';
      }
    });
  }
}
