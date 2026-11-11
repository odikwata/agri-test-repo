import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Locations Grid -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let location of locations" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-primary/50 transition-all group">
          <div class="p-6 border-b border-slate-200 flex justify-between items-start">
            <div class="flex flex-col gap-1">
              <h3 class="text-lg font-black text-slate-900 tracking-tight">{{ location.name }}</h3>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ location.type }}</p>
            </div>
            <div [class]="location.bgColor + ' p-3 rounded-xl group-hover:scale-110 transition-transform'">
              <lucide-icon [name]="location.icon" [class]="location.color + ' w-6 h-6'"></lucide-icon>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Items</span>
              <span class="text-sm font-black text-slate-900">{{ location.itemCount }} Items</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Capacity</span>
              <div class="flex items-center gap-2">
                <div class="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div [class]="location.color.replace('text', 'bg')" class="h-full" [style.width.%]="location.capacity"></div>
                </div>
                <span class="text-[10px] font-black text-slate-500">{{ location.capacity }}%</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest uppercase tracking-widest">Last Audit</span>
              <span class="text-xs font-bold text-slate-500">{{ location.lastAudit }}</span>
            </div>
          </div>
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <button [routerLink]="['/equipment/inventory/locations', location.id]" class="text-xs font-black text-primary hover:underline uppercase tracking-widest">View Storage Details</button>
            <div class="flex gap-2">
              <button class="p-1.5 hover:bg-white rounded-lg text-slate-400 transition-colors">
                <lucide-icon name="edit" class="w-3.5 h-3.5"></lucide-icon>
              </button>
              <button class="p-1.5 hover:bg-white rounded-lg text-red-400 transition-colors">
                <lucide-icon name="trash-2" class="w-3.5 h-3.5"></lucide-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Add New Location Card -->
        <button [routerLink]="['/equipment/inventory/locations/create']" class="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-4 hover:bg-slate-100 hover:border-primary/50 transition-all group min-h-[300px]">
          <div class="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
            <lucide-icon name="plus" class="w-8 h-8 text-primary"></lucide-icon>
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="text-lg font-black text-slate-900 tracking-tight">Add New Location</span>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Create a storage area</span>
          </div>
        </button>
      </section>
    </div>
  `
})
export class LocationsComponent {
  locations = [
    { id: 'LOC-1', name: 'Main Warehouse', type: 'Warehouse', itemCount: 450, capacity: 75, lastAudit: 'Oct 12, 2023', icon: 'warehouse', color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'LOC-2', name: 'Cold Storage 1', type: 'Refrigerated', itemCount: 120, capacity: 45, lastAudit: 'Oct 20, 2023', icon: 'thermometer-snowflake', color: 'text-cyan-500', bgColor: 'bg-cyan-50' },
    { id: 'LOC-3', name: 'Equipment Shed A', type: 'Shed', itemCount: 15, capacity: 90, lastAudit: 'Sep 30, 2023', icon: 'tractor', color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { id: 'LOC-4', name: 'Chemical Store', type: 'Hazardous', itemCount: 85, capacity: 30, lastAudit: 'Oct 05, 2023', icon: 'beaker', color: 'text-red-500', bgColor: 'bg-red-50' },
  ];
}
