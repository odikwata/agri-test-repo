import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Stats Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div *ngFor="let stat of stats" class="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div [class]="stat.bgColor + ' p-2 rounded-lg'">
                <lucide-icon [name]="stat.icon" [class]="stat.color + ' w-4 h-4'"></lucide-icon>
              </div>
              <p class="text-slate-500 text-xs font-bold uppercase tracking-wider">{{ stat.label }}</p>
            </div>
          </div>
          <div class="mt-2">
            <p class="text-slate-900 text-2xl font-black leading-tight">{{ stat.value }} <span class="text-xs font-normal text-slate-400">{{ stat.unit }}</span></p>
            <p [class]="stat.color + ' text-xs font-bold mt-1'">{{ stat.total }} Total</p>
          </div>
        </div>
      </section>

      <!-- Table Section -->
      <section class="flex flex-col gap-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 class="text-lg font-black text-slate-900 tracking-tight">Inventory Detailed List</h3>
          <div class="flex gap-2">
            <button class="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <lucide-icon name="filter" class="w-4 h-4"></lucide-icon>
            </button>
            <button class="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Name</th>
                <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</th>
                <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Reorder Level</th>
                <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</th>
                <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr *ngFor="let item of inventoryItems" [routerLink]="['/equipment/inventory/view', item.id]" class="hover:bg-slate-50 transition-colors cursor-pointer">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-900">{{ item.name }}</span>
                    <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ID: {{ item.id }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="item.categoryColor + ' px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest'">
                    {{ item.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="item.stockLevel <= item.reorderLevel ? 'text-red-500' : 'text-slate-900'" class="text-sm font-black">
                    {{ item.stockLevel }} {{ item.unit }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                  {{ item.reorderLevel }} {{ item.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                  {{ item.unitPrice | currency:'USD':'symbol':'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-black">
                  {{ item.stockLevel * item.unitPrice | currency:'USD':'symbol':'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="item.stockLevel <= item.reorderLevel ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'" class="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {{ item.stockLevel <= item.reorderLevel ? 'Low Stock' : 'In Stock' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p class="text-xs text-slate-500 font-medium tracking-tight">Showing 5 of 1,240 items</p>
          <div class="flex gap-1">
            <button class="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Previous</button>
            <button class="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold shadow-sm">1</button>
            <button class="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">2</button>
            <button class="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Next</button>
          </div>
        </div>
      </section>
    </div>
  `
})
export class InventoryListComponent {
  stats = [
    { label: 'Equipment', value: '124', unit: 'Items', total: '$45,000', icon: 'tractor', color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Vaccines', value: '450', unit: 'Units', total: '$12,000', icon: 'syringe', color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { label: 'Fertilizers', value: '2,500', unit: 'kg', total: '$8,500', icon: 'zap', color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { label: 'Pesticides', value: '120', unit: 'L', total: '$3,200', icon: 'beaker', color: 'text-red-500', bgColor: 'bg-red-50' },
    { label: 'Fungicides', value: '85', unit: 'L', total: '$2,100', icon: 'sprout', color: 'text-green-500', bgColor: 'bg-green-50' },
  ];

  inventoryItems = [
    { id: 'EQ-10293', name: 'John Deere 5075E Tractor', category: 'Equipment', categoryColor: 'bg-blue-50 text-blue-600', stockLevel: 5, reorderLevel: 2, unit: 'Units', unitPrice: 35000, status: 'In Stock' },
    { id: 'VC-4421', name: 'Bovilis BVD Vaccine', category: 'Vaccines', categoryColor: 'bg-purple-50 text-purple-600', stockLevel: 10, reorderLevel: 25, unit: 'Units', unitPrice: 45, status: 'Low Stock' },
    { id: 'FR-9912', name: 'Nitrogen Urea Fertilizer', category: 'Fertilizers', categoryColor: 'bg-orange-50 text-orange-600', stockLevel: 500, reorderLevel: 1000, unit: 'kg', unitPrice: 2, status: 'Low Stock' },
    { id: 'PS-2201', name: 'Roundup Herbicide', category: 'Pesticides', categoryColor: 'bg-red-50 text-red-600', stockLevel: 60, reorderLevel: 20, unit: 'L', unitPrice: 15, status: 'In Stock' },
    { id: 'FG-1182', name: 'Copper Oxychloride', category: 'Fungicides', categoryColor: 'bg-green-50 text-green-600', stockLevel: 85, reorderLevel: 25, unit: 'L', unitPrice: 24.70, status: 'In Stock' },
  ];
}
