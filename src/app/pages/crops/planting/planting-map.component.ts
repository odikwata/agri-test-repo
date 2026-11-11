import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-planting-map',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="p-6 max-w-8xl mx-auto space-y-8 h-[calc(100vh-80px)] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button routerLink="/crops/planting" class="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors">
            <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
          </button>
          <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <lucide-icon name="map" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Planting Map</h1>
            <p class="text-sm text-slate-500">Geospatial view of active planting cycles across fields.</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">
            <lucide-icon name="filter" class="w-4 h-4"></lucide-icon>
            Filter
          </button>
        </div>
      </div>

      <!-- Map Container -->
      <div class="flex-1 bg-white rounded-2xl border border-slate-200 relative overflow-hidden shadow-sm flex items-center justify-center">
        <!-- Placeholder for actual map integration -->
        <div class="text-center text-slate-400">
          <lucide-icon name="map" class="w-16 h-16 mx-auto mb-4 opacity-50"></lucide-icon>
          <p class="font-medium text-lg text-slate-600 mb-1">Map View Available</p>
          <p class="text-sm">Map integration goes here.</p>
        </div>
      </div>
    </div>
  `
})
export class PlantingMapComponent {}
