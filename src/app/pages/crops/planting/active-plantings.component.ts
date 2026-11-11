import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CropService } from '../../../services/crop.service';

@Component({
  selector: 'app-active-plantings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="p-6 max-w-8xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button routerLink="/crops/planting" class="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors">
            <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
          </button>
          <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <lucide-icon name="sprout" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Active Plantings</h1>
            <p class="text-sm text-slate-500">All current planting cycles across your fields.</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button routerLink="/crops/new-planting" class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            New Planting
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[11px] font-mono text-slate-400">ID: #{{ cycle.cycleId }}</span>
                <span class="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group-hover:underline">
                  <span>View More Details</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
            
            <a [routerLink]="['/planting-cycle', cycle.cycleId]" class="absolute inset-0 z-20" title="View more details of the planting cycle"></a>
          </div>
        } @empty {
          <div class="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <lucide-icon name="sprout" class="w-8 h-8"></lucide-icon>
            </div>
            <p class="font-medium text-slate-900 mb-1">No active plantings</p>
            <p class="text-sm">You don't have any active planting cycles at the moment.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ActivePlantingsComponent {
  private cropService = inject(CropService);
  activePlantingCycles = toSignal(this.cropService.getActivePlantingCycles(), { initialValue: [] });
}
