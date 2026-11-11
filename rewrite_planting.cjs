const fs = require('fs');

const componentContent = `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CropService } from '../../../services/crop.service';

@Component({
  selector: 'app-planting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: \`
    <div class="p-6 max-w-8xl mx-auto space-y-8">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <lucide-icon name="calendar" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Planting Schedule</h1>
            <p class="text-sm text-slate-500">Manage crop varieties, planting dates, and estimated yields.</p>
          </div>
        </div>
        <button class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
          New Planting
        </button>
      </div>

      <!-- Top Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Area Planted -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="relative z-10">
            <p class="text-sm font-bold text-slate-500 mb-1">Total Area Planted</p>
            <div class="flex items-baseline gap-2 mb-2">
              <h2 class="text-4xl font-black text-slate-900">{{ totalPlantedArea()?.currentSeasonAreaHa || 0 }} <span class="text-lg font-normal text-slate-500">Ha</span></h2>
            </div>
            <p class="text-sm font-bold flex items-center gap-1"
               [ngClass]="totalPlantedArea()?.trend === 'INCREASE' ? 'text-emerald-500' : (totalPlantedArea()?.trend === 'DECREASE' ? 'text-red-500' : 'text-slate-500')">
              <lucide-icon [name]="totalPlantedArea()?.trend === 'INCREASE' ? 'trending-up' : (totalPlantedArea()?.trend === 'DECREASE' ? 'trending-down' : 'minus')" class="w-4 h-4"></lucide-icon>
              {{ totalPlantedArea()?.percentageChange || 0 }}% vs prev season
            </p>
          </div>
          <div class="absolute -bottom-4 -right-4 opacity-5 pointer-events-none text-emerald-500">
            <lucide-icon name="map" class="w-32 h-32"></lucide-icon>
          </div>
        </div>

        <!-- Active Crops -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="relative z-10">
            <p class="text-sm font-bold text-slate-500 mb-1">Active Crops</p>
            <div class="flex items-baseline gap-2 mb-3">
              <h2 class="text-4xl font-black text-slate-900">{{ activeCrops()?.totalActiveCycles || 0 }}</h2>
              <span class="text-sm font-medium text-slate-500">cycles</span>
            </div>
            <p class="text-sm font-bold text-slate-600 truncate">
              {{ activeCrops()?.activeCropNames?.join(', ') || 'None' }}
            </p>
          </div>
          <div class="absolute top-4 -right-4 opacity-5 pointer-events-none text-blue-500">
            <lucide-icon name="sprout" class="w-32 h-32"></lucide-icon>
          </div>
        </div>

        <!-- Approaching Harvest -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="relative z-10">
            <p class="text-sm font-bold text-slate-500 mb-1">Approaching Harvest (14 days)</p>
            <div class="flex items-baseline gap-2 mb-3">
              <h2 class="text-4xl font-black text-slate-900">{{ approachingHarvest()?.count || 0 }}</h2>
              <span class="text-sm font-medium text-slate-500">fields</span>
            </div>
            <p class="text-sm font-bold text-amber-600 flex items-center gap-1">
              <lucide-icon name="alert-triangle" class="w-4 h-4"></lucide-icon>
              Review harvest readiness
            </p>
          </div>
        </div>
      </div>

      <!-- Active Planting Cycles -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-800">Active Planting Cycles</h3>
          <button class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
            View All <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (cycle of activePlantingCycles(); track cycle.cycleId) {
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <lucide-icon name="sprout" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900">{{ cycle.varietyName }}</h4>
                      <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <lucide-icon name="map-pin" class="w-3 h-3"></lucide-icon> {{ cycle.fieldName }}
                      </p>
                    </div>
                  </div>
                  <span class="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wide">{{ cycle.currentStage }}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p class="text-[11px] font-medium text-slate-500 mb-1">Planted</p>
                    <p class="text-sm font-bold text-slate-900">{{ cycle.plantedDate | date }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] font-medium text-slate-500 mb-1">Est. Harvest</p>
                    <p class="text-sm font-bold text-slate-900">{{ cycle.expectedHarvestDate | date }}</p>
                  </div>
                </div>
                
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-slate-700">Cycle Progress</span>
                    <span class="text-xs font-bold text-emerald-600">{{ cycle.cycleProgressPercentage | number:'1.0-0' }}%</span>
                  </div>
                  <div class="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-600 rounded-full" [style.width.%]="cycle.cycleProgressPercentage"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Upcoming Schedule Table -->
      <div>
        <h3 class="text-lg font-bold text-slate-800 mb-4">Upcoming Schedule</h3>
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-6 py-4 font-bold text-slate-600">Planned Start</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Activity</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Crop Variety</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Target Field</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Est. Duration</th>
                  <th class="px-6 py-4 font-bold text-slate-600">Status</th>
                  <th class="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (schedule of upcomingSchedule(); track schedule.activityId) {
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 font-bold text-slate-900">{{ schedule.plannedStartDate | date }}</td>
                    <td class="px-6 py-4 font-medium text-slate-700">{{ schedule.activityTitle }}</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span class="font-medium text-slate-700">{{ schedule.cropVariety }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-slate-600">{{ schedule.targetField }}</td>
                    <td class="px-6 py-4 text-slate-600">{{ schedule.estimatedDuration }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs font-bold rounded-md"
                            [ngClass]="{
                              'bg-blue-50 text-blue-600': schedule.status === 'READY',
                              'bg-slate-100 text-slate-600': schedule.status === 'PENDING',
                              'bg-amber-50 text-amber-600': schedule.status === 'PLANNED'
                            }">
                        {{ schedule.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right text-slate-400">
                      <button class="hover:text-slate-600 transition-colors">
                        <lucide-icon name="more-vertical" class="w-4 h-4"></lucide-icon>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  \`
})
export class PlantingComponent {
  private cropService = inject(CropService);

  totalPlantedArea = toSignal(this.cropService.getTotalAreaPlanted());
  activeCrops = toSignal(this.cropService.getActiveCrops());
  approachingHarvest = toSignal(this.cropService.getApproachingHarvest());
  activePlantingCycles = toSignal(this.cropService.getActivePlantingCycles(), { initialValue: [] });
  upcomingSchedule = toSignal(this.cropService.getUpcomingSchedule(), { initialValue: [] });
}
`;

fs.writeFileSync('src/app/pages/crops/planting/planting.component.ts', componentContent);
console.log('rewrote planting.component.ts');
