import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BulkStatus {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  processed?: number;
  total?: number;
  errors?: any[];
  success?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // change if your backend URL differs
  private API_BASE = 'http://localhost:5000/api/inventory';

  constructor(private http: HttpClient) { }

  uploadBulkFile(file: File): Observable<HttpEvent<any>> {
    const form = new FormData();
    form.append('file', file);
    const req = new HttpRequest('POST', `${this.API_BASE}/bulk-upload`, form, { reportProgress: true });
    return this.http.request(req);
  }

  getBulkStatus(uploadId: string): Observable<BulkStatus> {
    return this.http.get<BulkStatus>(`${this.API_BASE}/bulk-status/${uploadId}`);
  }

  getAvailability(productId: string): Observable<any> {
    return this.http.get<any>(`${this.API_BASE}/${productId}/availability`);
  }


  getAllStock(): Observable<any> {
    return this.http.get<any>(`${this.API_BASE}/`);
  }
  reserveStock(productId: string, qty: number): Observable<any> {
    return this.http.post<any>(`${this.API_BASE}/reserve`, { productId, qty });
  }

  confirmStock(reservationId: string): Observable<any> {
  return this.http.post<any>(`${this.API_BASE}/confirm`, { reservationId });
}




}
