import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col w-full -mt-2 space-y-6">
      <!-- Sub-header Breadcrumb and Quick Telemetry Action Strip -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
            <span>OAKRIDGE CADASTRE</span>
            <span>/</span>
            <span class="text-emerald-700 font-bold">COHORT &amp; PRODUCTION BATCH MANAGEMENT</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Livestock Cohorts &amp; Production Batches</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              BATCH TELEMETRY ACTIVE
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Management of multi-animal cohorts, commercial broiler sheds, apiary compounds, sheep mobs, and feeding groups.</p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          <a routerLink="/livestock/add" 
             class="inline-flex items-center gap-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Enroll New Batch</span>
          </a>
          <a routerLink="/livestock" 
             class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">arrow_back</span>
            <span>Herd Directory</span>
          </a>
        </div>
      </div>

      <!-- Cohort Summary Stats Bento Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Managed Groups -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Managed Cohorts</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">12</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Batches</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">groups</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">7 Cattle &bull; 2 Poultry &bull; 2 Ovine</span>
            <span class="text-slate-400">1 Apiary</span>
          </div>
        </div>

        <!-- Total Headcount / Biomass Count -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Group Animals</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">6,740</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Head / Birds</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <span class="material-symbols-outlined text-2xl">pets</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>5,000 Broilers &bull; 1,480 Large Animal</span>
            <span class="text-slate-400">24 Hives</span>
          </div>
        </div>

        <!-- Average Growth Rate -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mean Average Daily Gain</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">+1.24</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">kg / day</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">trending_up</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">ADG Benchmark Top 10%</span>
            <span class="text-slate-400">Scale Verified</span>
          </div>
        </div>

        <!-- Kraal & Pen Density -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Housing Occupancy</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">76.4%</span>
                <span class="font-mono text-xs text-slate-500 font-medium">Capacity</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">fence</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Optimal Stocking Level</span>
            <span class="text-emerald-700 font-bold">Zero Crowding</span>
          </div>
        </div>
      </section>

      <!-- Bulk Multi-Action Quick Links -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a routerLink="/livestock/bulk-health" class="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3.5 hover:border-emerald-600/40 hover:shadow-sm transition-all group">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
            <span class="material-symbols-outlined text-xl">medical_services</span>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">Bulk Health &amp; Vaccine Protocol</h4>
            <p class="text-xs text-slate-500">Dispense vaccines or deworm entire cohort at once</p>
          </div>
        </a>

        <a routerLink="/livestock/bulk-breeding" class="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3.5 hover:border-emerald-600/40 hover:shadow-sm transition-all group">
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold shadow-xs">
            <span class="material-symbols-outlined text-xl">favorite</span>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">Bulk Breeding &amp; Synchronization</h4>
            <p class="text-xs text-slate-500">Record AI straw batch exposure or pregnancy ultrasounds</p>
          </div>
        </a>

        <a routerLink="/livestock/bulk-accounting" class="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3.5 hover:border-emerald-600/40 hover:shadow-sm transition-all group">
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-[#012d1d] flex items-center justify-center font-bold shadow-xs">
            <span class="material-symbols-outlined text-xl">account_balance_wallet</span>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">Bulk Accounting &amp; Valuation</h4>
            <p class="text-xs text-slate-500">Capitalize feeding expenses or fair market valuation</p>
          </div>
        </a>
      </div>

      <!-- Cohorts Grid -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#012d1d]">density_medium</span>
            <h2 class="font-heading text-lg font-bold text-slate-900">Active Livestock Cohorts &amp; Production Batches</h2>
          </div>
          <span class="text-xs font-mono text-slate-500">Categorized by Housing Kraals &amp; Pens</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- Card 1: Replacement Heifer Cohort Alpha -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-emerald-600/50 transition-all">
            <div>
              <div class="flex justify-between items-start mb-3">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                  Breeding Heifers
                </span>
                <span class="font-mono text-xs font-bold text-slate-500">Kraal 04 &bull; Pen 12</span>
              </div>
              <h3 class="text-base font-bold text-slate-900">Replacement Heifer Alpha</h3>
              <p class="text-xs text-slate-500 mt-0.5">Spring 2024 Black Angus Maiden Heifers on growing TMR.</p>

              <div class="grid grid-cols-2 gap-2 my-4 bg-slate-50 p-3 rounded-xl font-mono text-xs">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Head Count</span>
                  <span class="font-bold text-slate-900">14 Head</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Mean Weight</span>
                  <span class="font-bold text-emerald-800">412.5 kg</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Health Gate</span>
                  <span class="font-bold text-emerald-800">100% Certified</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Pen Capacity</span>
                  <span class="font-bold text-slate-700">14 / 20 (70%)</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="font-mono text-slate-400">Oakridge Cadastre</span>
              <a routerLink="/livestock" class="font-bold text-emerald-800 hover:text-[#012d1d] hover:underline">View Animals &rarr;</a>
            </div>
          </div>

          <!-- Card 2: Broiler Flock Cobb 500 -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-emerald-600/50 transition-all">
            <div>
              <div class="flex justify-between items-start mb-3">
                <span class="px-2 py-0.5 bg-[#012d1d] text-white text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                  Broiler Meat Batch
                </span>
                <span class="font-mono text-xs font-bold text-slate-500">Shed 03 &bull; Bay A</span>
              </div>
              <h3 class="text-base font-bold text-slate-900">FLOCK-BR-2025-094</h3>
              <p class="text-xs text-slate-500 mt-0.5">Automated climate poultry house with automated auger feeding.</p>

              <div class="grid grid-cols-2 gap-2 my-4 bg-slate-50 p-3 rounded-xl font-mono text-xs">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Batch Quantity</span>
                  <span class="font-bold text-slate-900">5,000 Birds</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Day 14 Avg Wt</span>
                  <span class="font-bold text-emerald-800">460 grams</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">FCR Ratio</span>
                  <span class="font-bold text-emerald-800">1.48 (Target)</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Biosecure Cleanroom</span>
                  <span class="font-bold text-slate-700">Class 1 Confirmed</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="font-mono text-slate-400">Valley Aviary</span>
              <a routerLink="/livestock" class="font-bold text-emerald-800 hover:text-[#012d1d] hover:underline">View Batch &rarr;</a>
            </div>
          </div>

          <!-- Card 3: Honeybee Apiary Yard 4 -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-emerald-600/50 transition-all">
            <div>
              <div class="flex justify-between items-start mb-3">
                <span class="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                  Apiary Compound
                </span>
                <span class="font-mono text-xs font-bold text-slate-500">Apiary Alpha &bull; Row 02</span>
              </div>
              <h3 class="text-base font-bold text-slate-900">APIARY-HIVE-YARD-4</h3>
              <p class="text-xs text-slate-500 mt-0.5">Italian Honeybee colonies pollinating orchard and producing clover honey.</p>

              <div class="grid grid-cols-2 gap-2 my-4 bg-slate-50 p-3 rounded-xl font-mono text-xs">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Colonies Count</span>
                  <span class="font-bold text-slate-900">24 Hives</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Honey Yield Est.</span>
                  <span class="font-bold text-emerald-800">720 kg</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Varroa Mite Check</span>
                  <span class="font-bold text-emerald-800">Clean / Zero</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Queen Health</span>
                  <span class="font-bold text-slate-700">100% Active Brood</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="font-mono text-slate-400">West Orchard</span>
              <a routerLink="/livestock" class="font-bold text-emerald-800 hover:text-[#012d1d] hover:underline">View Apiary &rarr;</a>
            </div>
          </div>

          <!-- Card 4: Merino Ewe Mob Delta -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-emerald-600/50 transition-all">
            <div>
              <div class="flex justify-between items-start mb-3">
                <span class="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                  Sheep Wool &amp; Lambs
                </span>
                <span class="font-mono text-xs font-bold text-slate-500">Kraal Delta &bull; Pen 06</span>
              </div>
              <h3 class="text-base font-bold text-slate-900">Merino Ewe Mob Delta</h3>
              <p class="text-xs text-slate-500 mt-0.5">Purebred superfine fleece ewes with spring lambs at foot.</p>

              <div class="grid grid-cols-2 gap-2 my-4 bg-slate-50 p-3 rounded-xl font-mono text-xs">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Head Count</span>
                  <span class="font-bold text-slate-900">45 Ewes + Lambs</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Mean Micron</span>
                  <span class="font-bold text-emerald-800">18.2 µm</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Drench Protocol</span>
                  <span class="font-bold text-emerald-800">Current</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Paddock Cell</span>
                  <span class="font-bold text-slate-700">Paddock 06</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="font-mono text-slate-400">South Slope</span>
              <a routerLink="/livestock" class="font-bold text-emerald-800 hover:text-[#012d1d] hover:underline">View Mob &rarr;</a>
            </div>
          </div>

          <!-- Card 5: High-Yield Dairy Herd Alpha -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-emerald-600/50 transition-all">
            <div>
              <div class="flex justify-between items-start mb-3">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                  Dairy Milkers
                </span>
                <span class="font-mono text-xs font-bold text-slate-500">Kraal 02 &bull; Pen 04</span>
              </div>
              <h3 class="text-base font-bold text-slate-900">Lactation Parlor Milkers</h3>
              <p class="text-xs text-slate-500 mt-0.5">Twice-daily rotary parlor milking with inline somatic cell counters.</p>

              <div class="grid grid-cols-2 gap-2 my-4 bg-slate-50 p-3 rounded-xl font-mono text-xs">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Head Count</span>
                  <span class="font-bold text-slate-900">440 Head</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Daily Milk Yield</span>
                  <span class="font-bold text-emerald-800">32.4 L / cow</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">SCC Count</span>
                  <span class="font-bold text-emerald-800">92k (Grade A)</span>
                </div>
                <div class="mt-1">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Rumination</span>
                  <span class="font-bold text-slate-700">492 min/d</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="font-mono text-slate-400">Oakridge Main Hub</span>
              <a routerLink="/livestock" class="font-bold text-emerald-800 hover:text-[#012d1d] hover:underline">View Herd &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GroupsComponent {}
