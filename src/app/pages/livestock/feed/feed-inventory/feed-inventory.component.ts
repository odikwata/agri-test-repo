import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feed-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Nutrition & Silo KPI Bento Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Feed Stock -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Silo Stock</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">42,850</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">kg</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">warehouse</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">4 Main Silos Active</span>
            <span class="text-slate-400">78% Silo Fill</span>
          </div>
        </div>

        <!-- Daily Consumption -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Daily Ration Dispensed</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">2,450</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">kg / day</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <span class="material-symbols-outlined text-2xl">restaurant</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>1,480 Head Fed</span>
            <span class="text-emerald-700 font-bold">Zero Wastage Logged</span>
          </div>
        </div>

        <!-- Runway Days -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stock Runway</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">18.5</span>
                <span class="font-mono text-xs text-amber-700 font-semibold">Days</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-amber-50 text-amber-900">
              <span class="material-symbols-outlined text-2xl">hourglass_bottom</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-amber-800 font-bold">Delivery PO #FD-401</span>
            <span class="text-slate-400">In 5 Days</span>
          </div>
        </div>

        <!-- Feeding Efficiency & Cost -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mean Feed Cost / Head</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">$1.42</span>
                <span class="font-mono text-xs text-slate-500 font-medium">USD / day</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">payments</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Feed Conversion: 6.2:1</span>
            <span class="text-emerald-700 font-bold">Optimal Margin</span>
          </div>
        </div>
      </section>

      <!-- Main Grid: Consumption Trends & Commodity Silo Fill -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 7-Day Dispensation Trends -->
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 class="font-heading text-base font-bold text-slate-900">7-Day TMR Dispensation Telemetry</h3>
                <p class="text-xs text-slate-500">Automated feed wagon scale logs across Kraals and Broiler Sheds</p>
              </div>
              <span class="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">TELEMETRY SYNCED</span>
            </div>

            <!-- Bar Chart Representation -->
            <div class="flex items-end justify-between h-44 gap-2 px-2 pt-6">
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <span class="font-mono text-[10px] text-slate-500 font-bold">2.3t</span>
                <div class="w-full bg-emerald-100 rounded-t-lg h-[65%]"></div>
                <span class="font-mono text-[10px] text-slate-400 font-bold">Mon</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <span class="font-mono text-[10px] text-slate-500 font-bold">2.5t</span>
                <div class="w-full bg-emerald-200 rounded-t-lg h-[75%]"></div>
                <span class="font-mono text-[10px] text-slate-400 font-bold">Tue</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <span class="font-mono text-[10px] text-slate-500 font-bold">2.4t</span>
                <div class="w-full bg-emerald-100 rounded-t-lg h-[70%]"></div>
                <span class="font-mono text-[10px] text-slate-400 font-bold">Wed</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <span class="font-mono text-[10px] text-slate-500 font-bold">2.6t</span>
                <div class="w-full bg-emerald-200 rounded-t-lg h-[82%]"></div>
                <span class="font-mono text-[10px] text-slate-400 font-bold">Thu</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <span class="font-mono text-[10px] text-emerald-800 font-bold">2.8t</span>
                <div class="w-full bg-[#012d1d] rounded-t-lg h-[92%]"></div>
                <span class="font-mono text-[10px] text-[#012d1d] font-bold">Fri</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <span class="font-mono text-[10px] text-slate-500 font-bold">2.4t</span>
                <div class="w-full bg-emerald-100 rounded-t-lg h-[72%]"></div>
                <span class="font-mono text-[10px] text-slate-400 font-bold">Sat</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <span class="font-mono text-[10px] text-slate-500 font-bold">2.45t</span>
                <div class="w-full bg-emerald-600 rounded-t-lg h-[76%]"></div>
                <span class="font-mono text-[10px] text-slate-400 font-bold">Sun</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span class="text-slate-500">Weekly Total: 17.45 Metric Tons</span>
            <span class="text-emerald-800 font-bold">Mix Variance &lt; 1.2%</span>
          </div>
        </div>

        <!-- Silo Reserves by Commodity -->
        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 class="font-heading text-base font-bold text-slate-900">Silo Reserves by Commodity</h3>
              <span class="font-mono text-[10px] text-slate-500 font-bold">SONAR MONITORED</span>
            </div>

            <div class="space-y-4">
              <!-- Silo 1 -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-mono">
                  <span class="font-bold text-slate-900">Silo 01: Corn / Maize Silage</span>
                  <span class="text-slate-600">24,500 kg (68%)</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-[#012d1d] rounded-full" style="width: 68%"></div>
                </div>
              </div>

              <!-- Silo 2 -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-mono">
                  <span class="font-bold text-slate-900">Silo 02: Broiler Starter Crumbles (22% CP)</span>
                  <span class="text-slate-600">9,800 kg (82%)</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-600 rounded-full" style="width: 82%"></div>
                </div>
              </div>

              <!-- Silo 3 -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-mono">
                  <span class="font-bold text-slate-900">Silo 03: Dairy Lactation Pellets</span>
                  <span class="text-slate-600">6,100 kg (55%)</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-700 rounded-full" style="width: 55%"></div>
                </div>
              </div>

              <!-- Silo 4 -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-mono">
                  <span class="font-bold text-slate-900">Silo 04: Lucerne Hay &amp; Protein Meals</span>
                  <span class="text-amber-800 font-bold">2,450 kg (22% Low)</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full" style="width: 22%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-500 font-mono">Reorder threshold at 15%</span>
            <button type="button" class="px-4 py-2 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">add_shopping_cart</span>
              <span>Reorder Commodity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FeedInventoryComponent {}
