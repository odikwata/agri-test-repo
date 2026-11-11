import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Species, PrimaryLocation, Kraal, Pen, Breed, HoldingResponse, PenResponse } from '../models/livestock.model';
import { HoldingService } from './holding.service';

@Injectable({
  providedIn: 'root'
})
export class LivestockMetadataService {
  private http = inject(HttpClient);
  private holdingService = inject(HoldingService);
  
  private apiUrl = '/api/livestock/v1/metadata';

  getSpecies(onlyAnimals: boolean = true): Observable<Species[]> {
    let params = new HttpParams();
    if (onlyAnimals) {
      params = params.set('onlyAnimals', 'true');
    }
    return this.http.get<Species[]>(`${this.apiUrl}/species`, { params });
  }

  getBreeds(speciesId: string): Observable<Breed[]> {
    const params = new HttpParams().set('speciesId', speciesId);
    return this.http.get<Breed[]>(`${this.apiUrl}/breeds`, { params });
  }

  getLocations(): Observable<PrimaryLocation[]> {
    return this.http.get<PrimaryLocation[]>(`${this.apiUrl}/locations`);
  }

  getKraals(locationId?: string): Observable<Kraal[]> {
    let params = new HttpParams();
    if (locationId) {
      params = params.set('locationId', locationId);
    }
    return this.http.get<Kraal[]>(`${this.apiUrl}/kraals`, { params });
  }

  getPens(kraalId?: string): Observable<Pen[]> {
    let params = new HttpParams();
    if (kraalId) {
      params = params.set('kraalId', kraalId);
    }
    return this.http.get<Pen[]>(`${this.apiUrl}/pens`, { params });
  }

  getKraalsByFarmId(farmId: string): Observable<HoldingResponse[]> {
    return this.holdingService.getKraalsByFarmId(farmId);
  }

  getPensByKraalId(kraalId: string): Observable<PenResponse[]> {
    return this.holdingService.getPensByKraalId(kraalId);
  }
}
