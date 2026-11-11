import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Animal,
  HealthRecord,
  BreedingRecord,
  LivestockQuery,
  PaginatedResponse,
  AnimalRosterDTOs,
  AnimalDossierDTOs
} from '../models/livestock.model';

@Injectable({
  providedIn: 'root'
})
export class LivestockService {
  private http = inject(HttpClient);
  
  private apiUrl = '/api/livestock/v1';

  /**
   * Fetches the paged Animal Roster and Herd Telemetry from the external backend
   * GET /api/v1/livestock?holdingId=...&search=...&page=...&size=...
   */
  getRoster(holdingId?: string, search?: string, page: number = 0, size: number = 10): Observable<AnimalRosterDTOs.PagedRosterResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (holdingId && holdingId !== 'all') {
      params = params.set('holdingId', holdingId);
    }
    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }

    return this.http.get<AnimalRosterDTOs.PagedRosterResponse>('/api/v1/livestock', { params });
  }

  /**
   * Animal View / Dossier Endpoints (/api/v1/livestock/{id}/*)
   */
  getAnimalProfile(id: string): Observable<AnimalDossierDTOs.FullAnimalProfileResponse> {
    return this.http.get<AnimalDossierDTOs.FullAnimalProfileResponse>(`/api/v1/livestock/${encodeURIComponent(id)}/profile`);
  }

  updateAnimalProfile(id: string, payload: AnimalDossierDTOs.UpdateProfileRequest): Observable<AnimalDossierDTOs.ProfileHeaderDTO> {
    return this.http.put<AnimalDossierDTOs.ProfileHeaderDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/profile`, payload);
  }

  moveAnimalLocation(id: string, payload: AnimalDossierDTOs.MoveLocationRequest): Observable<AnimalDossierDTOs.ProfileHeaderDTO> {
    return this.http.post<AnimalDossierDTOs.ProfileHeaderDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/move-location`, payload);
  }

  updateAnimalStatus(id: string, payload: AnimalDossierDTOs.UpdateStatusRequest): Observable<AnimalDossierDTOs.ProfileHeaderDTO> {
    return this.http.patch<AnimalDossierDTOs.ProfileHeaderDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/status`, payload);
  }

  getHealthMedical(id: string): Observable<AnimalDossierDTOs.HealthMedicalTabDTO> {
    return this.http.get<AnimalDossierDTOs.HealthMedicalTabDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/health-medical`);
  }

  getFeedingRations(id: string): Observable<AnimalDossierDTOs.FeedingRationsTabDTO> {
    return this.http.get<AnimalDossierDTOs.FeedingRationsTabDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/feeding-rations`);
  }

  getBreedingPedigree(id: string): Observable<AnimalDossierDTOs.BreedingPedigreeTabDTO> {
    return this.http.get<AnimalDossierDTOs.BreedingPedigreeTabDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/breeding-pedigree`);
  }

  getAccountingValuation(id: string): Observable<AnimalDossierDTOs.AccountingValuationTabDTO> {
    return this.http.get<AnimalDossierDTOs.AccountingValuationTabDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/accounting-valuation`);
  }

  getTelemetryRumination(id: string): Observable<AnimalDossierDTOs.TelemetryRuminationTabDTO> {
    return this.http.get<AnimalDossierDTOs.TelemetryRuminationTabDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/telemetry-rumination`);
  }

  getVaccinations(id: string): Observable<AnimalDossierDTOs.VaccinationRecordDTO[]> {
    return this.http.get<AnimalDossierDTOs.VaccinationRecordDTO[]>(`/api/v1/livestock/${encodeURIComponent(id)}/vaccinations`);
  }

  addVaccination(id: string, payload: AnimalDossierDTOs.CreateVaccinationRequest): Observable<AnimalDossierDTOs.VaccinationRecordDTO> {
    return this.http.post<AnimalDossierDTOs.VaccinationRecordDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/vaccinations`, payload);
  }

  getUpcomingChecks(id: string): Observable<AnimalDossierDTOs.UpcomingCheckDTO[]> {
    return this.http.get<AnimalDossierDTOs.UpcomingCheckDTO[]>(`/api/v1/livestock/${encodeURIComponent(id)}/upcoming-checks`);
  }

  addUpcomingCheck(id: string, payload: AnimalDossierDTOs.CreateUpcomingCheckRequest): Observable<AnimalDossierDTOs.UpcomingCheckDTO> {
    return this.http.post<AnimalDossierDTOs.UpcomingCheckDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/upcoming-checks`, payload);
  }

  getMedicalLogs(id: string): Observable<AnimalDossierDTOs.MedicalLogDTO[]> {
    return this.http.get<AnimalDossierDTOs.MedicalLogDTO[]>(`/api/v1/livestock/${encodeURIComponent(id)}/medical-logs`);
  }

  addMedicalLog(id: string, payload: AnimalDossierDTOs.CreateMedicalLogRequest): Observable<AnimalDossierDTOs.MedicalLogDTO> {
    return this.http.post<AnimalDossierDTOs.MedicalLogDTO>(`/api/v1/livestock/${encodeURIComponent(id)}/medical-logs`, payload);
  }

  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/animals`);
  }

  getAnimalsPaginated(query: LivestockQuery): Observable<PaginatedResponse<Animal>> {
    let params = new HttpParams()
      .set('page', query.page.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.search) params = params.set('search', query.search);
    if (query.type) params = params.set('type', query.type);
    if (query.status) params = params.set('status', query.status);
    if (query.gender) params = params.set('gender', query.gender);
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortOrder) params = params.set('sortOrder', query.sortOrder);

    return this.http.get<PaginatedResponse<Animal>>(`${this.apiUrl}/animals/paginated`, { params });
  }

  getAnimalById(id: string): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/animals/${id}`);
  }

  addAnimal(animal: Partial<Animal>): Observable<Animal> {
    return this.http.post<Animal>(`${this.apiUrl}/animals`, animal);
  }

  getHealthRecords(animalId: string): Observable<HealthRecord[]> {
    return this.http.get<HealthRecord[]>(`${this.apiUrl}/animals/${animalId}/health`);
  }

  addHealthRecord(record: Partial<HealthRecord>): Observable<HealthRecord> {
    return this.http.post<HealthRecord>(`${this.apiUrl}/health`, record);
  }
}

