const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `<!-- Financial KPIs -->`;
const replacement = `<!-- Financial Overview Visual -->
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
                               <div class="h-full bg-red-500 rounded-full transition-all" [style.width]="projectedIncome() > 0 ? getMath().min((totalActivityCost() / projectedIncome()) * 100, 100) + '%' : '0%'"></div>
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

                <!-- Financial KPIs -->`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Visual forecast added');
} else {
    console.log('Target not found');
}
