import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-species-create',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  template: `
    <div class="p-6 mx-auto max-w-3xl">
      <div class="flex items-center gap-4 mb-8">
        <button routerLink="/species" class="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Add Species</h1>
          <p class="text-slate-500 mt-1">Define a new species to manage on your farm.</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 space-y-6">
          
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Species Name</label>
            <input type="text" [(ngModel)]="name" placeholder="e.g. Corn, Sheep, Cattle..." class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Category</label>
            <div class="grid grid-cols-2 gap-4">
              <label 
                class="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all"
                [ngClass]="category === 'Livestock' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'"
                (click)="category = 'Livestock'">
                <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <lucide-icon name="paw-print" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <p class="font-bold text-slate-800">Livestock</p>
                  <p class="text-xs text-slate-500">Animals, breeding</p>
                </div>
              </label>

              <label 
                class="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all"
                [ngClass]="category === 'Crops' ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'"
                (click)="category = 'Crops'">
                <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <lucide-icon name="sprout" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <p class="font-bold text-slate-800">Crops</p>
                  <p class="text-xs text-slate-500">Plants, fields</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea [(ngModel)]="description" rows="3" placeholder="Brief description of this species..." class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea>
          </div>

        </div>

        <div class="p-6 bg-slate-50 flex justify-end gap-3">
          <button type="button" routerLink="/species" class="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button type="button" (click)="save()" class="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 flex items-center gap-2">
            <lucide-icon name="save" class="w-4 h-4"></lucide-icon>
            Save Species
          </button>
        </div>
      </div>
    </div>
  `
})
export class SpeciesCreateComponent {
  name = '';
  category = 'Livestock';
  description = '';

  constructor(private router: Router) {}

  save() {
    this.router.navigate(['/species']);
  }
}
