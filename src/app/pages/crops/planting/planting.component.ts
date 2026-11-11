import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CropService } from '../../../services/crop.service';

@Component({
  selector: 'app-planting',
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
            <span class="text-emerald-700 font-bold">ARABLE AGRONOMY &amp; SEEDING PROTOCOLS</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Planting Schedules &amp; Crop Cadastre</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              AGRONOMIC TELEMETRY ACTIVE
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Manage crop varieties, precision seed drill calibration, soil moisture triggers, and estimated harvest yields.</p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          <a routerLink="/crops/planting/calendar" 
             class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">calendar_month</span>
            <span>Planting Calendar</span>
          </a>
          <a routerLink="/crops/new-planting" 
             class="inline-flex items-center gap-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Seeding Cycle</span>
          </a>
        </div>
      </div>

      <!-- Crops Bento KPI Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Area Planted -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Planted Cadastre</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">{{ totalPlantedArea()?.currentSeasonAreaHa || 840 }}</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Hectares</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">crop</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">+12% vs Prev Season</span>
            <span class="text-slate-400">14 Active Blocks</span>
          </div>
        </div>

        <!-- Active Crop Cycles -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Cycles</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">{{ activeCrops()?.totalActiveCycles || 6 }}</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Varieties</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <span class="material-symbols-outlined text-2xl">eco</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Silage Corn &bull; Lucerne &bull; Wheat</span>
            <span class="text-emerald-700 font-bold">Soybeans</span>
          </div>
        </div>

        <!-- Approaching Harvest -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Harvest Readiness (14d)</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">{{ approachingHarvest()?.count || 2 }}</span>
                <span class="font-mono text-xs text-amber-700 font-semibold">Blocks</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-amber-50 text-amber-900">
              <span class="material-symbols-outlined text-2xl">agriculture</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-amber-800 font-bold">Corn Silage Block 4</span>
            <span class="text-slate-400">Moisture 65%</span>
          </div>
        </div>

        <!-- Germination & Stand Count -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Germination Rate</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">96.2%</span>
                <span class="font-mono text-xs text-slate-500 font-medium">Stand Count</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">analytics</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Precision Seeded</span>
            <span class="text-emerald-700 font-bold">Drone Scanned</span>
          </div>
        </div>
      </section>

      <!-- Active Planting Cycles Grid -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#012d1d]">sprout</span>
            <h2 class="font-heading text-lg font-bold text-slate-900">Active Crop Planting Cycles</h2>
          </div>
          <a routerLink="/crops/planting/active" class="text-xs font-bold text-emerald-800 hover:text-[#012d1d] hover:underline flex items-center gap-1">
            View All Cycles &rarr;
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (cycle of activePlantingCycles(); track cycle.cycleId) {
            <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-emerald-600/50 transition-all">
              <div>
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                      <span class="material-symbols-outlined text-lg">potted_plant</span>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 text-sm">{{ cycle.varietyName }}</h4>
                      <span class="font-mono text-[11px] text-slate-500">{{ cycle.fieldName }}</span>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                    {{ cycle.currentStage }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-2 my-4 bg-slate-50 p-3 rounded-xl font-mono text-xs">
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase font-bold block">Planted Date</span>
                    <span class="font-bold text-slate-900">{{ cycle.plantedDate | date:'mediumDate' }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase font-bold block">Est. Harvest</span>
                    <span class="font-bold text-emerald-800">{{ cycle.expectedHarvestDate | date:'mediumDate' }}</span>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <div class="flex justify-between text-xs font-mono font-bold">
                    <span class="text-slate-500">Phenological Cycle Progress</span>
                    <span class="text-emerald-700">{{ cycle.cycleProgressPercentage | number:'1.0-0' }}%</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-[#012d1d] rounded-full" [style.width.%]="cycle.cycleProgressPercentage"></div>
                  </div>
                </div>
              </div>

              <!-- Cycle Details Link Footer -->
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[11px] font-mono text-slate-400">ID: #{{ cycle.cycleId }}</span>
                <a [routerLink]="['/planting-cycle', cycle.cycleId]"
                   class="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline">
                  <span>View More Details</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Upcoming Seeding Schedule Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-heading text-base font-bold text-slate-900">Upcoming Field Operations &amp; Seeding Schedule</h3>
            <p class="text-xs text-slate-500">Soil temperature and rainfall windows for planting execution</p>
          </div>
          <span class="font-mono text-[11px] text-slate-500 font-bold">Agronomic Work Plan</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/75 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <th class="py-3 px-4">Planned Date</th>
                <th class="py-3 px-4">Agronomic Activity</th>
                <th class="py-3 px-4">Crop Variety &amp; Seed Lot</th>
                <th class="py-3 px-4">Target Field Cadastre</th>
                <th class="py-3 px-4">Est. Duration</th>
                <th class="py-3 px-4">Status Gate</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              @for (schedule of upcomingSchedule(); track schedule.activityId) {
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-3.5 px-4 font-mono font-bold text-slate-900">{{ schedule.plannedStartDate | date:'mediumDate' }}</td>
                  <td class="py-3.5 px-4 font-bold text-slate-800">{{ schedule.activityTitle }}</td>
                  <td class="py-3.5 px-4">
                    <span class="font-mono text-emerald-800 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                      {{ schedule.cropVariety }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-slate-600">{{ schedule.targetField }}</td>
                  <td class="py-3.5 px-4 font-mono text-slate-600">{{ schedule.estimatedDuration }}</td>
                  <td class="py-3.5 px-4">
                    <span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold"
                          [ngClass]="{
                            'bg-blue-100 text-blue-900': schedule.status === 'READY',
                            'bg-slate-100 text-slate-800': schedule.status === 'PENDING',
                            'bg-amber-100 text-amber-900': schedule.status === 'PLANNED'
                          }">
                      {{ schedule.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right">
                    <a routerLink="/crops/planting/calendar" class="text-xs font-bold text-emerald-800 hover:text-[#012d1d] hover:underline cursor-pointer">
                      Details &rarr;
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PlantingComponent {
  private cropService = inject(CropService);

  totalPlantedArea = toSignal(this.cropService.getTotalAreaPlanted());
  activeCrops = toSignal(this.cropService.getActiveCrops());
  approachingHarvest = toSignal(this.cropService.getApproachingHarvest());
  activePlantingCycles = toSignal(this.cropService.getActivePlantingCycles(), { initialValue: [] });
  upcomingSchedule = toSignal(this.cropService.getUpcomingSchedule(), { initialValue: [] });
}
