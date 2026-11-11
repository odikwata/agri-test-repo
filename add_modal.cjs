const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

// 1. Imports
const importTarget1 = `import { RouterModule, ActivatedRoute } from '@angular/router';`;
const importReplacement1 = `import { RouterModule, ActivatedRoute } from '@angular/router';\nimport { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';`;
code = code.replace(importTarget1, importReplacement1);

const importTarget2 = `import { CropService, PlantingCycleResponse, GrowthProgramResponse, PlantingCycleActivityListDTO } from '../../../services/crop.service';`;
const importReplacement2 = `import { CropService, PlantingCycleResponse, GrowthProgramResponse, PlantingCycleActivityListDTO, CreatePlantingCycleActivityRequest } from '../../../services/crop.service';`;
code = code.replace(importTarget2, importReplacement2);

const importArrayTarget = `imports: [CommonModule, LucideAngularModule, RouterModule],`;
const importArrayReplacement = `imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule, ReactiveFormsModule],`;
code = code.replace(importArrayTarget, importArrayReplacement);

// 2. Open Modal Button
const btnTarget = `<button class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                    Log Activity
                  </button>`;
const btnReplacement = `<button (click)="showLogActivityModal.set(true)" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                    Log Activity
                  </button>`;
if(code.includes(btnTarget)) {
    code = code.replace(btnTarget, btnReplacement);
} else {
    console.log("Button target not found");
}

// 3. Modal HTML
const modalHtmlTarget = `      <!-- History Modal -->`;
const modalHtmlReplacement = `      <!-- Log Activity Modal -->
      @if (showLogActivityModal()) {
        <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <lucide-icon name="activity" class="w-5 h-5 text-emerald-600"></lucide-icon>
                Log New Activity
              </h2>
              <button (click)="showLogActivityModal.set(false)" class="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <div class="p-6 overflow-y-auto">
              <form [formGroup]="logActivityForm" (ngSubmit)="submitActivity()" class="space-y-4">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Activity Type *</label>
                        <select formControlName="activityType" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="">Select Type</option>
                            <option value="LAND_PREPARATION">Land Preparation</option>
                            <option value="PLANTING">Planting</option>
                            <option value="IRRIGATION">Irrigation</option>
                            <option value="FERTILIZATION">Fertilization</option>
                            <option value="WEEDING">Weeding</option>
                            <option value="PEST_CONTROL">Pest Control</option>
                            <option value="DISEASE_CONTROL">Disease Control</option>
                            <option value="HARVESTING">Harvesting</option>
                            <option value="SCOUTING">Scouting</option>
                            <option value="OTHER">Other</option>
                        </select>
                        @if (logActivityForm.get('activityType')?.touched && logActivityForm.get('activityType')?.invalid) {
                          <p class="text-xs text-red-500 mt-1">Activity Type is required.</p>
                        }
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                        <select formControlName="priority" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Description *</label>
                    <input type="text" formControlName="description" placeholder="e.g. Applied 15mm using drip lines" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    @if (logActivityForm.get('description')?.touched && logActivityForm.get('description')?.invalid) {
                      <p class="text-xs text-red-500 mt-1">Description is required.</p>
                    }
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Planned Start Date *</label>
                        <input type="date" formControlName="plannedStartDate" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        @if (logActivityForm.get('plannedStartDate')?.touched && logActivityForm.get('plannedStartDate')?.invalid) {
                          <p class="text-xs text-red-500 mt-1">Start Date is required.</p>
                        }
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Planned End Date *</label>
                        <input type="date" formControlName="plannedEndDate" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        @if (logActivityForm.get('plannedEndDate')?.touched && logActivityForm.get('plannedEndDate')?.invalid) {
                          <p class="text-xs text-red-500 mt-1">End Date is required.</p>
                        }
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Assignee</label>
                        <input type="text" formControlName="assignee" placeholder="John Doe" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Target Area (Ha)</label>
                        <input type="number" step="0.01" formControlName="targetAreaHa" placeholder="0.0" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2 sm:col-span-1">
                        <label class="block text-sm font-bold text-slate-700 mb-1">Estimated Cost</label>
                        <input type="number" step="0.01" formControlName="estimatedCost" placeholder="0.00" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Remarks</label>
                    <textarea formControlName="remarks" rows="2" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" (click)="showLogActivityModal.set(false)" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                    <button type="submit" [disabled]="logActivityForm.invalid || isSubmittingActivity()" class="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all">
                        @if (isSubmittingActivity()) {
                           <lucide-icon name="loader-2" class="w-4 h-4 animate-spin"></lucide-icon> Saving...
                        } @else {
                           Save Activity
                        }
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }

      <!-- History Modal -->`;
if(code.includes(modalHtmlTarget)) {
    code = code.replace(modalHtmlTarget, modalHtmlReplacement);
} else {
    console.log("Modal HTML target not found");
}


// 4. Class methods and properties
const classBodyTarget = `  aiAnalysis = signal<string | null>(null);
  analyzing = signal(false);
  activities = signal<PlantingCycleActivityListDTO[]>([]);`;
const classBodyReplacement = `  aiAnalysis = signal<string | null>(null);
  analyzing = signal(false);
  activities = signal<PlantingCycleActivityListDTO[]>([]);

  fb = inject(FormBuilder);
  showLogActivityModal = signal(false);
  isSubmittingActivity = signal(false);

  logActivityForm: FormGroup = this.fb.nonNullable.group({
    description: ['', Validators.required],
    activityType: ['', Validators.required],
    priority: ['MEDIUM'],
    assignee: [''],
    plannedStartDate: ['', Validators.required],
    plannedEndDate: ['', Validators.required],
    targetAreaHa: [null as number | null],
    estimatedCost: [null as number | null],
    remarks: ['']
  });

  submitActivity() {
    if (this.logActivityForm.invalid) {
      this.logActivityForm.markAllAsTouched();
      return;
    }

    const formValue = this.logActivityForm.getRawValue();
    const cycleId = this.cycleId();
    if (!cycleId) return;

    const request: CreatePlantingCycleActivityRequest = {
      ...formValue,
      plantingCycleId: cycleId
    };

    this.isSubmittingActivity.set(true);
    this.cropService.createPlantingCycleActivity(request).subscribe({
      next: (res) => {
        this.isSubmittingActivity.set(false);
        this.showLogActivityModal.set(false);
        this.logActivityForm.reset({ priority: 'MEDIUM' });
        // Refresh activities
        this.cropService.getPlantingCycleActivities(cycleId).subscribe({
          next: (activitiesRes) => this.activities.set(activitiesRes.content),
          error: (err) => console.error('Failed to refresh activities', err)
        });
      },
      error: (err) => {
        console.error('Failed to log activity', err);
        this.isSubmittingActivity.set(false);
      }
    });
  }`;
if(code.includes(classBodyTarget)) {
    code = code.replace(classBodyTarget, classBodyReplacement);
} else {
    console.log("Class body target not found");
}

fs.writeFileSync(file, code);
console.log('Component updated');
