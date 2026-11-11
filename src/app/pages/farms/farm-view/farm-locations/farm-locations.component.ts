import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FarmLocation } from '../../../../models/farm.model';
import { CreateLocationModalComponent } from './create-location-modal.component';

@Component({
  selector: 'app-farm-locations',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CreateLocationModalComponent],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-900">Locations</h2>
      <button (click)="isModalOpen.set(true)" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm">
        <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
        Add Location
      </button>
    </div>

    <div class="overflow-x-auto bg-white border border-gray-200 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          @for (location of locations(); track location.id) {
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <lucide-icon name="map-pin" class="w-4 h-4"></lucide-icon>
                  </div>
                  {{ location.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ location.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ location.capacity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    @if (isModalOpen()) {
      <app-create-location-modal 
        (close)="isModalOpen.set(false)"
        (save)="onSaveLocation($event)">
      </app-create-location-modal>
    }
  `
})
export class FarmLocationsComponent {
  isModalOpen = signal(false);
  locations = signal<FarmLocation[]>([
    { id: 'l1', farmId: 'f1', name: 'North Pasture', type: 'Pasture', capacity: 500 },
    { id: 'l2', farmId: 'f1', name: 'South Barn', type: 'Barn', capacity: 200 },
    { id: 'l3', farmId: 'f1', name: 'East Field', type: 'Field', capacity: 300 }
  ]);

  onSaveLocation(locationData: any) {
    const newLocation: FarmLocation = {
      id: Math.random().toString(36).substring(2, 9),
      farmId: 'f1',
      name: locationData.name,
      type: locationData.type,
      capacity: locationData.capacity
    };
    
    this.locations.update(locs => [...locs, newLocation]);
    this.isModalOpen.set(false);
  }
}
