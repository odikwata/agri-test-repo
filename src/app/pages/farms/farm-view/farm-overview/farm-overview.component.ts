import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ActivatedRoute } from '@angular/router';
import { FarmService, ApiFarmResponse } from '../../../../services/farm.service';

@Component({
  selector: 'app-farm-overview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (loading()) {
      <div class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    } @else if (error()) {
      <div class="bg-red-50 text-red-600 p-4 rounded-lg">
        {{ error() }}
      </div>
    } @else if (farm()) {
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <lucide-icon name="map" class="w-5 h-5"></lucide-icon>
            </div>
            <h3 class="text-sm font-medium text-gray-500">Coordinates</h3>
          </div>
          <p class="text-lg font-bold text-gray-900">{{ farm()?.latitude | number:'1.2-4' }}, {{ farm()?.longitude | number:'1.2-4' }}</p>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <lucide-icon name="paw-print" class="w-5 h-5"></lucide-icon>
            </div>
            <h3 class="text-sm font-medium text-gray-500">Species Types</h3>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ farm()?.species?.length || 0 }}</p>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <lucide-icon name="building-2" class="w-5 h-5"></lucide-icon>
            </div>
            <h3 class="text-sm font-medium text-gray-500">Organisation</h3>
          </div>
          <p class="text-lg font-bold text-gray-900 truncate" [title]="farm()?.organisation">{{ farm()?.organisation || 'N/A' }}</p>
        </div>
      </div>
      
      <div class="mt-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Farm Details</h2>
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <dl class="divide-y divide-gray-200">
            <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Farm Name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ farm()?.name || 'Unnamed Farm' }}</dd>
            </div>
            <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Fields/Paddocks</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ farm()?.location || 'Unknown Location' }}</dd>
            </div>
            <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Organisation</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ farm()?.organisation || 'N/A' }}</dd>
            </div>
            <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Coordinates</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Lat: {{ farm()?.latitude }} <br/> Lng: {{ farm()?.longitude }}
              </dd>
            </div>
            <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Species</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div class="flex flex-wrap gap-2">
                  @for (specie of farm()?.species; track specie.id) {
                    <span class="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
                      {{ specie.commonName }}
                      <span class="text-slate-400 ml-1 italic">{{ specie.scientificName }}</span>
                    </span>
                  }
                  @if (!farm()?.species?.length) {
                    <span class="text-gray-500">No species registered</span>
                  }
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    }
  `
})
export class FarmOverviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private farmService = inject(FarmService);

  farm = signal<ApiFarmResponse | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log("Farm ID:", id); this.fetchFarmDetails(id);
      } else {
        this.error.set('No farm ID provided.');
        this.loading.set(false);
      }
    });
  }

  fetchFarmDetails(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.farmService.getFarmById(id).subscribe({
      next: (data) => {
        this.farm.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load farm details', err);
        this.error.set('Failed to load farm details.');
        this.loading.set(false);
      }
    });
  }
}
