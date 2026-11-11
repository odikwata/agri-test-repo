import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventory',
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
            <span class="text-emerald-700 font-bold">FLEET &amp; PRECISION MACHINERY</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Farm Machinery &amp; Resource Inventory</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              CAN-BUS TELEMETRY ONLINE
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Tractors, automated feed mixers, combine harvesters, pivot irrigators, and precision IoT implements.</p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          <a [routerLink]="['create']" 
             class="inline-flex items-center gap-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Machinery Asset</span>
          </a>
          <a [routerLink]="['/livestock']" 
             class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">arrow_back</span>
            <span>Herd Registry</span>
          </a>
        </div>
      </div>

      <!-- Fleet KPI Bento Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Equipment Fleet -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Fleet Assets</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">48</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Units</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">agriculture</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">42 Operational</span>
            <span class="text-slate-400">6 In Maintenance</span>
          </div>
        </div>

        <!-- Active in Field -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Telemetry Units</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">18</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">In Field</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <span class="material-symbols-outlined text-2xl">gps_fixed</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Paddocks &bull; Feed Hub</span>
            <span class="text-emerald-700 font-bold">GPS Geofenced</span>
          </div>
        </div>

        <!-- Fuel Efficiency -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mean Diesel Economy</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">14.2</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">L / hr</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">local_gas_station</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">-8% vs Last Quarter</span>
            <span class="text-slate-400">Sensor Tuned</span>
          </div>
        </div>

        <!-- Maintenance Health Score -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Service Health Score</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">94.8%</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Optimal</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">build_circle</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>2 Due Routine 250h</span>
            <span class="text-emerald-700 font-bold">Workshop Ready</span>
          </div>
        </div>
      </section>

      <!-- Navigation Tabs Styled like Livestock Register -->
      <div class="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200/80 flex items-center gap-1 overflow-x-auto">
        <a [routerLink]="['list']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           [routerLinkActiveOptions]="{exact: true}"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">list_alt</span>
          <span>Machinery Inventory Directory</span>
        </a>
        <a [routerLink]="['locations']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">garage</span>
          <span>Depot &amp; Shed Locations</span>
        </a>
      </div>

      <router-outlet></router-outlet>
    </div>
  `
})
export class InventoryComponent {}
