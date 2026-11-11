const fs = require('fs');
const file = 'src/app/services/crop.service.ts';
let code = fs.readFileSync(file, 'utf8');

const target1 = `export interface GrowthProgramDropDownList {`;
const replacement1 = `export interface PlantingCycleActivityListDTO {
    id: string;
    plantingCycleId: string;
    description: string;
    activityType: string;
    priority: string;
    assignee: string;
    plannedStartDate: string;
    plannedEndDate: string;
    targetAreaHa: number;
    estimatedCost: number;
    actualCost: number;
    currentStatus: string;
    currentStageRemarks: string;
    statusUpdatedAt: string;
}

export interface PagedResponse<T> {
    content: T[];
    currentPage: number;
    total: number;
    pages: number;
}

export interface GrowthProgramDropDownList {`;

const target2 = `  getPlantingCycle(id: string): Observable<PlantingCycleResponse> {
    return this.http.get<PlantingCycleResponse>(\`/api/external/crop/planting-cycle/\${id}\`);
  }
}`;
const replacement2 = `  getPlantingCycle(id: string): Observable<PlantingCycleResponse> {
    return this.http.get<PlantingCycleResponse>(\`/api/external/crop/planting-cycle/\${id}\`);
  }
  
  getPlantingCycleActivities(id: string, page: number = 0, size: number = 10): Observable<PagedResponse<PlantingCycleActivityListDTO>> {
    return this.http.get<PagedResponse<PlantingCycleActivityListDTO>>(\`/api/external/crop/planting-cycle/\${id}/activities?page=\${page}&size=\${size}\`);
  }
}`;

if (code.includes(target1) && code.includes(target2)) {
    code = code.replace(target1, replacement1);
    code = code.replace(target2, replacement2);
    fs.writeFileSync(file, code);
    console.log('Updated crop.service.ts');
} else {
    console.log('Targets not found in crop.service.ts');
}
