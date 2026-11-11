const fs = require('fs');
let code = fs.readFileSync('src/app/services/crop.service.ts', 'utf8');

const newTypes = `export interface ResourceUsageInput {
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
`;

const method = `
  updateActivityStatus(id: string, payload: UpdateActivityStatusWithResourcesRequest): Observable<any> {
    return this.http.post(\`/api/external/crop/planting-cycle/activities/status-update/\${id}\`, payload);
  }
`;

if (code.includes('export interface CreatePlantingCycleActivityRequest')) {
  code = code.replace('export interface CreatePlantingCycleActivityRequest', newTypes + '\nexport interface CreatePlantingCycleActivityRequest');
  
  // Add method
  const targetClass = `getPlantingCycleActivity(id: string): Observable<PlantingCycleActivityDetailDTO> {`;
  if (code.includes(targetClass)) {
      code = code.replace(targetClass, method + '\n  ' + targetClass);
      fs.writeFileSync('src/app/services/crop.service.ts', code);
      console.log('Patched service');
  } else {
      console.log('Method target not found');
  }
} else {
  console.log('Types target not found');
}

