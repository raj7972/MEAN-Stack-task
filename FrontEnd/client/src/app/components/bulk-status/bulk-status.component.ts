import { Component, Input, OnInit } from '@angular/core';
import { InventoryService, BulkStatus } from '../../services/inventory.service';

@Component({
  selector: 'app-bulk-status',
  template: `
  <div class="small-card" *ngIf="uploadId">
    <div><strong>Upload:</strong> {{uploadId}}</div>
    <div *ngIf="status">Status: {{status.status}} — {{status.processed || 0}} / {{status.total || 0}}</div>
    <div *ngIf="!status">Loading...</div>
  </div>
  `,
  styles: [`.small-card{padding:8px;background:#fff;border-radius:8px;border:1px solid #eef4ff;margin-top:6px}`]
})
export class BulkStatusComponent implements OnInit {
  @Input() uploadId!: string;
  status: BulkStatus | null = null;
  stocks : any

  constructor(private svc: InventoryService) {}

  ngOnInit() {
    if (!this.uploadId) return;
    this.svc.getBulkStatus(this.uploadId).subscribe(s => this.status = s, err => console.warn(err));
    this.svc.getAllStock().subscribe(res=>{
      this.stocks = res
      console.log(this.stocks,"Available stocks");
      
    })
  }
}
