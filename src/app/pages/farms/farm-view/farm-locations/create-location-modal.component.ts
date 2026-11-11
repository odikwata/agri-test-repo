import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-create-location-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-xl bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Add Location</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-500">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>
        
        <form [formGroup]="locationForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
              <input type="text" formControlName="name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select formControlName="type" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="Pasture">Pasture</option>
                <option value="Barn">Barn</option>
                <option value="Field">Field</option>
                <option value="Pen">Pen</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" formControlName="capacity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" [disabled]="!locationForm.valid" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateLocationModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  
  locationForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      type: ['Pasture', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]]
    });
  }
  
  onSubmit() {
    if (this.locationForm.valid) {
      this.save.emit(this.locationForm.value);
    }
  }
}
