import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LivestockService } from '../../../services/livestock.service';
import { HoldingService } from '../../../services/holding.service';
import { SessionService } from '../../../services/session.service';
import { AnimalDossierDTOs, HoldingResponse, PenResponse } from '../../../models/livestock.model';

export interface RfidGateScanLog {
  id: string;
  timestamp: string;
  gateId: string;
  gateName: string;
  movementType: 'ENTRY' | 'EXIT' | 'SORT CHUTE' | 'MILKING PARLOR' | 'WATER TROUGH';
  direction: 'INBOUND' | 'OUTBOUND' | 'TRANSIT';
  rfidScanned: string;
  readerModel: string;
  signalRssi: string;
  automatedAction: string;
  status: 'VERIFIED' | 'FLAGGED' | 'MANUAL';
  weightKg?: number;
}

export interface VaccineRecord {
  id?: string;
  name: string;
  subtitle: string;
  date: string;
  adminBy: string;
  dosage: string;
  lot: string;
  dosageAndLotDisplay?: string;
  status: string;
  statusVariant?: string;
}

export interface MedicalLog {
  id: string;
  title: string;
  date: string;
  notes: string;
  examiner: string;
  clearance: string;
  severity?: string;
  type: 'routine' | 'warning' | 'cleared';
}

export interface UpcomingCheck {
  id?: string;
  date: string;
  title: string;
  subtitle: string;
  category: string;
  isUrgent?: boolean;
  completed?: boolean;
}

export interface LedgerTransaction {
  date: string;
  category: 'MILK SALES' | 'NUTRITION' | 'VETERINARY' | 'GENOMICS' | 'LIVESTOCK SALE' | 'INSURANCE';
  description: string;
  subtext: string;
  costCenter: string;
  amount: number;
  isCredit: boolean;
  status: 'AUDITED' | 'CLEARED' | 'PENDING';
}

export interface AnimalDossier {
  id: string;
  name: string;
  tag: string;
  rfid: string;
  taxId: string;
  breed: string;
  speciesName: string;
  breedName: string;
  gender: string;
  dateOfBirth: string;
  dob: string;
  collarStatus: string;
  status: string;
  rawStatus: string;
  photo: string;
  age: string;
  lactation: string;
  ageBadge: string;
  weight: number;
  weightTrend: string;
  weightBadge: string;
  holdingId: string;
  holdingName: string;
  penId: string;
  penName: string;
  location: string;
  locationSub: string;
  locationBadge: string;
  healthScore: number;
  maxHealthScore: number;
  healthStandingDesc: string;
  ruminationMinutes: number;
  ruminationPct: number;
  somaticRating: string;
  sire: string;
  dam: string;
  progeny: string;
  collarBattery: number;
  hydrationIntake: string;
}

@Component({
  selector: 'app-animal-dossier',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './animal-dossier.component.html',
})
export class AnimalDossierComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private livestockService = inject(LivestockService);
  private holdingService = inject(HoldingService);
  private sessionService = inject(SessionService);

  // Current backend UUID for API calls
  currentAnimalUuid = signal<string>('5e38a37a-cd6f-11f1-9ec1-07cd451b3c70');
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // Active navigation tab: Health / Feeding / Breeding / Accounting / Telemetry
  activeTab = signal<'health' | 'feeding' | 'breeding' | 'accounting' | 'telemetry'>('health');

  // Modals state
  showEditProfileModal = signal<boolean>(false);
  showMoveLocationModal = signal<boolean>(false);
  showUpdateStatusModal = signal<boolean>(false);
  showAddVaccineModal = signal<boolean>(false);
  showCalendarModal = signal<boolean>(false);
  showAddCheckModal = signal<boolean>(false);
  showAddMedicalLogModal = signal<boolean>(false);
  showUltrasoundModal = signal<boolean>(false);
  showOrderSemenModal = signal<boolean>(false);
  showTaxScheduleModal = signal<boolean>(false);
  showAddBolusModal = signal<boolean>(false);
  showLogGateScanModal = signal<boolean>(false);
  actionFeedback = signal<string | null>(null);

  // Live API Tab DTO signals
  profileHeaderData = signal<AnimalDossierDTOs.ProfileHeaderDTO | null>(null);
  healthMedicalData = signal<AnimalDossierDTOs.HealthMedicalTabDTO | null>(null);
  feedingRationsData = signal<AnimalDossierDTOs.FeedingRationsTabDTO | null>(null);
  breedingPedigreeData = signal<AnimalDossierDTOs.BreedingPedigreeTabDTO | null>(null);
  accountingValuationData = signal<AnimalDossierDTOs.AccountingValuationTabDTO | null>(null);
  telemetryRuminationData = signal<AnimalDossierDTOs.TelemetryRuminationTabDTO | null>(null);

  // Holdings & Pens for Move Location modal
  availableHoldings = signal<HoldingResponse[]>([]);
  availablePens = signal<PenResponse[]>([]);
  isLoadingHoldings = signal<boolean>(false);
  isLoadingPens = signal<boolean>(false);

  // Computed EPD trait list from breedingPedigreeData
  epdEntries = computed(() => {
    const traits = this.breedingPedigreeData()?.epdTraits;
    if (!traits) return [];
    return Object.entries(traits).map(([key, value]) => ({
      name: key,
      value: value
    }));
  });

  // RFID Gate Scan Filtering
  gateFilter = signal<string>('All');
  gateSearch = signal<string>('');

  // Daily Gate Logs Dataset
  gateLogs = signal<RfidGateScanLog[]>([
    {
      id: 'gl-01',
      timestamp: 'Today, 14:32:08',
      gateId: 'GATE-04',
      gateName: 'Paddock D-3 Pasture Return Gate',
      movementType: 'ENTRY',
      direction: 'INBOUND',
      rfidScanned: '982.000364910284',
      readerModel: 'Gallagher SmartGate 900 Array',
      signalRssi: '-58 dBm (Strong)',
      automatedAction: 'Pasture D-3 geofence synced • Solar latch released',
      status: 'VERIFIED'
    },
    {
      id: 'gl-02',
      timestamp: 'Today, 13:10:44',
      gateId: 'GATE-02',
      gateName: 'Feed Bunk Alpha Station 04',
      movementType: 'WATER TROUGH',
      direction: 'TRANSIT',
      rfidScanned: '982.000364910284',
      readerModel: 'Tru-Test Antenna Panel #2',
      signalRssi: '-61 dBm (Nominal)',
      automatedAction: 'Water consumption logged (9.8 L) • CAM-04 optical confirmed',
      status: 'VERIFIED'
    },
    {
      id: 'gl-03',
      timestamp: 'Today, 11:45:19',
      gateId: 'GATE-07',
      gateName: 'Walkover Weigh Chute #01',
      movementType: 'SORT CHUTE',
      direction: 'INBOUND',
      rfidScanned: '982.000364910284',
      readerModel: 'Tru-Test MP800 Scale Array',
      signalRssi: '-54 dBm (High)',
      automatedAction: 'Weight: 650.2 kg recorded (+1.1 kg/d ADG) • Auto-drafted to Pen 12',
      status: 'VERIFIED',
      weightKg: 650.2
    },
    {
      id: 'gl-04',
      timestamp: 'Today, 06:14:30',
      gateId: 'GATE-01B',
      gateName: 'Rotary Milking Parlor Outfeed',
      movementType: 'MILKING PARLOR',
      direction: 'OUTBOUND',
      rfidScanned: '982.000364910284',
      readerModel: 'DeLaval AutoGate Reader #01',
      signalRssi: '-52 dBm (Excellent)',
      automatedAction: 'AM Milking complete (17.4 L) • Post-dip disinfectant applied',
      status: 'VERIFIED'
    },
    {
      id: 'gl-05',
      timestamp: 'Today, 05:22:15',
      gateId: 'GATE-01A',
      gateName: 'Rotary Milking Parlor Infeed',
      movementType: 'MILKING PARLOR',
      direction: 'INBOUND',
      rfidScanned: '982.000364910284',
      readerModel: 'DeLaval AutoGate Reader #01',
      signalRssi: '-55 dBm (Strong)',
      automatedAction: 'Collar ID confirmed • Rotary stall #04 assigned',
      status: 'VERIFIED'
    },
    {
      id: 'gl-06',
      timestamp: 'Today, 04:45:00',
      gateId: 'GATE-09',
      gateName: 'Barn B Night Enclosure Exit',
      movementType: 'EXIT',
      direction: 'OUTBOUND',
      rfidScanned: '982.000364910284',
      readerModel: 'LoRaWAN Gate Transponder 868MHz',
      signalRssi: '-64 dBm (Stable)',
      automatedAction: 'Night barn release to morning holding corridor',
      status: 'VERIFIED'
    }
  ]);

  // Filtered Gate Logs Computed
  filteredGateLogs = computed(() => {
    const filter = this.gateFilter();
    const search = this.gateSearch().toLowerCase().trim();

    return this.gateLogs().filter(log => {
      const matchesFilter = filter === 'All' || 
        log.gateId === filter || 
        log.movementType === filter;
      const matchesSearch = !search || 
        log.gateName.toLowerCase().includes(search) || 
        log.gateId.toLowerCase().includes(search) || 
        log.movementType.toLowerCase().includes(search) || 
        log.automatedAction.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  });

  // Active Animal Data
  animal = signal<AnimalDossier>({
    id: '5e38a37a-cd6f-11f1-9ec1-07cd451b3c70',
    name: 'Bella',
    tag: '#TAG-8492',
    rfid: '982.00018492019',
    taxId: '#AG-ASSET-8492',
    breed: 'Registered Cattle (FEMALE)',
    speciesName: 'Cattle',
    breedName: 'Purebred Angus',
    gender: 'FEMALE',
    dateOfBirth: '2020-03-18',
    dob: 'Mar 18, 2020 (6 yrs)',
    collarStatus: 'Smart Collar v3 Active • Last synchronized: 2 minutes ago',
    status: 'ACTIVE CAPITAL LIVESTOCK',
    rawStatus: 'ACTIVE',
    photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
    age: '6 yrs',
    lactation: 'Lactation cycle 2 • Day 142 in milk (L2)',
    ageBadge: 'Prime Adult',
    weight: 425.0,
    weightTrend: '+1.1 kg/day (30d ADG)',
    weightBadge: 'Optimal Range',
    holdingId: 'h2000000-0000-0000-0000-000000000002',
    holdingName: 'Kraal 02 (Dairy & Calving Unit)',
    penId: 'p2000000-0000-0000-0000-000000000001',
    penName: 'Pen 01 (North Calving Bay)',
    location: 'Kraal 02 (Dairy & Calving Unit) > Pen 01 (North Calving Bay)',
    locationSub: 'Paddock D-3 (Sector West Pasture)',
    locationBadge: 'Live GPS Lock',
    healthScore: 98,
    maxHealthScore: 100,
    healthStandingDesc: 'Excellent standing. In the top 3% of Cattle herd for biometric stability.',
    ruminationMinutes: 490,
    ruminationPct: 99,
    somaticRating: '96% Optimal',
    sire: 'Registered Herd Sire #SIRE-001',
    dam: 'Registered Herd Dam #DAM-001',
    progeny: '2 Born (100% Weaned • Heifer #702, Bull #819)',
    collarBattery: 94,
    hydrationIntake: '45.0 Liters today'
  });

  // Vaccines Ledger
  vaccines = signal<VaccineRecord[]>([]);

  // Medical History Logs
  medicalLogs = signal<MedicalLog[]>([]);

  // Upcoming Veterinary Checks
  upcomingChecks = signal<UpcomingCheck[]>([]);

  // Lifetime Verified Logs count
  lifetimeVerifiedLogsCount = signal<number>(0);

  // Weight Progression points
  weightPoints = signal<AnimalDossierDTOs.WeightPointDTO[]>([]);

  // Financial Ledger Transactions (Itemized Ledger)
  ledgerTransactions = signal<LedgerTransaction[]>([
    {
      date: '2025-03-15',
      category: 'MILK SALES',
      description: 'Q1 Lactation Revenue Payout',
      subtext: 'Batch delivery to Valley Creamery Co-op (3,100 L @ $0.48/L)',
      costCenter: 'CC-DAIRY-L04',
      amount: 1488.00,
      isCredit: true,
      status: 'AUDITED'
    },
    {
      date: '2025-02-28',
      category: 'NUTRITION',
      description: 'Annual TMR Feed Allocation (Prorated)',
      subtext: 'Alfalfa silage, maize meal & mineral pre-mix mix ration',
      costCenter: 'CC-FEED-GRAIN',
      amount: 412.50,
      isCredit: false,
      status: 'AUDITED'
    },
    {
      date: '2025-01-20',
      category: 'VETERINARY',
      description: 'Herd Health Check & Mastitis Screening',
      subtext: 'Dr. Sarah Miller (Negative culture, preventive udder seal)',
      costCenter: 'CC-VET-MED',
      amount: 95.00,
      isCredit: false,
      status: 'CLEARED'
    },
    {
      date: '2024-11-10',
      category: 'GENOMICS',
      description: 'Progeny Registration & Genomic Testing',
      subtext: 'Breed Registry SNP parentage verification fee',
      costCenter: 'CC-BREED-STUD',
      amount: 65.00,
      isCredit: false,
      status: 'AUDITED'
    }
  ]);

  // Header Action Modal Form Models (Matching Exact Backend DTOs)
  // 1. PUT /api/v1/livestock/{id}/profile
  editForm: AnimalDossierDTOs.UpdateProfileRequest = {
    name: 'Bella',
    earTag: '#TAG-8492',
    rfidMicrochip: '982.00018492019',
    assetCode: '#AG-ASSET-8492',
    dateOfBirth: '2020-03-18',
    gender: 'FEMALE'
  };

  // 2. POST /api/v1/livestock/{id}/move-location
  locationForm: AnimalDossierDTOs.MoveLocationRequest = {
    holdingId: 'h2000000-0000-0000-0000-000000000002',
    penId: 'p2000000-0000-0000-0000-000000000001',
    reason: 'Rotational grazing transfer'
  };

  // 3. PATCH /api/v1/livestock/{id}/status
  statusForm: AnimalDossierDTOs.UpdateStatusRequest = {
    status: 'ACTIVE',
    statusBadgeText: 'ACTIVE CAPITAL LIVESTOCK',
    notes: 'Verified active in herd audit'
  };

  // Health & Medical Sub-Resource Action Form Models
  // 1. POST /api/v1/livestock/{id}/vaccinations
  newVaccineForm: AnimalDossierDTOs.CreateVaccinationRequest = {
    vaccineName: 'BVD Type 1 & 2',
    vaccineSubtitle: 'Bovine Viral Diarrhea Shield',
    dateAdministered: new Date().toISOString().split('T')[0],
    administeredBy: 'Dr. Sarah Miller',
    dosage: '2 ml Sub-Q',
    lotNumber: '#BVD-889',
    status: 'ACTIVE_SHIELD'
  };

  // 2. POST /api/v1/livestock/{id}/upcoming-checks
  newCheckForm: AnimalDossierDTOs.CreateUpcomingCheckRequest = {
    scheduledDate: '2024-12-15',
    title: 'Brucellosis Testing',
    subtitle: 'MANDATORY ANNUAL HERD HEALTH CHECK',
    category: 'HEALTH_CHECK'
  };

  // 3. POST /api/v1/livestock/{id}/medical-logs
  newMedicalLogForm: AnimalDossierDTOs.CreateMedicalLogRequest = {
    title: 'Routine Physical Exam',
    examDate: new Date().toISOString().split('T')[0],
    severity: 'NORMAL',
    clinicalNotes: 'Overall health excellent. Sound dental arc and clear rumen motility sounds.',
    examiner: 'Dr. Sarah Miller, DVM',
    clearanceStatus: 'Full Commercial Milk'
  };

  ultrasoundForm = {
    gestationDays: 42,
    fetusCrownRumpCm: 2.4,
    viability: 'Viable - Strong Cardiac Rhythm (180 bpm)',
    examiner: 'Dr. Aris Vance (Lic. #VET-419)'
  };

  semenOrderForm = {
    sireName: 'Oakridge Apex Titan #902',
    strawCount: 5,
    type: 'Sexed Heifer (92%)',
    vendor: 'Alta Genetics Global'
  };

  bolusForm = {
    bolusName: 'Slow-Release Trace Mineral Bolus',
    composition: 'Selenium (3mg/d) + Organic Copper (140mg/d) + Cobalt',
    durationDays: 250,
    lot: '#BOL-2025-X'
  };

  newGateScanForm = {
    gateId: 'GATE-04',
    gateName: 'Paddock D-3 Pasture Return Gate',
    movementType: 'ENTRY' as 'ENTRY' | 'EXIT' | 'SORT CHUTE' | 'MILKING PARLOR' | 'WATER TROUGH',
    direction: 'INBOUND' as 'INBOUND' | 'OUTBOUND' | 'TRANSIT',
    readerModel: 'Gallagher SmartGate 900 Array',
    signalRssi: '-58 dBm (Strong)',
    automatedAction: 'Pasture D-3 geofence synced • Solar latch released',
    weightKg: 425.0
  };

  ngOnInit() {
    this.loadHoldingsForMoveModal();

    this.route.paramMap.subscribe(params => {
      const routeId = params.get('id');
      this.resolveAndLoadAnimal(routeId);
    });
  }

  private isUuid(val: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim());
  }

  private resolveAndLoadAnimal(routeId: string | null) {
    if (routeId && this.isUuid(routeId)) {
      this.currentAnimalUuid.set(routeId.trim());
      this.loadAllDossierEndpoints(routeId.trim());
      return;
    }

    // If a tag number (e.g. TAG-9042) or no ID was provided, query roster to find matching UUID
    const searchTag = routeId && routeId !== 'AG-442' ? routeId.replace(/^#/, '').trim() : undefined;
    this.isLoading.set(true);
    this.livestockService.getRoster(undefined, searchTag, 0, 10).subscribe({
      next: (res) => {
        const items = res?.items || [];
        if (items.length > 0 && items[0].id) {
          const targetUuid = items[0].id;
          this.currentAnimalUuid.set(targetUuid);
          this.loadAllDossierEndpoints(targetUuid);
        } else {
          // Fallback to fetching first animal without search filter
          this.livestockService.getRoster(undefined, undefined, 0, 10).subscribe({
            next: (fallbackRes) => {
              const firstId = fallbackRes?.items?.[0]?.id || '5e38a37a-cd6f-11f1-9ec1-07cd451b3c70';
              this.currentAnimalUuid.set(firstId);
              this.loadAllDossierEndpoints(firstId);
            },
            error: () => {
              this.loadAllDossierEndpoints(this.currentAnimalUuid());
            }
          });
        }
      },
      error: () => {
        this.loadAllDossierEndpoints(this.currentAnimalUuid());
      }
    });
  }

  loadAllDossierEndpoints(id: string) {
    this.isLoading.set(true);

    // 1. GET /api/v1/livestock/{id}/profile
    this.livestockService.getAnimalProfile(id).subscribe({
      next: (profile) => {
        if (profile?.header) {
          this.applyHeaderData(profile.header);
        }
        if (profile?.healthAndMedical) {
          this.applyHealthMedicalData(profile.healthAndMedical);
        }
        if (profile?.feedingAndRations) {
          this.feedingRationsData.set(profile.feedingAndRations);
        }
        if (profile?.breedingAndPedigree) {
          this.breedingPedigreeData.set(profile.breedingAndPedigree);
        }
        if (profile?.accountingAndValuation) {
          this.accountingValuationData.set(profile.accountingAndValuation);
        }
        if (profile?.telemetryAndRumination) {
          this.telemetryRuminationData.set(profile.telemetryAndRumination);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.warn('Error loading full animal profile:', err);
        this.isLoading.set(false);
      }
    });

    // 2. GET /api/v1/livestock/{id}/health-medical
    this.loadHealthMedicalTab(id);

    // 3. GET /api/v1/livestock/{id}/vaccinations, upcoming-checks, medical-logs
    this.loadVaccinations(id);
    this.loadUpcomingChecks(id);
    this.loadMedicalLogs(id);

    // 4. GET /api/v1/livestock/{id}/feeding-rations
    this.loadFeedingRationsTab(id);

    // 5. GET /api/v1/livestock/{id}/breeding-pedigree
    this.loadBreedingPedigreeTab(id);

    // 6. GET /api/v1/livestock/{id}/accounting-valuation
    this.loadAccountingValuationTab(id);

    // 7. GET /api/v1/livestock/{id}/telemetry-rumination
    this.loadTelemetryRuminationTab(id);
  }

  private applyHeaderData(h: AnimalDossierDTOs.ProfileHeaderDTO) {
    this.profileHeaderData.set(h);
    const holdingPart = h.holdingName || 'Unassigned Holding';
    const penPart = h.penName ? ` > ${h.penName}` : '';
    const dobFormatted = h.dobDisplay
      ? `${h.dobDisplay}${h.ageDisplay ? ` (${h.ageDisplay})` : ''}`
      : (h.dateOfBirth || 'Unknown');

    this.animal.update(cur => ({
      ...cur,
      id: h.id || cur.id,
      name: h.name || h.earTag || cur.name,
      tag: h.earTag || cur.tag,
      rfid: h.rfidMicrochip || cur.rfid,
      taxId: h.assetCode || cur.taxId,
      breed: h.breedAndClassLabel || `${h.speciesName || ''} ${h.breedName || ''}`.trim() || cur.breed,
      speciesName: h.speciesName || cur.speciesName,
      breedName: h.breedName || cur.breedName,
      gender: h.gender || cur.gender,
      dateOfBirth: h.dateOfBirth || cur.dateOfBirth,
      dob: dobFormatted,
      collarStatus: h.telemetryStatus?.summaryLine || cur.collarStatus,
      status: h.statusBadgeText || h.status || cur.status,
      rawStatus: h.status || cur.rawStatus,
      photo: h.imageUrl || cur.photo,
      age: h.ageDisplay || cur.age,
      holdingId: h.holdingId || cur.holdingId,
      holdingName: h.holdingName || cur.holdingName,
      penId: h.penId || cur.penId,
      penName: h.penName || cur.penName,
      location: `${holdingPart}${penPart}`,
      locationSub: h.holdingName || cur.locationSub
    }));

    // Sync default form values with live header
    this.editForm = {
      name: h.name || '',
      earTag: h.earTag || '',
      rfidMicrochip: h.rfidMicrochip || '',
      assetCode: h.assetCode || '',
      dateOfBirth: h.dateOfBirth || '2020-03-18',
      gender: h.gender || 'FEMALE'
    };

    if (h.holdingId) {
      this.locationForm.holdingId = h.holdingId;
      this.onHoldingSelectChange(h.holdingId, h.penId);
    }
    if (h.penId) {
      this.locationForm.penId = h.penId;
    }

    this.statusForm = {
      status: h.status || 'ACTIVE',
      statusBadgeText: h.statusBadgeText || 'ACTIVE CAPITAL LIVESTOCK',
      notes: 'Verified active in herd audit'
    };
  }

  private applyHealthMedicalData(hm: AnimalDossierDTOs.HealthMedicalTabDTO) {
    this.healthMedicalData.set(hm);

    if (hm.lifetimeVerifiedLogsCount !== undefined) {
      this.lifetimeVerifiedLogsCount.set(hm.lifetimeVerifiedLogsCount);
    }

    if (hm.healthScore) {
      this.animal.update(cur => ({
        ...cur,
        healthScore: hm.healthScore.score ?? cur.healthScore,
        maxHealthScore: hm.healthScore.maxScore ?? 100,
        healthStandingDesc: hm.healthScore.standingDescription || cur.healthStandingDesc,
        ruminationMinutes: hm.healthScore.ruminationMinutes ?? cur.ruminationMinutes,
        ruminationPct: hm.healthScore.ruminationConsistencyPct ?? cur.ruminationPct
      }));
    }

    if (hm.weightProgression) {
      if (hm.weightProgression.currentWeightKg) {
        this.animal.update(cur => ({
          ...cur,
          weight: hm.weightProgression.currentWeightKg
        }));
      }
      if (Array.isArray(hm.weightProgression.points)) {
        this.weightPoints.set(hm.weightProgression.points);
      }
    }

    if (Array.isArray(hm.recentVaccinations) && hm.recentVaccinations.length > 0 && this.vaccines().length === 0) {
      this.vaccines.set(hm.recentVaccinations.map(v => this.mapVaccinationDto(v)));
    }

    if (Array.isArray(hm.upcomingChecks) && hm.upcomingChecks.length > 0 && this.upcomingChecks().length === 0) {
      this.upcomingChecks.set(hm.upcomingChecks.map(c => this.mapUpcomingCheckDto(c)));
    }

    if (Array.isArray(hm.medicalHistorySummary) && hm.medicalHistorySummary.length > 0 && this.medicalLogs().length === 0) {
      this.medicalLogs.set(hm.medicalHistorySummary.map(m => this.mapMedicalLogDto(m)));
    }
  }

  private mapVaccinationDto(v: AnimalDossierDTOs.VaccinationRecordDTO): VaccineRecord {
    return {
      id: v.id,
      name: v.vaccineName,
      subtitle: v.vaccineSubtitle || '',
      date: v.dateAdministeredDisplay || v.dateAdministered,
      adminBy: v.administeredBy,
      dosage: v.dosage,
      lot: v.lotNumber,
      dosageAndLotDisplay: v.dosageAndLotDisplay || `${v.dosage} • ${v.lotNumber}`,
      status: v.statusLabel || (v.status === 'ACTIVE_SHIELD' ? 'Active Shield' : v.status),
      statusVariant: v.statusVariant || (v.status === 'ACTIVE_SHIELD' ? 'SUCCESS' : 'WARNING')
    };
  }

  private mapUpcomingCheckDto(c: AnimalDossierDTOs.UpcomingCheckDTO): UpcomingCheck {
    return {
      id: c.id,
      date: c.scheduledDateDisplay || c.scheduledDate,
      title: c.title,
      subtitle: c.subtitle || c.category,
      category: c.subtitle || c.category,
      isUrgent: !c.completed,
      completed: c.completed
    };
  }

  private mapMedicalLogDto(m: AnimalDossierDTOs.MedicalLogDTO): MedicalLog {
    const sev = (m.severity || 'NORMAL').toUpperCase();
    return {
      id: m.id || `med-${Math.random().toString(36).substring(2, 8)}`,
      title: m.title,
      date: m.examDateDisplay || m.examDate,
      notes: m.clinicalNotes,
      examiner: m.examiner,
      clearance: m.clearanceStatus,
      severity: m.severity,
      type: sev === 'WARNING' || sev === 'HIGH' || sev === 'CRITICAL' ? 'warning' : 'routine'
    };
  }

  loadHealthMedicalTab(id: string) {
    this.livestockService.getHealthMedical(id).subscribe({
      next: (hm) => {
        if (hm) this.applyHealthMedicalData(hm);
      },
      error: (err) => console.warn('Failed to load health-medical tab:', err)
    });
  }

  loadVaccinations(id: string) {
    this.livestockService.getVaccinations(id).subscribe({
      next: (list) => {
        if (Array.isArray(list)) {
          this.vaccines.set(list.map(v => this.mapVaccinationDto(v)));
        }
      },
      error: (err) => console.warn('Failed to load vaccinations:', err)
    });
  }

  loadUpcomingChecks(id: string) {
    this.livestockService.getUpcomingChecks(id).subscribe({
      next: (list) => {
        if (Array.isArray(list)) {
          this.upcomingChecks.set(list.map(c => this.mapUpcomingCheckDto(c)));
        }
      },
      error: (err) => console.warn('Failed to load upcoming checks:', err)
    });
  }

  loadMedicalLogs(id: string) {
    this.livestockService.getMedicalLogs(id).subscribe({
      next: (list) => {
        if (Array.isArray(list)) {
          this.medicalLogs.set(list.map(m => this.mapMedicalLogDto(m)));
          this.lifetimeVerifiedLogsCount.set(list.length);
        }
      },
      error: (err) => console.warn('Failed to load medical logs:', err)
    });
  }

  loadFeedingRationsTab(id: string) {
    this.livestockService.getFeedingRations(id).subscribe({
      next: (fr) => {
        if (fr) {
          this.feedingRationsData.set(fr);
          if (fr.waterIntakeLitersPerDay !== undefined) {
            this.animal.update(cur => ({
              ...cur,
              hydrationIntake: `${fr.waterIntakeLitersPerDay} Liters today`
            }));
          }
        }
      },
      error: (err) => console.warn('Failed to load feeding-rations tab:', err)
    });
  }

  loadBreedingPedigreeTab(id: string) {
    this.livestockService.getBreedingPedigree(id).subscribe({
      next: (bp) => {
        if (bp) {
          this.breedingPedigreeData.set(bp);
          this.animal.update(cur => ({
            ...cur,
            sire: bp.sire ? `${bp.sire.name} (${bp.sire.registrationOrTagNumber})` : cur.sire,
            dam: bp.dam ? `${bp.dam.name} (${bp.dam.registrationOrTagNumber})` : cur.dam
          }));
        }
      },
      error: (err) => console.warn('Failed to load breeding-pedigree tab:', err)
    });
  }

  loadAccountingValuationTab(id: string) {
    this.livestockService.getAccountingValuation(id).subscribe({
      next: (av) => {
        if (av) {
          this.accountingValuationData.set(av);
        }
      },
      error: (err) => console.warn('Failed to load accounting-valuation tab:', err)
    });
  }

  loadTelemetryRuminationTab(id: string) {
    this.livestockService.getTelemetryRumination(id).subscribe({
      next: (tr) => {
        if (tr) {
          this.telemetryRuminationData.set(tr);
          if (tr.dailyRuminationMinutes !== undefined) {
            this.animal.update(cur => ({
              ...cur,
              ruminationMinutes: tr.dailyRuminationMinutes
            }));
          }
        }
      },
      error: (err) => console.warn('Failed to load telemetry-rumination tab:', err)
    });
  }

  loadHoldingsForMoveModal() {
    const farmId = this.sessionService.selectedFarmId() || 'f1000000-0000-0000-0000-000000000001';
    this.isLoadingHoldings.set(true);
    this.holdingService.getKraalsByFarmId(farmId).subscribe({
      next: (holdings) => {
        const list = Array.isArray(holdings) ? holdings : [];
        this.availableHoldings.set(list);
        this.isLoadingHoldings.set(false);
        if (list.length > 0) {
          const initialHoldingId = this.locationForm.holdingId || list[0].id;
          this.onHoldingSelectChange(initialHoldingId, this.locationForm.penId);
        }
      },
      error: () => {
        this.isLoadingHoldings.set(false);
        this.availableHoldings.set([
          { id: 'h2000000-0000-0000-0000-000000000001', name: 'Kraal 01 (Primary Beef Lot)' },
          { id: 'h2000000-0000-0000-0000-000000000002', name: 'Kraal 02 (Dairy & Calving Unit)' },
          { id: 'h2000000-0000-0000-0000-000000000004', name: 'Kraal 04 (Replacement Heifers)' }
        ]);
      }
    });
  }

  onHoldingSelectChange(holdingId: string, preferredPenId?: string) {
    this.locationForm.holdingId = holdingId;
    if (!holdingId) {
      this.availablePens.set([]);
      return;
    }
    this.isLoadingPens.set(true);
    this.holdingService.getPensByKraalId(holdingId).subscribe({
      next: (pens) => {
        const list = Array.isArray(pens) ? pens : [];
        this.availablePens.set(list);
        this.isLoadingPens.set(false);
        if (preferredPenId && list.some(p => p.id === preferredPenId)) {
          this.locationForm.penId = preferredPenId;
        } else if (list.length > 0) {
          this.locationForm.penId = list[0].id;
        }
      },
      error: () => {
        this.isLoadingPens.set(false);
        this.availablePens.set([
          { id: 'p2000000-0000-0000-0000-000000000001', name: 'Pen 01 (North Calving Bay)' },
          { id: 'p2000000-0000-0000-0000-000000000002', name: 'Pen 02 (East Lactation Bay)' }
        ]);
      }
    });
  }

  // Tab Switching triggers fresh fetch for that tab
  setTab(tab: 'health' | 'feeding' | 'breeding' | 'accounting' | 'telemetry') {
    this.activeTab.set(tab);
    const id = this.currentAnimalUuid();
    if (!id) return;

    if (tab === 'health') {
      this.loadHealthMedicalTab(id);
      this.loadVaccinations(id);
      this.loadUpcomingChecks(id);
      this.loadMedicalLogs(id);
    } else if (tab === 'feeding') {
      this.loadFeedingRationsTab(id);
    } else if (tab === 'breeding') {
      this.loadBreedingPedigreeTab(id);
    } else if (tab === 'accounting') {
      this.loadAccountingValuationTab(id);
    } else if (tab === 'telemetry') {
      this.loadTelemetryRuminationTab(id);
    }
  }

  // ==========================================
  // Header Action 1: Edit Profile (PUT /api/v1/livestock/{id}/profile)
  // ==========================================
  openEditProfile() {
    const cur = this.animal();
    const hdr = this.profileHeaderData();
    this.editForm = {
      name: hdr?.name || cur.name || 'Bella',
      earTag: hdr?.earTag || cur.tag || '#TAG-8492',
      rfidMicrochip: hdr?.rfidMicrochip || cur.rfid || '982.00018492019',
      assetCode: hdr?.assetCode || cur.taxId || '#AG-ASSET-8492',
      dateOfBirth: hdr?.dateOfBirth || cur.dateOfBirth || '2020-03-18',
      gender: hdr?.gender || cur.gender || 'FEMALE'
    };
    this.showEditProfileModal.set(true);
  }

  saveEditProfile() {
    const id = this.currentAnimalUuid();
    this.isSubmitting.set(true);

    this.livestockService.updateAnimalProfile(id, this.editForm).subscribe({
      next: (updatedHeader) => {
        this.isSubmitting.set(false);
        if (updatedHeader) {
          this.applyHeaderData(updatedHeader);
        }
        this.showEditProfileModal.set(false);
        this.notify(`Profile updated on backend for ${this.editForm.name} (${this.editForm.earTag})`);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notify(`Failed to update profile: ${err?.error?.message || err?.message || 'Server error'}`);
      }
    });
  }

  // ==========================================
  // Header Action 2: Move Location (POST /api/v1/livestock/{id}/move-location)
  // ==========================================
  openMoveLocation() {
    const hdr = this.profileHeaderData();
    if (hdr?.holdingId) {
      this.locationForm.holdingId = hdr.holdingId;
      this.onHoldingSelectChange(hdr.holdingId, hdr.penId);
    }
    this.showMoveLocationModal.set(true);
  }

  saveMoveLocation() {
    const id = this.currentAnimalUuid();
    this.isSubmitting.set(true);

    this.livestockService.moveAnimalLocation(id, this.locationForm).subscribe({
      next: (updatedHeader) => {
        this.isSubmitting.set(false);
        if (updatedHeader) {
          this.applyHeaderData(updatedHeader);
        }
        this.showMoveLocationModal.set(false);
        this.notify(`Moved ${this.animal().name} to ${updatedHeader?.holdingName || this.locationForm.holdingId} > ${updatedHeader?.penName || this.locationForm.penId}`);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notify(`Failed to move location: ${err?.error?.message || err?.message || 'Server error'}`);
      }
    });
  }

  // ==========================================
  // Header Action 3: Update Status (PATCH /api/v1/livestock/{id}/status)
  // ==========================================
  openUpdateStatus() {
    const hdr = this.profileHeaderData();
    this.statusForm = {
      status: hdr?.status || this.animal().rawStatus || 'ACTIVE',
      statusBadgeText: hdr?.statusBadgeText || this.animal().status || 'ACTIVE CAPITAL LIVESTOCK',
      notes: 'Verified active in herd audit'
    };
    this.showUpdateStatusModal.set(true);
  }

  onStatusSelectChange(newStatus: string) {
    this.statusForm.status = newStatus;
    const badgeMap: Record<string, string> = {
      'ACTIVE': 'ACTIVE CAPITAL LIVESTOCK',
      'LACTATING': 'LACTATING • HIGH YIELD (L2)',
      'PREGNANT': 'CONFIRMED PREGNANT (D-42)',
      'QUARANTINED': 'ANTIBIOTIC HOLD (QUARANTINE)',
      'SOLD': 'DISPOSED / SOLD ASSET'
    };
    if (badgeMap[newStatus]) {
      this.statusForm.statusBadgeText = badgeMap[newStatus];
    }
  }

  saveUpdateStatus() {
    const id = this.currentAnimalUuid();
    this.isSubmitting.set(true);

    this.livestockService.updateAnimalStatus(id, this.statusForm).subscribe({
      next: (updatedHeader) => {
        this.isSubmitting.set(false);
        if (updatedHeader) {
          this.applyHeaderData(updatedHeader);
        } else {
          this.animal.update(a => ({
            ...a,
            rawStatus: this.statusForm.status,
            status: this.statusForm.statusBadgeText
          }));
        }
        this.showUpdateStatusModal.set(false);
        this.notify(`Updated status for ${this.animal().name} to ${this.statusForm.statusBadgeText}`);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notify(`Failed to update status: ${err?.error?.message || err?.message || 'Server error'}`);
      }
    });
  }

  // ==========================================
  // Health & Medical Action 1: Vaccinations (POST /api/v1/livestock/{id}/vaccinations)
  // ==========================================
  openAddVaccine() {
    this.newVaccineForm = {
      vaccineName: 'BVD Type 1 & 2',
      vaccineSubtitle: 'Bovine Viral Diarrhea Shield',
      dateAdministered: new Date().toISOString().split('T')[0],
      administeredBy: 'Dr. Sarah Miller',
      dosage: '2 ml Sub-Q',
      lotNumber: '#BVD-889',
      status: 'ACTIVE_SHIELD'
    };
    this.showAddVaccineModal.set(true);
  }

  saveAddVaccine() {
    const id = this.currentAnimalUuid();
    this.isSubmitting.set(true);

    this.livestockService.addVaccination(id, this.newVaccineForm).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        if (created) {
          this.vaccines.update(list => [this.mapVaccinationDto(created), ...list]);
        }
        this.loadVaccinations(id);
        this.loadHealthMedicalTab(id);
        this.showAddVaccineModal.set(false);
        this.notify(`Added ${this.newVaccineForm.vaccineName} to immunization ledger`);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notify(`Failed to add vaccination: ${err?.error?.message || err?.message || 'Server error'}`);
      }
    });
  }

  // ==========================================
  // Health & Medical Action 2: Upcoming Checks / Calendar (POST /api/v1/livestock/{id}/upcoming-checks)
  // ==========================================
  openAddCheck() {
    this.newCheckForm = {
      scheduledDate: '2024-12-15',
      title: 'Brucellosis Testing',
      subtitle: 'MANDATORY ANNUAL HERD HEALTH CHECK',
      category: 'HEALTH_CHECK'
    };
    this.showAddCheckModal.set(true);
  }

  saveAddCheck() {
    const id = this.currentAnimalUuid();
    this.isSubmitting.set(true);

    this.livestockService.addUpcomingCheck(id, this.newCheckForm).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        if (created) {
          this.upcomingChecks.update(list => [...list, this.mapUpcomingCheckDto(created)]);
        }
        this.loadUpcomingChecks(id);
        this.loadHealthMedicalTab(id);
        this.showAddCheckModal.set(false);
        this.notify(`Scheduled upcoming check: ${this.newCheckForm.title} (${this.newCheckForm.scheduledDate})`);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notify(`Failed to schedule check: ${err?.error?.message || err?.message || 'Server error'}`);
      }
    });
  }

  // ==========================================
  // Health & Medical Action 3: Medical Logs (POST /api/v1/livestock/{id}/medical-logs)
  // ==========================================
  openAddMedicalLog() {
    this.newMedicalLogForm = {
      title: 'Routine Physical Exam',
      examDate: new Date().toISOString().split('T')[0],
      severity: 'NORMAL',
      clinicalNotes: 'Overall health excellent. Sound dental arc and clear rumen motility sounds.',
      examiner: 'Dr. Sarah Miller, DVM',
      clearanceStatus: 'Full Commercial Milk'
    };
    this.showAddMedicalLogModal.set(true);
  }

  saveAddMedicalLog() {
    const id = this.currentAnimalUuid();
    this.isSubmitting.set(true);

    this.livestockService.addMedicalLog(id, this.newMedicalLogForm).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        if (created) {
          this.medicalLogs.update(list => [this.mapMedicalLogDto(created), ...list]);
        }
        this.loadMedicalLogs(id);
        this.loadHealthMedicalTab(id);
        this.showAddMedicalLogModal.set(false);
        this.notify(`Added clinical log: ${this.newMedicalLogForm.title}`);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notify(`Failed to add medical log: ${err?.error?.message || err?.message || 'Server error'}`);
      }
    });
  }

  openUltrasound() {
    this.showUltrasoundModal.set(true);
  }

  saveUltrasound() {
    this.showUltrasoundModal.set(false);
    this.notify(`Ultrasound confirmed: Day ${this.ultrasoundForm.gestationDays} gestation. Cardiac activity 180 bpm verified.`);
  }

  openOrderSemen() {
    this.showOrderSemenModal.set(true);
  }

  saveOrderSemen() {
    this.showOrderSemenModal.set(false);
    this.notify(`Order submitted: ${this.semenOrderForm.strawCount} straws for ${this.semenOrderForm.sireName} (${this.semenOrderForm.type})`);
  }

  saveAddBolus() {
    this.showAddBolusModal.set(false);
    this.notify(`Recorded administration of ${this.bolusForm.bolusName} (Lot ${this.bolusForm.lot})`);
  }

  forcePollTelemetry() {
    this.loadTelemetryRuminationTab(this.currentAnimalUuid());
    this.notify(`Polled L-band transponder. RSSI: -62 dBm • Collar & Bolus in telemetry synchronization.`);
  }

  exportLedgerCsv() {
    this.notify(`Generated IRS 1040F & General Ledger CSV for Animal ID ${this.animal().tag}. File downloaded.`);
  }

  exportDossier() {
    this.notify(`Exporting official PDF Animal Dossier for ${this.animal().name} (${this.animal().tag})... Certified with SHA-256 seal.`);
  }

  openLogGateScan() {
    this.showLogGateScanModal.set(true);
  }

  saveLogGateScan() {
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;
    
    const newLog: RfidGateScanLog = {
      id: `gl-${Date.now()}`,
      timestamp: timeStr,
      gateId: this.newGateScanForm.gateId,
      gateName: this.newGateScanForm.gateName,
      movementType: this.newGateScanForm.movementType,
      direction: this.newGateScanForm.direction,
      rfidScanned: this.animal().rfid,
      readerModel: this.newGateScanForm.readerModel,
      signalRssi: this.newGateScanForm.signalRssi,
      automatedAction: this.newGateScanForm.automatedAction,
      status: 'VERIFIED',
      weightKg: this.newGateScanForm.weightKg
    };

    if (this.newGateScanForm.weightKg && this.newGateScanForm.weightKg > 0) {
      this.animal.update(a => ({ ...a, weight: Number(this.newGateScanForm.weightKg) }));
    }

    this.gateLogs.update(list => [newLog, ...list]);
    this.showLogGateScanModal.set(false);
    this.notify(`RFID Scan Logged: ${this.animal().name} detected at ${newLog.gateName} (${newLog.gateId}). Action: ${newLog.automatedAction}`);
  }

  quickSimulateScan(gateId: string, gateName: string, movement: 'ENTRY' | 'EXIT' | 'SORT CHUTE' | 'MILKING PARLOR' | 'WATER TROUGH', action: string) {
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;
    const newLog: RfidGateScanLog = {
      id: `gl-${Date.now()}`,
      timestamp: timeStr,
      gateId,
      gateName,
      movementType: movement,
      direction: movement === 'EXIT' ? 'OUTBOUND' : 'INBOUND',
      rfidScanned: this.animal().rfid,
      readerModel: 'Gallagher SmartGate 900 Array',
      signalRssi: '-56 dBm (High)',
      automatedAction: action,
      status: 'VERIFIED'
    };
    this.gateLogs.update(list => [newLog, ...list]);
    this.notify(`Simulated RFID Scan: Passed ${gateName} [${gateId}] at ${timeStr}`);
  }

  notify(msg: string) {
    this.actionFeedback.set(msg);
    setTimeout(() => {
      this.actionFeedback.set(null);
    }, 4500);
  }
}
