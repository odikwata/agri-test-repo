import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-stock-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-xl">
              <lucide-icon name="refresh-cw" class="w-5 h-5 text-primary"></lucide-icon>
            </div>
            <h3 class="text-xl font-black text-slate-900 tracking-tight">Update Stock Levels</h3>
          </div>
          <button (click)="close.emit()" class="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <form [formGroup]="stockForm" (ngSubmit)="onSubmit()" class="p-8 flex flex-col gap-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Item Name</span>
              <span class="text-sm font-bold text-slate-900">{{ itemName }}</span>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Stock</span>
              <span class="text-sm font-bold text-slate-900">{{ currentStock }} {{ unit }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Adjustment Type</label>
            <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button 
                type="button"
                (click)="stockForm.patchValue({ type: 'IN' })"
                [class]="stockForm.get('type')?.value === 'IN' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                class="py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <lucide-icon name="plus" class="w-3 h-3"></lucide-icon>
                Add (+)
              </button>
              <button 
                type="button"
                (click)="stockForm.patchValue({ type: 'OUT' })"
                [class]="stockForm.get('type')?.value === 'OUT' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                class="py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <lucide-icon name="minus" class="w-3 h-3"></lucide-icon>
                Remove (-)
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity</label>
              <div class="relative">
                <input type="number" formControlName="quantity" class="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{ unit }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Reason</label>
              <select formControlName="reason" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white">
                <option value="purchase">New Purchase</option>
                <option value="usage">Field Usage</option>
                <option value="transfer">Transfer</option>
                <option value="damage">Damage/Loss</option>
                <option value="audit">Audit Adjustment</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Notes (Optional)</label>
            <textarea formControlName="notes" rows="3" placeholder="Provide context for this adjustment..." class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"></textarea>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button type="button" (click)="close.emit()" class="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" [disabled]="stockForm.invalid" class="flex-[2] py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-black rounded-xl shadow-lg shadow-primary/20 transition-all uppercase tracking-widest">
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UpdateStockModalComponent {
  @Input() itemName = '';
  @Input() currentStock = 0;
  @Input() unit = '';
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  stockForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.stockForm = this.fb.group({
      type: ['IN', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      reason: ['purchase', Validators.required],
      notes: ['']
    });
  }

  onSubmit() {
    if (this.stockForm.valid) {
      this.submit.emit(this.stockForm.value);
    }
  }
}
