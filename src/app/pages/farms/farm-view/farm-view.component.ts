import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { EditFarmModalComponent } from './edit-farm-modal.component';
import { FarmService, ApiFarmResponse } from '../../../services/farm.service';

@Component({
  selector: 'app-farm-view',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, EditFarmModalComponent],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-6 flex justify-between items-center">
        <div>
          <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <a routerLink="/farms" class="hover:text-indigo-600 flex items-center gap-1">
              <lucide-icon name="arrow-left" class="w-4 h-4"></lucide-icon>
              Farms
            </a>
            <span>/</span>
            <span>{{ farm()?.name || 'Loading...' }}</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">{{ farm()?.name || 'Farm Details' }}</h1>
        </div>
        <button (click)="isEditModalOpen.set(true)" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2">
          <lucide-icon name="pencil" class="w-4 h-4"></lucide-icon>
          Edit Farm
        </button>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px" aria-label="Tabs">
            @for (tab of tabs; track tab.id) {
              <a [routerLink]="['/farms', farmId(), tab.id]"
                 routerLinkActive="border-indigo-500 text-indigo-600"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent">
                {{ tab.name }}
              </a>
            }
          </nav>
        </div>
        
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
    
    @if (isEditModalOpen() && farm()) {
      <app-edit-farm-modal 
        [farm]="farm()!"
        (close)="isEditModalOpen.set(false)"
        (save)="onSaveFarm($event)">
      </app-edit-farm-modal>
    }
  `
})
export class FarmViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private farmService = inject(FarmService);

  isEditModalOpen = signal(false);
  farm = signal<any | null>(null);
  farmId = signal<string>('');
  
  tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'locations', name: 'Locations' },
    { id: 'species', name: 'Species' }
  ];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.farmId.set(id);
        this.farmService.getFarmById(id).subscribe({
          next: (data) => this.farm.set(data),
          error: (err) => console.error('Error fetching farm details', err)
        });
      }
    });
  }

  onSaveFarm(updatedData: any) {
    this.farm.update(current => {
      if (!current) return current;
      return { ...current, ...updatedData };
    });
    this.isEditModalOpen.set(false);
  }
}
