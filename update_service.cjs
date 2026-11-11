const fs = require('fs');

let code = fs.readFileSync('src/app/services/field-map.service.ts', 'utf8');

const interfaces = `export interface CreateManagementUnitRequest {
  name: string;
  farmId: string;
  landUnitType: string;
  boundaryGeoJson: string;
  areaHectares?: number;
  attributes?: Record<string, any>;
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
`;

code = code.replace("export interface ManagementUnitSearchCriteria", interfaces + "\nexport interface ManagementUnitSearchCriteria");

const createMethod = `  createManagementUnit(request: CreateManagementUnitRequest): Observable<ManagementUnitResponse> {
    return this.http.post<ManagementUnitResponse>('/api/external/farm/management-units', request);
  }`;

code = code.replace("loadFieldsForFarm", createMethod + "\n\n  loadFieldsForFarm");

fs.writeFileSync('src/app/services/field-map.service.ts', code);
