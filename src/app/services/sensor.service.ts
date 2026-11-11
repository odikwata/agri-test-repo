import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportedSensorResponse } from '../models/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/mobile/sensors';

  /**
   * Retrieves supported sensors for a given species from Spring Boot backend:
   * GET /api/v1/mobile/sensors/{speciesId}/supported-sensors
   */
  getSupportedSensorsBySpecies(speciesId: string): Observable<SupportedSensorResponse[]> {
    return this.http.get<SupportedSensorResponse[]>(`${this.apiUrl}/${speciesId}/supported-sensors`);
  }
}
