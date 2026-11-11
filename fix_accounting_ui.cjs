const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

// I will match everything from @if (activeTab() === 'accounting') { down to @if (activeTab() === 'watering') {
const startIndex = code.indexOf("@if (activeTab() === 'accounting') {");
const endIndex = code.indexOf("@if (activeTab() === 'watering') {");

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `@if (activeTab() === 'accounting') {
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-slate-800">Financial Overview & Accounting</h3>
                  <div class="flex gap-2">
                    <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
                      Export Report
                    </button>
                  </div>
                </div>
                
                <div class="mb-8 p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                   <h4 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
                       <lucide-icon name="bar-chart-3" class="w-5 h-5 text-emerald-600"></lucide-icon>
                       Profitability Forecast
                   </h4>
                   
                   <div class="space-y-4">
                       <div>
                           <div class="flex justify-between items-end mb-2">
                               <span class="text-sm font-bold text-emerald-700">Projected Income</span>
                               <span class="text-lg font-black text-emerald-700">{{ projectedIncome() | currency }}</span>
                           </div>
                           <div class="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div class="h-full bg-emerald-500 rounded-full" style="width: 100%"></div>
                           </div>
                       </div>
                       
                       <div>
                           <div class="flex justify-between items-end mb-2">
                               <span class="text-sm font-bold text-red-700">Total Expenses (Activities)</span>
                               <span class="text-lg font-black text-red-700">{{ totalActivityCost() | currency }}</span>
                           </div>
                           <div class="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div class="h-full bg-red-500 rounded-full transition-all" [style.width]="projectedIncome() > 0 ? (totalActivityCost() / projectedIncome() * 100 > 100 ? 100 : totalActivityCost() / projectedIncome() * 100) + '%' : '0%'"></div>
                           </div>
                       </div>
                       
                       <div class="pt-4 mt-2 border-t border-slate-100">
                           <div class="flex justify-between items-end">
                               <span class="text-sm font-bold text-slate-600">Estimated Profit (Margin)</span>
                               <div class="text-right">
                                  <span class="text-2xl font-black" [ngClass]="estimatedProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'">
                                      {{ estimatedProfit() | currency }}
                                  </span>
                                  <span class="ml-2 text-sm font-bold px-2 py-0.5 rounded-full" [ngClass]="estimatedProfit() >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
                                      {{ roi() }}% ROI
                                  </span>
                               </div>
                           </div>
                       </div>
                   </div>
                </div>

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
              
              `;
              
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
    fs.writeFileSync(file, code);
    console.log('UI updated successfully');
} else {
    console.log('Start or end tag not found');
}
