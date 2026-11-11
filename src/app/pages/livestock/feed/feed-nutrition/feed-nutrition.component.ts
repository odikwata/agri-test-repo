import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feed-nutrition',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <!-- Nutrition Overview -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Nutrition Overview</h2>
        <button [routerLink]="['/livestock/bulk-accounting']" class="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-100 transition-all border border-amber-100">
          <lucide-icon name="dollar-sign" class="w-4 h-4"></lucide-icon>
          Bulk Accounting
        </button>
      </div>
      <p class="text-sm text-slate-500">Monitoring nutritional metrics across active feed mixes and livestock groups.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avg Protein Content</p>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-black text-slate-900">16.5%</h3>
          <span class="text-xs text-green-600 font-bold">~0.4%</span>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Energy Density</p>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-black text-slate-900">2.8 Mcal</h3>
          <span class="text-xs text-slate-400 font-bold">/kg</span>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mineral Balance</p>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-black text-slate-900">94%</h3>
          <span class="text-xs text-green-600 font-bold">Target 95%</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Nutrient Analysis -->
      <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-slate-900">Nutrient Analysis</h3>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">By Livestock Type</span>
        </div>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100">
              <th class="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
              <th class="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protein</th>
              <th class="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiber</th>
              <th class="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fat</th>
              <th class="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Minerals</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr>
              <td class="py-4 font-bold text-slate-900">Cows (Adult)</td>
              <td class="py-4 text-sm text-slate-600">18.2%</td>
              <td class="py-4 text-sm text-slate-600">28.0%</td>
              <td class="py-4 text-sm text-slate-600">4.5%</td>
              <td class="py-4 text-sm text-slate-600">7.2%</td>
            </tr>
            <tr>
              <td class="py-4 font-bold text-slate-900">Heifers</td>
              <td class="py-4 text-sm text-slate-600">15.5%</td>
              <td class="py-4 text-sm text-slate-600">32.0%</td>
              <td class="py-4 text-sm text-slate-600">3.8%</td>
              <td class="py-4 text-sm text-slate-600">6.5%</td>
            </tr>
            <tr>
              <td class="py-4 font-bold text-slate-900">Calves</td>
              <td class="py-4 text-sm text-slate-600">22.0%</td>
              <td class="py-4 text-sm text-slate-600">12.5%</td>
              <td class="py-4 text-sm text-slate-600">6.2%</td>
              <td class="py-4 text-sm text-slate-600">8.8%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Targets vs. Actuals -->
      <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div class="flex items-center justify-between mb-8">
          <h3 class="font-bold text-slate-900">Targets vs. Actuals</h3>
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actual</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-slate-200"></div>
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recommended</span>
            </div>
          </div>
        </div>
        <div class="space-y-6">
          <div class="space-y-2">
            <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span class="text-slate-700">Protein Intake</span>
              <span class="text-slate-400">92% of target</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 w-[92%]"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span class="text-slate-700">Fiber Efficiency</span>
              <span class="text-slate-400">105% of target</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 w-full"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span class="text-slate-700">Calcium Levels</span>
              <span class="text-slate-400">98% of target</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 w-[98%]"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span class="text-slate-700">Dry Matter (DMI)</span>
              <span class="text-slate-400">85% of target</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 w-[85%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Feed Mixes -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-black text-slate-900 tracking-tight">Custom Feed Mixes</h3>
        <button class="px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-green-600 transition-all">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
          New Mix
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="font-bold text-slate-900">Lactation SuperMix-A</h4>
              <p class="text-[10px] text-slate-400 font-bold">ID: SL-4491-A</p>
            </div>
            <span class="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest rounded-full">Active</span>
          </div>
          <div class="flex gap-2 mb-4">
            <span class="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded">P: 18.5%</span>
            <span class="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded">F: 24%</span>
            <span class="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded">E: 3.1M</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div class="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">G1</div>
              <div class="w-6 h-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[8px] font-bold">G3</div>
            </div>
            <span class="text-[10px] text-slate-500">Assigned to: Milking Herd 1 & 2</span>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="font-bold text-slate-900">Growth Pro Calf Starter</h4>
              <p class="text-[10px] text-slate-400 font-bold">ID: SL-2201-C</p>
            </div>
            <span class="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest rounded-full">Active</span>
          </div>
          <div class="flex gap-2 mb-4">
            <span class="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded">P: 22.0%</span>
            <span class="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded">F: 12%</span>
            <span class="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded">E: 2.4M</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-amber-600">N1</div>
            <span class="text-[10px] text-slate-500">Assigned to: Nursery Pens</span>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="font-bold text-slate-900">Dry Cow Maintainer</h4>
              <p class="text-[10px] text-slate-400 font-bold">ID: SL-1182-D</p>
            </div>
            <span class="px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-full">Pending</span>
          </div>
          <div class="flex gap-2 mb-4">
            <span class="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded">P: 14.5%</span>
            <span class="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded">F: 35%</span>
            <span class="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded">E: 2.1M</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
            <span class="text-[10px] text-slate-500 italic">Not currently assigned</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Feeding Records -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-slate-900">Recent Feeding Records</h3>
        <button class="px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-200">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
          Log New Feeding
        </button>
      </div>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 border-b border-slate-200">
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Animal Group</th>
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Feed Mix</th>
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity (kg)</th>
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recorded By</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr>
            <td class="px-6 py-4 text-xs font-medium text-slate-600">Oct 24, 2023 08:30 AM</td>
            <td class="px-6 py-4 text-xs font-bold text-slate-900">Milking Herd 1</td>
            <td class="px-6 py-4 text-xs text-slate-600">Lactation SuperMix-A</td>
            <td class="px-6 py-4 text-xs font-bold text-slate-900">450.0</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-slate-200"></div>
                <span class="text-xs text-slate-600">J. Miller</span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 text-xs font-medium text-slate-600">Oct 24, 2023 07:15 AM</td>
            <td class="px-6 py-4 text-xs font-bold text-slate-900">Nursery Pens</td>
            <td class="px-6 py-4 text-xs text-slate-600">Growth Pro Calf Starter</td>
            <td class="px-6 py-4 text-xs font-bold text-slate-900">125.5</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-slate-200"></div>
                <span class="text-xs text-slate-600">A. Thompson</span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 text-xs font-medium text-slate-600">Oct 23, 2023 05:45 PM</td>
            <td class="px-6 py-4 text-xs font-bold text-slate-900">Dry Cows</td>
            <td class="px-6 py-4 text-xs text-slate-600">Dry Cow Maintainer</td>
            <td class="px-6 py-4 text-xs font-bold text-slate-900">380.0</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-slate-200"></div>
                <span class="text-xs text-slate-600">R. Peterson</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class FeedNutritionComponent {}
