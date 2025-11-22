import { Component } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent {

  productId = '';
  qty: number | null = null;

  message: string | null = null;
  error: string | null = null;

  loading = false;

  constructor(private svc: InventoryService) {}

  reserve() {
    this.message = null;
    this.error = null;

    if (!this.productId || !this.qty) {
      this.error = "Please enter Product ID and Quantity";
      return;
    }

    this.loading = true;

    this.svc.reserveStock(this.productId, this.qty).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = `Reserved successfully! Updated Stock → Available: ${res.availableStock}, Reserved: ${res.reservedStock}`;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || "Failed to reserve stock";
      }
    });
  }
}
