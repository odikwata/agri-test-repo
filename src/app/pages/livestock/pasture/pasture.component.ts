import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pasture',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col w-full -mt-2 space-y-6">
      <!-- Sub-header Breadcrumb and Quick Telemetry Action Strip -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
            <span>OAKRIDGE CADASTRE</span>
            <span>/</span>
            <span class="text-emerald-700 font-bold">SPATIAL GRAZING &amp; PADDOCK ROTATION</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Pasture Allocation &amp; Grazing Cadastre</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              IOT SOIL &amp; BIOMASS SENSORS
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Rotational stocking density calculations, residual sward height monitoring, and automated paddock rest periods.</p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          <button type="button" 
                  class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">rotate_right</span>
            <span>Trigger Mob Move</span>
          </button>
          <a [routerLink]="['/livestock']" 
             class="inline-flex items-center gap-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">fence</span>
            <span>Kraal Allocations</span>
          </a>
        </div>
      </div>

      <!-- Pasture & Grazing Bento KPI Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Grazing Area -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Grazing Cadastre</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">2,850</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Acres</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">landscape</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">24 Fenced Cells</span>
            <span class="text-slate-400">Oakridge Sector 1-4</span>
          </div>
        </div>

        <!-- Active Grazing -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Occupied Paddocks</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">12 / 24</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Cells</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <span class="material-symbols-outlined text-2xl">pets</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>1,480 Head Stocking</span>
            <span class="text-emerald-700 font-bold">Density: 1.8 LSU/Ha</span>
          </div>
        </div>

        <!-- Resting Land -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Resting Recovery</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">1,120</span>
                <span class="font-mono text-xs text-amber-700 font-semibold">Acres</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-amber-50 text-amber-900">
              <span class="material-symbols-outlined text-2xl">spa</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-amber-800 font-bold">28-Day Rest Cycle</span>
            <span class="text-slate-400">8 Cells Ready</span>
          </div>
        </div>

        <!-- Biomass Height -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sward Biomass Height</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">14.2</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">cm Mean</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">grass</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>2,650 kg DM/Ha</span>
            <span class="text-emerald-700 font-bold">Rising Plate Metred</span>
          </div>
        </div>
      </section>

      <!-- Paddock Grid & History -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- LEFT 8 COLS: Paddock Cells Matrix & Rotation Schedule -->
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-800 text-xl">grid_view</span>
                <div>
                  <h3 class="font-heading text-base font-bold text-slate-900">Cadastre Paddock Cells</h3>
                  <p class="text-xs text-slate-500">Live stocking occupancy across 24 rotational grazing pastures</p>
                </div>
              </div>
              <div class="flex items-center gap-3 text-xs font-mono">
                <span class="flex items-center gap-1.5 text-slate-600">
                  <span class="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span> Grazing
                </span>
                <span class="flex items-center gap-1.5 text-slate-600">
                  <span class="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Resting
                </span>
                <span class="flex items-center gap-1.5 text-slate-600">
                  <span class="w-2.5 h-2.5 rounded-sm bg-slate-300"></span> Fallow
                </span>
              </div>
            </div>

            <!-- 24 Paddock Grid -->
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              @for (i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]; track i) {
                <div [class]="i % 3 === 0 
                       ? 'bg-emerald-50 border-emerald-500/80 text-emerald-950 shadow-xs' 
                       : (i % 3 === 1 
                           ? 'bg-amber-50/70 border-amber-300 text-amber-950' 
                           : 'bg-slate-50 border-slate-200 text-slate-600')"
                     class="p-2.5 rounded-xl border flex flex-col justify-between aspect-square cursor-pointer transition-all hover:scale-102">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold">P{{ i < 10 ? '0' + i : i }}</span>
                    <span class="material-symbols-outlined text-sm">
                      {{ i % 3 === 0 ? 'pets' : (i % 3 === 1 ? 'spa' : 'hourglass_empty') }}
                    </span>
                  </div>
                  <div class="font-mono text-[10px]">
                    <span class="font-bold block">{{ i % 3 === 0 ? 'Grazing' : (i % 3 === 1 ? 'Resting' : 'Fallow') }}</span>
                    <span class="text-slate-400 text-[9px]">{{ i % 3 === 0 ? '14.2cm' : (i % 3 === 1 ? '18d rest' : 'Cleared') }}</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Rotation Log Table -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 class="font-heading text-base font-bold text-slate-900">Recent Mob Movements &amp; Residual Sward</h3>
                <p class="text-xs text-slate-500">Historical intake records verified by GPS collar tracking</p>
              </div>
              <span class="font-mono text-[11px] text-slate-500 font-bold">Automated Gate Logs</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/75 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    <th class="py-3 px-4">Paddock</th>
                    <th class="py-3 px-4">Allocated Herd Cohort</th>
                    <th class="py-3 px-4">Stocking Duration</th>
                    <th class="py-3 px-4">Residual Exit Height</th>
                    <th class="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs">
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3.5 px-4 font-mono font-bold text-slate-900">Paddock 04 (North Ridge)</td>
                    <td class="py-3.5 px-4 font-bold text-slate-800">High-Yield Dairy Herd A (440 Head)</td>
                    <td class="py-3.5 px-4 font-mono text-slate-600">4 Days (Rotated Today)</td>
                    <td class="py-3.5 px-4 font-mono text-emerald-800 font-bold">6.8 cm Residual</td>
                    <td class="py-3.5 px-4">
                      <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">Optimal Exit</span>
                    </td>
                  </tr>
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3.5 px-4 font-mono font-bold text-slate-900">Paddock 12 (Heifer Valley)</td>
                    <td class="py-3.5 px-4 font-bold text-slate-800">Replacement Heifer Alpha (180 Head)</td>
                    <td class="py-3.5 px-4 font-mono text-slate-600">6 Days</td>
                    <td class="py-3.5 px-4 font-mono text-emerald-800 font-bold">7.2 cm Residual</td>
                    <td class="py-3.5 px-4">
                      <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">Optimal Exit</span>
                    </td>
                  </tr>
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3.5 px-4 font-mono font-bold text-slate-900">Paddock 06 (South Slope)</td>
                    <td class="py-3.5 px-4 font-bold text-slate-800">Merino Ewe Mob Delta (220 Head)</td>
                    <td class="py-3.5 px-4 font-mono text-slate-600">3 Days (Active)</td>
                    <td class="py-3.5 px-4 font-mono text-slate-700">11.4 cm Current</td>
                    <td class="py-3.5 px-4">
                      <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">In Grazing (2d left)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- RIGHT 4 COLS: Telemetry Sensor Feeds & Environmental Recommendations -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Soil Moisture & Telemetry Box -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 class="font-heading text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-800">sensors</span>
              Soil Moisture &amp; Agronomic Health
            </h3>

            <div class="space-y-3 font-mono text-xs">
              <div class="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase">Soil Moisture (Depth 15cm)</span>
                  <span class="font-bold text-slate-900 text-sm">24.2% VWC</span>
                </div>
                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">OPTIMAL</span>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase">Soil Temperature</span>
                  <span class="font-bold text-slate-900 text-sm">18.4°C</span>
                </div>
                <span class="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">GROWTH READY</span>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase">Soil pH Index</span>
                  <span class="font-bold text-slate-900 text-sm">6.42 pH</span>
                </div>
                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">BALANCED</span>
              </div>
            </div>
          </div>

          <!-- Automated Rotation Recommendation Card -->
          <div class="bg-[#012d1d] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-emerald-400">autorenew</span>
                <span class="font-heading text-sm font-bold uppercase tracking-wider">AI Grazing Recommendation</span>
              </div>
              <p class="text-xs text-emerald-100 leading-relaxed mb-4">
                Paddock 08 has completed 28 days of rest and sward height has recovered to 19.5 cm (3,100 kg DM/Ha). Recommend shifting Dairy Herd A from Paddock 04 tomorrow morning.
              </p>
              <button type="button" class="w-full py-2.5 bg-white text-[#012d1d] rounded-xl font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Confirm Scheduled Move</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PastureComponent {}
