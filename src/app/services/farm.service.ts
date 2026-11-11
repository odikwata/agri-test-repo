import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiSpecie {
  id: string;
  commonName: string;
  type: any;
  family: string;
  scientificName: string;
}

export interface ApiFarmResponse {
  id: string;
  name: string;
  location: string;
  organisation: string;
  latitude: string;
  longitude: string;
  boundaryGeoJson: string,
  species: ApiSpecie[];
}

@Injectable({
  providedIn: 'root'
})
export class FarmService {
  private http = inject(HttpClient);
  private baseUrl = '/api/external/farm';

  getAllFarms(id: string = 'org-doasis-01'): Observable<ApiFarmResponse[]> {
    return this.http.get<ApiFarmResponse[]>(`${this.baseUrl}/all/${id}`);
  }

  getFarmById(id: string): Observable<ApiFarmResponse> {
    return this.http.get<ApiFarmResponse>(`${this.baseUrl}/${id}`);
  }
}
