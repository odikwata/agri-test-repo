const fs = require('fs');

const code = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-planting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: \`
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      
      <!-- Top Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Area Planted -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm">
          <div class="relative z-10">
            <p class="text-sm font-bold text-slate-500 mb-1">Total Area Planted</p>
            <div class="flex items-baseline gap-2 mb-2">
              <h2 class="text-4xl font-black text-slate-900">1,240</h2>
              <span class="text-slate-500 font-medium">Acres</span>
            </div>
            <p class="text-sm font-bold text-emerald-500 flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-4 h-4"></lucide-icon>
              +5% vs last season
            </p>
          </div>
          <div class="absolute -bottom-4 -right-4 opacity-10 pointer-events-none text-blue-500">
            <lucide-icon name="sprout" class="w-32 h-32"></lucide-icon>
          </div>
        </div>

        <!-- Active Crops -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm">
          <div class="relative z-10">
            <p class="text-sm font-bold text-slate-500 mb-1">Active Crops</p>
            <div class="flex items-baseline gap-2 mb-3">
              <h2 class="text-4xl font-black text-slate-900">12</h2>
              <span class="text-slate-500 font-medium">Cycles</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white relative z-30">W</div>
                <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white relative z-20">C</div>
                <div class="w-6 h-6 rounded-full bg-slate-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white relative z-10">S</div>
              </div>
              <p class="text-xs text-slate-500 font-medium">Wheat, Corn, Soy...</p>
            </div>
          </div>
          <div class="absolute top-4 -right-4 opacity-10 pointer-events-none text-blue-500">
            <lucide-icon name="leaf" class="w-32 h-32"></lucide-icon>
          </div>
        </div>

        <!-- Approaching Harvest -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm">
          <div class="relative z-10">
            <p class="text-sm font-bold text-slate-500 mb-1">Approaching Harvest</p>
            <div class="flex items-baseline gap-2 mb-3">
              <h2 class="text-4xl font-black text-slate-900">3</h2>
              <span class="text-slate-500 font-medium">Fields</span>
            </div>
            <p class="text-sm font-bold text-red-500 flex items-center gap-1">
              <lucide-icon name="alert-triangle" class="w-4 h-4"></lucide-icon>
              Within 14 days
            </p>
          </div>
          <div class="absolute top-4 -right-4 opacity-10 pointer-events-none text-red-500">
            <lucide-icon name="clock" class="w-32 h-32"></lucide-icon>
          </div>
        </div>
      </div>

      <!-- Active Planting Cycles -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-800">Active Planting Cycles</h3>
          <button class="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors">
            View Map <lucide-icon name="map" class="w-4 h-4"></lucide-icon>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <lucide-icon name="sprout" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900">Winter Wheat</h4>
                  <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <lucide-icon name="map-pin" class="w-3 h-3"></lucide-icon> Field A-12 (North Valley)
                  </p>
                </div>
              </div>
              <span class="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wide">Vegetative</span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-[11px] font-medium text-slate-500 mb-1">Planted</p>
                <p class="text-sm font-bold text-slate-900">Oct 15, 2023</p>
              </div>
              <div>
                <p class="text-[11px] font-medium text-slate-500 mb-1">Est. Harvest</p>
                <p class="text-sm font-bold text-slate-900">Jul 20, 2024</p>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-700">Cycle Progress</span>
                <span class="text-xs font-bold text-emerald-600">65%</span>
              </div>
              <div class="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-600 rounded-full" style="width: 65%"></div>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <lucide-icon name="leaf" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900">Yellow Corn (DKC)</h4>
                  <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <lucide-icon name="map-pin" class="w-3 h-3"></lucide-icon> Field B-04 (East Ridge)
                  </p>
                </div>
              </div>
              <span class="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wide">Flowering</span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-[11px] font-medium text-slate-500 mb-1">Planted</p>
                <p class="text-sm font-bold text-slate-900">Apr 05, 2024</p>
              </div>
              <div>
                <p class="text-[11px] font-medium text-slate-500 mb-1">Est. Harvest</p>
                <p class="text-sm font-bold text-slate-900">Sep 10, 2024</p>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-700">Cycle Progress</span>
                <span class="text-xs font-bold text-blue-600">85%</span>
              </div>
              <div class="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full" style="width: 85%"></div>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <lucide-icon name="plant" class="w-5 h-5"></lucide-icon>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900">Soybeans (RR2)</h4>
                    <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <lucide-icon name="map-pin" class="w-3 h-3"></lucide-icon> Field C-01 (South Pivot)
                    </p>
                  </div>
                </div>
                <span class="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wide">Seedling</span>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p class="text-[11px] font-medium text-slate-500 mb-1">Planted</p>
                  <p class="text-sm font-bold text-slate-900">May 12, 2024</p>
                </div>
                <div>
                  <p class="text-[11px] font-medium text-slate-500 mb-1">Est. Harvest</p>
                  <p class="text-sm font-bold text-slate-900">Oct 05, 2024</p>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-bold text-slate-700">Cycle Progress</span>
                  <span class="text-xs font-bold text-slate-600">15%</span>
                </div>
                <div class="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div class="h-full bg-slate-600 rounded-full" style="width: 15%"></div>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-4 -right-4 opacity-5 pointer-events-none text-slate-900 z-0">
               <lucide-icon name="droplet" class="w-32 h-32"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Schedule Table -->
      <div>
        <h3 class="text-lg font-bold text-slate-800 mb-4">Upcoming Schedule</h3>
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-6 py-4 font-bold text-slate-600">Planned Start</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Crop Variety</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Target Field</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Est. Duration</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Status</th>
                  <th class="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <!-- Row 1 -->
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900">Sep 01, 2024</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span class="font-medium text-slate-700">Winter Canola</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-600">Field D-10</td>
                  <td class="px-6 py-4 text-slate-600">~280 Days</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">Ready</span>
                  </td>
                  <td class="px-6 py-4 text-right text-slate-400">
                    <button class="hover:text-slate-600 transition-colors">
                      <lucide-icon name="more-vertical" class="w-4 h-4"></lucide-icon>
                    </button>
                  </td>
                </tr>

                <!-- Row 2 -->
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900">Sep 15, 2024</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span class="font-medium text-slate-700">Cover Crop (Rye)</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-600">Field A-01, A-02</td>
                  <td class="px-6 py-4 text-slate-600">~120 Days</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">Pending Seed</span>
                  </td>
                  <td class="px-6 py-4 text-right text-slate-400">
                    <button class="hover:text-slate-600 transition-colors">
                      <lucide-icon name="more-vertical" class="w-4 h-4"></lucide-icon>
                    </button>
                  </td>
                </tr>

                <!-- Row 3 -->
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900">Oct 10, 2024</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span class="font-medium text-slate-700">Winter Wheat (SRW)</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-600">Field B-05</td>
                  <td class="px-6 py-4 text-slate-600">~270 Days</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">Planned</span>
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
export class PlantingComponent {}
`;
fs.writeFileSync('src/app/pages/crops/planting/planting.component.ts', code);
