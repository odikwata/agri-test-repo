import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-feeding-programme',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <lucide-icon name="clipboard-list" class="w-6 h-6"></lucide-icon>
          </div>
          <h2 class="text-xl font-black text-slate-900 tracking-tight">Create Programme</h2>
        </div>
        <button [routerLink]="['..']" class="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400">
          <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
        </button>
      </div>

      <div class="p-8 space-y-8">
        <!-- Basic Info -->
        <div>
          <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">New Feeding Programme</h1>
          <p class="text-sm text-slate-500 mb-8 font-medium">Define your feeding schedule and rations for your livestock.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-700 uppercase tracking-widest">Programme Name</label>
              <input type="text" placeholder="e.g., Winter Growth Mix" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium">
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-700 uppercase tracking-widest">Description</label>
              <textarea rows="1" placeholder="Describe the purpose of this programme..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"></textarea>
            </div>
          </div>
        </div>

        <!-- Feeding Steps -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">Feeding Steps</h3>
              <p class="text-xs text-slate-500 font-medium">Sequence of feeds and timings.</p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Step 1 -->
            <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm relative group">
              <div class="absolute -top-3 left-6 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                Step 1
              </div>
              <button class="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-all">
                <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
              </button>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feed Mix</label>
                  <div class="relative">
                    <select class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm font-bold">
                      <option>Standard Protein Pellets</option>
                      <option>Maize Silage</option>
                      <option>Mineral Supplement</option>
                    </select>
                    <lucide-icon name="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></lucide-icon>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing</label>
                  <div class="relative">
                    <select class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm font-bold">
                      <option>Twice Daily (AM/PM)</option>
                      <option>Morning Only</option>
                      <option>Evening Only</option>
                    </select>
                    <lucide-icon name="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></lucide-icon>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity (kg/head)</label>
                  <div class="relative">
                    <input type="number" step="0.1" value="2.5" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm font-bold pr-10">
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">kg</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl relative group">
              <div class="absolute -top-3 left-6 px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                Step 2
              </div>
              <button class="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-all">
                <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
              </button>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feed Mix</label>
                  <div class="relative">
                    <select class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm font-bold">
                      <option>Mineral Supplement</option>
                      <option>Standard Protein Pellets</option>
                      <option>Maize Silage</option>
                    </select>
                    <lucide-icon name="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></lucide-icon>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing</label>
                  <div class="relative">
                    <select class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm font-bold">
                      <option>Morning Only</option>
                      <option>Twice Daily (AM/PM)</option>
                      <option>Evening Only</option>
                    </select>
                    <lucide-icon name="chevron-down" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></lucide-icon>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity (kg/head)</label>
                  <div class="relative">
                    <input type="number" step="0.1" value="0.2" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm font-bold pr-10">
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">kg</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Step Button -->
            <button class="w-full py-4 border-2 border-dashed border-green-200 rounded-2xl text-green-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-all">
              <lucide-icon name="plus-circle" class="w-5 h-5"></lucide-icon>
              Add Feeding Step
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
        <button class="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all">Save as Draft</button>
        <button class="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center gap-2">
          <lucide-icon name="save" class="w-5 h-5"></lucide-icon>
          Create Programme
        </button>
      </div>
    </div>
  `
})
export class CreateFeedingProgrammeComponent {}
