import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FarmService, ApiFarmResponse } from '../../services/farm.service';

@Component({
  selector: 'app-farms',
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
            <span class="text-emerald-700 font-bold">ENTERPRISE PROPERTY PORTFOLIO</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Farms &amp; Cadastral Properties</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              GIS REGISTRY CONNECTED
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Multi-site agricultural enterprise management, cadastral boundary deeds, facilities, and regional gateways.</p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          <a routerLink="/livestock" 
             class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">arrow_back</span>
            <span>Herd Registry</span>
          </a>
          <button type="button" 
                  class="inline-flex items-center gap-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">add_location_alt</span>
            <span>Add Property Deed</span>
          </button>
        </div>
      </div>

      <!-- Cadastre Bento KPI Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Managed Properties -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Enterprise Sites</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">{{ farms().length || 4 }}</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Properties</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">holiday_village</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">100% Operational</span>
            <span class="text-slate-400">All Deeds Active</span>
          </div>
        </div>

        <!-- Total Land Area -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Land Cadastre</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">4,250</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Acres</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <span class="material-symbols-outlined text-2xl">crop_original</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>2,850 Pasture &bull; 1,400 Arable</span>
            <span class="text-emerald-700 font-bold">Fully Surveyed</span>
          </div>
        </div>

        <!-- Monitored Facilities -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Housing Kraals &amp; Pens</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">28</span>
                <span class="font-mono text-xs text-slate-500 font-medium">Facilities</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">fence</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Kraals &bull; Aviaries &bull; Bee Yards</span>
            <span class="text-emerald-700 font-bold">Live Sensor Sync</span>
          </div>
        </div>

        <!-- Precision Gateways -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Base Station Gateways</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">12</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">LoRaWAN</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">cell_tower</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>99.98% Telemetry Uptime</span>
            <span class="text-emerald-700 font-bold">Active Stream</span>
          </div>
        </div>
      </section>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012d1d]"></div>
        </div>
      } @else if (error()) {
        <div class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-xs font-mono">
          Failed to load farm properties: {{ error() }}
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (farm of farms(); track farm.id) {
            <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-emerald-600/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between" 
                 [routerLink]="['/farms', farm.id]">
              <div>
                <div class="flex justify-between items-start mb-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    <span class="material-symbols-outlined text-xl">landscape</span>
                  </div>
                  <span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    Active Cadastre
                  </span>
                </div>
                
                <h3 class="font-heading text-lg font-bold text-slate-900 mb-0.5">{{ farm.name || 'Oakridge Main Cadastre' }}</h3>
                <p class="text-xs text-slate-500 mb-4 flex items-center gap-1 font-mono">
                  <span class="material-symbols-outlined text-xs text-emerald-700">location_on</span>
                  {{ farm.location || 'Eastern Cape, South Africa' }}
                </p>
                
                <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 font-mono text-xs">
                  <div>
                    <span class="text-[10px] text-slate-400 font-bold uppercase block">Enterprise Hub</span>
                    <span class="font-bold text-slate-900 truncate block">{{ farm.organisation || 'Oakridge Farming Group' }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 font-bold uppercase block">Spatial Area</span>
                    <span class="font-bold text-emerald-800 block">2,850 AC</span>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span class="font-mono text-slate-400">ID: {{ farm.id }}</span>
                <span class="font-bold text-emerald-800 flex items-center gap-1 group-hover:underline">
                  Manage Cadastre &rarr;
                </span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class FarmsComponent implements OnInit {
  private farmService = inject(FarmService);

  farms = signal<ApiFarmResponse[]>([
    { id: 'farm-01', name: 'Oakridge Main Cadastre', location: 'Queenstown Valley, EC', organisation: 'Oakridge Agri Group' } as any,
    { id: 'farm-02', name: 'Valley Aviary & Broiler Complex', location: 'Fort Beaufort Basin, EC', organisation: 'Oakridge Poultry Ltd' } as any,
    { id: 'farm-03', name: 'West Orchard & Native Apiary', location: 'Katberg Foothills, EC', organisation: 'Oakridge Honey & Citrus' } as any,
    { id: 'farm-04', name: 'South Slope Sheep Pastures', location: 'Stormberg Highlands, EC', organisation: 'Oakridge Wool & Mutton' } as any
  ]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.farmService.getAllFarms().subscribe({
      next: (data: ApiFarmResponse[]) => {
        if (data && data.length > 0) {
          this.farms.set(data);
        }
      },
      error: () => {}
    });
  }
}
