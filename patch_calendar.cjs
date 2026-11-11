const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting/planting-calendar.component.ts', 'utf8');

// Replace imports
code = code.replace(
  "import { CropService } from '../../../services/crop.service';",
  `import { CropService } from '../../../services/crop.service';
import { FieldMapService, MapElement } from '../../../services/field-map.service';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';`
);

// Add FormsModule to imports array
code = code.replace(
  "imports: [CommonModule, LucideAngularModule, RouterModule],",
  "imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],"
);

// Add New Planting Button
code = code.replace(
  `        <div class="flex flex-center gap-3">
          <button class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
          </button>`,
  `        <div class="flex items-center gap-3">
          <button (click)="openNewPlantingModal()" class="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            New Planting
          </button>
          <div class="h-6 w-px bg-slate-200"></div>
          <button class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
          </button>`
);

// We need to add the modal to the template. We'll append it before the last </div> of the template.
code = code.replace(
  `    </div>
  \`
})`,
  `
      <!-- New Planting Modal -->
      @if (showNewPlantingModal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-900">Start New Planting</h2>
              <button (click)="closeNewPlantingModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto">
              <p class="text-sm text-slate-500 mb-6">Select a field for your new planting cycle, or let our AI suggest the best field based on soil fertility and history.</p>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-2">Select Field</label>
                  <select [(ngModel)]="selectedFieldId" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                    <option value="">-- Choose a field --</option>
                    @for (field of fields; track field.id) {
                      <option [value]="field.id">{{ field.name }} ({{ field.size }} ha)</option>
                    }
                  </select>
                </div>
                
                <div class="relative py-4">
                  <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="w-full border-t border-slate-200"></div>
                  </div>
                  <div class="relative flex justify-center">
                    <span class="bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Or</span>
                  </div>
                </div>

                <button (click)="suggestFieldWithAI()" [disabled]="isSuggesting" class="w-full px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:from-violet-700 hover:to-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  @if (isSuggesting) {
                    <lucide-icon name="loader-2" class="w-4 h-4 animate-spin"></lucide-icon>
                    Analyzing Soil Data...
                  } @else {
                    <lucide-icon name="sparkles" class="w-4 h-4"></lucide-icon>
                    Ask AI for Best Field
                  }
                </button>
                
                @if (aiSuggestion) {
                  <div class="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div class="flex items-start gap-3">
                      <lucide-icon name="sparkles" class="w-5 h-5 text-indigo-600 shrink-0 mt-0.5"></lucide-icon>
                      <div>
                        <h4 class="font-bold text-indigo-900 text-sm">AI Suggestion</h4>
                        <p class="text-sm text-indigo-700 mt-1">{{ aiSuggestion }}</p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
            
            <div class="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button (click)="closeNewPlantingModal()" class="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Cancel
              </button>
              <button 
                (click)="proceedToNewPlanting()" 
                [disabled]="!selectedFieldId"
                class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Proceed to Planting
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  \`
})`
);

// Add logic to class
const classAddition = `
  showNewPlantingModal = false;
  fields: MapElement[] = [];
  selectedFieldId = '';
  isSuggesting = false;
  aiSuggestion = '';

  private fieldMapService = inject(FieldMapService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  ngOnInit() {
    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      this.fieldMapService.loadFieldsForFarm(farmId).subscribe({
        next: (fields) => {
          this.fields = fields.filter(f => f.type === 'CROP_FIELD' || !f.type);
        }
      });
    }
  }

  openNewPlantingModal() {
    this.showNewPlantingModal = true;
    this.selectedFieldId = '';
    this.aiSuggestion = '';
  }

  closeNewPlantingModal() {
    this.showNewPlantingModal = false;
  }

  suggestFieldWithAI() {
    this.isSuggesting = true;
    this.aiSuggestion = '';
    
    // Simulate AI suggestion delay
    setTimeout(() => {
      this.isSuggesting = false;
      if (this.fields.length > 0) {
        // Pick a random field or first field
        const bestField = this.fields[0];
        this.selectedFieldId = bestField.id;
        this.aiSuggestion = \`Based on recent soil tests and crop rotation history, "\${bestField.name}" has the optimal nitrogen levels and moisture retention for a new planting cycle.\`;
      } else {
        this.aiSuggestion = "No available fields found to analyze.";
      }
    }, 1500);
  }

  proceedToNewPlanting() {
    if (this.selectedFieldId) {
      this.closeNewPlantingModal();
      this.router.navigate(['/crops/new-planting'], { queryParams: { fieldId: this.selectedFieldId } });
    }
  }
`;

code = code.replace(
  'upcomingSchedule = toSignal(this.cropService.getUpcomingSchedule(), { initialValue: [] });',
  'upcomingSchedule = toSignal(this.cropService.getUpcomingSchedule(), { initialValue: [] });' + classAddition
);

code = code.replace(
  `export class PlantingCalendarComponent {`,
  `export class PlantingCalendarComponent implements import('@angular/core').OnInit {`
);

fs.writeFileSync('src/app/pages/crops/planting/planting-calendar.component.ts', code);
console.log('Patched');
