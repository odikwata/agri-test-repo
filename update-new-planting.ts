import * as fs from 'fs';

let serviceContent = fs.readFileSync('src/app/services/crop.service.ts', 'utf8');

if (!serviceContent.includes('getCropSpecies')) {
    serviceContent = serviceContent.replace(
        `export class CropService {`,
        `export interface CropSpeciesResponse {
  id: string;
  commonName: string;
}
export interface CropVarietyResponse {
  id: string;
  name: string;
}

export class CropService {`
    );

    serviceContent = serviceContent.replace(
        `getPlantingCycle(id: string): Observable<PlantingCycleResponse> {`,
        `getCropSpecies(): Observable<{content: CropSpeciesResponse[]}> {
    return this.http.get<{content: CropSpeciesResponse[]}>('/api/external/species/all?types=CROP');
  }

  getCropVarieties(speciesId: string): Observable<CropVarietyResponse[]> {
    return this.http.get<CropVarietyResponse[]>(\`/api/livestock/v1/metadata/breeds?speciesId=\${speciesId}\`);
  }

  getPlantingCycle(id: string): Observable<PlantingCycleResponse> {`
    );
    
    fs.writeFileSync('src/app/services/crop.service.ts', serviceContent);
}

let componentContent = `import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CropService, CropSpeciesResponse, CropVarietyResponse } from '../../../services/crop.service';
import { FieldMapService, MapElement } from '../../../services/field-map.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-new-planting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
  template: \`
    <div class="p-6 mx-auto max-w-3xl">
      <div class="flex items-center gap-4 mb-8">
        <button routerLink=".." class="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-slate-900">New Planting Cycle</h1>
          <p class="text-slate-500 mt-1">Record a new planting for your field.</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-800 mb-4">Planting Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Crop</label>
              <select [(ngModel)]="selectedCropId" (change)="onCropChange()" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
                <option value="" disabled selected>Select a crop</option>
                @for (crop of crops(); track crop.id) {
                  <option [value]="crop.id">{{ crop.commonName }}</option>
                }
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Seed Type / Variety</label>
              <select [(ngModel)]="seedType" [disabled]="!selectedCropId" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white disabled:bg-slate-50 disabled:text-slate-400">
                <option value="" disabled selected>Select seed type</option>
                @for (variety of varieties(); track variety.id) {
                  <option [value]="variety.id">{{ variety.name }}</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Target Field</label>
              <select [(ngModel)]="selectedField" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
                <option value="" disabled selected>Select a field</option>
                @for (field of fields(); track field.id) {
                  <option [value]="field.id">{{ field.name }} ({{ field.size || 0 }} ha)</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Planting Date</label>
              <input type="date" [(ngModel)]="plantingDate" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Expected Harvest Date</label>
              <input type="date" [(ngModel)]="expectedHarvestDate" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Population/Density</label>
              <input type="text" [(ngModel)]="population" placeholder="e.g. 24,000 seeds/acre" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            </div>
          </div>
        </div>

        <div class="p-6 bg-slate-50 flex justify-end gap-3">
          <button type="button" routerLink=".." class="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button type="button" (click)="save()" [disabled]="!selectedField || !selectedCropId || !seedType" class="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <lucide-icon name="save" class="w-4 h-4"></lucide-icon>
            Save Planting
          </button>
        </div>
      </div>
    </div>
  \`
})
export class NewPlantingComponent implements OnInit {
  private router = inject(Router);
  private cropService = inject(CropService);
  private fieldMapService = inject(FieldMapService);
  private sessionService = inject(SessionService);

  selectedCropId = '';
  seedType = '';
  plantingDate = '';
  expectedHarvestDate = '';
  population = '';
  selectedField = '';

  crops = signal<CropSpeciesResponse[]>([]);
  varieties = signal<CropVarietyResponse[]>([]);
  fields = signal<MapElement[]>([]);

  ngOnInit() {
    this.cropService.getCropSpecies().subscribe({
      next: (res) => this.crops.set(res.content),
      error: (err) => console.error('Failed to load crops', err)
    });

    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      this.fieldMapService.loadFieldsForFarm(farmId).subscribe({
        next: (fields) => this.fields.set(fields),
        error: (err) => console.error('Failed to load fields', err)
      });
    }
  }

  onCropChange() {
    this.seedType = '';
    if (this.selectedCropId) {
      this.cropService.getCropVarieties(this.selectedCropId).subscribe({
        next: (varieties) => this.varieties.set(varieties),
        error: (err) => console.error('Failed to load varieties', err)
      });
    } else {
      this.varieties.set([]);
    }
  }

  save() {
    if (!this.selectedField) return;
    // Just navigate back for now
    this.router.navigate(['/crops/map', this.selectedField]);
  }
}
`;

fs.writeFileSync('src/app/pages/crops/new-planting/new-planting.component.ts', componentContent);
