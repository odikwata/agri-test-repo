import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HoldingResponse, PenResponse } from '../models/livestock.model';

@Injectable({
  providedIn: 'root'
})
export class HoldingService {
  private http = inject(HttpClient);

  /**
   * GET /kraals/farm/{id}
   * Retrieves kraals (holdings) for a given farm ID from external API
   */
  getKraalsByFarmId(id: string): Observable<HoldingResponse[]> {
    return this.http.get<HoldingResponse[]>(`/kraals/farm/${id}`);
  }

  /**
   * GET /pens/kraal/{id}
   * Retrieves pens for a given kraal ID from external API
   */
  getPensByKraalId(id: string): Observable<PenResponse[]> {
    return this.http.get<PenResponse[]>(`/pens/kraal/${id}`);
  }
}
