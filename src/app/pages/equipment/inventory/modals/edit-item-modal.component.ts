import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-item-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-xl">
              <lucide-icon name="edit" class="w-5 h-5 text-primary"></lucide-icon>
            </div>
            <h3 class="text-xl font-black text-slate-900 tracking-tight">Edit Inventory Item</h3>
          </div>
          <button (click)="close.emit()" class="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="p-8 flex flex-col gap-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Item Name</label>
              <input type="text" formControlName="name" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
              <select formControlName="category" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                <option value="Equipment">Equipment</option>
                <option value="Vaccines">Vaccines</option>
                <option value="Fertilizers">Fertilizers</option>
                <option value="Pesticides">Pesticides</option>
                <option value="Fungicides">Fungicides</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
            <textarea formControlName="description" rows="3" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Unit Price ($)</label>
              <input type="number" formControlName="unitPrice" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Reorder Level</label>
              <input type="number" formControlName="reorderLevel" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Location</label>
              <input type="text" formControlName="location" class="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" (click)="close.emit()" class="px-6 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" [disabled]="editForm.invalid" class="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EditItemModalComponent {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [0, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.item) {
      this.editForm.patchValue(this.item);
    }
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.submit.emit(this.editForm.value);
    }
  }
}
