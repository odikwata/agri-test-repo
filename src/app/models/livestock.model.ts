export type AnimalType = string;
export type HealthStatus = 'healthy' | 'sick' | 'quarantined' | 'treated';
export type ManagementType = 'individual' | 'group';

export interface Animal {
  id: string;
  tagId?: string;
  batchId?: string;
  managementType: ManagementType;
  quantity?: number;
  unit?: string;
  type: AnimalType;
  speciesId?: string;
  breed: string;
  gender?: 'male' | 'female';
  birthDate?: Date;
  weight?: number;
  status: HealthStatus;
  locationId?: string;
  kraalId?: string;
  penId?: string;
  motherId?: string;
  sireId?: string;
  groupId?: string;
  organizationId: string;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  date: Date;
  diagnosis: string;
  treatment: string;
  medication?: string;
  administeredBy: string;
  cost: number;
}

export interface BreedingRecord {
  id: string;
  damId: string;
  sireId?: string;
  breedingDate: Date;
  expectedBirthDate?: Date;
  status: 'pending' | 'confirmed' | 'failed' | 'delivered';
}

export interface LivestockQuery {
  search?: string;
  type?: AnimalType;
  status?: HealthStatus;
  gender?: 'male' | 'female';
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LivestockStats {
  totalAnimals: number;
  monthlyChange: number;
  healthyAnimals: number;
  requiresAttention: number;
  upcomingTasks: number;
}

export interface Breed {
  id: string;
  speciesId: string;
  name: string;
}

export interface Species {
  id: string;
  name: string;
  code?: string;
  description?: string;
  type?: string;
}

export interface PrimaryLocation {
  id: string;
  name: string;
  description?: string;
}

export interface Kraal {
  id: string;
  name: string;
  locationId: string;
  capacity?: number;
  type?: string;
}

export interface Pen {
  id: string;
  name: string;
  kraalId: string;
  capacity?: number | string;
}

export interface HoldingResponse {
  id: string;
  name?: string;
  holdingName?: string;
  kraalName?: string;
  farmId?: string;
  type?: string;
  holdingType?: string;
  capacity?: number | string;
  description?: string;
  [key: string]: any;
}

export interface PenResponse {
  id: string;
  name?: string;
  penName?: string;
  kraalId?: string;
  holdingId?: string;
  capacity?: number | string;
  penType?: string;
  type?: string;
  [key: string]: any;
}

export namespace AnimalRosterDTOs {
  export interface BioAssetColumn {
    tagNumber: string;
    displayName: string;
    imageUrl?: string;
    enrollmentMode?: 'INDIVIDUAL' | 'BATCH_GROUP' | string;
    isBatch?: boolean;
    batch?: boolean;
    hasActiveTelemetry?: boolean;
  }

  export interface LocationColumn {
    holdingName: string;
    penName: string;
    paddockName?: string | null;
  }

  export interface AgeQuantityColumn {
    primaryMetric: string;
    subMetric: string;
  }

  export interface HealthReproductionColumn {
    statusBadgeText: string;
    statusBadgeVariant: 'SUCCESS' | 'INFO' | 'DANGER' | string;
    notes?: string | null;
  }

  export interface WeightBiomassColumn {
    weightKg?: number;
    weightDisplay: string;
    dailyDeltaDisplay: string;
    isDeltaPositive?: boolean;
    deltaPositive?: boolean;
  }

  export interface YieldIndexColumn {
    primaryYield: string;
    secondaryIndex: string;
    isWithheld?: boolean;
    withheld?: boolean;
  }

  export interface AnimalRosterRowResponse {
    id: string;
    bioAsset: BioAssetColumn;
    location: LocationColumn;
    ageQuantity: AgeQuantityColumn;
    healthReproduction: HealthReproductionColumn;
    weightBiomass: WeightBiomassColumn;
    yieldIndex: YieldIndexColumn;
  }

  export interface PagedRosterResponse {
    items: AnimalRosterRowResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }
}

export namespace AnimalDossierDTOs {
  export interface TelemetryStatusDTO {
    deviceLabel: string;
    lastSynchronizedText: string;
    summaryLine: string;
    online: boolean;
  }

  export interface ProfileHeaderDTO {
    id: string;
    name: string;
    statusBadgeText: string;
    status: string;
    rfidMicrochip: string;
    assetCode: string;
    earTag: string;
    breedAndClassLabel: string;
    speciesName?: string;
    breedName?: string;
    gender?: string;
    dateOfBirth?: string;
    dobDisplay?: string;
    ageDisplay?: string;
    imageUrl?: string;
    holdingId?: string;
    holdingName?: string;
    penId?: string;
    penName?: string;
    telemetryStatus?: TelemetryStatusDTO;
  }

  export interface VaccinationRecordDTO {
    id?: string;
    vaccineName: string;
    vaccineSubtitle: string;
    dateAdministered: string;
    dateAdministeredDisplay?: string;
    administeredBy: string;
    dosage: string;
    lotNumber: string;
    dosageAndLotDisplay?: string;
    status: string;
    statusLabel?: string;
    statusVariant?: string;
  }

  export interface UpcomingCheckDTO {
    id?: string;
    scheduledDate: string;
    scheduledDateDisplay?: string;
    title: string;
    subtitle: string;
    category: string;
    completed?: boolean;
  }

  export interface MedicalLogDTO {
    id?: string;
    title: string;
    examDate: string;
    examDateDisplay?: string;
    severity: string;
    clinicalNotes: string;
    examiner: string;
    clearanceStatus: string;
  }

  export interface HealthScoreDTO {
    score: number;
    maxScore: number;
    standingDescription: string;
    ruminationLabel: string;
    ruminationMinutes: number;
    ruminationConsistencyPct: number;
  }

  export interface WeightPointDTO {
    monthLabel: string;
    date: string;
    actualWeightKg: number;
    herdMeanWeightKg: number;
  }

  export interface WeightProgressionDTO {
    animalLabel: string;
    benchmarkLabel: string;
    currentWeightKg: number;
    points: WeightPointDTO[];
  }

  export interface HealthMedicalTabDTO {
    recentVaccinations: VaccinationRecordDTO[];
    upcomingChecks: UpcomingCheckDTO[];
    lifetimeVerifiedLogsCount: number;
    medicalHistorySummary: MedicalLogDTO[];
    healthScore: HealthScoreDTO;
    weightProgression: WeightProgressionDTO;
  }

  export interface RationComponentDTO {
    ingredientName: string;
    percentageOrAmount: string;
    purpose: string;
  }

  export interface FeedingRationsTabDTO {
    activeNutritionProtocol: string;
    managementCohort: string;
    dailyDryMatterIntakeKg: number;
    waterIntakeLitersPerDay: number;
    feedConversionRatio: string;
    dailyFeedCost: number;
    rationComponents: RationComponentDTO[];
  }

  export interface ParentSummaryDTO {
    id?: string | null;
    name: string;
    registrationOrTagNumber: string;
    breedName: string;
    roleLabel: string;
  }

  export interface BreedingPedigreeTabDTO {
    reproductiveClass: string;
    conceptionMethod: string;
    breedRegistry: string;
    associationRegNumber: string;
    tsuSampleBarcode: string;
    sire?: ParentSummaryDTO;
    dam?: ParentSummaryDTO;
    epdTraits?: Record<string, string>;
  }

  export interface AccountingValuationTabDTO {
    acquisitionOrCapCost: number;
    currentFairValue: number;
    unrealizedGainLoss: number;
    marketPricePerKg: number;
    accumulatedMaintenanceExpense: number;
    valuationMethod: string;
    lastValuationDate: string;
  }

  export interface TelemetryRuminationTabDTO {
    smartCollarSerial: string;
    bolusSerial: string;
    gatewayIdentifier: string;
    bodyTemperatureC: number;
    heartRateBpm: number;
    dailyRuminationMinutes: number;
    dailyActivitySteps: number;
    rumenPh: number;
    recentReadings: any[];
  }

  export interface FullAnimalProfileResponse {
    header: ProfileHeaderDTO;
    healthAndMedical?: HealthMedicalTabDTO;
    feedingAndRations?: FeedingRationsTabDTO;
    breedingAndPedigree?: BreedingPedigreeTabDTO;
    accountingAndValuation?: AccountingValuationTabDTO;
    telemetryAndRumination?: TelemetryRuminationTabDTO;
  }

  export interface UpdateProfileRequest {
    name: string;
    earTag: string;
    rfidMicrochip: string;
    assetCode: string;
    dateOfBirth: string;
    gender: string;
  }

  export interface MoveLocationRequest {
    holdingId: string;
    penId: string;
    reason: string;
  }

  export interface UpdateStatusRequest {
    status: string;
    statusBadgeText: string;
    notes: string;
  }

  export interface CreateVaccinationRequest {
    vaccineName: string;
    vaccineSubtitle: string;
    dateAdministered: string;
    administeredBy: string;
    dosage: string;
    lotNumber: string;
    status: string;
  }

  export interface CreateUpcomingCheckRequest {
    scheduledDate: string;
    title: string;
    subtitle: string;
    category: string;
  }

  export interface CreateMedicalLogRequest {
    title: string;
    examDate: string;
    severity: string;
    clinicalNotes: string;
    examiner: string;
    clearanceStatus: string;
  }
}


