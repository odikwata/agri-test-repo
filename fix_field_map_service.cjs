const fs = require('fs');

let code = `import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';

export interface MapElement {
  id: string;
  type: 'field' | 'block';
  paths: { lat: number; lng: number }[];
  name: string;
  size?: number;
  soilType?: string;
  irrigationSystem?: 'drip' | 'sprinkler' | 'none';
  dripLines?: number;
  sprinklersCount?: number;
  currentPlantings?: { name: string; stage: string; color: string }[];
  rawUnit?: any;
}

export interface ManagementUnitSearchCriteria {
    searchText?: string;
    farmId?: string;
    landUnitType?: string;
}

export interface ManagementUnitListResponse {
    id: string;
    name: string;
    boundaryGeoJson: string;
    areaHectares: number;
    speciesNames: string[];
    createdOn: string;
    plantingCycle?: {
        id: string;
        crop: string;
    };
}

@Injectable({ providedIn: 'root' })
export class FieldMapService {
  private http = inject(HttpClient);
  
  private elementsSignal = signal<MapElement[]>([]);

  get elements() { return this.elementsSignal.asReadonly(); }

  setElements(els: MapElement[]) {
    this.elementsSignal.set(els);
  }

  loadFieldsForFarm(farmId: string): Observable<MapElement[]> {
    const criteria: ManagementUnitSearchCriteria = { farmId };
    return this.http.post<ManagementUnitListResponse[]>('/api/v1/farm/management-units/search', criteria)
      .pipe(
        map(units => {
          return units.map(unit => {
            let paths: { lat: number; lng: number }[] = [];
            if (unit.boundaryGeoJson) {
              try {
                const geoJson = typeof unit.boundaryGeoJson === 'string' ? JSON.parse(unit.boundaryGeoJson) : unit.boundaryGeoJson;
                if (geoJson.type === 'Polygon' && geoJson.coordinates && geoJson.coordinates.length > 0) {
                  paths = geoJson.coordinates[0].map((coord: number[]) => ({
                    lng: coord[0],
                    lat: coord[1]
                  }));
                } else if (geoJson.type === 'MultiPolygon' && geoJson.coordinates && geoJson.coordinates.length > 0) {
                  paths = geoJson.coordinates[0][0].map((coord: number[]) => ({
                    lng: coord[0],
                    lat: coord[1]
                  }));
                }
              } catch (e) {
                console.error('Error parsing boundaryGeoJson for unit', unit.id, e);
              }
            }

            const currentPlantings = [];
            if (unit.plantingCycle) {
               currentPlantings.push({
                   name: unit.plantingCycle.crop,
                   stage: 'Active',
                   color: '#10b981'
               });
            } else if (unit.speciesNames && unit.speciesNames.length > 0) {
               currentPlantings.push({
                   name: unit.speciesNames.join(', '),
                   stage: 'Planted',
                   color: '#3b82f6'
               });
            }

            const mapEl: MapElement = {
              id: unit.id,
              type: 'field',
              paths: paths,
              name: unit.name,
              size: unit.areaHectares,
              currentPlantings: currentPlantings,
              rawUnit: unit
            };
            return mapEl;
          });
        })
      );
  }
}
`;

fs.writeFileSync('src/app/services/field-map.service.ts', code);
