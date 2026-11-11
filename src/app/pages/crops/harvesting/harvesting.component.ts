import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-harvesting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>OAKRIDGE CADASTRE / ARABLE AGRONOMY & YIELD LOGISTICS</span>
          </div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Harvesting Telemetry & Silo Cadastre</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              COMBINE TELEMETRY LIVE
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a routerLink="/crops/field-map" class="px-3.5 py-2 text-xs font-mono font-medium rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all flex items-center gap-2 shadow-xs">
            <lucide-icon name="map" class="w-3.5 h-3.5 text-stone-500"></lucide-icon>
            <span>FIELD GIS</span>
          </a>
          <button class="px-4 py-2 bg-[#012d1d] hover:bg-[#023f29] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
            <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
            <span>LOG HARVEST BATCH</span>
          </button>
        </div>
      </div>

      <!-- Bento KPI Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Projected Yield -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Projected Season Yield</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <lucide-icon name="wheat" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">8,450 MT</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>+14.2% vs previous arable cycle</span>
          </div>
        </div>

        <!-- Active Combines In Field -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Active In-Field Harvesters</span>
            <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <lucide-icon name="tractor" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">3 Combines</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-stone-600">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>John Deere S780 & S770 Units</span>
          </div>
        </div>

        <!-- Approaching Window -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Ready in 14-Day Window</span>
            <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <lucide-icon name="clock" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">3 Cadastre Plots</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-stone-600">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-stone-500"></span>
            <span>288.1 Total Hectares</span>
          </div>
        </div>

        <!-- Silo Capacity -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Silo Intake Reserves</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <lucide-icon name="warehouse" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">12,000 MT</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>4 Silos Ready (Moisture 13.8%)</span>
          </div>
        </div>
      </div>

      <!-- Active Ongoing Harvesting Operations -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-stone-900">Active Field Operations</span>
            <span class="px-2 py-0.5 text-[11px] font-mono rounded-full bg-emerald-100 text-emerald-800 font-bold">2 IN PROGRESS</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Plot 1 -->
          <div class="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider">PIVOT 01 • GRAIN FILL COMPLETE</span>
                <h4 class="text-lg font-bold text-stone-900 mt-0.5">North Pivot Field A — Yellow Maize</h4>
                <p class="text-xs text-stone-500 font-mono mt-0.5">Pioneer P1197 Hybrid • 125.4 Hectares</p>
              </div>
              <span class="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold rounded-lg uppercase">
                68% CUT
              </span>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-mono text-stone-600">
                <span>Progress: 85.3 Ha / 125.4 Ha</span>
                <span class="font-bold text-amber-700">Combine #01 Active</span>
              </div>
              <div class="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full" style="width: 68%"></div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center font-mono text-xs">
              <div class="bg-stone-50 p-2 rounded-xl border border-stone-100">
                <span class="text-stone-400 block text-[10px]">MOISTURE</span>
                <span class="font-bold text-stone-800">14.6%</span>
              </div>
              <div class="bg-stone-50 p-2 rounded-xl border border-stone-100">
                <span class="text-stone-400 block text-[10px]">EST. YIELD</span>
                <span class="font-bold text-stone-800">11.8 MT/Ha</span>
              </div>
              <div class="bg-stone-50 p-2 rounded-xl border border-stone-100">
                <span class="text-stone-400 block text-[10px]">ELEVATOR</span>
                <span class="font-bold text-emerald-700">Silo 02</span>
              </div>
            </div>
          </div>

          <!-- Plot 2 -->
          <div class="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider">PADDOCK 03 • DESICCATION VERIFIED</span>
                <h4 class="text-lg font-bold text-stone-900 mt-0.5">East Terrace Paddock 03 — Forage Sorghum</h4>
                <p class="text-xs text-stone-500 font-mono mt-0.5">Phofu Drought-Resilient • 98.2 Hectares</p>
              </div>
              <span class="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold rounded-lg uppercase">
                42% CUT
              </span>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-mono text-stone-600">
                <span>Progress: 41.2 Ha / 98.2 Ha</span>
                <span class="font-bold text-emerald-700">Combine #02 Active</span>
              </div>
              <div class="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-600 rounded-full" style="width: 42%"></div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center font-mono text-xs">
              <div class="bg-stone-50 p-2 rounded-xl border border-stone-100">
                <span class="text-stone-400 block text-[10px]">MOISTURE</span>
                <span class="font-bold text-stone-800">13.2%</span>
              </div>
              <div class="bg-stone-50 p-2 rounded-xl border border-stone-100">
                <span class="text-stone-400 block text-[10px]">EST. YIELD</span>
                <span class="font-bold text-stone-800">7.4 MT/Ha</span>
              </div>
              <div class="bg-stone-50 p-2 rounded-xl border border-stone-100">
                <span class="text-stone-400 block text-[10px]">SILO DEST</span>
                <span class="font-bold text-emerald-700">Bunker 01</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Harvest Schedule Table -->
      <div class="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-stone-800">Cadastre Harvest Queue & Grain Maturation</span>
            <span class="px-2 py-0.5 text-[11px] font-mono rounded-full bg-stone-200/70 text-stone-700">3 Plots Scheduled</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">Target Window</th>
                <th class="px-6 py-3.5">Cadastre Field</th>
                <th class="px-6 py-3.5">Crop & Seed Variety</th>
                <th class="px-6 py-3.5">Projected Yield</th>
                <th class="px-6 py-3.5">Agronomic Status</th>
                <th class="px-6 py-3.5 text-right">Combine Assignment</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr class="hover:bg-stone-50/70 transition-colors">
                <td class="px-6 py-4 font-mono text-xs font-bold text-stone-900">Oct 18, 2026 (14 Days)</td>
                <td class="px-6 py-4 font-semibold text-stone-900">North Pivot Field A</td>
                <td class="px-6 py-4 text-xs font-mono text-stone-600">Grain Maize • Pioneer P1197</td>
                <td class="px-6 py-4 font-mono font-bold text-stone-800">~1,480 MT</td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border bg-amber-50 text-amber-800 border-amber-200 uppercase">
                    Kernel Dent R5
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-mono text-xs text-stone-600">Combine JD-S780 #1</td>
              </tr>
              <tr class="hover:bg-stone-50/70 transition-colors">
                <td class="px-6 py-4 font-mono text-xs font-bold text-stone-900">Oct 22, 2026 (18 Days)</td>
                <td class="px-6 py-4 font-semibold text-stone-900">East Terrace Paddock 03</td>
                <td class="px-6 py-4 text-xs font-mono text-stone-600">Sorghum • Phofu Drought-Tolerant</td>
                <td class="px-6 py-4 font-mono font-bold text-stone-800">~720 MT</td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border bg-blue-50 text-blue-800 border-blue-200 uppercase">
                    Hard Dough Stage
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-mono text-xs text-stone-600">Combine JD-S770 #2</td>
              </tr>
              <tr class="hover:bg-stone-50/70 transition-colors">
                <td class="px-6 py-4 font-mono text-xs font-bold text-stone-900">Oct 25, 2026 (21 Days)</td>
                <td class="px-6 py-4 font-semibold text-stone-900">West River Alluvial Plot</td>
                <td class="px-6 py-4 text-xs font-mono text-stone-600">Yukon Gold Potatoes</td>
                <td class="px-6 py-4 font-mono font-bold text-stone-800">~2,150 MT</td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200 uppercase">
                    Skin Set & Cure
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-mono text-xs text-stone-600">Spudnik Harvester #1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class HarvestingComponent {}
