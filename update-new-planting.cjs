const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/new-planting/new-planting.component.ts', 'utf8');

if (!code.includes('growthPrograms')) {
  // Add imports
  code = code.replace("CropVarietyResponse } from '../../../services/crop.service';", "CropVarietyResponse, GrowthProgramDropDownList } from '../../../services/crop.service';");
  
  // Add properties
  code = code.replace("selectedField = '';", "selectedField = '';\n  selectedGrowthProgramId = '';");
  code = code.replace("fields = signal<MapElement[]>([]);", "fields = signal<MapElement[]>([]);\n  growthPrograms = signal<GrowthProgramDropDownList[]>([]);");

  // Add onVarietyChange method
  code = code.replace("onCropChange() {", "onVarietyChange() {\n    this.selectedGrowthProgramId = '';\n    if (this.selectedCropId && this.seedType) {\n      this.cropService.getGrowthPrograms(this.selectedCropId, this.seedType).subscribe({\n        next: (programs) => this.growthPrograms.set(programs),\n        error: (err) => console.error('Failed to load growth programs', err)\n      });\n    } else {\n      this.growthPrograms.set([]);\n    }\n  }\n\n  onCropChange() {");

  // Add the growth plan dropdown in the template
  const newDropdown = `
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Growth Plan</label>
              <select [(ngModel)]="selectedGrowthProgramId" [disabled]="!seedType" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white disabled:bg-slate-50 disabled:text-slate-400">
                <option value="" disabled selected>Select growth plan</option>
                @for (program of growthPrograms(); track program.id) {
                  <option [value]="program.id">{{ program.name }}</option>
                }
              </select>
            </div>
`;
  code = code.replace("<div>\n              <label class=\"block text-sm font-bold text-slate-700 mb-2\">Target Field</label>", newDropdown + "            <div>\n              <label class=\"block text-sm font-bold text-slate-700 mb-2\">Target Field</label>");

  // Update variety dropdown to trigger change
  code = code.replace("<select [(ngModel)]=\"seedType\" [disabled]=\"!selectedCropId\"", "<select [(ngModel)]=\"seedType\" (change)=\"onVarietyChange()\" [disabled]=\"!selectedCropId\"");
  
  fs.writeFileSync('src/app/pages/crops/new-planting/new-planting.component.ts', code);
}
