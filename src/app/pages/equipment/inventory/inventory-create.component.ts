import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory-create',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto flex flex-col gap-8">
      <!-- Header -->
      <section class="flex items-center gap-4">
        <button routerLink="/equipment/inventory/list" class="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
          <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
        </button>
        <div class="flex flex-col gap-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight tracking-tight">Add New Inventory Item</h1>
          <p class="text-slate-500 text-sm font-medium">Enter details for the new item in your inventory</p>
        </div>
      </section>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form [formGroup]="inventoryForm" (ngSubmit)="onSubmit()" class="p-8 flex flex-col gap-8">
          <!-- Basic Info -->
          <div class="flex flex-col gap-6">
            <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Item Name</label>
                <input type="text" formControlName="name" placeholder="e.g. John Deere Tractor" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                <select formControlName="category" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                  <option value="">Select Category</option>
                  <option value="equipment">Equipment</option>
                  <option value="vaccines">Vaccines</option>
                  <option value="fertilizers">Fertilizers</option>
                  <option value="pesticides">Pesticides</option>
                  <option value="fungicides">Fungicides</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
              <textarea formControlName="description" rows="3" placeholder="Enter item description..." class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></textarea>
            </div>
          </div>

          <!-- Stock & Pricing -->
          <div class="flex flex-col gap-6 pt-8 border-t border-slate-100">
            <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">Stock & Pricing</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Initial Stock</label>
                <input type="number" formControlName="stockLevel" placeholder="0" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Unit (e.g. kg, L, Units)</label>
                <input type="text" formControlName="unit" placeholder="Units" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Reorder Level</label>
                <input type="number" formControlName="reorderLevel" placeholder="10" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Unit Price ($)</label>
                <input type="number" formControlName="unitPrice" placeholder="0.00" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Storage Location</label>
                <select formControlName="location" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                  <option value="">Select Location</option>
                  <option value="warehouse-a">Warehouse A</option>
                  <option value="cold-storage-1">Cold Storage 1</option>
                  <option value="shed-3">Shed 3</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-8 border-t border-slate-100">
            <button type="button" routerLink="/equipment/inventory/list" class="px-6 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" [disabled]="inventoryForm.invalid" class="px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-sm transition-colors">Save Item</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class InventoryCreateComponent {
  inventoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      stockLevel: [0, [Validators.required, Validators.min(0)]],
      unit: ['Units', Validators.required],
      reorderLevel: [10, [Validators.required, Validators.min(0)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.inventoryForm.valid) {
      console.log('Form submitted:', this.inventoryForm.value);
      // Handle submission logic
    }
  }
}
