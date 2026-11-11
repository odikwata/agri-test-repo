import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from '../models/livestock.model';
import { PairedSensorEntry } from '../models/sensor.model';

export type EnrollmentMode = 'INDIVIDUAL' | 'BATCH_GROUP';
export type GenderEnum = 'MALE' | 'FEMALE' | 'MIXED_FLOCK';

export interface Step1UnifiedRequest {
  enrollmentMode: EnrollmentMode;
  speciesId: string;
  breedId: string;
  visualTag?: string;
  rfidMicrochip?: string;
  tagColorPlacement?: string;
  registeredAlias?: string;
  batchLotId?: string;
  quantityCount?: number;
  unitType?: string;
  productionPurpose?: string;
  gender?: GenderEnum;
  sexReproductiveClass?: string;
  dateOfBirthOrPlacement: string;
  birthDeliveryType?: string;
  polledHornStatus?: string;
  imageUrl?: string;
}

export interface Step2PedigreeRequest {
  sireId?: string;
  sireName?: string;
  sireRegistrationNumber?: string;
  sireRfid?: string;
  sireEpdTraits?: Record<string, any>;
  motherId?: string;
  damName?: string;
  damRegistrationNumber?: string;
  damVisualTag?: string;
  damEpdTraits?: Record<string, any>;
  breedRegistry?: string;
  officialAssociationRegNumber?: string;
  conceptionMethod?: string;
  tsuSampleBarcode?: string;
}

export interface Step3VitalsRequest {
  weightKg: number;
  bodyConditionScore?: number;
  scaleDeviceId?: string;
  quarantineDisposition?: string;
  originCadastre?: string;
  bvdPiNegative?: boolean;
  clostridialBoosterGiven?: boolean;
  parasiticideDrenchGiven?: boolean;
  brucellosisTattooVerified?: boolean;
}

export interface Step4IoTPairingRequest {
  smartCollarSerial?: string;
  reticulorumenBolusSerial?: string;
  initialTempC?: number;
  initialPh?: number;
  gatewayIdentifier?: string;
  sensors?: PairedSensorEntry[];
}

export interface Step5SpatialAllocationRequest {
  holdingId: string;
  penId: string;
  farmId?: string;
  managementCohort?: string;
  nutritionProtocol?: string;
  assetCapitalizationCost?: number;
  clinicalNotes?: string;
  imageUrl?: string;
}

export interface StepResponse {
  draftId: string;
  stepCompleted: number;
  tagNumber: string;
  rfidTag: string;
  message: string;
  syncedAt: string;
}

export interface EnrollmentFinalizedResponse {
  animalId: string;
  tagNumber: string;
  rfidTag: string;
  registeredAlias: string;
  speciesName: string;
  breedName: string;
  holdingName: string;
  penName: string;
  intakeWeightKg: number;
  message: string;
  enrolledAt: string;
}

export interface DraftDetailsResponse {
  draftId: string;
  stepCompleted: number;
  tagNumber: string;
  rfidTag: string;
  step1Data?: Step1UnifiedRequest;
  step2Data?: Step2PedigreeRequest;
  step3Data?: Step3VitalsRequest;
  step4Data?: Step4IoTPairingRequest;
  step5Data?: Step5SpatialAllocationRequest;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnimalManagementService {
  private http = inject(HttpClient);
  
  private apiUrl = '/api/livestock/v1/animals';
  private stepApiUrl = '/api/v1/livestock/registration-steps';

  // Step 1: POST /api/v1/animals/registration-steps/step1
  saveStep1(request: Step1UnifiedRequest, draftId?: string): Observable<StepResponse> {
    let params = new HttpParams();
    if (draftId) {
      params = params.set('draftId', draftId);
    }
    return this.http.post<StepResponse>(`${this.stepApiUrl}/step1`, request, { params });
  }

  // Step 2: PUT /api/v1/animals/registration-steps/{draftId}/step2
  saveStep2(draftId: string, request: Step2PedigreeRequest): Observable<StepResponse> {
    return this.http.put<StepResponse>(`${this.stepApiUrl}/${draftId}/step2`, request);
  }

  // Step 3: PUT /api/v1/animals/registration-steps/{draftId}/step3
  saveStep3(draftId: string, request: Step3VitalsRequest): Observable<StepResponse> {
    return this.http.put<StepResponse>(`${this.stepApiUrl}/${draftId}/step3`, request);
  }

  // Step 4: PUT /api/v1/animals/registration-steps/{draftId}/step4
  saveStep4(draftId: string, request: Step4IoTPairingRequest): Observable<StepResponse> {
    return this.http.put<StepResponse>(`${this.stepApiUrl}/${draftId}/step4`, request);
  }

  // Finalize Step 5: POST /api/v1/animals/registration-steps/{draftId}/finalize
  finalizeEnrollment(draftId: string, request: Step5SpatialAllocationRequest): Observable<EnrollmentFinalizedResponse> {
    return this.http.post<EnrollmentFinalizedResponse>(`${this.stepApiUrl}/${draftId}/finalize`, request);
  }

  // Get draft
  getDraft(draftId: string): Observable<DraftDetailsResponse> {
    return this.http.get<DraftDetailsResponse>(`${this.stepApiUrl}/${draftId}`);
  }

  addAnimal(animalData: Partial<Animal>): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, animalData);
  }

  getPotentialParents(speciesId?: string, gender?: 'male' | 'female'): Observable<{id: string, tagId: string, registeredAlias?: string, breed?: string, rfid?: string, officialAssociationRegNumber?: string}[]> {
    let url = `${this.apiUrl}/potential-parents`;
    const params: string[] = [];
    if (speciesId) {
      params.push(`speciesId=${encodeURIComponent(speciesId)}`);
    }
    if (gender) {
      params.push(`gender=${gender}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get<{id: string, tagId: string, registeredAlias?: string, breed?: string, rfid?: string, officialAssociationRegNumber?: string}[]>(url);
  }

  updateAnimal(id: string, animalData: Partial<Animal>): Observable<Animal> {
    return this.http.patch<Animal>(`${this.apiUrl}/${id}`, animalData);
  }

  deleteAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
