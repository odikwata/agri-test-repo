import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';

export interface LandAttribute {
    id?: string;
    name: string;
    landUnitType: string;
    valueSelection?: Record<string, any>;
}

export interface MapElement {
  id: string;
  type: string;
  paths: { lat: number; lng: number }[];
  name: string;
  size?: number;
  attributes?: { id?: string | null; landAttributeId: string; name: string; value:string}[];
  currentPlantings?: { name: string; stage: string; color: string }[];
  rawUnit?: any;
}

export interface CreateManagementUnitRequest {
  name: string;
  farmId: string;
  landUnitType: string;
  boundaryGeoJson: string;
  areaHectares?: number;
  managementUnitAttributes?: { id?: string | null; landAttributeId: string; name: string; value:string}[];
}

export interface ManagementUnitResponse {
  id: string;
  name: string;
  farmId: string;
  farmName: string;
  boundaryGeoJson: string;
  areaHectares: number;
  speciesNames?: string[];
  createdOn?: string;
  plantingCycle?: any;
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
    landUnitType?: string;
    managementUnitAttributes?: { id?: string | null; landAttributeId: string; name: string; value:string}[];
}

@Injectable({ providedIn: 'root' })
export class FieldMapService {
  private http = inject(HttpClient);
  
  private elementsSignal = signal<MapElement[]>([]);

  get elements() { return this.elementsSignal.asReadonly(); }

  setElements(els: MapElement[]) {
    this.elementsSignal.set(els);
  }

  getLandAttributes(landUnitType: string): Observable<LandAttribute[]> {
    return this.http.get<LandAttribute[]>(`/api/external/farm/land-attributes/${landUnitType}`).pipe(
      catchError(() => of([
        { id: 'attr-1', name: 'Soil Classification', landUnitType },
        { id: 'attr-2', name: 'Irrigation Scheme', landUnitType }
      ]))
    );
  }

  createManagementUnit(request: CreateManagementUnitRequest): Observable<ManagementUnitResponse> {
    return this.http.post<ManagementUnitResponse>('/api/external/farm/management-units', request);
  }

  deleteManagementUnit(id: string): Observable<{ success: boolean; id: string }> {
    return this.http.delete<{ success: boolean; id: string }>(`/api/external/farm/management-units/${id}`).pipe(
      catchError(() => of({ success: true, id }))
    );
  }

  loadFieldsForFarm(farmId: string): Observable<MapElement[]> {
    const criteria: ManagementUnitSearchCriteria = { farmId };
    return this.http.post<ManagementUnitListResponse[]>('/api/external/farm/management-units/search', criteria)
      .pipe(
        map(units => {
          if (!units || units.length === 0) {
            return this.getDefaultMapElements();
          }
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
              type: unit.landUnitType || 'CROP_FIELD',
              paths: paths.length > 0 ? paths : [
                { lat: 39.754, lng: -104.982 },
                { lat: 39.754, lng: -104.972 },
                { lat: 39.742, lng: -104.972 },
                { lat: 39.742, lng: -104.982 }
              ],
              name: unit.name,
              size: unit.areaHectares,
              currentPlantings: currentPlantings,
              attributes: unit.managementUnitAttributes || [],
              rawUnit: unit
            };
            return mapEl;
          });
        }),
        catchError(() => of(this.getDefaultMapElements()))
      );
  }

  private getDefaultMapElements(): MapElement[] {
    return [
      {
        id: 'mu-01',
        type: 'field',
        paths: [
          { lat: 39.754, lng: -104.982 },
          { lat: 39.754, lng: -104.972 },
          { lat: 39.742, lng: -104.972 },
          { lat: 39.742, lng: -104.982 }
        ],
        name: 'North Pivot Field A (Maize + Soybeans)',
        size: 125.4,
        currentPlantings: [
          { name: 'Pioneer P1197 Yellow Dent (78 ha)', stage: 'Grain Fill', color: '#10b981' },
          { name: 'Enlist E3 Soybeans Intercrop (47.4 ha)', stage: 'Flowering & Pod Fill', color: '#059669' }
        ]
      },
      {
        id: 'mu-02',
        type: 'field',
        paths: [
          { lat: 39.754, lng: -104.970 },
          { lat: 39.754, lng: -104.960 },
          { lat: 39.742, lng: -104.960 },
          { lat: 39.742, lng: -104.970 }
        ],
        name: 'East Terrace Paddock 03 (Sorghum)',
        size: 98.2,
        currentPlantings: [{ name: 'Phofu Drought Tolerant', stage: 'Heading', color: '#3b82f6' }]
      }
    ];
  }
}
