import { Component, HostListener, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { SpeciesService } from '../../services/species.service';
import { LivestockService } from '../../services/livestock.service';
import { AnimalRosterDTOs } from '../../models/livestock.model';
import { SoilAlertBannerComponent } from '../../components/soil-alert-banner.component';
import { SoilNotificationService } from '../../services/soil-notification.service';

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

export interface HerdAnimal {
  id: string; // e.g. 'TAG-8492' or 'FLOCK-BR-094'
  rosterRow?: AnimalRosterDTOs.AnimalRosterRowResponse;
  managementType?: 'individual' | 'group';
  batchId?: string;
  quantity?: number;
  unit?: string;
  groupPurpose?: string;
  collarId: string;
  breed: string;
  species: string;
  category: 'all' | 'dairy' | 'heifer' | 'bull' | 'quarantine' | 'poultry' | 'apiary' | 'sheep';
  photo: string;
  locationName?: string;
  kraalId?: string;
  kraalName?: string;
  penId?: string;
  penName?: string;
  paddockId: string;
  paddockName: string;
  paddockSubtext: string;
  age: string;
  sex: string;
  healthStatus: string;
  healthStatusType: 'healthy' | 'gestation' | 'quarantine' | 'heat' | 'breeding';
  weightKg: number;
  adgKg: number; // Average daily gain
  production: string;
  productionSubtext: string;
  hasCollarSensor: boolean;
  vaccinationSummary: string;
  vaccinationCompliant: boolean;
  reproStage: string;
  ruminationMinutes: number;
  internalTempC: number;
  tempStatus: 'NORMAL' | 'ELEVATED' | 'LOW';
  rumenPh: number;
  rumenPhStatus: 'BALANCED' | 'ACIDIC' | 'ALKALINE';
  sire: string;
  dam: string;
  marblingMbv: string;
}

export interface PasturePaddock {
  id: string;
  badge: string;
  badgeType: 'active' | 'rest' | 'feed' | 'stud';
  name: string;
  subtext: string;
  statusPill: string;
  metricLabel: string;
  metricValue: string;
  progressPct: number;
  footerLeft: string;
  footerRight: string;
  barColor: string;
}

@Component({
  selector: 'app-livestock',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    LucideAngularModule, 
    RouterLink, 
    SoilAlertBannerComponent
  ],
  templateUrl: './livestock.component.html',
})
export class LivestockComponent implements OnInit {
  private speciesService = inject(SpeciesService);
  private livestockService = inject(LivestockService);
  soilNotificationService = inject(SoilNotificationService);

  // External Livestock Roster API state
  isLoadingRoster = signal<boolean>(false);
  rosterError = signal<string | null>(null);
  rosterItems = signal<AnimalRosterDTOs.AnimalRosterRowResponse[]>([]);
  rosterTotal = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  selectedHoldingFilter = signal<string>('all');

  // Filter & Search states
  searchQuery = signal<string>('');
  selectedPaddockFilter = signal<string>('All');
  selectedStatusFilter = signal<string>('All');
  activePillFilter = signal<'all' | 'dairy' | 'heifer' | 'bull' | 'poultry' | 'apiary' | 'groups' | 'quarantine'>('all');

  // Active Menu / Row context
  activeRowMenuId = signal<string | null>(null);

  // Modals
  showRegisterModal = signal<boolean>(false);
  showBatchWeighingModal = signal<boolean>(false);
  showLogWeightModal = signal<boolean>(false);
  showAdministerRxModal = signal<boolean>(false);
  showMovePaddockModal = signal<boolean>(false);
  showPedigreeModal = signal<boolean>(false);
  showFilterModal = signal<boolean>(false);
  actionFeedback = signal<string | null>(null);

  // Master Locations, Kraals and Pens database
  locations = signal<LocationOption[]>([
    { id: 'loc-1', name: 'Oakridge Main Cadastre', description: 'Primary 2,850 AC Cattle & Crop Hub' },
    { id: 'loc-2', name: 'Valley Aviary & Poultry Center', description: 'Biosecure Climate-Controlled Sheds' },
    { id: 'loc-3', name: 'West Orchard & Apiary Zone', description: 'Protected Native Flora Bee Reserves' },
    { id: 'loc-4', name: 'South Slope Sheep Pastures', description: 'Open Rangeland & Shearing Kraals' }
  ]);

  kraals = signal<KraalOption[]>([
    { id: 'kr-04', locationId: 'loc-1', name: 'Kraal 04 (Replacement Heifer Complex)', type: 'Cattle Kraal' },
    { id: 'kr-02', locationId: 'loc-1', name: 'Kraal 02 (Lactation Parlor Holding)', type: 'Dairy Kraal' },
    { id: 'kr-01', locationId: 'loc-1', name: 'Kraal 01 (Dry Cow Transition)', type: 'Cattle Kraal' },
    { id: 'kr-08', locationId: 'loc-1', name: 'Kraal 08 (Biosecurity Quarantine Isolation)', type: 'Quarantine' },
    { id: 'kr-shed-03', locationId: 'loc-2', name: 'Broiler House Shed 03 (Automated Climate)', type: 'Poultry Shed' },
    { id: 'kr-shed-01', locationId: 'loc-2', name: 'Layer House Shed 01 (Egg Aviary)', type: 'Poultry Shed' },
    { id: 'kr-apiary-01', locationId: 'loc-3', name: 'Apiary Compound Alpha (Clover & Fynbos)', type: 'Bee Yard' },
    { id: 'kr-sheep-01', locationId: 'loc-4', name: 'Sheep Kraal Delta (Merino Enclosure)', type: 'Sheep Kraal' }
  ]);

  pens = signal<PenOption[]>([
    { id: 'pen-12', kraalId: 'kr-04', name: 'Pen 12 (Replacement Heifers)', capacity: '14 / 20 Head' },
    { id: 'pen-11', kraalId: 'kr-04', name: 'Pen 11 (Weanling Acclimation)', capacity: '8 / 15 Head' },
    { id: 'pen-04', kraalId: 'kr-02', name: 'Pen 04 (High-Yield Milkers Alpha)', capacity: '18 / 24 Head' },
    { id: 'pen-m1', kraalId: 'kr-01', name: 'Maternity Pen M-1 (Pre-Calving)', capacity: '3 / 6 Head' },
    { id: 'pen-q1', kraalId: 'kr-08', name: 'Quarantine Pen Q-1 (Vet Lockdown)', capacity: '2 / 5 Head' },
    { id: 'pen-shed3-a', kraalId: 'kr-shed-03', name: 'Pen Bay A (Brooder Starter Zone)', capacity: '2,500 / 2,500 Birds' },
    { id: 'pen-shed3-b', kraalId: 'kr-shed-03', name: 'Pen Bay B (Grower Finisher Zone)', capacity: '2,500 / 2,500 Birds' },
    { id: 'pen-hive-row2', kraalId: 'kr-apiary-01', name: 'Hive Stand Row 02 (10-Frame Langstroth)', capacity: '12 / 12 Hives' },
    { id: 'pen-sheep-6', kraalId: 'kr-sheep-01', name: 'Pen 06 (Ewe Mob Shelter)', capacity: '45 / 60 Head' }
  ]);

  // Dynamic filtered lists for register modal
  filteredRegisterKraals = computed(() => {
    return this.kraals().filter(k => k.locationId === this.newAnimalForm.locationId);
  });

  filteredRegisterPens = computed(() => {
    return this.pens().filter(p => p.kraalId === this.newAnimalForm.kraalId);
  });

  // Forms
  newAnimalForm = {
    managementType: 'individual' as 'individual' | 'group',
    tag: 'TAG-8520',
    collarId: 'RFID-8520-LR',
    // Group fields
    batchId: 'FLOCK-BR-2025-095',
    quantity: 5000,
    unit: 'Birds (Broilers)',
    groupPurpose: 'Broiler Meat Production',
    // Shared fields
    breed: 'Purebred Black Angus',
    species: 'Cattle (Bovine)',
    sex: 'Female (Heifer)',
    paddock: 'Paddock D-3 (Clover Pasture)',
    locationId: 'loc-1',
    locationName: 'Oakridge Main Cadastre',
    kraalId: 'kr-04',
    kraalName: 'Kraal 04 (Replacement Heifer Complex)',
    penId: 'pen-12',
    penName: 'Pen 12 (Replacement Heifers)',
    age: '1 yr 6 mos',
    weightKg: 520,
    healthStatus: 'HEALTHY' as 'HEALTHY' | 'GESTATION D-180' | 'ANTIBIOTIC HOLD' | 'IN HEAT (ESTRUS)' | 'BREEDING ACTIVE' | 'NEEDS CHECK',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC66en_HeWGU8uJiR6LOSycNVwzh7_g7-fTP5c3InADX76X8yijl-qxCDn4s2nTwn1jisZQzpQoCjR6fxfY3MxFQ1us9Gat_1scD02oj9-yum9--c1mvsyxQfWqMv__Le8v7KmQQuzTMJ88ppyCBrr74leZs-qD7v90xxooihsPryaZ2tZpRQ6wEpaQqpi1AgOJria_dmQW9ueJl2CmhkMdwFgHFKVP8UEpkzKQpXzeLIju7aLYj4ZeuA'
  };

  weightLogForm = {
    weightKg: 590,
    notes: 'Weekly scale weighing pass at sorting chute'
  };

  rxForm = {
    drugName: '7-Way Clostridial Booster',
    dosage: '5 mL Subcutaneous',
    withholdDays: 0,
    technician: 'Sarah Jenkins (DVM Lead)'
  };

  movePaddockForm = {
    targetPaddock: 'Paddock B-1 (North Meadow)',
    reason: 'Rotational Grazing Schedule - Clover Rest Cycle'
  };

  batchWeighForm = {
    paddock: 'Paddock D-3 (Clover Pasture)',
    averageGain: 1.25,
    animalsWeighed: 34
  };

  // Animal Registry Dataset (Individual Animals + Production Groupings)
  animals = signal<HerdAnimal[]>([
    {
      id: 'TAG-8492',
      managementType: 'individual',
      collarId: 'RFID-9021-LR',
      breed: 'Black Angus Heifer',
      species: 'Cattle (Beef)',
      category: 'heifer',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC66en_HeWGU8uJiR6LOSycNVwzh7_g7-fTP5c3InADX76X8yijl-qxCDn4s2nTwn1jisZQzpQoCjR6fxfY3MxFQ1us9Gat_1scD02oj9-yum9--c1mvsyxQfWqMv__Le8v7KmQQuzTMJ88ppyCBrr74leZs-qD7v90xxooihsPryaZ2tZpRQ6wEpaQqpi1AgOJria_dmQW9ueJl2CmhkMdwFgHFKVP8UEpkzKQpXzeLIju7aLYj4ZeuA',
      locationName: 'Oakridge Main Cadastre',
      kraalId: 'kr-04',
      kraalName: 'Kraal 04 (Replacement Heifers)',
      penId: 'pen-12',
      penName: 'Pen 12 (Heifer Bay)',
      paddockId: 'd-3',
      paddockName: 'Paddock D-3',
      paddockSubtext: 'Clover Pasture',
      age: '2 yrs 3 mos',
      sex: 'Female (Heifer)',
      healthStatus: 'HEALTHY',
      healthStatusType: 'healthy',
      weightKg: 585,
      adgKg: 1.2,
      production: '28.4 L/d',
      productionSubtext: '1.4x Gain Idx',
      hasCollarSensor: true,
      vaccinationSummary: 'BVD & 7-Way Clostridial administered June 12 • Due booster in 4 months',
      vaccinationCompliant: true,
      reproStage: 'Cycle #4 • AI Inseminated',
      ruminationMinutes: 492,
      internalTempC: 38.6,
      tempStatus: 'NORMAL',
      rumenPh: 6.42,
      rumenPhStatus: 'BALANCED',
      sire: 'Oakridge Titan #1105 (EBV Top 1%)',
      dam: 'Oakridge Belle #4812 (G1)',
      marblingMbv: '+2.4 MBV'
    },
    {
      id: 'FLOCK-BR-094',
      managementType: 'group',
      batchId: 'FLOCK-BR-094',
      quantity: 5000,
      unit: 'Birds (Broilers)',
      groupPurpose: 'Broiler Meat Production',
      collarId: 'IOT-SHED-03-GATEWAY',
      breed: 'Cobb 500 Fast-Feathering',
      species: 'Poultry / Broilers',
      category: 'poultry',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDklPZqXhenIBdF449HE_I75H2YPWHgJekZeIL-hCot1LLjiKeCFlNAoyFqjZ-WOylFa_3GHj0kre6oZouy6Eb5WpofArnDbJJG0RXdHGUDcZFx12jf5bCUzMVc6GGSMnU6tGv8qG-qf7aqGH0YOYd6py-ppfT1zXfVREh0HqVa-tbwKWJSqH-bDP-gHOoKsc4Mf5VulPIs3nH_gLOhmVsiYPv980rxZw3ENik8uzfVLgBhhFxUlwoGzA',
      locationName: 'Valley Aviary & Poultry Center',
      kraalId: 'kr-shed-03',
      kraalName: 'Broiler House Shed 03',
      penId: 'pen-shed3-a',
      penName: 'Pen Bay A (Brooder Starter)',
      paddockId: 'shed-3',
      paddockName: 'Climate Shed 03',
      paddockSubtext: 'Automated HVAC',
      age: 'Day 24 of 42',
      sex: '5,000 Head Mixed',
      healthStatus: 'HEALTHY',
      healthStatusType: 'healthy',
      weightKg: 1850,
      adgKg: 0.08,
      production: '2.1 kg Avg/Bird',
      productionSubtext: 'FCR: 1.52 (Optimal)',
      hasCollarSensor: true,
      vaccinationSummary: 'Marek & Infectious Bronchitis aerosol vax completed at hatchery',
      vaccinationCompliant: true,
      reproStage: 'Commercial Grower Batch',
      ruminationMinutes: 0,
      internalTempC: 41.2,
      tempStatus: 'NORMAL',
      rumenPh: 6.5,
      rumenPhStatus: 'BALANCED',
      sire: 'Cobb Heritage Foundation Pedigree',
      dam: 'Cobb Pureline Broiler Parent Stock',
      marblingMbv: 'Grade A Breast Yield'
    },
    {
      id: 'TAG-7104',
      managementType: 'individual',
      collarId: 'RFID-8440-NL',
      breed: 'Holstein Friesian',
      species: 'Dairy Cattle',
      category: 'dairy',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR3zK31htETWqIaLZGQmMN9lcqcF9txG5T8hNnb1Hpbrk0xJhGQ-nyxzWq7BHSClbs2HA4btHPSGBI2xWMO0RO2HNO2hOjJ0ndClOMh7cKcKo2Hv56Q19OMWzCEiNoZC5Rb2AbvCmsxPFl1JJu5sQvqIEGRhQdhug5_6B8pC5TlkIam8xTTZDbod5FjDfU5voThUesd3-koXzCIAnO9zlFl4M5Q2dCJOhbIhN7gE92ZVxRvyBmPlDvEg',
      locationName: 'Oakridge Main Cadastre',
      kraalId: 'kr-02',
      kraalName: 'Kraal 02 (Lactation Parlor)',
      penId: 'pen-04',
      penName: 'Pen 04 (High-Yield Milkers)',
      paddockId: 'b-1',
      paddockName: 'Paddock B-1',
      paddockSubtext: 'North Meadow',
      age: '4 yrs 1 mo',
      sex: 'Female (Cow)',
      healthStatus: 'GESTATION D-180',
      healthStatusType: 'gestation',
      weightKg: 640,
      adgKg: 0.4,
      production: '32.1 L/d',
      productionSubtext: 'Top 5%',
      hasCollarSensor: true,
      vaccinationSummary: 'IBR & Lepto Hardjo - Boosted • Certified Clean Herd',
      vaccinationCompliant: true,
      reproStage: 'Confirmed In-Calf (Due 42 Days)',
      ruminationMinutes: 510,
      internalTempC: 38.7,
      tempStatus: 'NORMAL',
      rumenPh: 6.38,
      rumenPhStatus: 'BALANCED',
      sire: 'AltaSuperstar #994 (TPI +2950)',
      dam: 'Friesian Queen #5102 (EX-92)',
      marblingMbv: '+1.8 MBV'
    },
    {
      id: 'APIARY-HIVE-04',
      managementType: 'group',
      batchId: 'APIARY-HIVE-04',
      quantity: 24,
      unit: 'Hives (Bee Colonies)',
      groupPurpose: 'Honey & Orchard Pollination',
      collarId: 'IOT-APIARY-LORA-01',
      breed: 'Italian Honeybee (Apis mellifera)',
      species: 'Apiculture / Bees',
      category: 'apiary',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXKG9fUqXgcjoM_iA3ZSDHpuSQH0zReM0tvW80yvqjZLFw5G2e7mQSa9CpklxOh9zUuE8ceKRy_neu6zm7ARjrC39BvmCPzki0EoqlwdZRCXRNlai_8pTzp7Tn62Z1VApSkPJeNG_lvFA7ZWOUWsqGz2hDILL9wG6Xmn1D4l3vM-ONma8xRdXEkurEQAn_DgDhBnH5Tj57VGhjyXSzyoqDMmrPk9BjlX9LAbMeaQpEUo_V6recqYssMo9otSXMgz7VY4',
      locationName: 'West Orchard & Apiary Zone',
      kraalId: 'kr-apiary-01',
      kraalName: 'Apiary Compound Alpha',
      penId: 'pen-hive-row2',
      penName: 'Hive Stand Row 02 (10-Frame)',
      paddockId: 'orchard-3',
      paddockName: 'West Orchard Grove',
      paddockSubtext: 'Almond & Clover',
      age: 'Season 2 Active',
      sex: '24 Breeder Queens',
      healthStatus: 'HEALTHY',
      healthStatusType: 'healthy',
      weightKg: 480,
      adgKg: 0.15,
      production: '18.4 kg Honey/wk',
      productionSubtext: 'High Varroa Resistance',
      hasCollarSensor: true,
      vaccinationSummary: 'Oxalic Acid vapor treatment applied • Zero brood disease detected',
      vaccinationCompliant: true,
      reproStage: 'Brood Pattern Solid (98%)',
      ruminationMinutes: 0,
      internalTempC: 35.1,
      tempStatus: 'NORMAL',
      rumenPh: 6.8,
      rumenPhStatus: 'BALANCED',
      sire: 'VSH-Certified Breeder Queen Lineage',
      dam: 'Ligustica Pureline Carniolan Matron',
      marblingMbv: 'Pure Raw Clover Honey'
    },
    {
      id: 'TAG-9033',
      managementType: 'individual',
      collarId: 'RFID-3312-QT',
      breed: 'Hereford Cross',
      species: 'Cattle (Beef)',
      category: 'quarantine',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbiDPnhfGhE-QnyJbEo517KBH2F5bknebi36R3eTA7s0ZYUPiKrWs9lvgH_kZAEEpxXyp8NqY8Oy80gPdaE_rYC8fCU8gUOGZDlqXzdKH6OkWYNADUCR3WdveYQJQtTYzY0Q5X97ybfI_3a5Tj_KHyXSUOCxiCk5n-SN_NEYRu0Mk-I0YIa8XspupCJB4PCUxdwrxnTRkvgWEYivqP41-5aJtKHPh3peG_FJRY7emmHUUCqJQWirpGug',
      locationName: 'Oakridge Main Cadastre',
      kraalId: 'kr-08',
      kraalName: 'Kraal 08 (Biosecurity Quarantine)',
      penId: 'pen-q1',
      penName: 'Quarantine Pen Q-1',
      paddockId: 'q-1',
      paddockName: 'Quarantine Q-1',
      paddockSubtext: 'Vet Isolation',
      age: '1 yr 9 mos',
      sex: 'Female',
      healthStatus: 'ANTIBIOTIC HOLD',
      healthStatusType: 'quarantine',
      weightKg: 520,
      adgKg: -0.8,
      production: 'WITHHELD',
      productionSubtext: 'Mastitis Rx',
      hasCollarSensor: true,
      vaccinationSummary: 'Ceftiofur Hydro 50mg/mL administered Day 2 of 5 • Milk Hold 72h',
      vaccinationCompliant: false,
      reproStage: 'Open • Vet Monitored',
      ruminationMinutes: 340,
      internalTempC: 39.4,
      tempStatus: 'ELEVATED',
      rumenPh: 6.15,
      rumenPhStatus: 'ACIDIC',
      sire: 'Hereford Dominator #802',
      dam: 'Crossbred Maid #4211',
      marblingMbv: '+0.9 MBV'
    },
    {
      id: 'MOB-SH-201',
      managementType: 'group',
      batchId: 'MOB-SH-201',
      quantity: 150,
      unit: 'Head (Merino Ewes)',
      groupPurpose: 'Fine Wool & Lamb Production',
      collarId: 'RFID-GATEWAY-SH-04',
      breed: 'Merino Purebred',
      species: 'Sheep (Ovine)',
      category: 'sheep',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR3zK31htETWqIaLZGQmMN9lcqcF9txG5T8hNnb1Hpbrk0xJhGQ-nyxzWq7BHSClbs2HA4btHPSGBI2xWMO0RO2HNO2hOjJ0ndClOMh7cKcKo2Hv56Q19OMWzCEiNoZC5Rb2AbvCmsxPFl1JJu5sQvqIEGRhQdhug5_6B8pC5TlkIam8xTTZDbod5FjDfU5voThUesd3-koXzCIAnO9zlFl4M5Q2dCJOhbIhN7gE92ZVxRvyBmPlDvEg',
      locationName: 'South Slope Sheep Pastures',
      kraalId: 'kr-sheep-01',
      kraalName: 'Sheep Kraal Delta',
      penId: 'pen-sheep-6',
      penName: 'Pen 06 (Ewe Mob Shelter)',
      paddockId: 'south-slope',
      paddockName: 'South Ridge Paddock',
      paddockSubtext: 'Native Fescue Grass',
      age: 'Mob Flock (2-3 Yrs)',
      sex: '150 Breeding Ewes',
      healthStatus: 'HEALTHY',
      healthStatusType: 'healthy',
      weightKg: 8750,
      adgKg: 0.35,
      production: '6.2 kg Fleece/Head',
      productionSubtext: '18.5 Micron Superfine',
      hasCollarSensor: true,
      vaccinationSummary: '6-in-1 Clostridial + Drenched with Zolvix oral suspension',
      vaccinationCompliant: true,
      reproStage: 'Flushing Prior to Ram Turnout',
      ruminationMinutes: 460,
      internalTempC: 39.0,
      tempStatus: 'NORMAL',
      rumenPh: 6.45,
      rumenPhStatus: 'BALANCED',
      sire: 'Poll Merino Ram Syndicate #901',
      dam: 'Stud Ewe Mob 2022',
      marblingMbv: 'Prime Wool Grade AAA'
    },
    {
      id: 'TAG-6219',
      managementType: 'individual',
      collarId: 'RFID-5104-LR',
      breed: 'Jersey Milker',
      species: 'Dairy Cattle',
      category: 'dairy',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC66en_HeWGU8uJiR6LOSycNVwzh7_g7-fTP5c3InADX76X8yijl-qxCDn4s2nTwn1jisZQzpQoCjR6fxfY3MxFQ1us9Gat_1scD02oj9-yum9--c1mvsyxQfWqMv__Le8v7KmQQuzTMJ88ppyCBrr74leZs-qD7v90xxooihsPryaZ2tZpRQ6wEpaQqpi1AgOJria_dmQW9ueJl2CmhkMdwFgHFKVP8UEpkzKQpXzeLIju7aLYj4ZeuA',
      locationName: 'Oakridge Main Cadastre',
      kraalId: 'kr-02',
      kraalName: 'Kraal 02 (Lactation Parlor)',
      penId: 'pen-04',
      penName: 'Pen 04 (High-Yield Milkers)',
      paddockId: 'd-3',
      paddockName: 'Paddock D-3',
      paddockSubtext: 'Clover Pasture',
      age: '3 yrs 0 mos',
      sex: 'Female',
      healthStatus: 'IN HEAT (ESTRUS)',
      healthStatusType: 'heat',
      weightKg: 435,
      adgKg: 0.6,
      production: '22.8 L/d',
      productionSubtext: 'AI Scheduled',
      hasCollarSensor: true,
      vaccinationSummary: 'Vanguard 5 CV - Current • Ready for Insemination',
      vaccinationCompliant: true,
      reproStage: 'Peak Estrus Window (+14h)',
      ruminationMinutes: 440,
      internalTempC: 38.8,
      tempStatus: 'NORMAL',
      rumenPh: 6.45,
      rumenPhStatus: 'BALANCED',
      sire: 'Jersey Pride #309',
      dam: 'Buttercup 4th #1902',
      marblingMbv: '+2.9 MBV'
    },
    {
      id: 'TAG-5520',
      managementType: 'individual',
      collarId: 'RFID-1120-LR',
      breed: 'Simmental Sire',
      species: 'Cattle (Beef)',
      category: 'bull',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbiDPnhfGhE-QnyJbEo517KBH2F5bknebi36R3eTA7s0ZYUPiKrWs9lvgH_kZAEEpxXyp8NqY8Oy80gPdaE_rYC8fCU8gUOGZDlqXzdKH6OkWYNADUCR3WdveYQJQtTYzY0Q5X97ybfI_3a5Tj_KHyXSUOCxiCk5n-SN_NEYRu0Mk-I0YIa8XspupCJB4PCUxdwrxnTRkvgWEYivqP41-5aJtKHPh3peG_FJRY7emmHUUCqJQWirpGug',
      locationName: 'Oakridge Main Cadastre',
      kraalId: 'kr-01',
      kraalName: 'Kraal 01 (Dry Cow / Sire Complex)',
      penId: 'pen-11',
      penName: 'Pen 11 (Bull Holding)',
      paddockId: 's-2',
      paddockName: 'Paddock S-2',
      paddockSubtext: 'Bull Run Pasture',
      age: '5 yrs 2 mos',
      sex: 'Male (Sire)',
      healthStatus: 'BREEDING ACTIVE',
      healthStatusType: 'breeding',
      weightKg: 1040,
      adgKg: 0.9,
      production: 'Proven Sire',
      productionSubtext: 'Top 1% Growth',
      hasCollarSensor: true,
      vaccinationSummary: 'Complete Annual Bull Battery Health & Breeding Soundness Exam Passed',
      vaccinationCompliant: true,
      reproStage: 'Breeding Season Active',
      ruminationMinutes: 520,
      internalTempC: 38.5,
      tempStatus: 'NORMAL',
      rumenPh: 6.40,
      rumenPhStatus: 'BALANCED',
      sire: 'Simmental King #401',
      dam: 'Highland Lass #109',
      marblingMbv: '+3.1 MBV'
    }
  ]);

  // Selected animal for inspector
  selectedAnimal = signal<HerdAnimal>(this.animals()[0]);

  // Pastures Rotation Data
  pastures = signal<PasturePaddock[]>([
    {
      id: 'd-3',
      badge: 'CURRENT ROTATION (DAY 4/12)',
      badgeType: 'active',
      name: 'Paddock D-3 (Clover Pasture)',
      subtext: '120 Acres • 240 Head',
      statusPill: 'Optimal',
      metricLabel: 'Biomass Residual',
      metricValue: '3,200 kg DM/ha',
      progressPct: 78,
      footerLeft: 'Rest Needed: 18 Days',
      footerRight: 'Move Scheduled in 8d',
      barColor: 'bg-[#006c48]'
    },
    {
      id: 'b-1',
      badge: 'ACTIVE GRAZING (DAY 8/10)',
      badgeType: 'rest',
      name: 'Paddock B-1 (North Meadow)',
      subtext: '95 Acres • 180 Heifers',
      statusPill: 'Transition',
      metricLabel: 'Biomass Residual',
      metricValue: '1,450 kg DM/ha',
      progressPct: 35,
      footerLeft: 'Graze Cap: Near Limit',
      footerRight: 'Ready in 4 Days',
      barColor: 'bg-[#56340e]'
    },
    {
      id: 'a-4',
      badge: 'FEED SUPPLEMENTATION',
      badgeType: 'feed',
      name: 'Paddock A-4 (Dry Lot)',
      subtext: '80 Acres • 310 Steers',
      statusPill: 'TMR Mix',
      metricLabel: 'Bunk Feed Capacity',
      metricValue: '94% Ration Eaten',
      progressPct: 94,
      footerLeft: 'Density: 3.8 AU/Acre',
      footerRight: 'Scheduled Refill 16:00',
      barColor: 'bg-[#012d1d]'
    },
    {
      id: 's-2',
      badge: 'RESERVE SIRE ROTATION',
      badgeType: 'stud',
      name: 'Paddock S-2 (Bull Run)',
      subtext: '65 Acres • 18 Breeding Bulls',
      statusPill: 'Optimal',
      metricLabel: 'Pasture Biomass',
      metricValue: '2,850 kg DM/ha',
      progressPct: 88,
      footerLeft: 'Low Stress Fence',
      footerRight: 'Electric 8.2 kV OK',
      barColor: 'bg-[#006c48]'
    }
  ]);

  // Filtered Animals Computed
  filteredAnimals = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const paddock = this.selectedPaddockFilter();
    const status = this.selectedStatusFilter();
    const pill = this.activePillFilter();

    return this.animals().filter(a => {
      // Search check
      const matchesSearch = !q || 
        a.id.toLowerCase().includes(q) || 
        a.breed.toLowerCase().includes(q) || 
        a.collarId.toLowerCase().includes(q) || 
        a.paddockName.toLowerCase().includes(q) || 
        (a.kraalName && a.kraalName.toLowerCase().includes(q)) ||
        (a.penName && a.penName.toLowerCase().includes(q)) ||
        a.sire.toLowerCase().includes(q);

      // Paddock dropdown check
      const matchesPaddock = paddock === 'All' || 
        a.paddockName.toLowerCase().includes(paddock.toLowerCase()) || 
        a.paddockSubtext.toLowerCase().includes(paddock.toLowerCase());

      // Status dropdown check
      let matchesStatus = true;
      if (status === 'Healthy') matchesStatus = a.healthStatusType === 'healthy';
      else if (status === 'Estrus') matchesStatus = a.healthStatusType === 'heat';
      else if (status === 'Gestation') matchesStatus = a.healthStatusType === 'gestation';
      else if (status === 'Quarantine') matchesStatus = a.healthStatusType === 'quarantine';
      else if (status === 'Breeding') matchesStatus = a.healthStatusType === 'breeding';

      // Quick filter pill check
      let matchesPill = true;
      if (pill === 'dairy') matchesPill = a.species.toLowerCase().includes('dairy') || a.category === 'dairy';
      else if (pill === 'heifer') matchesPill = a.category === 'heifer' || a.sex.toLowerCase().includes('heifer');
      else if (pill === 'bull') matchesPill = a.category === 'bull' || a.sex.toLowerCase().includes('male');
      else if (pill === 'poultry') matchesPill = a.species.toLowerCase().includes('poultry') || a.species.toLowerCase().includes('broiler') || a.category === 'poultry';
      else if (pill === 'apiary') matchesPill = a.species.toLowerCase().includes('bee') || a.category === 'apiary';
      else if (pill === 'groups') matchesPill = a.managementType === 'group';
      else if (pill === 'quarantine') matchesPill = a.healthStatusType === 'quarantine';

      return matchesSearch && matchesPaddock && matchesStatus && matchesPill;
    });
  });

  ngOnInit() {
    this.speciesService.getAllSpecies().subscribe({
      next: () => {},
      error: () => {}
    });
    this.loadRoster(0);
  }

  /**
   * Loads animal roster and herd telemetry directly from external Spring Boot API:
   * GET /api/v1/livestock?holdingId=...&search=...&page=...&size=...
   */
  loadRoster(page: number = this.currentPage()) {
    this.isLoadingRoster.set(true);
    this.rosterError.set(null);
    const holding = this.selectedHoldingFilter() === 'all' ? undefined : this.selectedHoldingFilter();
    const search = this.searchQuery().trim();

    this.livestockService.getRoster(holding, search, page, this.pageSize()).subscribe({
      next: (res) => {
        this.isLoadingRoster.set(false);
        const items = res?.items || [];
        this.rosterItems.set(items);
        this.rosterTotal.set(res?.totalElements ?? items.length);
        this.totalPages.set(res?.totalPages ?? Math.max(1, Math.ceil((res?.totalElements ?? items.length) / this.pageSize())));
        this.currentPage.set(res?.page ?? page);

        if (items.length > 0) {
          const mapped: HerdAnimal[] = items.map(item => this.mapRosterRowToHerdAnimal(item));
          this.animals.set(mapped);
          if (!this.selectedAnimal() || !mapped.some(a => a.id === this.selectedAnimal().id)) {
            this.selectedAnimal.set(mapped[0]);
          }
        }
      },
      error: (err) => {
        this.isLoadingRoster.set(false);
        this.rosterError.set(err?.error?.message || err?.message || 'External livestock service unavailable. Showing in-memory roster.');
      }
    });
  }

  private mapRosterRowToHerdAnimal(row: AnimalRosterDTOs.AnimalRosterRowResponse): HerdAnimal {
    const isGroup = Boolean(
      row.bioAsset?.enrollmentMode === 'BATCH_GROUP' || 
      row.bioAsset?.isBatch || 
      row.bioAsset?.batch
    );
    const tagNumber = (row.bioAsset?.tagNumber || '').replace(/^#/, '') || row.id;
    const weightNum = row.weightBiomass?.weightKg ? Number(row.weightBiomass.weightKg) : 450;
    const deltaStr = row.weightBiomass?.dailyDeltaDisplay || '+0.0 kg/day';
    const parsedDelta = parseFloat(deltaStr.replace(/[^0-9.-]/g, '')) || 0;
    const isDeltaPos = row.weightBiomass?.isDeltaPositive ?? row.weightBiomass?.deltaPositive ?? (parsedDelta >= 0);
    const adgVal = isDeltaPos ? Math.abs(parsedDelta) : -Math.abs(parsedDelta);

    let statusType: 'healthy' | 'gestation' | 'quarantine' | 'heat' | 'breeding' = 'healthy';
    const badgeVariant = (row.healthReproduction?.statusBadgeVariant || '').toUpperCase();
    const badgeText = (row.healthReproduction?.statusBadgeText || '').toUpperCase();
    if (badgeVariant === 'DANGER' || badgeText.includes('ANTIBIOTIC') || badgeText.includes('HOLD') || badgeText.includes('QUARANTINE')) {
      statusType = 'quarantine';
    } else if (badgeVariant === 'INFO' || badgeText.includes('GESTATION')) {
      statusType = 'gestation';
    } else if (badgeText.includes('HEAT') || badgeText.includes('ESTRUS')) {
      statusType = 'heat';
    } else if (badgeText.includes('BREEDING')) {
      statusType = 'breeding';
    }

    const spName = row.bioAsset?.displayName || 'Cattle';
    let category: 'all' | 'dairy' | 'heifer' | 'bull' | 'quarantine' | 'poultry' | 'apiary' | 'sheep' = 'dairy';
    const lowSp = spName.toLowerCase();
    if (lowSp.includes('poultry') || lowSp.includes('broiler') || lowSp.includes('flock')) category = 'poultry';
    else if (lowSp.includes('bee') || lowSp.includes('hive') || lowSp.includes('apiary')) category = 'apiary';
    else if (lowSp.includes('sheep') || lowSp.includes('ewe') || lowSp.includes('lamb')) category = 'sheep';
    else if (lowSp.includes('bull')) category = 'bull';
    else if (lowSp.includes('heifer')) category = 'heifer';

    return {
      id: tagNumber,
      rosterRow: row,
      managementType: isGroup ? 'group' : 'individual',
      batchId: isGroup ? tagNumber : undefined,
      quantity: isGroup ? parseInt(row.ageQuantity?.primaryMetric?.replace(/[^0-9]/g, '') || '100', 10) : undefined,
      unit: isGroup ? (row.ageQuantity?.primaryMetric?.split('(')[1]?.replace(')', '') || 'Head') : undefined,
      groupPurpose: isGroup ? row.bioAsset?.displayName : undefined,
      collarId: row.bioAsset?.hasActiveTelemetry ? `BLE-${tagNumber}` : 'NONE',
      breed: row.bioAsset?.displayName || 'Livestock Animal',
      species: spName,
      category,
      photo: row.bioAsset?.imageUrl || '/assets/icons/cattle.png',
      locationName: row.location?.holdingName,
      kraalName: row.location?.holdingName,
      penName: row.location?.penName,
      paddockId: 'p-1',
      paddockName: row.location?.paddockName || row.location?.holdingName || 'Main Paddock',
      paddockSubtext: row.location?.penName || 'Holding Bay',
      age: row.ageQuantity?.primaryMetric || '2 yrs',
      sex: row.ageQuantity?.subMetric || (isGroup ? 'Group Cohort' : 'Heifer'),
      healthStatus: (row.healthReproduction?.statusBadgeText as any) || 'HEALTHY',
      healthStatusType: statusType,
      weightKg: weightNum,
      adgKg: adgVal,
      production: row.yieldIndex?.primaryYield || '28.4 L/d',
      productionSubtext: row.yieldIndex?.secondaryIndex || '1.4x Gain Idx',
      hasCollarSensor: Boolean(row.bioAsset?.hasActiveTelemetry),
      vaccinationSummary: 'Vaccinations synced via Veterinary Regulatory Ledger',
      vaccinationCompliant: statusType !== 'quarantine',
      reproStage: row.ageQuantity?.subMetric || 'Active Production',
      ruminationMinutes: 480,
      internalTempC: 38.6,
      tempStatus: 'NORMAL',
      rumenPh: 6.6,
      rumenPhStatus: 'BALANCED',
      sire: 'Registered Foundation Sire',
      dam: 'Registered Matron Dam',
      marblingMbv: '+2.4 MBV'
    };
  }

  refreshRoster() {
    this.loadRoster(this.currentPage());
  }

  onSearchSubmit() {
    this.currentPage.set(0);
    this.loadRoster(0);
  }

  onSearchClear() {
    this.searchQuery.set('');
    this.currentPage.set(0);
    this.loadRoster(0);
  }

  onHoldingFilterChange(holdingId: string) {
    this.selectedHoldingFilter.set(holdingId);
    this.currentPage.set(0);
    this.loadRoster(0);
  }

  goToPage(p: number) {
    if (p >= 0 && p < this.totalPages()) {
      this.currentPage.set(p);
      this.loadRoster(p);
    }
  }

  nextPage() {
    if (this.currentPage() + 1 < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  // Row selection handler
  selectAnimal(animal: HerdAnimal) {
    this.selectedAnimal.set(animal);
  }

  // Context menu toggling
  toggleRowMenu(event: Event, id: string) {
    event.stopPropagation();
    this.activeRowMenuId.set(this.activeRowMenuId() === id ? null : id);
  }

  @HostListener('document:click')
  closeMenus() {
    this.activeRowMenuId.set(null);
  }

  // Filter Pills action
  setPillFilter(pill: 'all' | 'dairy' | 'heifer' | 'bull' | 'poultry' | 'apiary' | 'groups' | 'quarantine') {
    this.activePillFilter.set(pill);
  }

  // Register Modal Mode & Selection Handlers
  setModalManagementType(type: 'individual' | 'group') {
    this.newAnimalForm.managementType = type;
    if (type === 'group') {
      this.newAnimalForm.species = 'Poultry / Broilers';
      this.newAnimalForm.breed = 'Cobb 500 Fast-Feathering Broiler';
      this.newAnimalForm.batchId = `FLOCK-BR-2025-${Math.floor(100 + Math.random() * 900)}`;
      this.newAnimalForm.quantity = 5000;
      this.newAnimalForm.unit = 'Birds (Broilers)';
      this.newAnimalForm.groupPurpose = 'Broiler Meat Production';
      this.newAnimalForm.locationId = 'loc-2';
      this.newAnimalForm.locationName = 'Valley Aviary & Poultry Center';
      this.newAnimalForm.kraalId = 'kr-shed-03';
      this.newAnimalForm.kraalName = 'Broiler House Shed 03 (Automated Climate)';
      this.newAnimalForm.penId = 'pen-shed3-a';
      this.newAnimalForm.penName = 'Pen Bay A (Brooder Starter Zone)';
      this.newAnimalForm.weightKg = 1850;
      this.newAnimalForm.paddock = 'Valley Shed Complex 03';
      this.newAnimalForm.photo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDklPZqXhenIBdF449HE_I75H2YPWHgJekZeIL-hCot1LLjiKeCFlNAoyFqjZ-WOylFa_3GHj0kre6oZouy6Eb5WpofArnDbJJG0RXdHGUDcZFx12jf5bCUzMVc6GGSMnU6tGv8qG-qf7aqGH0YOYd6py-ppfT1zXfVREh0HqVa-tbwKWJSqH-bDP-gHOoKsc4Mf5VulPIs3nH_gLOhmVsiYPv980rxZw3ENik8uzfVLgBhhFxUlwoGzA';
    } else {
      this.newAnimalForm.species = 'Cattle (Bovine)';
      this.newAnimalForm.breed = 'Purebred Black Angus';
      const nextTag = 8500 + Math.floor(Math.random() * 200);
      this.newAnimalForm.tag = `TAG-${nextTag}`;
      this.newAnimalForm.collarId = `RFID-${nextTag}-LR`;
      this.newAnimalForm.locationId = 'loc-1';
      this.newAnimalForm.locationName = 'Oakridge Main Cadastre';
      this.newAnimalForm.kraalId = 'kr-04';
      this.newAnimalForm.kraalName = 'Kraal 04 (Replacement Heifer Complex)';
      this.newAnimalForm.penId = 'pen-12';
      this.newAnimalForm.penName = 'Pen 12 (Replacement Heifers)';
      this.newAnimalForm.weightKg = 520;
      this.newAnimalForm.paddock = 'Paddock D-3 (Clover Pasture)';
      this.newAnimalForm.photo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC66en_HeWGU8uJiR6LOSycNVwzh7_g7-fTP5c3InADX76X8yijl-qxCDn4s2nTwn1jisZQzpQoCjR6fxfY3MxFQ1us9Gat_1scD02oj9-yum9--c1mvsyxQfWqMv__Le8v7KmQQuzTMJ88ppyCBrr74leZs-qD7v90xxooihsPryaZ2tZpRQ6wEpaQqpi1AgOJria_dmQW9ueJl2CmhkMdwFgHFKVP8UEpkzKQpXzeLIju7aLYj4ZeuA';
    }
  }

  onModalSpeciesChange(species: string) {
    this.newAnimalForm.species = species;
    if (species.includes('Poultry') || species.includes('Broiler')) {
      this.setModalManagementType('group');
      this.newAnimalForm.species = 'Poultry / Broilers';
      this.newAnimalForm.breed = 'Cobb 500 Fast-Feathering Broiler';
      this.newAnimalForm.unit = 'Birds (Broilers)';
      this.newAnimalForm.groupPurpose = 'Broiler Meat Production';
      this.newAnimalForm.locationId = 'loc-2';
      this.newAnimalForm.locationName = 'Valley Aviary & Poultry Center';
      this.newAnimalForm.kraalId = 'kr-shed-03';
      this.newAnimalForm.kraalName = 'Broiler House Shed 03 (Automated Climate)';
      this.newAnimalForm.penId = 'pen-shed3-a';
      this.newAnimalForm.penName = 'Pen Bay A (Brooder Starter Zone)';
      this.newAnimalForm.weightKg = 1850;
      this.newAnimalForm.photo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDklPZqXhenIBdF449HE_I75H2YPWHgJekZeIL-hCot1LLjiKeCFlNAoyFqjZ-WOylFa_3GHj0kre6oZouy6Eb5WpofArnDbJJG0RXdHGUDcZFx12jf5bCUzMVc6GGSMnU6tGv8qG-qf7aqGH0YOYd6py-ppfT1zXfVREh0HqVa-tbwKWJSqH-bDP-gHOoKsc4Mf5VulPIs3nH_gLOhmVsiYPv980rxZw3ENik8uzfVLgBhhFxUlwoGzA';
    } else if (species.includes('Bee') || species.includes('Apiculture')) {
      this.setModalManagementType('group');
      this.newAnimalForm.species = 'Apiculture / Bees';
      this.newAnimalForm.breed = 'Italian Honeybee (Apis mellifera)';
      this.newAnimalForm.batchId = `APIARY-HIVE-YARD-${Math.floor(1 + Math.random() * 9)}`;
      this.newAnimalForm.quantity = 24;
      this.newAnimalForm.unit = 'Hives (Bee Colonies)';
      this.newAnimalForm.groupPurpose = 'Honey & Orchard Pollination';
      this.newAnimalForm.locationId = 'loc-3';
      this.newAnimalForm.locationName = 'West Orchard & Apiary Zone';
      this.newAnimalForm.kraalId = 'kr-apiary-01';
      this.newAnimalForm.kraalName = 'Apiary Compound Alpha (Clover & Fynbos)';
      this.newAnimalForm.penId = 'pen-hive-row2';
      this.newAnimalForm.penName = 'Hive Stand Row 02 (10-Frame Langstroth)';
      this.newAnimalForm.weightKg = 480;
      this.newAnimalForm.photo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXKG9fUqXgcjoM_iA3ZSDHpuSQH0zReM0tvW80yvqjZLFw5G2e7mQSa9CpklxOh9zUuE8ceKRy_neu6zm7ARjrC39BvmCPzki0EoqlwdZRCXRNlai_8pTzp7Tn62Z1VApSkPJeNG_lvFA7ZWOUWsqGz2hDILL9wG6Xmn1D4l3vM-ONma8xRdXEkurEQAn_DgDhBnH5Tj57VGhjyXSzyoqDMmrPk9BjlX9LAbMeaQpEUo_V6recqYssMo9otSXMgz7VY4';
    } else if (species.includes('Sheep')) {
      this.newAnimalForm.breed = 'Merino Purebred';
      this.newAnimalForm.locationId = 'loc-4';
      this.newAnimalForm.locationName = 'South Slope Sheep Pastures';
      this.newAnimalForm.kraalId = 'kr-sheep-01';
      this.newAnimalForm.kraalName = 'Sheep Kraal Delta (Merino Enclosure)';
      this.newAnimalForm.penId = 'pen-sheep-6';
      this.newAnimalForm.penName = 'Pen 06 (Ewe Mob Shelter)';
      this.newAnimalForm.photo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR3zK31htETWqIaLZGQmMN9lcqcF9txG5T8hNnb1Hpbrk0xJhGQ-nyxzWq7BHSClbs2HA4btHPSGBI2xWMO0RO2HNO2hOjJ0ndClOMh7cKcKo2Hv56Q19OMWzCEiNoZC5Rb2AbvCmsxPFl1JJu5sQvqIEGRhQdhug5_6B8pC5TlkIam8xTTZDbod5FjDfU5voThUesd3-koXzCIAnO9zlFl4M5Q2dCJOhbIhN7gE92ZVxRvyBmPlDvEg';
    } else {
      this.newAnimalForm.locationId = 'loc-1';
      this.newAnimalForm.locationName = 'Oakridge Main Cadastre';
      this.newAnimalForm.kraalId = 'kr-04';
      this.newAnimalForm.kraalName = 'Kraal 04 (Replacement Heifer Complex)';
      this.newAnimalForm.penId = 'pen-12';
      this.newAnimalForm.penName = 'Pen 12 (Replacement Heifers)';
      this.newAnimalForm.photo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC66en_HeWGU8uJiR6LOSycNVwzh7_g7-fTP5c3InADX76X8yijl-qxCDn4s2nTwn1jisZQzpQoCjR6fxfY3MxFQ1us9Gat_1scD02oj9-yum9--c1mvsyxQfWqMv__Le8v7KmQQuzTMJ88ppyCBrr74leZs-qD7v90xxooihsPryaZ2tZpRQ6wEpaQqpi1AgOJria_dmQW9ueJl2CmhkMdwFgHFKVP8UEpkzKQpXzeLIju7aLYj4ZeuA';
    }
  }

  onModalLocationChange() {
    const loc = this.locations().find(l => l.id === this.newAnimalForm.locationId);
    if (loc) {
      this.newAnimalForm.locationName = loc.name;
    }
    const kList = this.filteredRegisterKraals();
    if (kList.length > 0) {
      this.newAnimalForm.kraalId = kList[0].id;
      this.newAnimalForm.kraalName = kList[0].name;
      this.onModalKraalChange();
    }
  }

  onModalKraalChange() {
    const k = this.kraals().find(item => item.id === this.newAnimalForm.kraalId);
    if (k) {
      this.newAnimalForm.kraalName = k.name;
    }
    const pList = this.filteredRegisterPens();
    if (pList.length > 0) {
      this.newAnimalForm.penId = pList[0].id;
      this.newAnimalForm.penName = pList[0].name;
    }
  }

  onModalPenChange() {
    const p = this.pens().find(item => item.id === this.newAnimalForm.penId);
    if (p) {
      this.newAnimalForm.penName = p.name;
    }
  }

  autoScanRfid() {
    const randPart = Math.floor(100000000 + Math.random() * 900000000);
    this.newAnimalForm.collarId = `RFID-982${randPart.toString().substring(0, 4)}-LR`;
    const tagNum = 8500 + Math.floor(Math.random() * 200);
    this.newAnimalForm.tag = `TAG-${tagNum}`;
    this.showFeedback(`RFID Wand Captured: ${this.newAnimalForm.collarId} (Assigned Tag #${this.newAnimalForm.tag})`);
  }

  generateBatchId() {
    const isBees = this.newAnimalForm.species.toLowerCase().includes('bee');
    const isSheep = this.newAnimalForm.species.toLowerCase().includes('sheep');
    if (isBees) {
      this.newAnimalForm.batchId = `APIARY-HIVE-YARD-${Math.floor(10 + Math.random() * 90)}`;
    } else if (isSheep) {
      this.newAnimalForm.batchId = `MOB-SH-${Math.floor(200 + Math.random() * 800)}`;
    } else {
      this.newAnimalForm.batchId = `FLOCK-BR-2025-${Math.floor(100 + Math.random() * 900)}`;
    }
    this.showFeedback(`Generated Batch ID: ${this.newAnimalForm.batchId}`);
  }

  // Actions & Modals Triggers
  openRegisterModal() {
    if (this.newAnimalForm.managementType === 'individual') {
      const nextTagNumber = 8500 + Math.floor(Math.random() * 200);
      this.newAnimalForm.tag = `TAG-${nextTagNumber}`;
      this.newAnimalForm.collarId = `RFID-${nextTagNumber}-LR`;
    }
    this.showRegisterModal.set(true);
  }

  submitRegisterAnimal() {
    const isGroup = this.newAnimalForm.managementType === 'group';
    const assetId = isGroup ? this.newAnimalForm.batchId : this.newAnimalForm.tag;
    if (!assetId) return;

    const isQuarantine = this.newAnimalForm.healthStatus === 'ANTIBIOTIC HOLD';
    const isGestation = this.newAnimalForm.healthStatus === 'GESTATION D-180';
    const isHeat = this.newAnimalForm.healthStatus === 'IN HEAT (ESTRUS)';
    const isBreeding = this.newAnimalForm.healthStatus === 'BREEDING ACTIVE';

    const pParts = this.newAnimalForm.paddock.split('(');
    const pName = pParts[0].trim();

    let category: HerdAnimal['category'] = 'all';
    if (isQuarantine) category = 'quarantine';
    else if (isGroup) {
      category = this.newAnimalForm.species.toLowerCase().includes('bee') ? 'apiary' : 'poultry';
    } else if (this.newAnimalForm.species.toLowerCase().includes('dairy')) {
      category = 'dairy';
    } else if (this.newAnimalForm.sex.toLowerCase().includes('heifer')) {
      category = 'heifer';
    } else if (this.newAnimalForm.sex.toLowerCase().includes('sire') || this.newAnimalForm.sex.toLowerCase().includes('bull')) {
      category = 'bull';
    }

    const kraalLabel = this.newAnimalForm.kraalName ? this.newAnimalForm.kraalName.split('(')[0].trim() : 'Kraal 04';
    const penLabel = this.newAnimalForm.penName ? this.newAnimalForm.penName.split('(')[0].trim() : 'Pen 12';

    const newAnimal: HerdAnimal = {
      id: assetId,
      managementType: this.newAnimalForm.managementType,
      batchId: isGroup ? this.newAnimalForm.batchId : undefined,
      quantity: isGroup ? this.newAnimalForm.quantity : 1,
      unit: isGroup ? this.newAnimalForm.unit : 'Head',
      groupPurpose: isGroup ? this.newAnimalForm.groupPurpose : undefined,
      collarId: isGroup ? `GATEWAY-${this.newAnimalForm.kraalId.toUpperCase()}` : (this.newAnimalForm.collarId || `RFID-${assetId}-LR`),
      breed: this.newAnimalForm.breed,
      species: this.newAnimalForm.species,
      category: category,
      photo: this.newAnimalForm.photo,
      locationName: this.newAnimalForm.locationName,
      kraalId: this.newAnimalForm.kraalId,
      kraalName: this.newAnimalForm.kraalName,
      penId: this.newAnimalForm.penId,
      penName: this.newAnimalForm.penName,
      paddockId: 'p-user-custom',
      paddockName: pName,
      paddockSubtext: `${kraalLabel} • ${penLabel}`,
      age: isGroup ? 'Batch Cycle' : this.newAnimalForm.age,
      sex: isGroup ? `${this.newAnimalForm.quantity} ${this.newAnimalForm.unit}` : this.newAnimalForm.sex,
      healthStatus: this.newAnimalForm.healthStatus,
      healthStatusType: isQuarantine ? 'quarantine' : isGestation ? 'gestation' : isHeat ? 'heat' : isBreeding ? 'breeding' : 'healthy',
      weightKg: Number(this.newAnimalForm.weightKg) || (isGroup ? 1850 : 500),
      adgKg: isGroup ? 0.08 : 1.1,
      production: isGroup ? (this.newAnimalForm.species.toLowerCase().includes('bee') ? '18.4 kg Honey/wk' : '2.4 kg Target/Bird') : '24.5 L/d',
      productionSubtext: isGroup ? (this.newAnimalForm.groupPurpose || 'Production Lot') : '1.2x Gain Idx',
      hasCollarSensor: true,
      vaccinationSummary: isGroup ? 'Flock/Colony Biosecurity Protocol Active • USDA/NLIS Verified' : 'Registration Vax Protocol administered • Verified on Ledger',
      vaccinationCompliant: !isQuarantine,
      reproStage: isGroup ? 'Production Batch • Monitored' : 'Registered Animal • Monitored',
      ruminationMinutes: isGroup ? 0 : 470,
      internalTempC: isGroup ? 41.2 : 38.6,
      tempStatus: 'NORMAL',
      rumenPh: isGroup ? 6.5 : 6.40,
      rumenPhStatus: 'BALANCED',
      sire: isGroup ? 'Selected Foundation Breeder Lineage' : 'Oakridge Titan #1105 (EBV Top 1%)',
      dam: isGroup ? 'Certified Breeder Flock/Queen Stock' : 'Registered Matron #3011',
      marblingMbv: isGroup ? 'Grade A Production' : '+2.1 MBV'
    };

    this.animals.update(list => [newAnimal, ...list]);
    this.selectedAnimal.set(newAnimal);
    this.showRegisterModal.set(false);
    this.showFeedback(isGroup 
      ? `Production Group #${assetId} (${this.newAnimalForm.quantity} ${this.newAnimalForm.unit}) successfully registered and assigned to ${this.newAnimalForm.kraalName} • ${this.newAnimalForm.penName}!`
      : `Animal #${newAnimal.id} enrolled into ${this.newAnimalForm.kraalName} • ${this.newAnimalForm.penName} with active LoRaWAN RFID collar!`);
  }

  openLogWeightModal() {
    this.weightLogForm.weightKg = this.selectedAnimal().weightKg;
    this.showLogWeightModal.set(true);
  }

  submitLogWeight() {
    const cur = this.selectedAnimal();
    const newWeight = Number(this.weightLogForm.weightKg);
    const weightDiff = newWeight - cur.weightKg;
    const newAdg = weightDiff > 0 ? Number((weightDiff / 7).toFixed(1)) : cur.adgKg;

    const updated = {
      ...cur,
      weightKg: newWeight,
      adgKg: newAdg
    };

    this.updateAnimalInList(updated);
    this.selectedAnimal.set(updated);
    this.showLogWeightModal.set(false);
    this.showFeedback(`Logged scale weight: ${newWeight} kg for ${cur.id}. Average daily gain updated.`);
  }

  openAdministerRxModal() {
    this.showAdministerRxModal.set(true);
  }

  submitAdministerRx() {
    const cur = this.selectedAnimal();
    const updated = {
      ...cur,
      vaccinationSummary: `${this.rxForm.drugName} (${this.rxForm.dosage}) administered by ${this.rxForm.technician}. Withholding: ${this.rxForm.withholdDays} days.`,
      vaccinationCompliant: true
    };

    this.updateAnimalInList(updated);
    this.selectedAnimal.set(updated);
    this.showAdministerRxModal.set(false);
    this.showFeedback(`Administered ${this.rxForm.drugName} to ${cur.id}. Recorded in digital veterinary ledger.`);
  }

  openMovePaddockModal() {
    this.showMovePaddockModal.set(true);
  }

  submitMovePaddock() {
    const cur = this.selectedAnimal();
    const parts = this.movePaddockForm.targetPaddock.split('(');
    const pName = parts[0].trim();
    const pSub = parts[1] ? parts[1].replace(')', '').trim() : 'Pasture';

    const updated = {
      ...cur,
      paddockName: pName,
      paddockSubtext: pSub
    };

    this.updateAnimalInList(updated);
    this.selectedAnimal.set(updated);
    this.showMovePaddockModal.set(false);
    this.showFeedback(`Transferred ${cur.id} to ${this.movePaddockForm.targetPaddock}. Stocking density updated.`);
  }

  openPedigreeModal() {
    this.showPedigreeModal.set(true);
  }

  openBatchWeighingModal() {
    this.showBatchWeighingModal.set(true);
  }

  submitBatchWeighing() {
    this.showBatchWeighingModal.set(false);
    this.showFeedback(`Batch weighing recorded for ${this.batchWeighForm.animalsWeighed} animals in ${this.batchWeighForm.paddock}. ADG: +${this.batchWeighForm.averageGain} kg/day.`);
  }

  private updateAnimalInList(updated: HerdAnimal) {
    this.animals.update(list => list.map(a => a.id === updated.id ? updated : a));
  }

  private showFeedback(msg: string) {
    this.actionFeedback.set(msg);
    setTimeout(() => {
      this.actionFeedback.set(null);
    }, 4500);
  }
}
