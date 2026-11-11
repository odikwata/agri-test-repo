import { Injectable, signal, computed } from '@angular/core';

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type DeviationParameter = 'moisture' | 'ph' | 'both';

export interface CropSoilThreshold {
  cropKey: string;
  cropName: string;
  aliases: string[];
  optimalMoisture: { min: number; max: number; unit: string };
  optimalPh: { min: number; max: number };
  optimalNitrogen?: { min: number; max: number; unit: string };
  optimalPhosphorus?: { min: number; max: number; unit: string };
  optimalPotassium?: { min: number; max: number; unit: string };
  description: string;
  moistureWarningLow: string;
  moistureWarningHigh: string;
  phWarningLow: string;
  phWarningHigh: string;
}

export interface SoilAlert {
  id: string;
  fieldId: string;
  fieldName: string;
  cropName: string;
  variety?: string;
  parameter: DeviationParameter;
  severity: AlertSeverity;
  title: string;
  message: string;
  recommendation: string;
  currentMoisture?: number;
  expectedMoistureRange?: { min: number; max: number; unit: string };
  moistureDeviationText?: string;
  currentPh?: number;
  expectedPhRange?: { min: number; max: number };
  phDeviationText?: string;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
  status: 'active' | 'acknowledged' | 'resolved';
}

const DEFAULT_THRESHOLDS: Record<string, CropSoilThreshold> = {
  potato: {
    cropKey: 'potato',
    cropName: 'Potato',
    aliases: ['potato', 'potatoes', 'solanum tuberosum', 'panamera', 'valor', 'mondial'],
    optimalMoisture: { min: 30, max: 45, unit: '%' },
    optimalPh: { min: 5.0, max: 6.5 },
    optimalNitrogen: { min: 40, max: 80, unit: 'ppm' },
    optimalPhosphorus: { min: 25, max: 50, unit: 'ppm' },
    optimalPotassium: { min: 90, max: 160, unit: 'ppm' },
    description: 'Potatoes require consistent moderate-to-high moisture (30-45%) and slightly acidic soil (pH 5.0-6.5) to suppress Common Scab (Streptomyces scabies).',
    moistureWarningLow: 'Moisture below 30% causes tuber growth cracking, secondary growth, and hollow heart defect.',
    moistureWarningHigh: 'Moisture above 45% causes root asphyxiation, late blight, and soft rot decay.',
    phWarningLow: 'pH below 5.0 risks manganese/aluminum toxicity and impairs phosphorus uptake.',
    phWarningHigh: 'pH above 6.5 drastically triggers Common Scab bacteria, ruining tuber skins and market value.'
  },
  soybean: {
    cropKey: 'soybean',
    cropName: 'Soybeans',
    aliases: ['soybean', 'soybeans', 'soya', 'glycine max', 'rr2'],
    optimalMoisture: { min: 22, max: 35, unit: '%' },
    optimalPh: { min: 6.0, max: 6.8 },
    optimalNitrogen: { min: 30, max: 60, unit: 'ppm' },
    optimalPhosphorus: { min: 20, max: 40, unit: 'ppm' },
    optimalPotassium: { min: 60, max: 120, unit: 'ppm' },
    description: 'Soybeans thrive in well-aerated soil with 22-35% moisture and near-neutral pH (6.0-6.8) for optimal Bradyrhizobium nitrogen fixation.',
    moistureWarningLow: 'Moisture below 22% severely stunts vegetative canopy and causes flower/pod abortion.',
    moistureWarningHigh: 'Waterlogged soil (>35%) damages nitrogen nodules and promotes Phytophthora root rot.',
    phWarningLow: 'pH below 6.0 inhibits symbiotic nitrogen fixation and causes molybdenum deficiency.',
    phWarningHigh: 'pH above 6.8 causes Iron Deficiency Chlorosis (IDC) with severe leaf yellowing.'
  },
  wheat: {
    cropKey: 'wheat',
    cropName: 'Winter Wheat',
    aliases: ['wheat', 'winter wheat', 'spring wheat', 'triticum'],
    optimalMoisture: { min: 25, max: 40, unit: '%' },
    optimalPh: { min: 6.0, max: 7.0 },
    optimalNitrogen: { min: 45, max: 75, unit: 'ppm' },
    optimalPhosphorus: { min: 25, max: 45, unit: 'ppm' },
    optimalPotassium: { min: 70, max: 120, unit: 'ppm' },
    description: 'Wheat requires 25-40% moisture for good tillering and grain filling, preferring balanced pH between 6.0 and 7.0.',
    moistureWarningLow: 'Moisture below 25% impairs crown root development, tillering, and test weight.',
    moistureWarningHigh: 'Moisture above 40% promotes Fusarium head blight, crown rot, and lodging.',
    phWarningLow: 'pH below 6.0 causes toxic aluminum ionization, inhibiting deep root penetration.',
    phWarningHigh: 'pH above 7.0 ties up micronutrients including zinc and copper.'
  },
  corn: {
    cropKey: 'corn',
    cropName: 'Yellow Corn (Maize)',
    aliases: ['corn', 'maize', 'zea mays', 'dkc', 'sweetcorn', 'yellow corn'],
    optimalMoisture: { min: 25, max: 38, unit: '%' },
    optimalPh: { min: 5.8, max: 7.0 },
    optimalNitrogen: { min: 50, max: 90, unit: 'ppm' },
    optimalPhosphorus: { min: 30, max: 55, unit: 'ppm' },
    optimalPotassium: { min: 80, max: 140, unit: 'ppm' },
    description: 'Corn demands high moisture (25-38%) especially during silking and tasseling, with pH 5.8-7.0 for nutrient assimilation.',
    moistureWarningLow: 'Moisture below 25% induces severe moisture stress, delayed silking, and poor kernel fill.',
    moistureWarningHigh: 'Moisture above 38% causes denitrification, nitrogen leaching, and root death.',
    phWarningLow: 'pH below 5.8 limits phosphorus uptake and slows seedling emergence.',
    phWarningHigh: 'pH above 7.0 results in zinc deficiency and leaf striping.'
  },
  canola: {
    cropKey: 'canola',
    cropName: 'Winter Canola',
    aliases: ['canola', 'winter canola', 'oilseed rape', 'brassica napus'],
    optimalMoisture: { min: 20, max: 32, unit: '%' },
    optimalPh: { min: 6.0, max: 7.5 },
    optimalNitrogen: { min: 40, max: 70, unit: 'ppm' },
    optimalPhosphorus: { min: 25, max: 45, unit: 'ppm' },
    optimalPotassium: { min: 60, max: 110, unit: 'ppm' },
    description: 'Canola requires well-drained soil (20-32% moisture) and is tolerant of slightly higher pH ranges up to 7.5.',
    moistureWarningLow: 'Moisture below 20% restricts taproot penetration and branching.',
    moistureWarningHigh: 'Canola is highly susceptible to waterlogging (>32%); roots decay within 48 hours in standing water.',
    phWarningLow: 'pH below 6.0 increases Clubroot (Plasmodiophora brassicae) disease risk.',
    phWarningHigh: 'pH above 7.5 reduces boron uptake necessary for pod formation.'
  },
  tomato: {
    cropKey: 'tomato',
    cropName: 'Tomato',
    aliases: ['tomato', 'tomatoes', 'solanum lycopersicum'],
    optimalMoisture: { min: 28, max: 42, unit: '%' },
    optimalPh: { min: 6.0, max: 6.8 },
    optimalNitrogen: { min: 35, max: 65, unit: 'ppm' },
    optimalPhosphorus: { min: 30, max: 50, unit: 'ppm' },
    optimalPotassium: { min: 85, max: 150, unit: 'ppm' },
    description: 'Tomatoes need uniform 28-42% moisture to avoid blossom end rot and a pH of 6.0-6.8 for calcium mobilization.',
    moistureWarningLow: 'Fluctuating or low moisture (<28%) induces Blossom End Rot due to calcium transport failure.',
    moistureWarningHigh: 'High moisture (>42%) induces fruit splitting/cracking and root asphyxia.',
    phWarningLow: 'pH below 6.0 inhibits calcium and magnesium uptake.',
    phWarningHigh: 'pH above 6.8 induces phosphorus and iron chlorosis.'
  },
  default: {
    cropKey: 'default',
    cropName: 'General Crop',
    aliases: ['default', 'general', 'unknown'],
    optimalMoisture: { min: 25, max: 40, unit: '%' },
    optimalPh: { min: 6.0, max: 7.0 },
    optimalNitrogen: { min: 40, max: 75, unit: 'ppm' },
    optimalPhosphorus: { min: 20, max: 45, unit: 'ppm' },
    optimalPotassium: { min: 60, max: 120, unit: 'ppm' },
    description: 'Standard agronomic baseline range for field crops and pastures.',
    moistureWarningLow: 'Soil moisture is below the typical 25% threshold, indicating moisture deficit.',
    moistureWarningHigh: 'Soil moisture exceeds 40%, indicating water saturation and anaerobic conditions.',
    phWarningLow: 'Soil pH is overly acidic (<6.0), hindering nutrient availability.',
    phWarningHigh: 'Soil pH is overly alkaline (>7.0), causing micronutrient lockup.'
  }
};

const STORAGE_KEY_ALERTS = 'slingshot_soil_alerts';
const STORAGE_KEY_THRESHOLDS = 'slingshot_crop_thresholds';

@Injectable({
  providedIn: 'root'
})
export class SoilNotificationService {
  private thresholdsSignal = signal<Record<string, CropSoilThreshold>>(this.loadInitialThresholds());
  private alertsSignal = signal<SoilAlert[]>(this.loadInitialAlerts());
  private lastAlertTimeSignal = signal<Date | null>(new Date());

  // Public Signals
  readonly thresholds = this.thresholdsSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly lastAlertTime = this.lastAlertTimeSignal.asReadonly();

  // Computed views
  readonly activeAlerts = computed(() => {
    return this.alertsSignal().filter(alert => !alert.dismissed);
  });

  readonly unreadAlerts = computed(() => {
    return this.alertsSignal().filter(alert => !alert.read && !alert.dismissed);
  });

  readonly unreadCount = computed(() => this.unreadAlerts().length);

  readonly criticalAlertsCount = computed(() => {
    return this.activeAlerts().filter(a => a.severity === 'critical').length;
  });

  readonly warningAlertsCount = computed(() => {
    return this.activeAlerts().filter(a => a.severity === 'warning').length;
  });

  readonly hasActiveDeviations = computed(() => this.activeAlerts().length > 0);

  constructor() {
    // If no alerts stored, populate pre-seeded realistic field deviations
    if (this.alertsSignal().length === 0) {
      this.seedDefaultAlerts();
    }
  }

  /**
   * Find the matching crop threshold based on crop name or variety string
   */
  getThresholdForCrop(cropOrVarietyName?: string | null): CropSoilThreshold {
    if (!cropOrVarietyName) return this.thresholdsSignal()['default'];
    
    const query = cropOrVarietyName.trim().toLowerCase();
    const allThresholds = this.thresholdsSignal();

    for (const key of Object.keys(allThresholds)) {
      const threshold = allThresholds[key];
      if (threshold.aliases.some(alias => query.includes(alias) || alias.includes(query))) {
        return threshold;
      }
    }
    return allThresholds['default'];
  }

  /**
   * Evaluate soil sensor readings for a field and generate or update deviations
   */
  evaluateFieldSoil(params: {
    fieldId: string;
    fieldName: string;
    cropName: string;
    varietyName?: string;
    moisture: number;
    ph: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
  }): SoilAlert[] {
    const threshold = this.getThresholdForCrop(params.cropName || params.varietyName);
    const newAlerts: SoilAlert[] = [];

    const isMoistureLow = params.moisture < threshold.optimalMoisture.min;
    const isMoistureHigh = params.moisture > threshold.optimalMoisture.max;
    const isPhLow = params.ph < threshold.optimalPh.min;
    const isPhHigh = params.ph > threshold.optimalPh.max;

    if (!isMoistureLow && !isMoistureHigh && !isPhLow && !isPhHigh) {
      // Metrics are healthy! Auto-resolve any existing alert for this field
      this.resolveAlertsForField(params.fieldId);
      return [];
    }

    // Determine parameter
    let paramType: DeviationParameter = 'moisture';
    if ((isMoistureLow || isMoistureHigh) && (isPhLow || isPhHigh)) {
      paramType = 'both';
    } else if (isPhLow || isPhHigh) {
      paramType = 'ph';
    }

    // Calculate moisture deviation details
    let moistureDeviationText: string | undefined;
    let moistureSeverity: AlertSeverity = 'warning';
    if (isMoistureLow) {
      const diff = threshold.optimalMoisture.min - params.moisture;
      moistureDeviationText = `${diff.toFixed(0)}% below minimum optimal (${threshold.optimalMoisture.min}%)`;
      if (diff >= 7) moistureSeverity = 'critical';
    } else if (isMoistureHigh) {
      const diff = params.moisture - threshold.optimalMoisture.max;
      moistureDeviationText = `${diff.toFixed(0)}% above maximum optimal (${threshold.optimalMoisture.max}%)`;
      if (diff >= 8) moistureSeverity = 'critical';
    }

    // Calculate pH deviation details
    let phDeviationText: string | undefined;
    let phSeverity: AlertSeverity = 'warning';
    if (isPhLow) {
      const diff = threshold.optimalPh.min - params.ph;
      phDeviationText = `${diff.toFixed(1)} units below minimum (${threshold.optimalPh.min})`;
      if (diff >= 0.6) phSeverity = 'critical';
    } else if (isPhHigh) {
      const diff = params.ph - threshold.optimalPh.max;
      phDeviationText = `${diff.toFixed(1)} units above maximum (${threshold.optimalPh.max})`;
      if (diff >= 0.6) phSeverity = 'critical';
    }

    // Overall severity
    const overallSeverity: AlertSeverity = (moistureSeverity === 'critical' || phSeverity === 'critical')
      ? 'critical'
      : 'warning';

    // Construct Title and Recommendation
    let title = '';
    let message = '';
    let recommendation = '';

    if (paramType === 'both') {
      title = `Moisture & pH Deviation in ${params.fieldName}`;
      message = `${params.cropName} readings: Moisture is ${params.moisture}% (Optimal: ${threshold.optimalMoisture.min}-${threshold.optimalMoisture.max}%) and pH is ${params.ph} (Optimal: ${threshold.optimalPh.min}-${threshold.optimalPh.max}).`;
      
      const moistureAdvice = isMoistureLow 
        ? `Schedule immediate irrigation (${params.cropName.includes('Potato') ? '10-15mm gentle cycle' : '15-20mm'}).`
        : `Halt irrigation and verify field tile drainage.`;
      const phAdvice = isPhLow
        ? `Apply agricultural limestone (CaCO3) to neutralize acidity.`
        : `Apply elemental sulfur or acidifying fertilizer to lower pH and mitigate disease risk.`;
      
      recommendation = `${moistureAdvice} ${phAdvice}`;
    } else if (paramType === 'moisture') {
      if (isMoistureLow) {
        title = `Low Moisture Alert: ${params.fieldName}`;
        message = `${params.cropName} moisture has fallen to ${params.moisture}%, below the ${threshold.optimalMoisture.min}% optimal minimum threshold.`;
        recommendation = `Trigger supplemental irrigation promptly. ${threshold.moistureWarningLow}`;
      } else {
        title = `Excess Soil Moisture: ${params.fieldName}`;
        message = `${params.cropName} moisture is ${params.moisture}%, exceeding the ${threshold.optimalMoisture.max}% optimal limit.`;
        recommendation = `Suspend watering schedules and check drainage channels. ${threshold.moistureWarningHigh}`;
      }
    } else {
      if (isPhLow) {
        title = `Soil Acidity Warning: ${params.fieldName}`;
        message = `${params.cropName} soil pH is ${params.ph.toFixed(1)}, below the recommended minimum of ${threshold.optimalPh.min}.`;
        recommendation = `Apply agricultural lime (calcitic or dolomitic). ${threshold.phWarningLow}`;
      } else {
        title = `Soil Alkaline Deviation: ${params.fieldName}`;
        message = `${params.cropName} soil pH is ${params.ph.toFixed(1)}, exceeding the safe threshold of ${threshold.optimalPh.max}.`;
        recommendation = `Apply elemental sulfur (S) or ammonium sulfate. ${threshold.phWarningHigh}`;
      }
    }

    const alert: SoilAlert = {
      id: `alert-${params.fieldId}-${Date.now()}`,
      fieldId: params.fieldId,
      fieldName: params.fieldName,
      cropName: params.cropName,
      variety: params.varietyName,
      parameter: paramType,
      severity: overallSeverity,
      title,
      message,
      recommendation,
      currentMoisture: params.moisture,
      expectedMoistureRange: threshold.optimalMoisture,
      moistureDeviationText,
      currentPh: params.ph,
      expectedPhRange: threshold.optimalPh,
      phDeviationText,
      timestamp: new Date(),
      read: false,
      dismissed: false,
      status: 'active'
    };

    // Remove any previous active alert for the same field to avoid duplicates
    this.alertsSignal.update(current => [
      alert,
      ...current.filter(a => a.fieldId !== params.fieldId)
    ]);

    this.lastAlertTimeSignal.set(new Date());
    this.saveAlertsToStorage();
    newAlerts.push(alert);

    return newAlerts;
  }

  /**
   * Dismiss an alert so it doesn't show in active banners
   */
  dismissAlert(alertId: string) {
    this.alertsSignal.update(alerts => 
      alerts.map(a => a.id === alertId ? { ...a, dismissed: true, read: true } : a)
    );
    this.saveAlertsToStorage();
  }

  /**
   * Mark alert as read
   */
  markAsRead(alertId: string) {
    this.alertsSignal.update(alerts => 
      alerts.map(a => a.id === alertId ? { ...a, read: true } : a)
    );
    this.saveAlertsToStorage();
  }

  /**
   * Mark all alerts as read
   */
  markAllAsRead() {
    this.alertsSignal.update(alerts => alerts.map(a => ({ ...a, read: true })));
    this.saveAlertsToStorage();
  }

  /**
   * Acknowledge alert (marks as acknowledged)
   */
  acknowledgeAlert(alertId: string) {
    this.alertsSignal.update(alerts => 
      alerts.map(a => a.id === alertId ? { ...a, status: 'acknowledged', read: true } : a)
    );
    this.saveAlertsToStorage();
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string) {
    this.alertsSignal.update(alerts => 
      alerts.map(a => a.id === alertId ? { ...a, status: 'resolved', dismissed: true, read: true } : a)
    );
    this.saveAlertsToStorage();
  }

  /**
   * Resolve alerts for a specific field
   */
  resolveAlertsForField(fieldId: string) {
    this.alertsSignal.update(alerts => 
      alerts.map(a => a.fieldId === fieldId ? { ...a, status: 'resolved', dismissed: true } : a)
    );
    this.saveAlertsToStorage();
  }

  /**
   * Clear all dismissed alerts or reset alerts to sample state
   */
  resetSampleAlerts() {
    this.seedDefaultAlerts();
  }

  /**
   * Simulate a test deviation for rapid evaluation/demo
   */
  simulateDeviation(options: {
    cropKey: string;
    fieldName: string;
    fieldId?: string;
    deviationType: 'low_moisture' | 'high_moisture' | 'acidic_ph' | 'alkaline_ph' | 'severe_both';
  }) {
    const threshold = this.thresholdsSignal()[options.cropKey] || this.thresholdsSignal()['default'];
    const fieldId = options.fieldId || `sim-field-${Date.now().toString(36)}`;
    
    let moisture = (threshold.optimalMoisture.min + threshold.optimalMoisture.max) / 2;
    let ph = (threshold.optimalPh.min + threshold.optimalPh.max) / 2;

    switch (options.deviationType) {
      case 'low_moisture':
        moisture = Math.max(8, threshold.optimalMoisture.min - 10);
        break;
      case 'high_moisture':
        moisture = threshold.optimalMoisture.max + 12;
        break;
      case 'acidic_ph':
        ph = Math.max(4.2, +(threshold.optimalPh.min - 0.8).toFixed(1));
        break;
      case 'alkaline_ph':
        ph = +(threshold.optimalPh.max + 0.9).toFixed(1);
        break;
      case 'severe_both':
        moisture = Math.max(10, threshold.optimalMoisture.min - 12);
        ph = +(threshold.optimalPh.max + 0.8).toFixed(1);
        break;
    }

    return this.evaluateFieldSoil({
      fieldId,
      fieldName: options.fieldName,
      cropName: threshold.cropName,
      varietyName: threshold.cropName,
      moisture,
      ph
    });
  }

  /**
   * Update crop threshold ranges (e.g. customized by agronomist)
   */
  updateThreshold(cropKey: string, updates: Partial<CropSoilThreshold>) {
    this.thresholdsSignal.update(current => {
      const existing = current[cropKey] || current['default'];
      const updated = { ...existing, ...updates };
      const next = { ...current, [cropKey]: updated };
      try {
        localStorage.setItem(STORAGE_KEY_THRESHOLDS, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save thresholds to storage', e);
      }
      return next;
    });
  }

  /**
   * Reset thresholds to default agronomic standards
   */
  resetThresholds() {
    try {
      localStorage.removeItem(STORAGE_KEY_THRESHOLDS);
    } catch (e) {}
    this.thresholdsSignal.set(DEFAULT_THRESHOLDS);
  }

  // --- Private Helpers ---

  private loadInitialThresholds(): Record<string, CropSoilThreshold> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THRESHOLDS);
      if (stored) {
        return { ...DEFAULT_THRESHOLDS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read crop thresholds from localStorage', e);
    }
    return DEFAULT_THRESHOLDS;
  }

  private loadInitialAlerts(): SoilAlert[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ALERTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }));
        }
      }
    } catch (e) {
      console.warn('Could not read soil alerts from localStorage', e);
    }
    return [];
  }

  private saveAlertsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(this.alertsSignal()));
    } catch (e) {
      console.warn('Failed to persist alerts in localStorage', e);
    }
  }

  private seedDefaultAlerts() {
    const alerts: SoilAlert[] = [
      {
        id: 'alert-soybean-south-pivot',
        fieldId: 'f3',
        fieldName: 'Field C-01 (South Pivot)',
        cropName: 'Soybeans',
        variety: 'Soybeans (RR2)',
        parameter: 'both',
        severity: 'critical',
        title: 'Critical Soil Deviation in Field C-01',
        message: 'Soybeans (RR2) moisture has fallen to 15% (optimal: 22%-35%) and soil pH is elevated at 7.2 (optimal: 6.0-6.8).',
        recommendation: 'Immediate center-pivot irrigation (20mm) required to halt pod abortion. Follow with ammonium sulfate or sulfur application to mitigate Iron Deficiency Chlorosis (IDC).',
        currentMoisture: 15,
        expectedMoistureRange: { min: 22, max: 35, unit: '%' },
        moistureDeviationText: '7% below minimum optimal (22%)',
        currentPh: 7.2,
        expectedPhRange: { min: 6.0, max: 6.8 },
        phDeviationText: '0.4 units above maximum (6.8)',
        timestamp: new Date(Date.now() - 1000 * 60 * 18), // 18 mins ago
        read: false,
        dismissed: false,
        status: 'active'
      },
      {
        id: 'alert-potato-north-plot',
        fieldId: 'b98d4af2-8b5d-11f1-a784-b347e4d80244',
        fieldName: 'North Valley Plot (Potato)',
        cropName: 'Potato',
        variety: 'Panamera',
        parameter: 'ph',
        severity: 'critical',
        title: 'Alkaline pH Risk: Scab Vulnerability',
        message: 'Potato plot soil pH measured 7.1, significantly above the 6.5 maximum safe threshold for commercial tubers.',
        recommendation: 'Soil pH above 6.5 exponentially increases vulnerability to Common Scab (Streptomyces scabies). Apply elemental sulfur and acid-forming nitrogen fertilizers immediately.',
        currentMoisture: 32,
        expectedMoistureRange: { min: 30, max: 45, unit: '%' },
        currentPh: 7.1,
        expectedPhRange: { min: 5.0, max: 6.5 },
        phDeviationText: '0.6 units above safe maximum (6.5)',
        timestamp: new Date(Date.now() - 1000 * 60 * 42), // 42 mins ago
        read: false,
        dismissed: false,
        status: 'active'
      },
      {
        id: 'alert-corn-east-ridge',
        fieldId: 'f2',
        fieldName: 'Field B-04 (East Ridge)',
        cropName: 'Yellow Corn (Maize)',
        variety: 'Yellow Corn (DKC)',
        parameter: 'moisture',
        severity: 'warning',
        title: 'Sub-Optimal Moisture: Field B-04',
        message: 'Yellow Corn moisture has declined to 21%, falling below the 25% recommended baseline during vegetative expansion.',
        recommendation: 'Schedule a 12mm drip/sprinkler run within 24 hours to prevent leaf curling and maintain tillering vigor.',
        currentMoisture: 21,
        expectedMoistureRange: { min: 25, max: 38, unit: '%' },
        moistureDeviationText: '4% below minimum (25%)',
        currentPh: 6.5,
        expectedPhRange: { min: 5.8, max: 7.0 },
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hrs ago
        read: false,
        dismissed: false,
        status: 'active'
      }
    ];

    this.alertsSignal.set(alerts);
    this.saveAlertsToStorage();
  }
}
