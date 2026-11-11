const fs = require('fs');

const code = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-harvesting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: \`
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      
      <!-- Top Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Yield -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm">
          <div class="relative z-10">
            <p class="text-sm font-bold text-slate-500 mb-1">Projected Total Yield</p>
            <div class="flex items-baseline gap-2 mb-2">
              <h2 class="text-4xl font-black text-slate-900">8,450</h2>
              <span class="text-slate-500 font-medium">Tons</span>
            </div>
            <p class="text-sm font-bold text-emerald-500 flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-4 h-4"></lucide-icon>
              +12% vs last season
            </p>
          </div>
          <div class="absolute -bottom-4 -right-4 opacity-10 pointer-events-none text-amber-500">
            <lucide-icon name="wheat" class="w-32 h-32"></lucide-icon>
          </div>
        </div>

        <!-- Active Harvests -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm">
          <div class="relative z-10">
            <p class="text-sm font-bold text-slate-500 mb-1">Active Harvests</p>
            <div class="flex items-baseline gap-2 mb-3">
              <h2 class="text-4xl font-black text-slate-900">5</h2>
              <span class="text-slate-500 font-medium">Fields</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div class="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white relative z-30">C</div>
                <div class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white relative z-20">S</div>
              </div>
              <p class="text-xs text-slate-500 font-medium">Corn, Soybeans...</p>
            </div>
          </div>
          <div class="absolute top-4 -right-4 opacity-10 pointer-events-none text-emerald-500">
            <lucide-icon name="tractor" class="w-32 h-32"></lucide-icon>
          </div>
        </div>

        <!-- Pending Harvests -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm">
          <div class="relative z-10">
            <p class="text-sm font-bold text-slate-500 mb-1">Pending Harvests</p>
            <div class="flex items-baseline gap-2 mb-3">
              <h2 class="text-4xl font-black text-slate-900">2</h2>
              <span class="text-slate-500 font-medium">Fields</span>
            </div>
            <p class="text-sm font-bold text-amber-500 flex items-center gap-1">
              <lucide-icon name="alert-circle" class="w-4 h-4"></lucide-icon>
              Ready within 7 days
            </p>
          </div>
          <div class="absolute top-4 -right-4 opacity-10 pointer-events-none text-amber-500">
            <lucide-icon name="clock" class="w-32 h-32"></lucide-icon>
          </div>
        </div>
      </div>

      <!-- Active Harvest Cycles -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-800">Ongoing Harvests</h3>
          <button class="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors">
            View Map <lucide-icon name="map" class="w-4 h-4"></lucide-icon>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <lucide-icon name="wheat" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900">Yellow Corn (DKC)</h4>
                  <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <lucide-icon name="map-pin" class="w-3 h-3"></lucide-icon> Field B-04 (East Ridge)
                  </p>
                </div>
              </div>
              <span class="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wide">Harvesting</span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-[11px] font-medium text-slate-500 mb-1">Started</p>
                <p class="text-sm font-bold text-slate-900">Sep 10, 2024</p>
              </div>
              <div>
                <p class="text-[11px] font-medium text-slate-500 mb-1">Est. Completion</p>
                <p class="text-sm font-bold text-slate-900">Sep 15, 2024</p>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-700">Area Harvested</span>
                <span class="text-xs font-bold text-amber-600">45%</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full" style="width: 45%"></div>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <lucide-icon name="leaf" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900">Soybeans (RR2)</h4>
                  <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <lucide-icon name="map-pin" class="w-3 h-3"></lucide-icon> Field C-01 (South Pivot)
                  </p>
                </div>
              </div>
              <span class="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wide">Harvesting</span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-[11px] font-medium text-slate-500 mb-1">Started</p>
                <p class="text-sm font-bold text-slate-900">Oct 05, 2024</p>
              </div>
              <div>
                <p class="text-[11px] font-medium text-slate-500 mb-1">Est. Completion</p>
                <p class="text-sm font-bold text-slate-900">Oct 12, 2024</p>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-700">Area Harvested</span>
                <span class="text-xs font-bold text-emerald-600">12%</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-600 rounded-full" style="width: 12%"></div>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <lucide-icon name="sprout" class="w-5 h-5"></lucide-icon>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900">Winter Wheat</h4>
                    <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <lucide-icon name="map-pin" class="w-3 h-3"></lucide-icon> Field A-12 (North Valley)
                    </p>
                  </div>
                </div>
                <span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wide">Completed</span>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p class="text-[11px] font-medium text-slate-500 mb-1">Finished</p>
                  <p class="text-sm font-bold text-slate-900">Jul 20, 2024</p>
                </div>
                <div>
                  <p class="text-[11px] font-medium text-slate-500 mb-1">Total Yield</p>
                  <p class="text-sm font-bold text-slate-900">1,250 Tons</p>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-bold text-slate-700">Area Harvested</span>
                  <span class="text-xs font-bold text-blue-600">100%</span>
                </div>
                <div class="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-600 rounded-full" style="width: 100%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Harvest Schedule Table -->
      <div>
        <h3 class="text-lg font-bold text-slate-800 mb-4">Harvest Schedule</h3>
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-6 py-4 font-bold text-slate-600">Est. Date</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Crop Variety</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Target Field</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Est. Yield</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Status</th>
                  <th class="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <!-- Row 1 -->
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900">Oct 15, 2024</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <span class="font-medium text-slate-700">Yellow Corn (DKC)</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-600">Field B-05</td>
                  <td class="px-6 py-4 text-slate-600">~850 Tons</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-md">Maturing</span>
                  </td>
                  <td class="px-6 py-4 text-right text-slate-400">
                    <button class="hover:text-slate-600 transition-colors">
                      <lucide-icon name="more-vertical" class="w-4 h-4"></lucide-icon>
                    </button>
                  </td>
                </tr>

                <!-- Row 2 -->
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900">Nov 01, 2024</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span class="font-medium text-slate-700">Soybeans (RR2)</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-600">Field C-02</td>
                  <td class="px-6 py-4 text-slate-600">~420 Tons</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">Growing</span>
                  </td>
                  <td class="px-6 py-4 text-right text-slate-400">
                    <button class="hover:text-slate-600 transition-colors">
                      <lucide-icon name="more-vertical" class="w-4 h-4"></lucide-icon>
                    </button>
                  </td>
                </tr>

                <!-- Row 3 -->
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900">Nov 15, 2024</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span class="font-medium text-slate-700">Winter Canola</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-600">Field D-10</td>
                  <td class="px-6 py-4 text-slate-600">~600 Tons</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">Growing</span>
                  </td>
                  <td class="px-6 py-4 text-right text-slate-400">
                    <button class="hover:text-slate-600 transition-colors">
                      <lucide-icon name="more-vertical" class="w-4 h-4"></lucide-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  \`
})
export class HarvestingComponent {}
`;
fs.writeFileSync('src/app/pages/crops/harvesting/harvesting.component.ts', code);
