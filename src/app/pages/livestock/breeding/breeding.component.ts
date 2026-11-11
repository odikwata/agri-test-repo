import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breeding',
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
            <span class="text-emerald-700 font-bold">REPRODUCTIVE GENOMICS &amp; GESTATION</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Breeding Registry &amp; Gestation Telemetry</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              GESTATION TELEMETRY SYNCED
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Artificial insemination tracking, pedigree studbooks, EPD genomic evaluations, and ultrasound pregnancy checks.</p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          <a [routerLink]="['/livestock/bulk-breeding']" 
             class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">playlist_add</span>
            <span>Bulk Breeding Sync</span>
          </a>
          <a [routerLink]="['/livestock/new-breeding']" 
             class="inline-flex items-center gap-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Breeding Cycle</span>
          </a>
        </div>
      </div>

      <!-- Reproductive KPI Bento Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Confirmed In-Calf -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Confirmed In-Calf</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">68</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Dams</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">favorite</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> 52 Angus &bull; 16 Dairy
            </span>
            <span class="text-slate-400">Ultrasound Verified</span>
          </div>
        </div>

        <!-- Conception Rate -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Conception Efficiency</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">91.4%</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">1st Service</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <span class="material-symbols-outlined text-2xl">trending_up</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>AI Straw Batch #AI-4402</span>
            <span class="text-emerald-700 font-bold">+4.2% vs Benchmark</span>
          </div>
        </div>

        <!-- Expected Calvings This Month -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Expected Calvings</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">24</span>
                <span class="font-mono text-xs text-amber-700 font-semibold">Head</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-amber-50 text-amber-900">
              <span class="material-symbols-outlined text-2xl">nest_cam_wired_stand</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-amber-800 font-bold">Maternity Pen M-1 Primed</span>
            <span class="text-slate-400">Due in 3-18 Days</span>
          </div>
        </div>

        <!-- Genetic Lineage & Sires -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Genomic Stud Sires</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">8</span>
                <span class="font-mono text-xs text-slate-500 font-medium">Verified AAA</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">account_tree</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Mean CED +11.8</span>
            <span class="text-emerald-700 font-bold">Top 5% Genetics</span>
          </div>
        </div>
      </section>

      <!-- Active Breeding Cycles Cards (Matches Livestock Register aesthetic) -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#012d1d]">reorder</span>
            <h2 class="font-heading text-lg font-bold text-slate-900">Active High-Value Gestation Cycles</h2>
          </div>
          <span class="text-xs font-mono text-slate-500">Continuous Collar Temperature &amp; Contraction Sensors</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Cycle 1: Sovereign Belle -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-bold text-[#012d1d] bg-emerald-50 px-2 py-0.5 rounded">CYCLE #BC-2024-882</span>
                  <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono uppercase">Gestation Phase</span>
                </div>
                <h3 class="font-heading text-base font-bold text-slate-900 mt-2">Oakridge Belle V (TAG-9042)</h3>
                <span class="font-mono text-xs text-slate-500">Kraal 04 &bull; Pen 12 (Replacement Heifers)</span>
              </div>
              <div class="text-right font-mono text-xs">
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Estimated Calving</span>
                <span class="font-bold text-[#012d1d] text-sm">Nov 14, 2024</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 my-4 bg-slate-50 p-3 rounded-xl text-xs font-mono">
              <div>
                <span class="text-[10px] text-slate-400 uppercase font-bold block">Sire (AI Straw)</span>
                <span class="font-bold text-slate-900">Black Titan #881 (AAA #18420199)</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 uppercase font-bold block">Conception Protocol</span>
                <span class="font-bold text-emerald-800">Timed AI (Estrus Sync #ES-4)</span>
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-mono font-bold">
                <span class="text-slate-500">Gestation Progress: 215 of 283 Days</span>
                <span class="text-emerald-700">76% Term</span>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#012d1d] rounded-full" style="width: 76%"></div>
              </div>
            </div>
          </div>

          <!-- Cycle 2: Lactating Matron -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">CYCLE #BC-2024-904</span>
                  <span class="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-mono uppercase">Pre-Calving Prep</span>
                </div>
                <h3 class="font-heading text-base font-bold text-slate-900 mt-2">Lady Electra #AG-210</h3>
                <span class="font-mono text-xs text-slate-500">Kraal 01 &bull; Maternity Pen M-1 (Dry Transition)</span>
              </div>
              <div class="text-right font-mono text-xs">
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Estimated Calving</span>
                <span class="font-bold text-amber-800 text-sm">Oct 12, 2024 (2d)</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 my-4 bg-slate-50 p-3 rounded-xl text-xs font-mono">
              <div>
                <span class="text-[10px] text-slate-400 uppercase font-bold block">Sire (Natural Stud)</span>
                <span class="font-bold text-slate-900">Oakridge Monarch #014</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 uppercase font-bold block">Rumination Indicator</span>
                <span class="font-bold text-emerald-800">Normal (460 min/d)</span>
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-mono font-bold">
                <span class="text-slate-500">Gestation Progress: 281 of 283 Days</span>
                <span class="text-amber-700">99% Term (Close Watch)</span>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-amber-600 rounded-full" style="width: 99%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reproductive Lineage & History Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-heading text-base font-bold text-slate-900">Pedigree Register &amp; Reproductive History</h3>
            <p class="text-xs text-slate-500">Traceability across registered dams, active sires, and calf progeny</p>
          </div>
          <span class="font-mono text-[11px] text-slate-500 font-bold">Showing 4 of 68 Records</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/75 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <th class="py-3 px-4">Bio-Asset ID / Name</th>
                <th class="py-3 px-4">Allocated Kraal &amp; Pen</th>
                <th class="py-3 px-4">Parentage Lineage</th>
                <th class="py-3 px-4">Gestation / Cycle State</th>
                <th class="py-3 px-4">Historical Calvings</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-900">TAG-9042 &bull; Belle V</div>
                  <span class="font-mono text-[11px] text-slate-400">Purebred Angus Heifer</span>
                </td>
                <td class="py-3.5 px-4 font-mono text-slate-700">Kraal 04 &bull; Pen 12</td>
                <td class="py-3.5 px-4">
                  <div class="font-mono text-[11px] text-slate-800">Sire: Titan #881</div>
                  <div class="font-mono text-[11px] text-slate-400">Dam: Bessie #442</div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">Confirmed In-Calf</span>
                </td>
                <td class="py-3.5 px-4 font-mono font-bold text-slate-700">0 (Maiden Heifer)</td>
                <td class="py-3.5 px-4 text-right">
                  <a [routerLink]="['/livestock/dossier/1']" class="text-xs font-bold text-emerald-800 hover:text-[#012d1d] hover:underline cursor-pointer">View Dossier</a>
                </td>
              </tr>

              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-900">TAG-014 &bull; Monarch Stud</div>
                  <span class="font-mono text-[11px] text-slate-400">Senior Breeding Sire</span>
                </td>
                <td class="py-3.5 px-4 font-mono text-slate-700">Kraal 01 &bull; Bull Bay 01</td>
                <td class="py-3.5 px-4">
                  <div class="font-mono text-[11px] text-slate-800">Sire: Oakridge Imperator</div>
                  <div class="font-mono text-[11px] text-slate-400">Dam: Duchess Pride #90</div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-[10px] font-bold">Active Stud Duty</span>
                </td>
                <td class="py-3.5 px-4 font-mono font-bold text-slate-700">42 Progeny Calved</td>
                <td class="py-3.5 px-4 text-right">
                  <a [routerLink]="['/livestock/dossier/2']" class="text-xs font-bold text-emerald-800 hover:text-[#012d1d] hover:underline cursor-pointer">View Dossier</a>
                </td>
              </tr>

              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-900">TAG-210 &bull; Lady Electra</div>
                  <span class="font-mono text-[11px] text-slate-400">Mature Angus Dam</span>
                </td>
                <td class="py-3.5 px-4 font-mono text-slate-700">Kraal 01 &bull; Maternity Pen M-1</td>
                <td class="py-3.5 px-4">
                  <div class="font-mono text-[11px] text-slate-800">Sire: Sovereign Duke</div>
                  <div class="font-mono text-[11px] text-slate-400">Dam: Electra II #11</div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">Imminent Calving (2d)</span>
                </td>
                <td class="py-3.5 px-4 font-mono font-bold text-slate-700">4 Successful Calvings</td>
                <td class="py-3.5 px-4 text-right">
                  <a [routerLink]="['/livestock/dossier/3']" class="text-xs font-bold text-emerald-800 hover:text-[#012d1d] hover:underline cursor-pointer">View Dossier</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class BreedingComponent {}
