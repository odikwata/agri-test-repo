import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-location-create',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto flex flex-col gap-8">
      <!-- Header -->
      <section class="flex items-center gap-4">
        <button routerLink="/equipment/inventory/locations" class="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
          <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
        </button>
        <div class="flex flex-col gap-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight tracking-tight">Create New Storage Location</h1>
          <p class="text-slate-500 text-sm font-medium">Define a new area for storing your farm inventory</p>
        </div>
      </section>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form [formGroup]="locationForm" (ngSubmit)="onSubmit()" class="p-8 flex flex-col gap-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Location Name</label>
              <input type="text" formControlName="name" placeholder="e.g. Main Warehouse" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Storage Type</label>
              <select formControlName="type" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                <option value="">Select Type</option>
                <option value="warehouse">Warehouse</option>
                <option value="cold-storage">Cold Storage</option>
                <option value="shed">Shed</option>
                <option value="silo">Silo</option>
                <option value="hazardous">Hazardous Materials Store</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider uppercase tracking-wider">Description / Notes</label>
            <textarea formControlName="description" rows="3" placeholder="Enter details about this location..." class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider uppercase tracking-wider tracking-wider">Capacity (Optional)</label>
              <div class="relative">
                <input type="number" formControlName="capacity" placeholder="100" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider uppercase tracking-wider tracking-wider tracking-wider">Manager / Responsible Person</label>
              <input type="text" formControlName="manager" placeholder="e.g. John Doe" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-8 border-t border-slate-100">
            <button type="button" routerLink="/equipment/inventory/locations" class="px-6 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" [disabled]="locationForm.invalid" class="px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-sm transition-colors">Create Location</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LocationCreateComponent {
  locationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      capacity: [100, [Validators.min(0), Validators.max(100)]],
      manager: ['']
    });
  }

  onSubmit() {
    if (this.locationForm.valid) {
      console.log('Location created:', this.locationForm.value);
    }
  }
}
