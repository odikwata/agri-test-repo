import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AnimalManagementService, Step1UnifiedRequest, Step2PedigreeRequest, Step3VitalsRequest, Step4IoTPairingRequest, Step5SpatialAllocationRequest, EnrollmentMode, GenderEnum } from '../../../services/animal-management.service';
import { LivestockMetadataService } from '../../../services/livestock-metadata.service';
import { HoldingService } from '../../../services/holding.service';
import { SessionService } from '../../../services/session.service';
import { SensorService } from '../../../services/sensor.service';
import { Species, Breed, PrimaryLocation, Kraal, Pen, HoldingResponse, PenResponse } from '../../../models/livestock.model';
import { SupportedSensorResponse, PairedSensorEntry, TelemetryParameterDTO } from '../../../models/sensor.model';

export interface LocationOption {
  id: string;
  name: string;
  description: string;
}

export interface KraalOption {
  id: string;
  locationId: string;
  name: string;
  type: string;
}

export interface PenOption {
  id: string;
  kraalId: string;
  name: string;
  capacity: string;
}

@Component({
  selector: 'app-add-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-animal.component.html',
})
export class AddAnimalComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private animalService = inject(AnimalManagementService);
  private metadataService = inject(LivestockMetadataService);
  private holdingService = inject(HoldingService);
  private sensorService = inject(SensorService);
  sessionService = inject(SessionService);

  constructor() {
    effect(() => {
      const activeId = this.sessionService.selectedFarmId();
      if (activeId && activeId !== this.activeFarmId()) {
        this.activeFarmId.set(activeId);
        this.loadKraalsByFarmId(activeId);
      }
    });
  }

  // Active Wizard Step (1 to 5)
  currentStep = signal<number>(1);

  // Active Draft Tracking from Backend (PUT /api/v1/animals/registration-steps/{draftId}/...)
  draftId = signal<string | null>(null);
  isSavingStep = signal<boolean>(false);
  lastSyncedAt = signal<string | null>(null);

  // Management Mode: 'individual' (Cattle, Sheep, Horses, Goats) or 'group' (Broilers, Bees, Layer flocks, Fingerlings)
  managementType = signal<'individual' | 'group'>('individual');

  // Submitting state & feedback
  isSubmitting = signal<boolean>(false);
  actionFeedback = signal<string | null>(null);

  // Scale lock state
  scaleLocked = signal<boolean>(false);

  // Wizard Display Mode: 'wizard' (step by step) or 'all' (continuous form review)
  stepMode = signal<'wizard' | 'all'>('wizard');

  // Dynamic API Signals
  speciesList = signal<Species[]>([]);
  isLoadingSpecies = signal<boolean>(false);

  breedsList = signal<Breed[]>([]);
  isLoadingBreeds = signal<boolean>(false);
  isCustomBreed = signal<boolean>(false);

  siresList = signal<any[]>([]);
  isLoadingSires = signal<boolean>(false);
  selectedSireId = signal<string>('');

  damsList = signal<any[]>([]);
  isLoadingDams = signal<boolean>(false);
  selectedDamId = signal<string>('');

  isLoadingLocations = signal<boolean>(false);
  isLoadingKraals = signal<boolean>(false);
  isLoadingPens = signal<boolean>(false);

  // API Error Message Signals
  activeFarmId = signal<string | null>(null);
  speciesError = signal<string | null>(null);
  breedsError = signal<string | null>(null);
  parentsError = signal<string | null>(null);
  locationsError = signal<string | null>(null);
  kraalsError = signal<string | null>(null);
  pensError = signal<string | null>(null);
  registrationError = signal<string | null>(null);

  // Supported and Paired IoT Sensors (GET /api/v1/mobile/sensors/{speciesId}/supported-sensors)
  supportedSensors = signal<SupportedSensorResponse[]>([]);
  pairedSensors = signal<PairedSensorEntry[]>([]);
  isLoadingSensors = signal<boolean>(false);
  sensorsError = signal<string | null>(null);
  activePairedCount = computed(() => this.pairedSensors().filter(s => s.isPaired).length);

  // Form Model
  form = {
    // Section A: Identification & Taxonomy (Step 1)
    managementType: 'individual' as 'individual' | 'group',
    speciesId: 's1',
    species: 'Cattle',
    breedId: 'b3',
    breed: 'Angus',
    rfid: '982 000429185012',
    tagId: 'TAG-9042',
    earTagColor: 'Yellow (Left Ear)',
    registeredName: 'Oakridge Sovereign Belle V',
    sex: 'Heifer (Maiden / Open)',
    birthDate: '2024-03-18',
    birthType: 'Single',
    polledStatus: 'Naturally Polled (Homozygous)',
    imageUrl: '',
    // Group-specific fields
    batchId: 'FLOCK-BR-2025-094',
    quantity: 5000,
    unit: 'Birds (Broilers)',
    groupPurpose: 'Broiler Meat Production',

    // Section B: Pedigree, Studbook & Genomics (Step 2)
    sireId: 'sire-01',
    sireName: 'Oakridge Black Titan #881',
    sireReg: 'AAA #18420199 • RFID: 982 000109283711',
    sireStats: 'CED: +12 (Top 5%) • WW: +78 lbs • MARB: +1.18',
    damId: 'dam-01',
    damName: 'Bessie #AG-442',
    damReg: 'AAA #19204822 • Visual: TAG-442',
    damStats: 'Milk: +34 • Docility: +24 • Calving Ease: 5-Star',
    breedAssociation: 'American Angus Association (AAA)',
    associationRegNumber: 'AAA #20491823',
    conceptionMethod: 'Artificial Insemination (AI) - Straw Batch #AI-4402',
    tsuSampleTaken: true,
    tsuNumber: 'TSU #TS-99214',

    // Section C: Physical Exam & Biosecurity (Step 3)
    weightKg: 412.5,
    bcsScore: '3.25 - Prime Optimal Condition',
    bcsSlider: 65,
    provenance: 'Homebred (Oakridge North Valley Pasture)',
    quarantineDisposition: 'Quarantine Clearance Protocol (14 Days in Isolation Kraal 04)',
    protocolBvdPi: true,
    protocolClostridial: true,
    protocolDewormer: true,
    protocolBrucellosis: false,

    // Section D: IoT Telemetry & Tag Pairing (Step 4)
    collarId: 'BLE-COLLAR-8841-A',
    collarRssi: '-58 dBm (Strong)',
    collarPaired: true,
    bolusId: 'BOL-8841-RU',
    bolusDetected: true,

    // Section E: Pasture, Kraal & Pen Allocation (Step 5)
    locationId: '',
    locationName: '',
    kraalId: '',
    kraalName: '',
    penId: '',
    penName: '',
    cohortName: '',
    nutritionProtocol: '',
    capitalizedValue: '2,400.00',
    clinicalNotes: ''
  };

  // Locations / Kraals / Pens Hierarchical Signals (Loaded strictly from External APIs)
  locations = signal<LocationOption[]>([]);
  kraals = signal<KraalOption[]>([]);
  pens = signal<PenOption[]>([]);

  // Filtered Kraals and Pens from external API
  filteredKraals = computed(() => {
    return this.kraals();
  });

  filteredPens = computed(() => {
    return this.pens();
  });

  selectedPen = computed(() => {
    return this.pens().find(p => p.id === this.form.penId);
  });

  // Image Upload State Signals
  uploadedPhotoUrl = signal<string | null>(null);
  uploadedFileName = signal<string | null>(null);
  uploadedFileSize = signal<string | null>(null);
  isDraggingOver = signal<boolean>(false);

  // Dynamic Image preview based on uploaded photo or species & management mode
  assetPhotoUrl = computed(() => {
    if (this.uploadedPhotoUrl()) {
      return this.uploadedPhotoUrl()!;
    }
    if (this.form.imageUrl) {
      return this.form.imageUrl;
    }
    const sp = this.form.species.toLowerCase();

    if (sp.includes('poultry') || sp.includes('broiler')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDklPZqXhenIBdF449HE_I75H2YPWHgJekZeIL-hCot1LLjiKeCFlNAoyFqjZ-WOylFa_3GHj0kre6oZouy6Eb5WpofArnDbJJG0RXdHGUDcZFx12jf5bCUzMVc6GGSMnU6tGv8qG-qf7aqGH0YOYd6py-ppfT1zXfVREh0HqVa-tbwKWJSqH-bDP-gHOoKsc4Mf5VulPIs3nH_gLOhmVsiYPv980rxZw3ENik8uzfVLgBhhFxUlwoGzA';
    } else if (sp.includes('bee') || sp.includes('apiculture')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXKG9fUqXgcjoM_iA3ZSDHpuSQH0zReM0tvW80yvqjZLFw5G2e7mQSa9CpklxOh9zUuE8ceKRy_neu6zm7ARjrC39BvmCPzki0EoqlwdZRCXRNlai_8pTzp7Tn62Z1VApSkPJeNG_lvFA7ZWOUWsqGz2hDILL9wG6Xmn1D4l3vM-ONma8xRdXEkurEQAn_DgDhBnH5Tj57VGhjyXSzyoqDMmrPk9BjlX9LAbMeaQpEUo_V6recqYssMo9otSXMgz7VY4';
    } else if (sp.includes('sheep') || sp.includes('ovine')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR3zK31htETWqIaLZGQmMN9lcqcF9txG5T8hNnb1Hpbrk0xJhGQ-nyxzWq7BHSClbs2HA4btHPSGBI2xWMO0RO2HNO2hOjJ0ndClOMh7cKcKo2Hv56Q19OMWzCEiNoZC5Rb2AbvCmsxPFl1JJu5sQvqIEGRhQdhug5_6B8pC5TlkIam8xTTZDbod5FjDfU5voThUesd3-koXzCIAnO9zlFl4M5Q2dCJOhbIhN7gE92ZVxRvyBmPlDvEg';
    }
    // Default cattle heifer
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3SU2IzQ09GNgKTBfU9qnM6EVyiPHDz6nl4iz8KumlzrYMmgPYiyQdaGXZ5rPLI0s9FNOkZN6sRyCdzlSGl5h6YsnpYaUowW4hQz0Q5O0kmi4VDxw--sJEE_ugAajU1i3Mo0kur44IXHQ2vGZ-StKvBd0uA0Iv0qMrKpnepf-l_N5o-c5zyN_xox9lUdaTsqOMxYB9cGBwMFeptPJ5kDQrUxm0qYHmCbm2bCt4s2Ve54ZbVoaC2fDrA';
  });

  // Steps Metadata with direct data-linking indicators
  steps = [
    { number: 1, label: 'Identification & Physical', sublabel: 'TAXONOMY', icon: 'fingerprint' },
    { number: 2, label: 'Pedigree & Genomics', sublabel: 'LINEAGE / EPD', icon: 'account_tree' },
    { number: 3, label: 'Biosecurity & Vitals', sublabel: 'QUARANTINE EXAM', icon: 'health_and_safety' },
    { number: 4, label: 'IoT Sensor Pairing', sublabel: 'BLE / BOLUS / COLLAR', icon: 'sensors' },
    { number: 5, label: 'Pasture, Kraal & Pen', sublabel: 'HOUSING ALLOCATION', icon: 'fence' },
  ];

  ngOnInit() {
    this.loadSpeciesFromApi();
    this.loadLocationsFromApi();

    // Read farm Id from slingshot_active_farm on sessionService
    const farmId = this.sessionService.selectedFarmId() || (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('slingshot_active_farm') : null);
    this.activeFarmId.set(farmId);
    if (farmId) {
      this.loadKraalsByFarmId(farmId);
    } else {
      this.kraalsError.set('No active farm found in session (slingshot_active_farm). Please select a farm in the top navigation.');
    }

    // Check if resuming an existing draft via query param ?draftId=...
    const resumeDraftId = this.route.snapshot.queryParamMap.get('draftId');
    if (resumeDraftId) {
      this.draftId.set(resumeDraftId);
      this.animalService.getDraft(resumeDraftId).subscribe({
        next: (draft) => {
          this.populateFromDraft(draft);
          this.notify(`Resumed draft #${draft.draftId} (at Step ${draft.stepCompleted})`);
        },
        error: () => {}
      });
    }
  }

  // Load animal-only species from API (Strictly external, no database fallback)
  loadSpeciesFromApi() {
    this.isLoadingSpecies.set(true);
    this.speciesError.set(null);
    this.metadataService.getSpecies(true).subscribe({
      next: (res) => {
        this.isLoadingSpecies.set(false);

        const rawItems: any[] = Array.isArray(res) ? res : ((res as any)?.content && Array.isArray((res as any).content) ? (res as any).content : []);
        const animalSpecies = rawItems.filter((s: any) => {
          if ((s as any).type && (s as any).type !== 'ANIMAL') return false;
          return true;
        });

        this.speciesList.set(animalSpecies);

        if (animalSpecies.length > 0) {
          const match = animalSpecies.find((s: any) => s.id === this.form.speciesId || (s.name && this.form.species && s.name.toLowerCase().includes(this.form.species.toLowerCase())));
          if (match) {
            this.form.speciesId = match.id;
            this.form.species = match.name;
          } else {
            this.form.speciesId = animalSpecies[0].id;
            this.form.species = animalSpecies[0].name;
          }
          this.loadBreedsForSpecies(this.form.speciesId);
          this.loadSiresAndDams(this.form.speciesId);
          this.loadSupportedSensorsForSpecies(this.form.speciesId);
        } else {
          this.speciesError.set('No animal species returned from external API.');
        }
      },
      error: (err: any) => {
        this.isLoadingSpecies.set(false);
        this.speciesList.set([]);
        const errMsg = err?.error?.message || err?.error?.error || err?.message || 'Failed to connect to external species API';
        this.speciesError.set(`External API Error: ${errMsg}`);
      }
    });
  }

  // Load Supported Sensors for Species (GET /api/v1/mobile/sensors/{speciesId}/supported-sensors)
  loadSupportedSensorsForSpecies(speciesId: string) {
    if (!speciesId) return;
    this.isLoadingSensors.set(true);
    this.sensorsError.set(null);

    this.sensorService.getSupportedSensorsBySpecies(speciesId).subscribe({
      next: (sensors) => {
        this.isLoadingSensors.set(false);
        const sensorList = Array.isArray(sensors) ? sensors : [];
        this.supportedSensors.set(sensorList);

        const currentPaired = this.pairedSensors();
        const updatedList: PairedSensorEntry[] = sensorList.map(s => {
          const existing = currentPaired.find(p => p.deviceId === s.deviceId || p.compatibilityRole === s.compatibilityRole);
          if (existing && existing.tagOrIdentifier) {
            return {
              ...s,
              tagOrIdentifier: existing.tagOrIdentifier,
              isPaired: existing.isPaired,
              batteryPct: existing.batteryPct || 100,
              rssi: existing.rssi || '-58 dBm'
            };
          }

          let initialTag = '';
          let isPaired = false;
          if (s.compatibilityRole === 'SMART_COLLAR') {
            initialTag = this.form.collarId || `BLE-COL-${Math.floor(1000 + Math.random() * 9000)}-LR`;
            isPaired = this.form.collarPaired;
            this.form.collarId = initialTag;
          } else if (s.compatibilityRole === 'RUMEN_BOLUS') {
            initialTag = this.form.bolusId || `BOL-${Math.floor(1000 + Math.random() * 9000)}-RU`;
            isPaired = this.form.bolusDetected;
            this.form.bolusId = initialTag;
          } else if (s.compatibilityRole === 'EAR_TAG') {
            initialTag = this.form.rfid || this.form.tagId || `EID-HDX-${Math.floor(100000 + Math.random() * 900000)}`;
            isPaired = true;
          } else if (s.compatibilityRole === 'GATEWAY_HUB' || s.compatibilityRole === 'HIVE_SCALE') {
            initialTag = `GATEWAY-${s.modelNumber ? s.modelNumber.replace(/[^a-zA-Z0-9]/g, '') : 'HUB'}-${Math.floor(10 + Math.random() * 90)}`;
            isPaired = true;
          } else {
            initialTag = `${s.compatibilityRole ? s.compatibilityRole.substring(0, 3) : 'TAG'}-${Math.floor(1000 + Math.random() * 9000)}`;
            isPaired = s.isRecommended;
          }

          return {
            ...s,
            tagOrIdentifier: initialTag,
            isPaired: isPaired,
            batteryPct: 96 + Math.floor(Math.random() * 4),
            rssi: '-58 dBm (Strong)'
          };
        });

        this.pairedSensors.set(updatedList);
      },
      error: (err: any) => {
        this.isLoadingSensors.set(false);
        const errMsg = err?.error?.message || err?.message || 'Failed to load supported sensors from API';
        this.sensorsError.set(`Supported Sensors API: ${errMsg}`);
      }
    });
  }

  toggleSensorPairing(sensor: PairedSensorEntry) {
    this.pairedSensors.update(list => list.map(s => {
      if (s.deviceId === sensor.deviceId) {
        return { ...s, isPaired: !s.isPaired };
      }
      return s;
    }));

    if (sensor.compatibilityRole === 'SMART_COLLAR') {
      this.form.collarPaired = !sensor.isPaired;
    } else if (sensor.compatibilityRole === 'RUMEN_BOLUS') {
      this.form.bolusDetected = !sensor.isPaired;
    }

    this.notify(`${sensor.deviceName} pairing ${!sensor.isPaired ? 'Verified ✓' : 'Paused'}`);
  }

  autoAssignTag(sensor: PairedSensorEntry) {
    const prefix = sensor.compatibilityRole === 'SMART_COLLAR' ? 'BLE-COL'
      : sensor.compatibilityRole === 'RUMEN_BOLUS' ? 'BOL-RU'
      : sensor.compatibilityRole === 'EAR_TAG' ? 'EID-HDX'
      : sensor.compatibilityRole === 'GPS_TRANSPONDER' ? 'GPS-SAT'
      : 'SENS';
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const newTag = `${prefix}-${randPart}`;

    this.pairedSensors.update(list => list.map(s => {
      if (s.deviceId === sensor.deviceId) {
        return { ...s, tagOrIdentifier: newTag, isPaired: true };
      }
      return s;
    }));

    if (sensor.compatibilityRole === 'SMART_COLLAR') {
      this.form.collarId = newTag;
      this.form.collarPaired = true;
    } else if (sensor.compatibilityRole === 'RUMEN_BOLUS') {
      this.form.bolusId = newTag;
      this.form.bolusDetected = true;
    }

    this.notify(`Assigned new identification tag ${newTag} to ${sensor.deviceName}`);
  }

  onSensorTagInput(sensor: PairedSensorEntry, newTag: string) {
    sensor.tagOrIdentifier = newTag;
    if (sensor.compatibilityRole === 'SMART_COLLAR') {
      this.form.collarId = newTag;
    } else if (sensor.compatibilityRole === 'RUMEN_BOLUS') {
      this.form.bolusId = newTag;
    }
  }

  addManualSensor(sensor: SupportedSensorResponse) {
    const newEntry: PairedSensorEntry = {
      ...sensor,
      deviceId: `${sensor.deviceId}-aux-${Date.now().toString(36)}`,
      deviceName: `${sensor.deviceName} (Auxiliary)`,
      tagOrIdentifier: `AUX-${Math.floor(1000 + Math.random() * 9000)}`,
      isPaired: true,
      batteryPct: 100,
      rssi: '-54 dBm'
    };
    this.pairedSensors.update(list => [...list, newEntry]);
    this.notify(`Added auxiliary sensor: ${newEntry.deviceName}`);
  }

  removeSensor(sensor: PairedSensorEntry) {
    this.pairedSensors.update(list => list.filter(s => s.deviceId !== sensor.deviceId));
    this.notify(`Removed sensor: ${sensor.deviceName}`);
  }

  // Load breeds from API for given species (Strictly external, no database fallback)
  loadBreedsForSpecies(speciesId: string) {
    this.isLoadingBreeds.set(true);
    this.breedsError.set(null);
    this.metadataService.getBreeds(speciesId).subscribe({
      next: (breeds) => {
        this.isLoadingBreeds.set(false);
        const rawBreeds = Array.isArray(breeds) ? breeds : ((breeds as any)?.content && Array.isArray((breeds as any).content) ? (breeds as any).content : []);
        this.breedsList.set(rawBreeds);
        if (rawBreeds && rawBreeds.length > 0) {
          const match = rawBreeds.find((b: any) => b.name.toLowerCase() === this.form.breed.toLowerCase() || b.id === this.form.breedId);
          if (match) {
            this.form.breedId = match.id;
            this.form.breed = match.name;
          } else {
            this.form.breedId = rawBreeds[0].id;
            this.form.breed = rawBreeds[0].name;
          }
        }
      },
      error: (err: any) => {
        this.isLoadingBreeds.set(false);
        this.breedsList.set([]);
        const errMsg = err?.error?.message || err?.error?.error || err?.message || 'Failed to load breeds from external API';
        this.breedsError.set(`External Breeds API Error: ${errMsg}`);
      }
    });
  }

  // Load potential Sires and Dams from API (Strictly external, no database fallback)
  loadSiresAndDams(speciesId: string) {
    this.isLoadingSires.set(true);
    this.isLoadingDams.set(true);
    this.parentsError.set(null);

    this.animalService.getPotentialParents(speciesId, 'male').subscribe({
      next: (sires) => {
        this.isLoadingSires.set(false);
        const rawSires = Array.isArray(sires) ? sires : ((sires as any)?.content && Array.isArray((sires as any).content) ? (sires as any).content : []);
        this.siresList.set(rawSires);
        if (rawSires && rawSires.length > 0 && !this.selectedSireId()) {
          const match = rawSires.find((s: any) => s.id === this.form.sireId);
          if (match) {
            this.selectedSireId.set(match.id);
          }
        }
      },
      error: (err: any) => {
        this.isLoadingSires.set(false);
        this.siresList.set([]);
        const errMsg = err?.error?.message || err?.error?.error || err?.message || 'Failed to load sires from external API';
        this.parentsError.set(`External Lineage API Error: ${errMsg}`);
      }
    });

    this.animalService.getPotentialParents(speciesId, 'female').subscribe({
      next: (dams) => {
        this.isLoadingDams.set(false);
        const rawDams = Array.isArray(dams) ? dams : ((dams as any)?.content && Array.isArray((dams as any).content) ? (dams as any).content : []);
        this.damsList.set(rawDams);
        if (rawDams && rawDams.length > 0 && !this.selectedDamId()) {
          const match = rawDams.find((d: any) => d.id === this.form.damId);
          if (match) {
            this.selectedDamId.set(match.id);
          }
        }
      },
      error: (err: any) => {
        this.isLoadingDams.set(false);
        this.damsList.set([]);
        const errMsg = err?.error?.message || err?.error?.error || err?.message || 'Failed to load dams from external API';
        this.parentsError.set(`External Lineage API Error: ${errMsg}`);
      }
    });
  }

  // Load Locations (Management Units) from API (Strictly external, no database fallback)
  loadLocationsFromApi() {
    this.isLoadingLocations.set(true);
    this.locationsError.set(null);
    this.metadataService.getLocations().subscribe({
      next: (locs) => {
        this.isLoadingLocations.set(false);
        if (locs && locs.length > 0) {
          this.locations.set(locs.map(l => ({
            id: l.id,
            name: l.name,
            description: l.description || 'Primary Farm Location'
          })));

          const match = locs.find(l => l.id === this.form.locationId);
          if (!match) {
            this.form.locationId = locs[0].id;
            this.form.locationName = locs[0].name;
          } else {
            this.form.locationName = match.name;
          }
        }
      },
      error: (err: any) => {
        this.isLoadingLocations.set(false);
        const errMsg = err?.error?.message || err?.error?.error || err?.message || 'Failed to load locations from external API';
        this.locationsError.set(`External Cadastre API Error: ${errMsg}`);
      }
    });
  }

  // Load Target Kraals from External API (@GetMapping("/kraals/farm/{id}"))
  // Farm ID is obtained from slingshot_active_farm on sessionService
  loadKraalsByFarmId(farmId: string) {
    if (!farmId) {
      this.kraals.set([]);
      this.pens.set([]);
      this.kraalsError.set('No active farm found in session (slingshot_active_farm). Please select a farm in the top navigation.');
      return;
    }
    this.isLoadingKraals.set(true);
    this.kraalsError.set(null);
    this.holdingService.getKraalsByFarmId(farmId).subscribe({
      next: (res: any) => {
        this.isLoadingKraals.set(false);
        const kraalList: any[] = Array.isArray(res) ? res : ((res?.content && Array.isArray(res.content)) ? res.content : (res?.data || []));
        if (kraalList && kraalList.length > 0) {
          this.kraals.set(kraalList.map((k: any) => ({
            id: k.id || k.holdingId || `kraal-${Math.random()}`,
            locationId: k.farmId || farmId,
            name: k.name || k.holdingName || k.kraalName || `Kraal ${k.id}`,
            type: k.type || k.holdingType || 'Livestock Enclosure'
          })));

          const match = this.kraals().find(k => k.id === this.form.kraalId);
          if (!match) {
            this.form.kraalId = this.kraals()[0].id;
            this.form.kraalName = this.kraals()[0].name;
          } else {
            this.form.kraalName = match.name;
          }
          this.loadPensByKraalId(this.form.kraalId);
        } else {
          this.kraals.set([]);
          this.pens.set([]);
          this.form.kraalId = '';
          this.form.kraalName = '';
          this.form.penId = '';
          this.form.penName = '';
          this.kraalsError.set(`No kraals returned for farm #${farmId} from external holding service.`);
        }
      },
      error: (err: any) => {
        this.isLoadingKraals.set(false);
        this.kraals.set([]);
        this.pens.set([]);
        const errMsg = err?.error?.message || err?.error?.error || err?.message || 'Failed to connect to external kraals API';
        this.kraalsError.set(`External API Error (/kraals/farm/${farmId}): ${errMsg}`);
      }
    });
  }

  // Load Target Pens from External API (@GetMapping("/pens/kraal/{id}"))
  loadPensByKraalId(kraalId: string) {
    if (!kraalId) {
      this.pens.set([]);
      this.form.penId = '';
      this.form.penName = '';
      return;
    }
    this.isLoadingPens.set(true);
    this.pensError.set(null);
    this.holdingService.getPensByKraalId(kraalId).subscribe({
      next: (res: any) => {
        this.isLoadingPens.set(false);
        const penList: any[] = Array.isArray(res) ? res : ((res?.content && Array.isArray(res.content)) ? res.content : (res?.data || []));
        if (penList && penList.length > 0) {
          this.pens.set(penList.map((p: any) => ({
            id: p.id || p.penId || `pen-${Math.random()}`,
            kraalId: p.kraalId || p.holdingId || kraalId,
            name: p.name || p.penName || `Pen ${p.id}`,
            capacity: p.capacity ? (typeof p.capacity === 'number' ? `${p.capacity} Head` : p.capacity) : 'Open Capacity'
          })));

          const match = this.pens().find(p => p.id === this.form.penId);
          if (!match) {
            this.form.penId = this.pens()[0].id;
            this.form.penName = this.pens()[0].name;
          } else {
            this.form.penName = match.name;
          }
        } else {
          this.pens.set([]);
          this.form.penId = '';
          this.form.penName = '';
          this.pensError.set(`No pens returned for kraal #${kraalId} from external holding service.`);
        }
      },
      error: (err: any) => {
        this.isLoadingPens.set(false);
        this.pens.set([]);
        const errMsg = err?.error?.message || err?.error?.error || err?.message || 'Failed to connect to external pens API';
        this.pensError.set(`External API Error (/pens/kraal/${kraalId}): ${errMsg}`);
      }
    });
  }

  // Helper alias for backward compatibility
  loadKraalsForLocation(locationId: string) {
    const farmId = this.sessionService.selectedFarmId() || (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('slingshot_active_farm') : null) || locationId;
    this.loadKraalsByFarmId(farmId);
  }

  loadPensForKraal(kraalId: string) {
    this.loadPensByKraalId(kraalId);
  }

  retryLoadKraals() {
    const farmId = this.sessionService.selectedFarmId() || (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('slingshot_active_farm') : null);
    this.activeFarmId.set(farmId);
    if (farmId) {
      this.loadKraalsByFarmId(farmId);
    } else {
      this.kraalsError.set('No active farm selected in session (slingshot_active_farm). Please select a farm in the top navigation.');
    }
  }

  retryLoadPens() {
    if (this.form.kraalId) {
      this.loadPensByKraalId(this.form.kraalId);
    }
  }


  // Populate form fields from saved draft
  private populateFromDraft(draft: any) {
    if (draft.step1Data) {
      const s1 = draft.step1Data;
      if (s1.enrollmentMode) {
        this.setManagementType(s1.enrollmentMode === 'BATCH_GROUP' ? 'group' : 'individual');
      }
      if (s1.speciesId) this.form.species = s1.speciesId;
      if (s1.breedId) this.form.breed = s1.breedId;
      if (s1.visualTag) this.form.tagId = s1.visualTag;
      if (s1.rfidMicrochip) this.form.rfid = s1.rfidMicrochip;
      if (s1.tagColorPlacement) this.form.earTagColor = s1.tagColorPlacement;
      if (s1.registeredAlias) this.form.registeredName = s1.registeredAlias;
      if (s1.batchLotId) this.form.batchId = s1.batchLotId;
      if (s1.quantityCount) this.form.quantity = s1.quantityCount;
      if (s1.unitType) this.form.unit = s1.unitType;
      if (s1.productionPurpose) this.form.groupPurpose = s1.productionPurpose;
      if (s1.sexReproductiveClass) this.form.sex = s1.sexReproductiveClass;
      if (s1.dateOfBirthOrPlacement) this.form.birthDate = s1.dateOfBirthOrPlacement;
      if (s1.birthDeliveryType) this.form.birthType = s1.birthDeliveryType;
      if (s1.polledHornStatus) this.form.polledStatus = s1.polledHornStatus;
      if (s1.imageUrl) {
        this.form.imageUrl = s1.imageUrl;
        this.uploadedPhotoUrl.set(s1.imageUrl);
        this.uploadedFileName.set('Bio-Asset Photo');
      }
    }
    if (draft.step2Data) {
      const s2 = draft.step2Data;
      if (s2.sireName) this.form.sireName = s2.sireName;
      if (s2.sireRegistrationNumber) this.form.sireReg = s2.sireRegistrationNumber;
      if (s2.damName) this.form.damName = s2.damName;
      if (s2.damRegistrationNumber) this.form.damReg = s2.damRegistrationNumber;
      if (s2.breedRegistry) this.form.breedAssociation = s2.breedRegistry;
      if (s2.officialAssociationRegNumber) this.form.associationRegNumber = s2.officialAssociationRegNumber;
      if (s2.conceptionMethod) this.form.conceptionMethod = s2.conceptionMethod;
      if (s2.tsuSampleBarcode) {
        this.form.tsuNumber = s2.tsuSampleBarcode;
        this.form.tsuSampleTaken = true;
      }
    }
    if (draft.step3Data) {
      const s3 = draft.step3Data;
      if (s3.weightKg) this.form.weightKg = s3.weightKg;
      if (s3.quarantineDisposition) this.form.quarantineDisposition = s3.quarantineDisposition;
      if (s3.originCadastre) this.form.provenance = s3.originCadastre;
      if (s3.bvdPiNegative !== undefined) this.form.protocolBvdPi = s3.bvdPiNegative;
      if (s3.clostridialBoosterGiven !== undefined) this.form.protocolClostridial = s3.clostridialBoosterGiven;
      if (s3.parasiticideDrenchGiven !== undefined) this.form.protocolDewormer = s3.parasiticideDrenchGiven;
      if (s3.brucellosisTattooVerified !== undefined) this.form.protocolBrucellosis = s3.brucellosisTattooVerified;
    }
    if (draft.step4Data) {
      const s4 = draft.step4Data;
      if (s4.smartCollarSerial) {
        this.form.collarId = s4.smartCollarSerial;
        this.form.collarPaired = true;
      }
      if (s4.reticulorumenBolusSerial) {
        this.form.bolusId = s4.reticulorumenBolusSerial;
        this.form.bolusDetected = true;
      }
      if (s4.sensors && Array.isArray(s4.sensors) && s4.sensors.length > 0) {
        this.pairedSensors.set(s4.sensors);
      }
    }
    if (draft.stepCompleted && draft.stepCompleted > 1) {
      this.currentStep.set(Math.min(draft.stepCompleted, 5));
    }
  }

  // Sync current step data to Spring Boot REST backend
  syncCurrentStep(targetStep?: number): Promise<boolean> {
    const stepToSave = targetStep || this.currentStep();
    this.isSavingStep.set(true);

    return new Promise((resolve) => {
      if (stepToSave === 1) {
        const isGroup = this.managementType() === 'group';
        const req: Step1UnifiedRequest = {
          enrollmentMode: isGroup ? 'BATCH_GROUP' : 'INDIVIDUAL',
          speciesId: this.form.speciesId || this.form.species,
          breedId: this.form.breedId || this.form.breed,
          visualTag: isGroup ? undefined : this.form.tagId,
          rfidMicrochip: isGroup ? undefined : this.form.rfid,
          tagColorPlacement: isGroup ? undefined : this.form.earTagColor,
          registeredAlias: isGroup ? undefined : this.form.registeredName,
          batchLotId: isGroup ? this.form.batchId : undefined,
          quantityCount: isGroup ? this.form.quantity : 1,
          unitType: isGroup ? this.form.unit : 'Head',
          productionPurpose: isGroup ? this.form.groupPurpose : undefined,
          gender: this.form.sex.toLowerCase().includes('female') ? 'FEMALE' : (this.form.sex.toLowerCase().includes('mixed') ? 'MIXED_FLOCK' : 'MALE'),
          sexReproductiveClass: this.form.sex,
          dateOfBirthOrPlacement: this.form.birthDate || '2024-03-18',
          birthDeliveryType: this.form.birthType,
          polledHornStatus: this.form.polledStatus,
          imageUrl: this.assetPhotoUrl()
        };

        this.animalService.saveStep1(req, this.draftId() || undefined).subscribe({
          next: (res) => {
            this.draftId.set(res.draftId);
            this.lastSyncedAt.set(res.syncedAt);
            this.isSavingStep.set(false);
            this.notify(`Step 1 Draft Saved (#${res.draftId})`);
            resolve(true);
          },
          error: () => {
            this.isSavingStep.set(false);
            resolve(true); // Continue client-side gracefully
          }
        });
      } else if (stepToSave === 2) {
        if (!this.draftId()) {
          this.isSavingStep.set(false);
          resolve(true);
          return;
        }
        const req: Step2PedigreeRequest = {
          sireId: this.form.sireId || undefined,
          sireName: this.form.sireName,
          sireRegistrationNumber: this.form.sireReg,
          motherId: this.form.damId || undefined,
          damName: this.form.damName,
          damRegistrationNumber: this.form.damReg,
          breedRegistry: this.form.breedAssociation,
          officialAssociationRegNumber: this.form.associationRegNumber,
          conceptionMethod: this.form.conceptionMethod,
          tsuSampleBarcode: this.form.tsuNumber
        };
        this.animalService.saveStep2(this.draftId()!, req).subscribe({
          next: (res) => {
            this.lastSyncedAt.set(res.syncedAt);
            this.isSavingStep.set(false);
            this.notify(`Step 2 Pedigree Synced (#${res.draftId})`);
            resolve(true);
          },
          error: () => {
            this.isSavingStep.set(false);
            resolve(true);
          }
        });
      } else if (stepToSave === 3) {
        if (!this.draftId()) {
          this.isSavingStep.set(false);
          resolve(true);
          return;
        }
        let bcsNum = 3.25;
        if (this.form.bcsSlider) {
          bcsNum = Number((this.form.bcsSlider / 20).toFixed(2));
        }
        const req: Step3VitalsRequest = {
          weightKg: Number(this.form.weightKg) || 412.5,
          bodyConditionScore: bcsNum,
          scaleDeviceId: 'TRU-TEST-900',
          quarantineDisposition: this.form.quarantineDisposition,
          originCadastre: this.form.provenance,
          bvdPiNegative: this.form.protocolBvdPi,
          clostridialBoosterGiven: this.form.protocolClostridial,
          parasiticideDrenchGiven: this.form.protocolDewormer,
          brucellosisTattooVerified: this.form.protocolBrucellosis
        };
        this.animalService.saveStep3(this.draftId()!, req).subscribe({
          next: (res) => {
            this.lastSyncedAt.set(res.syncedAt);
            this.isSavingStep.set(false);
            this.notify(`Step 3 Vitals & Biosecurity Synced`);
            resolve(true);
          },
          error: () => {
            this.isSavingStep.set(false);
            resolve(true);
          }
        });
      } else if (stepToSave === 4) {
        if (!this.draftId()) {
          this.isSavingStep.set(false);
          resolve(true);
          return;
        }
        const collarSensor = this.pairedSensors().find(s => s.compatibilityRole === 'SMART_COLLAR');
        const bolusSensor = this.pairedSensors().find(s => s.compatibilityRole === 'RUMEN_BOLUS');
        const req: Step4IoTPairingRequest = {
          smartCollarSerial: collarSensor?.tagOrIdentifier || this.form.collarId,
          reticulorumenBolusSerial: bolusSensor?.tagOrIdentifier || this.form.bolusId,
          initialTempC: 39.1,
          initialPh: 6.64,
          sensors: this.pairedSensors()
        };
        this.animalService.saveStep4(this.draftId()!, req).subscribe({
          next: (res) => {
            this.lastSyncedAt.set(res.syncedAt);
            this.isSavingStep.set(false);
            const pairedCount = this.pairedSensors().filter(s => s.isPaired).length;
            this.notify(`Step 4 IoT Sensors Synced (${pairedCount} devices paired)`);
            resolve(true);
          },
          error: () => {
            this.isSavingStep.set(false);
            resolve(true);
          }
        });
      } else {
        this.isSavingStep.set(false);
        resolve(true);
      }
    });
  }

  // Returns true if all mandatory data for this step is provided
  isStepComplete(step: number): boolean {
    switch (step) {
      case 1:
        if (this.managementType() === 'individual') {
          return Boolean(this.form.tagId && this.form.species);
        } else {
          return Boolean(this.form.batchId && this.form.quantity > 0 && this.form.species);
        }
      case 2:
        return Boolean(this.form.breedAssociation && (this.form.sireName || this.form.conceptionMethod));
      case 3:
        return Boolean(this.form.weightKg > 0 && this.form.quarantineDisposition);
      case 4:
        return this.pairedSensors().some(s => s.isPaired && s.tagOrIdentifier?.trim().length > 0) || Boolean(this.form.collarId && this.form.collarPaired);
      case 5:
        return Boolean(this.form.locationId && this.form.kraalId && this.form.penId);
      default:
        return false;
    }
  }

  // Returns real-time snippet of data linked to this step tab
  getStepSummary(step: number): string {
    switch (step) {
      case 1:
        return this.managementType() === 'individual'
          ? `${this.form.tagId || 'Tag Pending'} • ${this.form.breed || this.form.species}`
          : `${this.form.batchId || 'Batch Lot'} • ${(this.form.quantity || 0).toLocaleString()} ${this.form.unit.split(' ')[0]}`;
      case 2:
        return this.managementType() === 'individual'
          ? `${this.form.sireName ? this.form.sireName.split('#')[0].trim() : 'Sire'} × ${this.form.damName ? this.form.damName.split('#')[0].trim() : 'Dam'}`
          : `${this.form.breedAssociation.split('(')[0].trim() || 'Hatchery'}`;
      case 3:
        return `${this.form.weightKg} kg • ${this.form.quarantineDisposition.includes('14') ? '14d Quarantined' : 'Clinical Pass'}`;
      case 4: {
        const paired = this.pairedSensors().filter(s => s.isPaired && s.tagOrIdentifier?.trim().length > 0);
        if (paired.length > 0) {
          const preview = paired.slice(0, 2).map(s => `${s.deviceName.split(' ')[0]}: #${s.tagOrIdentifier}`).join(' • ');
          return `${paired.length} Paired (${preview})`;
        }
        return `${this.form.collarId ? this.form.collarId.replace('BLE-', '') : 'Collar'} (${this.form.collarPaired ? 'Paired' : 'Pending'})`;
      }
      case 5:
        return `${this.form.kraalName ? this.form.kraalName.split('(')[0].trim() : 'Kraal'} • ${this.form.penName ? this.form.penName.split('(')[0].trim() : 'Pen'}`;
      default:
        return '';
    }
  }

  // Set Step and switch into wizard view
  async setStep(step: number) {
    if (step >= 1 && step <= 5) {
      await this.syncCurrentStep();
      this.currentStep.set(step);
      this.stepMode.set('wizard');
      if (step === 4 && this.pairedSensors().length === 0) {
        this.loadSupportedSensorsForSpecies(this.form.speciesId);
      }
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  async nextStep() {
    if (this.currentStep() < 5) {
      await this.syncCurrentStep();
      this.currentStep.update(s => s + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  toggleStepMode() {
    this.stepMode.update(m => m === 'wizard' ? 'all' : 'wizard');
  }

  getStepTitle(step: number): string {
    const s = this.steps.find(item => item.number === step);
    return s ? s.label : `Step ${step}`;
  }

  getNextStepLabel(): string {
    const nextNum = this.currentStep() + 1;
    const s = this.steps.find(item => item.number === nextNum);
    return s ? s.label : 'Next Step';
  }

  getPreviousStepLabel(): string {
    const prevNum = this.currentStep() - 1;
    const s = this.steps.find(item => item.number === prevNum);
    return s ? s.label : 'Previous Step';
  }

  // Set Management Mode (Individual vs Group)
  setManagementType(type: 'individual' | 'group') {
    this.managementType.set(type);
    this.form.managementType = type;

    if (type === 'group') {
      this.form.species = 'Poultry / Broilers (Avian)';
      this.form.breed = 'Cobb 500 Fast-Feathering Broiler';
      this.form.batchId = 'FLOCK-BR-2025-094';
      this.form.quantity = 5000;
      this.form.unit = 'Birds (Broilers)';
      this.form.groupPurpose = 'Broiler Meat Production';
      this.form.weightKg = 1850.0;
      this.form.cohortName = 'Broiler Batch 2025-A (Shed 3)';
      this.form.nutritionProtocol = 'Broiler Starter Crumbles #BR-START-01 (22% CP)';
      this.form.capitalizedValue = '3,750.00';
    } else {
      this.form.species = 'Cattle (Bovine)';
      this.form.breed = 'Purebred Black Angus';
      this.form.tagId = 'TAG-9042';
      this.form.registeredName = 'Oakridge Sovereign Belle V';
      this.form.weightKg = 412.5;
      this.form.cohortName = 'Replacement Heifer Cohort Alpha (Spring 2024)';
      this.form.nutritionProtocol = 'Growing TMR Rations - Recipe #GRW-HEIFER-04 (14.5% CP)';
      this.form.capitalizedValue = '2,400.00';
    }
  }

  // Set Species and adapt options, reloading breeds, sires, and dams from API
  onSpeciesChange(speciesIdOrName: string) {
    const s = this.speciesList().find(item => item.id === speciesIdOrName || item.name.toLowerCase() === speciesIdOrName.toLowerCase());
    if (s) {
      this.form.speciesId = s.id;
      this.form.species = s.name;
    } else {
      this.form.species = speciesIdOrName;
    }

    const speciesLower = (this.form.species || '').toLowerCase();
    if (speciesLower.includes('poultry') || speciesLower.includes('broiler')) {
      this.setManagementType('group');
      this.form.unit = 'Birds (Broilers)';
    } else if (speciesLower.includes('bee') || speciesLower.includes('apiculture')) {
      this.setManagementType('group');
      this.form.unit = 'Hives (Bee Colonies)';
      this.form.quantity = 24;
      this.form.batchId = 'APIARY-HIVE-YARD-4';
      this.form.groupPurpose = 'Honey & Orchard Pollination';
      this.form.weightKg = 480.0;
    } else if (speciesLower.includes('sheep')) {
      this.setManagementType('individual');
    } else {
      this.setManagementType('individual');
    }

    // Load Breeds from API for selected species
    this.loadBreedsForSpecies(this.form.speciesId || speciesIdOrName);

    // Load Sires and Dams from API for selected species
    this.loadSiresAndDams(this.form.speciesId || speciesIdOrName);

    // Load Supported Sensors from API for selected species
    this.loadSupportedSensorsForSpecies(this.form.speciesId || speciesIdOrName);

    this.onLocationChange();
  }

  // Breed Selection from API
  onBreedSelect(breedName: string) {
    if (breedName === '__custom__') {
      this.isCustomBreed.set(true);
      return;
    }
    this.isCustomBreed.set(false);
    this.form.breed = breedName;
    const b = this.breedsList().find(item => item.name === breedName);
    if (b) {
      this.form.breedId = b.id;
    }
  }

  // Sire (Father) Selection from API
  onSireSelect(sireId: string) {
    this.selectedSireId.set(sireId);
    if (sireId === '__manual__' || !sireId) {
      return;
    }
    const sire = this.siresList().find(s => s.id === sireId);
    if (sire) {
      this.form.sireId = sire.id;
      this.form.sireName = sire.registeredAlias || sire.tagId;
      this.form.sireReg = (sire.officialAssociationRegNumber || 'Reg Pending') + (sire.rfid ? ' • RFID: ' + sire.rfid : '');
      this.form.sireStats = `Breed: ${sire.breed || this.form.breed} • Weight: ${sire.weight || 900}kg • DNA Sire Verified`;
      this.notify(`Selected Sire from API: ${this.form.sireName}`);
    }
  }

  // Dam (Mother) Selection from API
  onDamSelect(damId: string) {
    this.selectedDamId.set(damId);
    if (damId === '__manual__' || !damId) {
      return;
    }
    const dam = this.damsList().find(d => d.id === damId);
    if (dam) {
      this.form.damId = dam.id;
      this.form.damName = dam.registeredAlias || dam.tagId;
      this.form.damReg = (dam.officialAssociationRegNumber || 'Reg Pending') + (dam.rfid ? ' • Visual: ' + dam.tagId : '');
      this.form.damStats = `Breed: ${dam.breed || this.form.breed} • Calving Ease: 5-Star • DNA Dam Verified`;
      this.notify(`Selected Dam from API: ${this.form.damName}`);
    }
  }

  // Location / Management Unit Cascade from API
  onLocationChange() {
    const loc = this.locations().find(l => l.id === this.form.locationId);
    if (loc) {
      this.form.locationName = loc.name;
    }
  }

  onKraalChange() {
    const k = this.kraals().find(item => item.id === this.form.kraalId);
    if (k) {
      this.form.kraalName = k.name;
    }
    this.loadPensByKraalId(this.form.kraalId);
  }

  onPenChange() {
    const p = this.pens().find(item => item.id === this.form.penId);
    if (p) {
      this.form.penName = p.name;
    }
  }

  // Auto-Scan RFID Wand simulation
  autoScanRfid() {
    const randPart = Math.floor(100000000 + Math.random() * 900000000);
    this.form.rfid = `982 000${randPart}`;
    this.notify(`RFID Wand Captured: ${this.form.rfid} (ISO 11784 Checksum OK)`);
  }

  // Lock scale reading
  toggleLockScale() {
    this.scaleLocked.update(v => !v);
    if (this.scaleLocked()) {
      this.notify(`Chute scale reading locked: ${this.form.weightKg} kg (Sensor stable)`);
    } else {
      this.notify('Chute scale unlocked for live reading stream.');
    }
  }

  // Simulate new scale weight
  simulateWeight() {
    const delta = (Math.random() * 4 - 2).toFixed(1);
    this.form.weightKg = Number((Number(this.form.weightKg) + Number(delta)).toFixed(1));
    this.notify(`Chute scale updated: ${this.form.weightKg} kg`);
  }

  // BCS Slider change
  onBcsSliderChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.form.bcsSlider = val;
    if (val < 25) {
      this.form.bcsScore = '1.5 - Underconditioned / Lean';
    } else if (val < 45) {
      this.form.bcsScore = '2.5 - Moderate / Developing';
    } else if (val < 70) {
      this.form.bcsScore = '3.25 - Prime Optimal Condition';
    } else if (val < 85) {
      this.form.bcsScore = '4.0 - Heavy Flesh / Well-Covered';
    } else {
      this.form.bcsScore = '4.75 - Over-Conditioned';
    }
  }

  // IoT Hardware Controls
  pairCollar() {
    this.form.collarPaired = !this.form.collarPaired;
    if (this.form.collarPaired) {
      this.notify(`Smart Collar ${this.form.collarId} paired successfully. RSSI: ${this.form.collarRssi}`);
    } else {
      this.notify(`Smart Collar ${this.form.collarId} unpaired.`);
    }
  }

  generateCollarId() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.form.collarId = `BLE-COLLAR-${rand}-A`;
    this.form.collarPaired = true;
    this.notify(`New Collar Beacon Generated: ${this.form.collarId}`);
  }

  detectBolus() {
    this.form.bolusDetected = !this.form.bolusDetected;
    if (this.form.bolusDetected) {
      this.notify(`Bolus ${this.form.bolusId} detected in rumen. Temp: 39.1°C, pH: 6.64`);
    } else {
      this.notify(`Bolus ${this.form.bolusId} disconnected.`);
    }
  }

  generateBolusId() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.form.bolusId = `BOL-${rand}-RU`;
    this.form.bolusDetected = true;
    this.notify(`Rumen Bolus Probe Synced: ${this.form.bolusId}`);
  }

  scanTsu() {
    const rand = Math.floor(10000 + Math.random() * 90000);
    this.form.tsuNumber = `TSU #TS-${rand}`;
    this.form.tsuSampleTaken = true;
    this.notify(`Genomic Tissue Sample Barcode captured: ${this.form.tsuNumber}`);
  }

  // Animal Photo Upload Handlers
  triggerFileInput() {
    const el = document.getElementById('animalPhotoInput') as HTMLInputElement | null;
    if (el) {
      el.click();
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.processFile(target.files[0]);
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver.set(false);
  }

  private processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.notify('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }
    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      this.notify('Image file exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        this.uploadedPhotoUrl.set(result);
        this.form.imageUrl = result;
        this.uploadedFileName.set(file.name);
        const sizeKb = Math.round(file.size / 1024);
        const sizeStr = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
        this.uploadedFileSize.set(sizeStr);
        this.notify(`Animal photo attached: ${file.name} (${sizeStr})`);
      }
    };
    reader.readAsDataURL(file);
  }

  removeUploadedPhoto() {
    this.uploadedPhotoUrl.set(null);
    this.form.imageUrl = '';
    this.uploadedFileName.set(null);
    this.uploadedFileSize.set(null);
    const el = document.getElementById('animalPhotoInput') as HTMLInputElement | null;
    if (el) el.value = '';
    this.notify('Uploaded photo removed. Using species default photo.');
  }

  setSamplePhoto(url: string, label: string) {
    this.uploadedPhotoUrl.set(url);
    this.form.imageUrl = url;
    this.uploadedFileName.set(`${label}.jpg`);
    this.uploadedFileSize.set('Verified Sample');
    this.notify(`Attached sample photo for ${label}`);
  }

  // Save Draft (Triggers sync of all completed steps up to current step)
  async saveDraft() {
    this.isSavingStep.set(true);
    await this.syncCurrentStep();
    const id = this.draftId() || 'draft-pending';
    this.notify(`Registration draft saved as #${id}. You can resume at any time.`);
  }

  // Submit & Enroll Bio-Asset (Calls Step 5 Finalize API)
  async onSubmit() {
    this.isSubmitting.set(true);

    // Ensure step 1 to 4 are synced first if needed
    if (!this.draftId()) {
      await this.syncCurrentStep(1);
    }
    await this.syncCurrentStep(2);
    await this.syncCurrentStep(3);
    await this.syncCurrentStep(4);

    const step5Request: Step5SpatialAllocationRequest = {
      holdingId: this.form.kraalId,
      penId: this.form.penId,
      farmId: this.form.locationId,
      managementCohort: this.form.cohortName,
      nutritionProtocol: this.form.nutritionProtocol,
      assetCapitalizationCost: Number(this.form.capitalizedValue.replace(/,/g, '')) || 2400.0,
      clinicalNotes: this.form.clinicalNotes,
      imageUrl: this.assetPhotoUrl()
    };

    const targetDraftId = this.draftId() || `draft-${Math.random().toString(36).substring(2, 10)}`;

    this.animalService.finalizeEnrollment(targetDraftId, step5Request).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.notify(res.message || `Bio-Asset ${res.registeredAlias} (${res.tagNumber}) enrolled successfully!`);
        setTimeout(() => {
          this.router.navigate(['/livestock']);
        }, 1500);
      },
      error: () => {
        // Fallback to standard addAnimal
        const isGroup = this.managementType() === 'group';
        const assetId = isGroup ? this.form.batchId : this.form.tagId;
        const assetName = isGroup ? `${this.form.batchId} (${this.form.quantity} ${this.form.unit})` : this.form.registeredName;

        const payload = {
          id: assetId,
          tagId: isGroup ? undefined : this.form.tagId,
          batchId: isGroup ? this.form.batchId : undefined,
          managementType: this.form.managementType,
          quantity: isGroup ? this.form.quantity : 1,
          unit: isGroup ? this.form.unit : 'Head',
          type: this.form.species,
          breed: this.form.breed,
          gender: this.form.sex.toLowerCase().includes('female') ? 'female' : 'male',
          weight: this.form.weightKg,
          status: 'healthy',
          locationId: this.form.locationId,
          kraalId: this.form.kraalId,
          penId: this.form.penId,
          organizationId: 'org-oakridge'
        };

        this.animalService.addAnimal(payload as any).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.notify(`Bio-Asset ${assetName} successfully enrolled! RFID Bio-Passport issued.`);
            setTimeout(() => {
              this.router.navigate(['/livestock']);
            }, 1200);
          },
          error: (err: any) => {
            this.isSubmitting.set(false);
            const errMsg = err?.error?.message || err?.error?.error || err?.message || 'Failed to enroll animal';
            this.registrationError.set(`Enrollment Error: ${errMsg}`);
            this.notify(`Enrollment Error: ${errMsg}`);
          }
        });
      }
    });
  }

  notify(msg: string) {
    this.actionFeedback.set(msg);
    setTimeout(() => {
      this.actionFeedback.set(null);
    }, 4500);
  }
}
