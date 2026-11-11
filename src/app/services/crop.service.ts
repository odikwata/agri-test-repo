import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface PlantingCycleListResponse {
    id: string;
    sid?: string;
    crop: string;
    varietyName?: string;
    plantedDate: string;
    expectedPlantingDate?: string;
    expectedHarvestDate: string;
    status?: string;
    actualHarvestDate: string | null;
    areaHa?: number;
    allocationPercentage?: number;
    plantingPattern?: string;
    currentStage?: string;
    cycleProgressPercentage?: number;
    daysAfterPlanting?: number;
    targetYield?: string;
}

export interface PlantingCycleResponse {
    id: string;
    sid: string;
    managementUnitId?: string;
    managementUnitName?: string;
    growthProgram: { id: string; name: string };
    variety: { id: string; commonName: string };
    plantedDate: string;
    expectedPlantingDate?: string;
    expectedHarvestDate: string;
    actualHarvestDate: string | null;
    areaSize?: number;
    plantingArea?: number;
    seedsPlanted: number;
    crop: { id: string; name: string };
    projectedYield?: string;
    targetYield?: string;
    fieldId?: string;
    currentGrowthStage?: {
        id: string;
        stageName: string;
        stageOrder: number;
        baselineDurationDays?: number;
    } | null;
}

export interface CropSpeciesResponse {
  id: string;
  commonName: string;
}

export interface CropVarietyResponse {
  id: string;
  scientificName: string;
  commonName: string;
  breedSpecificData?: any;
}


export interface GrowthProgramResponse {
    id: string;
    name: string;
    variety: { id: string; commonName: string };
    crop: { id: string; name: string };
    growthStageList: GrowthStage[];
}

export interface GrowthStage {
    id: string;
    stageName: string;
    durationInDays: number;
    growthStageSpecificData: any;
    growthActivityStageActivities: GrowthActivityStageActivity[];
    growthParameterSpecs: GrowthParameterSpec[];
}

export interface GrowthActivityStageActivity {
    id: string;
    name: string;
    minStartDay?: number;
    maxStartDay: number;
    activityType: string;
    dosage?: string;
    brandRecommendation?: string;
    applicationMethod?: string;
    mandatory?: boolean;
    safetyPrecautions?: string;
    notes?: string;
    frequency?: string;
    frequencyUnit?: string;
    formSchema?: any[];
}

export interface GrowthParameterSpec {
    id?: string;
    parameterId?: string;
    parameterCode?: string;
    elementName: string;
    elementSymbol?: string;
    maxValue?: string;
    minValue?: string;
    targetValue?: string;
    dataType?: string;
    unit?: string;
    tolerancePercentage?: number;
}

export interface CropStageFilterParams {
    speciesId?: string;
    breedId?: string;
    programId?: string;
    plantingCycleId?: string;
}

export interface CropStageDTO {
    id: string;
    growthStageId?: string;
    programStageId?: string | null;
    stageName: string;
    stageOrder: number;
    durationInDays: number;
    baselineDurationDays?: number;
    startDayOffset?: number;
    endDayOffset?: number;
    plannedStartDate?: string | null;
    plannedEndDate?: string | null;
    status?: 'COMPLETED' | 'CURRENT' | 'UPCOMING' | string;
    isCurrentStage?: boolean;
    speciesId?: string;
    cropName?: string;
    varietyId?: string | null;
    varietyName?: string | null;
    growthStageSpecificData?: {
        code?: string;
        [key: string]: any;
    } | null;
    growthParameterSpecs?: GrowthParameterSpec[];
    growthProgramStageActivities?: GrowthActivityStageActivity[];
    growthActivityStageActivities?: GrowthActivityStageActivity[];
}

export interface ResourceUsageInput {
  resourceType: string;
  inventoryItemId?: string;
  resourceName?: string;
  quantityUsed: number;
  unitOfMeasure: string;
  packageSize?: number;
  packageUnitOfMeasure?: string;
  unitCostOverride?: number;
  notes?: string;
}

export interface UpdateActivityStatusWithResourcesRequest {
  status: string;
  remarks?: string;
  updatedBy?: string;
  resourcesUsed?: ResourceUsageInput[];
}

export interface CreatePlantingCycleActivityRequest {
    plantingCycleId: string;
    growthStageActivityId?: string;
    description: string;
    activityType: string;
    priority?: string;
    assignee?: string;
    plannedStartDate: string;
    plannedEndDate: string;
    targetAreaHa?: number;
    subLocationNotes?: string;
    estimatedCost?: number;
    remarks?: string;
}


export interface ActivityResourceDTO {
    id: string;
    resourceType: string;
    inventoryItemId: string;
    resourceName: string;
    quantityUsed: number;
    unitOfMeasure: string;
    unitCost: number;
    totalCost: number;
    isInventoryDeducted: boolean;
}

export interface StageHistoryDTO {
    id: string;
    status: string;
    remarks: string;
    updatedBy: string;
    enteredOn: string;
}

export interface PlantingCycleActivityDetailDTO {
    id: string;
    plantingCycleId: string;
    plantingCycleName: string;
    growthStageActivityId: string;
    growthStageActivityName: string;
    description: string;
    activityType: string;
    priority: string;
    assignee: string;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate: string;
    actualEndDate: string;
    targetAreaHa: number;
    subLocationNotes: string;
    estimatedCost: number;
    actualCost: number;
    verifiedBy: string;
    remarks: string;
    enteredOn: string;
    currentStage: StageHistoryDTO;
    stageHistory: StageHistoryDTO[];
    resourcesUsed: ActivityResourceDTO[];
}

export interface PlantingCycleActivityListDTO {
    id: string;
    plantingCycleId: string;
    description: string;
    activityType: string;
    priority: string;
    assignee: string;
    plannedStartDate: string;
    plannedEndDate: string;
    targetAreaHa: number;
    estimatedCost: number;
    actualCost: number;
    currentStatus: string;
    currentStageRemarks: string;
    statusUpdatedAt: string;
}

export interface PagedResponse<T> {
    content: T[];
    currentPage: number;
    total: number;
    pages: number;
}

export interface GrowthProgramDropDownList {
    id: string;
    name: string;
}

export interface CreatePlantingCycleRequest {
    breedId: string;
    managementUnitId: string;
    growthProgramId?: string;
    plantedDate?: string;
    expectedPlantingDate?: string;
    expectedHarvestDate?: string;
    areaSize?: number;
    seedsPlanted?: number;
    numberOfRows?: number;
    rowLength?: number;
    plantingArea?: number;
    expectedYield?: number;
    rowSpacing?: number;
    plantSpacing?: number;
    plantingDepth?: number;
    seedsPerHole?: number;
    plantingMethod?: string;
    cycleSpecificData?: any;
}


export interface TotalPlantedAreaResponse {
    currentSeasonAreaHa: number;
    previousSeasonAreaHa: number;
    percentageChange: number;
    trend: string;
    currentSeasonCode: string;
}

export interface ActiveCropDetail {
    cropName: string;
    cycleCount: number;
    totalAreaHa: number;
}

export interface ActiveCropsResponse {
    totalActiveCycles: number;
    activeCropNames: string[];
    cropBreakdown: ActiveCropDetail[];
}

export interface ApproachingHarvestDetail {
    cycleId: string;
    cropName: string;
    varietyName: string;
    fieldName: string;
    expectedHarvestDate: string;
    daysUntilHarvest: number;
}

export interface ApproachingHarvestResponse {
    count: number;
    fields: ApproachingHarvestDetail[];
}

export interface ActivePlantingCycleItem {
    cycleId: string;
    cropName: string;
    varietyName: string;
    fieldName: string;
    currentStage: string;
    plantedDate: string;
    expectedHarvestDate: string;
    cycleProgressPercentage: number;
}

export interface UpcomingScheduleItem {
    activityId: string;
    activityTitle: string;
    plannedStartDate: string;
    cropVariety: string;
    targetField: string;
    estimatedDuration: string;
    status: string;
}

@Injectable({ providedIn: 'root' })

export class CropService {
  private http = inject(HttpClient);


  updatePlantingCycleActuals(id: string, payload: any): Observable<any> {
    return this.http.post(`/api/external/crop/planting-cycle/update-actuals/${id}`, payload);
  }

  createPlantingCycle(request: CreatePlantingCycleRequest): Observable<PlantingCycleResponse> {

    return this.http.post<PlantingCycleResponse>('/api/external/crop/planting-cycle/create', request);
  }

  
  getGrowthProgramById(id: string): Observable<GrowthProgramResponse> {
    return this.http.get<GrowthProgramResponse>(`/api/external/growth-program/${id}`);
  }

  getGrowthPrograms(speciesId: string, breedId: string): Observable<GrowthProgramDropDownList[]> {
    return this.http.get<GrowthProgramDropDownList[]>(`/api/external/crop/growth-program/species/${speciesId}/breed/${breedId}`);
  }

  private buildStageQueryString(filters?: CropStageFilterParams): string {
    if (!filters) return '';
    const params = new URLSearchParams();
    if (filters.speciesId) params.set('speciesId', filters.speciesId);
    if (filters.breedId) params.set('breedId', filters.breedId);
    if (filters.programId) params.set('programId', filters.programId);
    if (filters.plantingCycleId) params.set('plantingCycleId', filters.plantingCycleId);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }

  // 1. Get All Crop Stages (with optional filters: speciesId, breedId, programId, plantingCycleId)
  getCropStages(filters?: CropStageFilterParams): Observable<CropStageDTO[]> {
    const qs = this.buildStageQueryString(filters);
    return this.http.get<CropStageDTO[]>(`/api/v1/crop/stages${qs}`).pipe(
      catchError(() => of([]))
    );
  }

  getGrowthProgramStages(filters?: CropStageFilterParams): Observable<CropStageDTO[]> {
    const qs = this.buildStageQueryString(filters);
    return this.http.get<CropStageDTO[]>(`/api/v1/growth-program/stages${qs}`).pipe(
      catchError(() => of([]))
    );
  }

  // 2. Get Stages by Crop / Variety / Program / Planting Cycle ID (or Crop Name)
  getCropStagesById(id: string): Observable<CropStageDTO[]> {
    return this.http.get<CropStageDTO[]>(`/api/v1/crop/stages/${encodeURIComponent(id)}`).pipe(
      catchError(() => of([]))
    );
  }

  getStagesForCrop(id: string): Observable<CropStageDTO[]> {
    return this.http.get<CropStageDTO[]>(`/api/v1/crop/${encodeURIComponent(id)}/stages`).pipe(
      catchError(() => of([]))
    );
  }

  getGrowthProgramStagesById(id: string): Observable<CropStageDTO[]> {
    return this.http.get<CropStageDTO[]>(`/api/v1/growth-program/stages/${encodeURIComponent(id)}`).pipe(
      catchError(() => of([]))
    );
  }

  getStagesForGrowthProgram(id: string): Observable<CropStageDTO[]> {
    return this.http.get<CropStageDTO[]>(`/api/v1/growth-program/${encodeURIComponent(id)}/stages`).pipe(
      catchError(() => of([]))
    );
  }

  // 3. Explicit Resource Stage Endpoints
  getStagesBySpecies(speciesId: string): Observable<CropStageDTO[]> {
    return this.http.get<CropStageDTO[]>(`/api/v1/crop/species/${encodeURIComponent(speciesId)}/stages`).pipe(
      catchError(() => of([]))
    );
  }

  getStagesByVariety(varietyId: string): Observable<CropStageDTO[]> {
    return this.http.get<CropStageDTO[]>(`/api/v1/crop/variety/${encodeURIComponent(varietyId)}/stages`).pipe(
      catchError(() => of([]))
    );
  }

  getStagesByPlantingCycle(plantingCycleId: string): Observable<CropStageDTO[]> {
    return this.http.get<CropStageDTO[]>(`/api/v1/crop/planting-cycle/${encodeURIComponent(plantingCycleId)}/stages`).pipe(
      catchError(() => of([]))
    );
  }

  getPlantingCyclesForManagementUnit(id: string): Observable<PlantingCycleListResponse[]> {
    return this.http.get<PlantingCycleListResponse[]>(`/api/external/crop/management-units/${id}/planting-cycles`);
  }

  getCropSpecies(): Observable<{content: CropSpeciesResponse[]}> {
    return this.http.get<{content: CropSpeciesResponse[]}>(`/api/external/species/all?types=CROP&_t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
    });
  }

  getCropVarieties(speciesId: string): Observable<CropVarietyResponse[]> {
    return this.http.get<CropVarietyResponse[]>(`/api/external/breeds/species/${speciesId}?_t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
    });
  }

  getPlantingCycle(id: string): Observable<PlantingCycleResponse> {
    return this.http.get<PlantingCycleResponse>(`/api/external/crop/planting-cycle/${id}`);
  }
  
  
  
  updateActivityStatus(id: string, payload: UpdateActivityStatusWithResourcesRequest): Observable<any> {
    return this.http.post(`/api/external/crop/planting-cycle/activities/status-update/${id}`, payload);
  }

  getPlantingCycleActivity(id: string): Observable<PlantingCycleActivityDetailDTO> {
    return this.http.get<PlantingCycleActivityDetailDTO>(`/api/external/crop/planting-cycle/activity/${id}`);
  }

  getPlantingCycleActivities(id: string, page: number = 0, size: number = 10,payload:any): Observable<PagedResponse<PlantingCycleActivityListDTO>> {
    return this.http.post<PagedResponse<PlantingCycleActivityListDTO>>(`/api/external/crop/planting-cycle/${id}/activities?page=${page}&size=${size}`, payload);
  }
  
  createPlantingCycleActivity(request: CreatePlantingCycleActivityRequest): Observable<any> {
    return this.http.post('/api/external/crop/planting-cycle/activities/create', request);
  }

  getTotalAreaPlanted(): Observable<TotalPlantedAreaResponse> {
    return this.http.get<TotalPlantedAreaResponse>('/api/external/crop/planting-schedule/total-area-planted').pipe(
      catchError(() => of({
        currentSeasonAreaHa: 731.5,
        previousSeasonAreaHa: 680.0,
        percentageChange: 7.57,
        trend: 'UP',
        currentSeasonCode: '2025/2026 Arable Season'
      }))
    );
  }

  getActiveCrops(): Observable<ActiveCropsResponse> {
    return this.http.get<ActiveCropsResponse>('/api/external/crop/planting-schedule/active-crops');
  }

  getApproachingHarvest(daysWindow: number = 14): Observable<ApproachingHarvestResponse> {
    return this.http.get<ApproachingHarvestResponse>(`/api/external/crop/planting-schedule/approaching-harvest?daysWindow=${daysWindow}`);
  }

  getActivePlantingCycles(): Observable<ActivePlantingCycleItem[]> {
    return this.http.get<ActivePlantingCycleItem[]>('/api/external/crop/planting-schedule/active-planting-cycles');
  }

  getUpcomingSchedule(): Observable<UpcomingScheduleItem[]> {
    return this.http.get<UpcomingScheduleItem[]>('/api/external/crop/planting-schedule/upcoming-schedule');
  }
}
