import { Component, OnDestroy } from '@angular/core';
import { InventoryService, BulkStatus } from '../../services/inventory.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnDestroy {

  selectedFile: File | null = null;
  progress = 0;
  uploadId: string | null = null;
  status: BulkStatus | null | undefined = null;
  fileReports: { success: any[]; errors: any[] } | null = null;

  uploading = false;
  private pollSub: Subscription | null = null;

  constructor(private svc: InventoryService) {}

  // FILE SELECTION
  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.progress = 0;
    this.uploadId = null;
    this.status = null;
    this.fileReports = null;
  }

  // START UPLOAD
  startUpload() {
    if (!this.selectedFile) return;
    this.uploading = true;

    this.svc.uploadBulkFile(this.selectedFile).subscribe({
      next: ev => {
        if (ev.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * ev.loaded) / (ev.total || ev.loaded));
        }

        if (ev instanceof HttpResponse) {
          const body: any = ev.body;
          this.uploading = false;
          this.progress = 100;

          this.uploadId = body.uploadId || body.id || null;

          // some backends immediately return success array
          if (!this.uploadId) {
            this.fileReports = {
              success: body.success || [],
              errors: body.errors || []
            };
            return;
          }

          this.startPolling();
        }
      },
      error: err => {
        console.error('Upload failed', err);
        this.uploading = false;
        this.fileReports = { success: [], errors: [{ message: 'Upload failed', detail: err }] };
      }
    });
  }

  // POLLING
  private startPolling() {
    if (!this.uploadId) return;

    this.pollSub?.unsubscribe();
    this.pollSub = timer(0, 1500).subscribe(async () => {
      try {
        const s = await this.svc.getBulkStatus(this.uploadId!).toPromise();
        this.status = s;

        const normalized = s?.status?.toString().toUpperCase();

        // STOP POLLING WHEN STATUS IS NOT IN_PROGRESS
        if (normalized !== 'IN_PROGRESS') {
          this.pollSub?.unsubscribe();
          this.fileReports = {
            success: s?.success || [],
            errors: s?.errors || []
          };
        }
      } catch (err) {
        console.warn('Polling failed', err);
      }
    });
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }
}
