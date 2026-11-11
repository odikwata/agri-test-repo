import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpeciesResponseModel, BreedResponseModel, PaginatedResponse } from '../models/species.model';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {
  private http = inject(HttpClient);
  private baseUrl = '/api/external/';

  getAllSpecies(page: number = 0, size: number = 50, sort: string = 'commonName,asc'): Observable<PaginatedResponse<SpeciesResponseModel>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('_t', Date.now().toString());
      
    return this.http.get<PaginatedResponse<SpeciesResponseModel>>(`${this.baseUrl}species/all`, {
      params,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }

  getBreedsBySpeciesId(speciesId: string): Observable<BreedResponseModel[]> {
    const params = new HttpParams().set('_t', Date.now().toString());
    return this.http.get<BreedResponseModel[]>(`${this.baseUrl}breeds/species/${speciesId}`, {
      params,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}
