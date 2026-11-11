export interface Field {
  id: string;
  name: string;
  acreage: number;
  coordinates: { lat: number; lng: number }[]; // GeoJSON-like
  soilType?: string;
  organizationId: string;
}

export interface PlantingRecord {
  id: string;
  fieldId: string;
  cropType: string;
  variety: string;
  plantingDate: Date;
  expectedHarvestDate: Date;
  quantity: number;
  unit: 'kg' | 'ton' | 'seeds';
}

export interface HarvestRecord {
  id: string;
  plantingId: string;
  harvestDate: Date;
  yield: number;
  unit: 'kg' | 'ton';
  qualityGrade?: string;
}
