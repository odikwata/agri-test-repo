import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UpdateStockModalComponent } from './modals/update-stock-modal.component';
import { EditItemModalComponent } from './modals/edit-item-modal.component';

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, UpdateStockModalComponent, EditItemModalComponent],
  template: `
    <div class="mx-auto flex flex-col gap-8 pb-12">
      <!-- Modals -->
      <app-update-stock-modal 
        *ngIf="showStockModal()" 
        [itemName]="item.name" 
        [currentStock]="item.stockLevel" 
        [unit]="item.unit"
        (close)="showStockModal.set(false)"
        (submit)="handleStockUpdate($event)">
      </app-update-stock-modal>

      <app-edit-item-modal
        *ngIf="showEditModal()"
        [item]="item"
        (close)="showEditModal.set(false)"
        (submit)="handleItemEdit($event)">
      </app-edit-item-modal>

      <!-- Header -->
      <section class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <button routerLink="/equipment/inventory/list" class="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
          </button>
          <div class="flex flex-col gap-1">
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">{{ item.name }}</h1>
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {{ item.id }}</span>
              <span [class]="item.categoryColor + ' px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest'">
                {{ item.category }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button (click)="showEditModal.set(true)" class="flex items-center justify-center rounded-lg h-10 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors shadow-sm">
            <lucide-icon name="edit" class="w-4 h-4 mr-2"></lucide-icon>
            Edit Item
          </button>
          <button (click)="showStockModal.set(true)" class="flex items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors shadow-sm">
            <lucide-icon name="plus" class="w-4 h-4 mr-2"></lucide-icon>
            Update Stock
          </button>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content (Left) -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          <!-- Item Details Card -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-200">
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Item Overview</h3>
            </div>
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</span>
                  <p class="text-sm text-slate-600 leading-relaxed">{{ item.description }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage Location</span>
                  <div class="flex items-center gap-2 text-sm text-slate-900 font-bold">
                    <lucide-icon name="map-pin" class="w-4 h-4 text-primary"></lucide-icon>
                    {{ item.location }}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-slate-50 rounded-xl flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-widest">Current Stock</span>
                  <p class="text-xl font-black text-slate-900">{{ item.stockLevel }} <span class="text-xs font-normal text-slate-500">{{ item.unit }}</span></p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-widest">Unit Price</span>
                  <p class="text-xl font-black text-slate-900">{{ item.unitPrice | currency }}</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-widest">Total Value</span>
                  <p class="text-xl font-black text-slate-900">{{ item.stockLevel * item.unitPrice | currency }}</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-widest tracking-widest">Reorder Level</span>
                  <p class="text-xl font-black text-red-500">{{ item.reorderLevel }} <span class="text-xs font-normal text-slate-500">{{ item.unit }}</span></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Stock History Card -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Stock History</h3>
              <button class="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                    <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</th>
                    <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Updated By</th>
                    <th class="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                  <tr *ngFor="let history of stockHistory" class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{{ history.date }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="history.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'" class="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {{ history.type }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">{{ history.quantity }} {{ item.unit }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{{ history.user }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">{{ history.notes }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sidebar (Right) -->
        <div class="flex flex-col gap-8">
          <!-- Accounting Info Card -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-200">
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Accounting Info</h3>
            </div>
            <div class="p-6 flex flex-col gap-4">
              <div class="flex justify-between items-center py-2 border-b border-slate-50">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Purchase Date</span>
                <span class="text-sm font-bold text-slate-900">Oct 12, 2023</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-slate-50">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Supplier</span>
                <span class="text-sm font-bold text-slate-900">AgriCorp Solutions</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-slate-50">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Warranty Exp.</span>
                <span class="text-sm font-bold text-slate-900">Oct 12, 2025</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Asset Value</span>
                <span class="text-sm font-black text-primary">$35,000.00</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-200">
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Quick Actions</h3>
            </div>
            <div class="p-4 flex flex-col gap-2">
              <button class="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all text-left group">
                <div class="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <lucide-icon name="file-text" class="w-4 h-4 text-blue-600"></lucide-icon>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-900">Print Label</span>
                  <span class="text-[10px] text-slate-400 font-medium uppercase tracking-widest tracking-widest">Generate barcode label</span>
                </div>
              </button>
              <button class="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all text-left group">
                <div class="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <lucide-icon name="share-2" class="w-4 h-4 text-purple-600"></lucide-icon>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-900">Transfer Stock</span>
                  <span class="text-[10px] text-slate-400 font-medium uppercase tracking-widest tracking-widest">Move to another location</span>
                </div>
              </button>
              <button class="flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-all text-left group">
                <div class="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                  <lucide-icon name="trash-2" class="w-4 h-4 text-red-600"></lucide-icon>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-red-600">Delete Item</span>
                  <span class="text-[10px] text-red-400 font-medium uppercase tracking-widest tracking-widest">Remove from inventory</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InventoryDetailComponent {
  item = {
    id: 'EQ-10293',
    name: 'John Deere 5075E Tractor',
    category: 'Equipment',
    categoryColor: 'bg-blue-50 text-blue-600',
    description: 'Versatile utility tractor designed for various farm tasks including plowing, sowing, and transport. Features a 75hp engine and 4WD.',
    stockLevel: 5,
    reorderLevel: 2,
    unit: 'Units',
    unitPrice: 35000,
    location: 'Main Warehouse - Section A4',
    status: 'In Stock'
  };

  stockHistory = [
    { date: 'Oct 24, 2023', type: 'IN', quantity: 2, user: 'John Doe', notes: 'New purchase arrival' },
    { date: 'Oct 15, 2023', type: 'OUT', quantity: 1, user: 'Sarah Smith', notes: 'Assigned to Field 3' },
    { date: 'Sep 30, 2023', type: 'IN', quantity: 4, user: 'John Doe', notes: 'Initial stock entry' },
  ];

  showStockModal = signal(false);
  showEditModal = signal(false);

  constructor(private route: ActivatedRoute) {}

  handleStockUpdate(data: any) {
    console.log('Stock update:', data);
    // In a real app, we'd call a service here
    if (data.type === 'IN') {
      this.item.stockLevel += data.quantity;
    } else {
      this.item.stockLevel -= data.quantity;
    }
    this.stockHistory.unshift({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: data.type,
      quantity: data.quantity,
      user: 'Current User',
      notes: data.notes || data.reason
    });
    this.showStockModal.set(false);
  }

  handleItemEdit(data: any) {
    console.log('Item edit:', data);
    this.item = { ...this.item, ...data };
    this.showEditModal.set(false);
  }
}
