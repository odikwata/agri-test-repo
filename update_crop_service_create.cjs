const fs = require('fs');
const file = 'src/app/services/crop.service.ts';
let code = fs.readFileSync(file, 'utf8');

const target1 = `export interface PlantingCycleActivityListDTO {`;
const replacement1 = `export interface CreatePlantingCycleActivityRequest {
    plantingCycleId: string;
    growthStageActivityId?: string;
    description: string;
    activityType: string;
    priority?: string;
    assignee?: string;
    plannedStartDate: string;
    plannedEndDate: string;
    targetAreaHa?: number;
    subLocationNotes?: string;
    estimatedCost?: number;
    remarks?: string;
}

export interface PlantingCycleActivityListDTO {`;

const target2 = `  getPlantingCycleActivities(id: string, page: number = 0, size: number = 10): Observable<PagedResponse<PlantingCycleActivityListDTO>> {
    return this.http.get<PagedResponse<PlantingCycleActivityListDTO>>(\`/api/external/crop/planting-cycle/\${id}/activities?page=\${page}&size=\${size}\`);
  }
}`;
const replacement2 = `  getPlantingCycleActivities(id: string, page: number = 0, size: number = 10): Observable<PagedResponse<PlantingCycleActivityListDTO>> {
    return this.http.get<PagedResponse<PlantingCycleActivityListDTO>>(\`/api/external/crop/planting-cycle/\${id}/activities?page=\${page}&size=\${size}\`);
  }
  
  createPlantingCycleActivity(request: CreatePlantingCycleActivityRequest): Observable<any> {
    return this.http.post('/api/external/crop/planting-cycle/activities/create', request);
  }
}`;

if (code.includes(target1) && code.includes(target2)) {
    code = code.replace(target1, replacement1);
    code = code.replace(target2, replacement2);
    fs.writeFileSync(file, code);
    console.log('Updated crop.service.ts for create activity');
} else {
    console.log('Targets not found in crop.service.ts');
}
