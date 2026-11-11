import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feed',
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
            <span class="text-emerald-700 font-bold">NUTRITION &amp; RATION DISPENSATION</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Feed Inventory &amp; Nutrition Telemetry</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              SILO LEVEL SENSORS ACTIVE
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Automated total mixed ration (TMR) formulation, bulk commodity silo monitoring, and batch dispensation tracking.</p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          <a [routerLink]="['/livestock/log-feeding']" 
             class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">restaurant</span>
            <span>Log Feeding Event</span>
          </a>
          <a [routerLink]="['/livestock']" 
             class="inline-flex items-center gap-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">pets</span>
            <span>Herd Registry</span>
          </a>
        </div>
      </div>

      <!-- Navigation Tabs Styled like Livestock Register -->
      <div class="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200/80 flex items-center gap-1 overflow-x-auto">
        <a [routerLink]="['./inventory']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           [routerLinkActiveOptions]="{exact: true}"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">inventory_2</span>
          <span>Silo Stock Inventory</span>
        </a>
        <a [routerLink]="['./schedules']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">schedule</span>
          <span>Feeding Schedules</span>
        </a>
        <a [routerLink]="['./nutrition']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">nutrition</span>
          <span>Ration Formulations</span>
        </a>
        <a [routerLink]="['./programmes']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">assignment</span>
          <span>Feed Programmes</span>
        </a>
      </div>

      <router-outlet></router-outlet>
    </div>
  `
})
export class FeedComponent {}
