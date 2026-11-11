import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LivestockStats } from '../models/livestock.model';

@Injectable({
  providedIn: 'root'
})
export class LivestockDashboardService {
  private http = inject(HttpClient);
  
  private apiUrl = '/api/livestock/v1/stats';

  getStats(): Observable<LivestockStats> {
    return this.http.get<LivestockStats>(this.apiUrl);
  }
}
