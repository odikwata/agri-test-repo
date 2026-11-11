const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

// Update imports
const importTarget = `import { CropService, PlantingCycleResponse, GrowthProgramResponse } from '../../../services/crop.service';`;
const importReplacement = `import { CropService, PlantingCycleResponse, GrowthProgramResponse, PlantingCycleActivityListDTO } from '../../../services/crop.service';`;
if (code.includes(importTarget)) {
    code = code.replace(importTarget, importReplacement);
}

// Replace the Activities HTML tab content
const htmlTarget = `<div class="space-y-4">
                  <div class="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <lucide-icon name="droplets" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="font-bold text-slate-800">Irrigation Run</p>
                          <p class="text-sm text-slate-500 mt-0.5">Applied 15mm using drip lines.</p>
                        </div>
                        <span class="text-xs font-medium text-slate-400">2 hrs ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <lucide-icon name="flask-conical" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="font-bold text-slate-800">Fertilizer Application</p>
                          <p class="text-sm text-slate-500 mt-0.5">Applied Liquid NPK 10-10-10 (50L/acre)</p>
                        </div>
                        <span class="text-xs font-medium text-slate-400">Yesterday</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <lucide-icon name="shield" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="font-bold text-slate-800">Fungicide Spray</p>
                          <p class="text-sm text-slate-500 mt-0.5">Preventative treatment for rust.</p>
                        </div>
                        <span class="text-xs font-medium text-slate-400">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>`;
const htmlReplacement = `<div class="space-y-4">
                  @for (activity of activities(); track activity.id) {
                    <div class="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50 shadow-sm">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" 
                           [ngClass]="getActivityColorClass(activity.activityType)">
                        <lucide-icon [name]="getActivityIcon(activity.activityType)" class="w-5 h-5"></lucide-icon>
                      </div>
                      <div class="flex-1">
                        <div class="flex justify-between items-start">
                          <div>
                            <p class="font-bold text-slate-800">{{ activity.activityType }}</p>
                            <p class="text-sm text-slate-500 mt-0.5">{{ activity.description }}</p>
                            <div class="flex items-center gap-3 mt-2 text-xs font-medium text-slate-500">
                               <span class="flex items-center gap-1"><lucide-icon name="user" class="w-3 h-3"></lucide-icon> {{ activity.assignee || 'Unassigned' }}</span>
                               <span class="flex items-center gap-1 px-2 py-0.5 rounded-full" [ngClass]="getStatusClass(activity.currentStatus)">{{ getStatusLabel(activity.currentStatus) }}</span>
                            </div>
                          </div>
                          <span class="text-xs font-bold text-slate-400">{{ activity.plannedStartDate | date:'mediumDate' }}</span>
                        </div>
                      </div>
                    </div>
                  } @empty {
                    <div class="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <lucide-icon name="activity" class="w-8 h-8 mx-auto text-slate-400 mb-2"></lucide-icon>
                        <p class="font-bold text-slate-600">No activities found</p>
                        <p class="text-sm mt-1">Activities logged for this cycle will appear here.</p>
                    </div>
                  }
                </div>`;

if(code.includes(htmlTarget)) {
    code = code.replace(htmlTarget, htmlReplacement);
} else {
    console.log('HTML Target not found');
}

// Add state signal and methods
const classBodyTarget = `  aiAnalysis = signal<string | null>(null);
  analyzing = signal(false);`;
const classBodyReplacement = `  aiAnalysis = signal<string | null>(null);
  analyzing = signal(false);
  activities = signal<PlantingCycleActivityListDTO[]>([]);

  getActivityIcon(type: string): string {
      const t = (type || '').toLowerCase();
      if (t.includes('irrigat') || t.includes('water')) return 'droplets';
      if (t.includes('fertili')) return 'flask-conical';
      if (t.includes('protect') || t.includes('spray') || t.includes('pest')) return 'shield';
      if (t.includes('plant') || t.includes('seed')) return 'sprout';
      if (t.includes('harvest')) return 'tractor';
      return 'activity';
  }

  getActivityColorClass(type: string): string {
      const t = (type || '').toLowerCase();
      if (t.includes('irrigat') || t.includes('water')) return 'bg-blue-100 text-blue-600';
      if (t.includes('fertili')) return 'bg-emerald-100 text-emerald-600';
      if (t.includes('protect') || t.includes('spray') || t.includes('pest')) return 'bg-amber-100 text-amber-600';
      if (t.includes('plant') || t.includes('seed')) return 'bg-emerald-100 text-emerald-600';
      return 'bg-slate-200 text-slate-600';
  }

  getStatusClass(status: string): string {
      switch (status) {
          case 'COMPLETED': return 'bg-blue-100 text-blue-700';
          case 'IN_PROGRESS': return 'bg-emerald-100 text-emerald-700';
          case 'OVERDUE': return 'bg-red-100 text-red-700';
          case 'CANCELLED': case 'SKIPPED': return 'bg-slate-200 text-slate-600';
          default: return 'bg-amber-100 text-amber-700';
      }
  }

  getStatusLabel(status: string): string {
      if (!status) return 'Unknown';
      return status.replace(/_/g, ' ').replace(/\\w\\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }`;

if(code.includes(classBodyTarget)) {
    code = code.replace(classBodyTarget, classBodyReplacement);
} else {
    console.log('Class body target not found');
}

// Add fetch call in ngOnInit
const onInitTarget = `        this.cropService.getPlantingCycle(id).subscribe({
          next: (res) => {
            this.cycle.set(res);
            if (res.growthProgram?.id) {
              this.cropService.getGrowthProgramById(res.growthProgram.id).subscribe({
                next: (prog) => this.growthProgram.set(prog),
                error: (err) => console.error(err)
              });
            }
          },
          error: (err) => console.error(err)
        });`;
const onInitReplacement = `        this.cropService.getPlantingCycle(id).subscribe({
          next: (res) => {
            this.cycle.set(res);
            if (res.growthProgram?.id) {
              this.cropService.getGrowthProgramById(res.growthProgram.id).subscribe({
                next: (prog) => this.growthProgram.set(prog),
                error: (err) => console.error(err)
              });
            }
          },
          error: (err) => console.error(err)
        });

        this.cropService.getPlantingCycleActivities(id).subscribe({
          next: (res) => {
             this.activities.set(res.content);
          },
          error: (err) => console.error(err)
        });`;

if(code.includes(onInitTarget)) {
    code = code.replace(onInitTarget, onInitReplacement);
} else {
    console.log('ngOnInit target not found');
}

fs.writeFileSync(file, code);
console.log('Component updated');
