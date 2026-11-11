import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FarmSpecies } from '../../../../models/farm.model';
import { AddSpeciesModalComponent } from './add-species-modal.component';

@Component({
  selector: 'app-farm-species',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AddSpeciesModalComponent],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-900">Species</h2>
      <button (click)="isModalOpen.set(true)" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm">
        <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
        Add Species
      </button>
    </div>

    <div class="overflow-x-auto bg-white border border-gray-200 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          @for (species of farmSpecies(); track species.id) {
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <lucide-icon name="paw-print" class="w-4 h-4"></lucide-icon>
                  </div>
                  {{ species.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ species.count }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button class="text-red-600 hover:text-red-900">Remove</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    @if (isModalOpen()) {
      <app-add-species-modal 
        (close)="isModalOpen.set(false)"
        (save)="onSaveSpecies($event)">
      </app-add-species-modal>
    }
  `
})
export class FarmSpeciesComponent {
  isModalOpen = signal(false);
  farmSpecies = signal<FarmSpecies[]>([
    { id: 'fs1', farmId: 'f1', speciesId: 's1', name: 'Cattle', count: 450 },
    { id: 'fs2', farmId: 'f1', speciesId: 's2', name: 'Sheep', count: 790 }
  ]);

  onSaveSpecies(speciesData: any) {
    const newSpecies: FarmSpecies = {
      id: Math.random().toString(36).substring(2, 9),
      farmId: 'f1',
      speciesId: speciesData.speciesId,
      name: speciesData.name,
      count: speciesData.count
    };
    
    this.farmSpecies.update(species => [...species, newSpecies]);
    this.isModalOpen.set(false);
  }
}
