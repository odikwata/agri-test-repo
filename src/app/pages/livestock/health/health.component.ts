import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-health',
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
            <span class="text-emerald-700 font-bold">VETERINARY &amp; BIOSECURITY PROTOCOLS</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Herd Health &amp; Veterinary Biometrics</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              BIOSECURITY GATE CERTIFIED
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Clinical vitals tracking, quarantine surveillance, vaccine dispensation schedules, and lab diagnostic histories.</p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          <a [routerLink]="['/livestock/health/status/bulk']" 
             class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">health_and_safety</span>
            <span>Bulk Health Exam</span>
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
        <a [routerLink]="['./status']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           [routerLinkActiveOptions]="{exact: true}"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">monitor_heart</span>
          <span>Health Status &amp; Vitals</span>
        </a>
        <a [routerLink]="['./vaccination']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">vaccines</span>
          <span>Vaccination Schedule</span>
        </a>
        <a [routerLink]="['./lab']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">biotech</span>
          <span>Lab Diagnostics</span>
        </a>
        <a [routerLink]="['./programmes']"
           routerLinkActive="bg-[#012d1d] text-white shadow-xs font-bold"
           class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">assignment</span>
          <span>Treatment Programmes</span>
        </a>
      </div>

      <router-outlet></router-outlet>
    </div>
  `
})
export class HealthComponent {}
