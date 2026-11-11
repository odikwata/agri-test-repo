const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const classTarget = `activityPriorityFilter = signal<string>('');`;
const classReplacement = `activityPriorityFilter = signal<string>('');

  expectedYield = signal<number>(500); // Default 500 tons
  expectedPrice = signal<number>(150); // Default $150 per ton
  
  totalActivityCost = computed(() => {
     return this.activities().reduce((sum, act) => sum + (act.actualCost || act.estimatedCost || 0), 0);
  });
  
  projectedIncome = computed(() => {
     return this.expectedYield() * this.expectedPrice();
  });
  
  estimatedProfit = computed(() => {
     return this.projectedIncome() - this.totalActivityCost();
  });
  
  roi = computed(() => {
     const cost = this.totalActivityCost();
     if (cost === 0) return 0;
     return ((this.estimatedProfit() / cost) * 100).toFixed(1);
  });`;

if (code.includes(classTarget)) {
    code = code.replace(classTarget, classReplacement);
}

const templateTargetRegex = /@if\s*\(\s*activeTab\(\)\s*===\s*'accounting'\s*\)\s*\{[\s\S]*?\}\s*<\/div>\s*\}\s*<!--\s*Log Activity Modal\s*-->/m;

const templateReplacement = `@if (activeTab() === 'accounting') {
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-slate-800">Financial Overview & Accounting</h3>
                  <div class="flex gap-2">
                    <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
                      Export Report
                    </button>
                  </div>
                </div>
                
                <!-- Financial KPIs -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div class="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <p class="text-sm font-bold text-slate-500 mb-1">Total Expenses (Activities)</p>
                    <p class="text-2xl font-black text-red-600">{{ totalActivityCost() | currency }}</p>
                  </div>
                  <div class="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <p class="text-sm font-bold text-slate-500 mb-1">Projected Income</p>
                    <p class="text-2xl font-black text-emerald-600">{{ projectedIncome() | currency }}</p>
                  </div>
                  <div class="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <p class="text-sm font-bold text-slate-500 mb-1">Estimated Profit</p>
                    <p class="text-2xl font-black" [ngClass]="estimatedProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'">
                      {{ estimatedProfit() | currency }}
                    </p>
                  </div>
                  <div class="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <p class="text-sm font-bold text-slate-500 mb-1">Est. ROI</p>
                    <p class="text-2xl font-black" [ngClass]="estimatedProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'">
                      {{ roi() }}%
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <!-- Income Projection Model -->
                  <div class="lg:col-span-1 space-y-6">
                    <div class="p-5 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
                      <h4 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                         <lucide-icon name="trending-up" class="w-4 h-4 text-emerald-600"></lucide-icon>
                         Income Projection Model
                      </h4>
                      <div class="space-y-4">
                        <div>
                           <label class="block text-sm font-bold text-slate-700 mb-1">Expected Yield (Tons)</label>
                           <input type="number" [ngModel]="expectedYield()" (ngModelChange)="expectedYield.set($event)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        </div>
                        <div>
                           <label class="block text-sm font-bold text-slate-700 mb-1">Expected Market Price ($ / Ton)</label>
                           <input type="number" [ngModel]="expectedPrice()" (ngModelChange)="expectedPrice.set($event)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        </div>
                        <div class="pt-4 border-t border-slate-200">
                           <div class="flex justify-between items-center">
                              <span class="text-sm font-bold text-slate-600">Calculated Income:</span>
                              <span class="font-black text-emerald-600">{{ projectedIncome() | currency }}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Expenses Breakdown -->
                  <div class="lg:col-span-2">
                    <div class="p-5 border border-slate-200 rounded-xl bg-white shadow-sm h-full">
                      <div class="flex justify-between items-center mb-6">
                        <h4 class="font-bold text-slate-800 flex items-center gap-2">
                           <lucide-icon name="pie-chart" class="w-4 h-4 text-blue-600"></lucide-icon>
                           Expenses Breakdown (By Activity)
                        </h4>
                      </div>
                      
                      @if (activities().length === 0) {
                         <div class="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <lucide-icon name="receipt" class="w-8 h-8 mx-auto text-slate-400 mb-2"></lucide-icon>
                            <p class="font-bold text-slate-600">No activities recorded</p>
                            <p class="text-sm mt-1">Log activities with costs to see the breakdown here.</p>
                         </div>
                      } @else {
                         <div class="space-y-3">
                           @for (activity of activities(); track activity.id) {
                             @if (activity.estimatedCost || activity.actualCost) {
                               <div class="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                                 <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" [ngClass]="getActivityColorClass(activity.activityType)">
                                      <lucide-icon [name]="getActivityIcon(activity.activityType)" class="w-4 h-4"></lucide-icon>
                                    </div>
                                    <div>
                                      <p class="font-bold text-slate-800 text-sm">{{ getStatusLabel(activity.activityType) }}</p>
                                      <p class="text-xs text-slate-500 line-clamp-1">{{ activity.description }}</p>
                                    </div>
                                 </div>
                                 <div class="text-right">
                                    <p class="font-black text-slate-700">{{ (activity.actualCost || activity.estimatedCost || 0) | currency }}</p>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                       {{ activity.actualCost ? 'ACTUAL' : 'ESTIMATED' }}
                                    </p>
                                 </div>
                               </div>
                             }
                           }
                           
                           @if (totalActivityCost() === 0) {
                              <div class="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                                <p class="font-bold text-slate-600">No costs recorded yet</p>
                                <p class="text-sm mt-1">Update your activities with estimated or actual costs.</p>
                             </div>
                           }
                         </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
            <!-- Log Activity Modal -->`;

code = code.replace(templateTargetRegex, templateReplacement);

fs.writeFileSync(file, code);
console.log('Accounting updated');
