const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

// 1. Replace tab headers
code = code.replace(
`              <button 
                (click)="activeTab.set('fertilization')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'fertilization' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="flask-conical" class="w-4 h-4"></lucide-icon>
                Fertilization
              </button>`,
`              <button 
                (click)="activeTab.set('recommendation')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'recommendation' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="lightbulb" class="w-4 h-4"></lucide-icon>
                Recommendation
              </button>`
);

code = code.replace(
`              <button 
                (click)="activeTab.set('protection')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'protection' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="shield" class="w-4 h-4"></lucide-icon>
                Protection
              </button>`,
`              <button 
                (click)="activeTab.set('accounting')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'accounting' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="calculator" class="w-4 h-4"></lucide-icon>
                Accounting
              </button>`
);

// 2. Replace tab bodies
code = code.replace(`@if (activeTab() === 'fertilization') {`, `@if (activeTab() === 'recommendation') {`);
code = code.replace(`<h3 class="text-lg font-bold text-slate-800">Fertilization Management</h3>`, `<h3 class="text-lg font-bold text-slate-800">Recommendations</h3>`);

code = code.replace(`@if (activeTab() === 'protection') {`, `@if (activeTab() === 'accounting') {`);
code = code.replace(`<h3 class="text-lg font-bold text-slate-800">Pest & Disease Protection</h3>`, `<h3 class="text-lg font-bold text-slate-800">Accounting</h3>`);

// 3. Replace activeTab signature
code = code.replace(
  `activeTab = signal<'program' | 'activities' | 'fertilization' | 'protection' | 'watering'>('program');`,
  `activeTab = signal<'program' | 'activities' | 'recommendation' | 'accounting' | 'watering'>('program');`
);


// 4. Update Activities tab body to add filters
const activitiesTabTarget = `<div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-slate-800">Recent Activities</h3>
                  <button (click)="showLogActivityModal.set(true)" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                    Log Activity
                  </button>
                </div>
                <div class="space-y-4">
                  @for (activity of activities(); track activity.id) {`;

const activitiesTabReplacement = `<div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-slate-800">Activities</h3>
                  <button (click)="showLogActivityModal.set(true)" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                    Log Activity
                  </button>
                </div>

                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                   <div class="flex bg-slate-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
                      <button (click)="activitySubTab.set('ongoing')" [class]="activitySubTab() === 'ongoing' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap">Today & Ongoing</button>
                      <button (click)="activitySubTab.set('planned')" [class]="activitySubTab() === 'planned' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap">Planned</button>
                      <button (click)="activitySubTab.set('completed')" [class]="activitySubTab() === 'completed' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap">Completed</button>
                      <button (click)="activitySubTab.set('expired')" [class]="activitySubTab() === 'expired' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap">Expired</button>
                   </div>
                   <div class="flex gap-2 w-full md:w-auto overflow-x-auto">
                      <select [ngModel]="activityTypeFilter()" (ngModelChange)="activityTypeFilter.set($event)" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                          <option value="">All Types</option>
                          <option value="CROP_HEALTH">Crop Health</option>
                          <option value="CROP_NUTRITION">Crop Nutrition</option>
                          <option value="ANIMAL_HEALTH">Animal Health</option>
                          <option value="ANIMAL_NUTRITION">Animal Nutrition</option>
                          <option value="MAINTENANCE">Maintenance</option>
                          <option value="GENERAL">General</option>
                          <option value="NUTRITION">Nutrition</option>
                          <option value="HEALTH">Health</option>
                          <option value="PROTECTION">Protection</option>
                          <option value="FERTILIZATION">Fertilization</option>
                          <option value="PEST_CONTROL">Pest Control</option>
                      </select>
                      <select [ngModel]="activityPriorityFilter()" (ngModelChange)="activityPriorityFilter.set($event)" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                          <option value="">All Priorities</option>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">Critical</option>
                      </select>
                   </div>
                </div>

                <div class="space-y-4">
                  @for (activity of filteredActivities(); track activity.id) {`;
code = code.replace(activitiesTabTarget, activitiesTabReplacement);


// 5. Add properties to class
const propsTarget = `  aiAnalysis = signal<string | null>(null);
  analyzing = signal(false);
  activities = signal<PlantingCycleActivityListDTO[]>([]);`;
const propsReplacement = `  aiAnalysis = signal<string | null>(null);
  analyzing = signal(false);
  activities = signal<PlantingCycleActivityListDTO[]>([]);
  
  activitySubTab = signal<'ongoing' | 'planned' | 'completed' | 'expired'>('ongoing');
  activityTypeFilter = signal<string>('');
  activityPriorityFilter = signal<string>('');

  filteredActivities = computed(() => {
     let list = this.activities();
     const now = new Date();
     now.setHours(0, 0, 0, 0);

     list = list.filter(a => {
         const status = (a.currentStatus || '').toUpperCase();
         const start = new Date(a.plannedStartDate);
         const end = new Date(a.plannedEndDate);
         start.setHours(0, 0, 0, 0);
         end.setHours(0, 0, 0, 0);
         
         const isOngoing = status === 'IN_PROGRESS' || (start <= now && end >= now && status !== 'COMPLETED' && status !== 'OVERDUE');
         const isPlanned = status === 'PLANNED' || status === 'PENDING' || (start > now && status !== 'COMPLETED' && status !== 'IN_PROGRESS' && status !== 'OVERDUE');
         const isCompleted = status === 'COMPLETED';
         const isExpired = status === 'OVERDUE' || (end < now && status !== 'COMPLETED');

         if (this.activitySubTab() === 'ongoing') return isOngoing;
         if (this.activitySubTab() === 'planned') return isPlanned;
         if (this.activitySubTab() === 'completed') return isCompleted;
         if (this.activitySubTab() === 'expired') return isExpired;
         
         return true;
     });

     if (this.activityTypeFilter()) {
         list = list.filter(a => a.activityType === this.activityTypeFilter());
     }
     if (this.activityPriorityFilter()) {
         list = list.filter(a => a.priority === this.activityPriorityFilter());
     }
     
     return list;
  });`;
code = code.replace(propsTarget, propsReplacement);


fs.writeFileSync(file, code);
console.log('Script executed');
