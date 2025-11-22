import { Component } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent {
  productId = '';
  loading = false;
  result: any = null;
  error: string | null = null;

  constructor(private svc: InventoryService) {}

  check() {
    if (!this.productId) { this.error = 'Enter product id'; return; }
    this.loading = true; this.error = null; this.result = null;
    this.svc.getAvailability(this.productId).subscribe({
      next: r => { this.result = r; this.loading = false; },
      error: e => { this.error = 'Failed to fetch availability'; this.loading = false; console.error(e); }
    });
  }
}
