import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Farm } from '../../../models/farm.model';

@Component({
  selector: 'app-edit-farm-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-xl bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Edit Farm</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-500">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>
        
        <form [formGroup]="farmForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
              <input type="text" formControlName="name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" formControlName="location" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Size (Acres)</label>
              <input type="number" formControlName="size" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select formControlName="status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" [disabled]="!farmForm.valid" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EditFarmModalComponent implements OnInit {
  @Input() farm!: Farm;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Farm>>();
  
  farmForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.farmForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      size: [0, [Validators.required, Validators.min(1)]],
      status: ['active', Validators.required]
    });
  }
  
  ngOnInit() {
    if (this.farm) {
      this.farmForm.patchValue({
        name: this.farm.name,
        location: this.farm.location,
        size: this.farm.size,
        status: this.farm.status
      });
    }
  }
  
  onSubmit() {
    if (this.farmForm.valid) {
      this.save.emit(this.farmForm.value);
    }
  }
}
