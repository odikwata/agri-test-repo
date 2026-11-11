import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-log-feeding',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [ngClass]="isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm' : 'p-6 max-w-4xl mx-auto'">
      <div [ngClass]="isModal ? 'bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative' : ''">
        
        @if (isModal) {
          <button (click)="close.emit()" class="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        }

        <div [ngClass]="isModal ? 'p-8' : ''">
          <div class="mb-8">
            <h1 class="text-3xl font-black text-slate-900 mb-2">Log Feeding Event</h1>
            <p class="text-slate-500 text-sm">Record daily feeding amounts and nutritional intake for individual animals.</p>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <!-- Active Animal Banner -->
            <div class="bg-orange-50 rounded-2xl p-6 mb-8 flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <lucide-icon name="utensils" class="w-6 h-6"></lucide-icon>
              </div>
              <div>
                <p class="text-[10px] font-black text-orange-600 uppercase tracking-widest">Active Animal</p>
                <h3 class="text-lg font-bold text-orange-900">Daisy #BR-452 (Jersey Heifer)</h3>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <lucide-icon name="calendar" class="w-3 h-3 text-orange-600"></lucide-icon>
                  Feeding Date
                </label>
                <div class="relative">
                  <input type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white">
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <lucide-icon name="clock" class="w-3 h-3 text-orange-600"></lucide-icon>
                  Feeding Time
                </label>
                <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none bg-white">
                  <option>Morning (06:00 - 09:00)</option>
                  <option>Mid-day (12:00 - 14:00)</option>
                  <option>Evening (17:00 - 19:00)</option>
                  <option>Custom Time</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <lucide-icon name="wheat" class="w-3 h-3 text-orange-600"></lucide-icon>
                  Feed Type
                </label>
                <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none bg-white">
                  <option>Dairy Meal (High Protein)</option>
                  <option>Lucerne Hay</option>
                  <option>Silage</option>
                  <option>Mineral Lick</option>
                  <option>Grazing (Field A)</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <lucide-icon name="scale" class="w-3 h-3 text-orange-600"></lucide-icon>
                  Quantity (kg)
                </label>
                <div class="relative">
                  <input type="number" placeholder="0.00" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">kg</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Water Intake</span>
                  <lucide-icon name="droplets" class="w-4 h-4 text-blue-500"></lucide-icon>
                </div>
                <input type="number" placeholder="Liters" class="w-full bg-transparent border-none p-0 text-lg font-bold text-slate-700 focus:ring-0 placeholder:text-slate-300">
              </div>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leftover</span>
                  <lucide-icon name="trash-2" class="w-4 h-4 text-red-400"></lucide-icon>
                </div>
                <input type="number" placeholder="kg" class="w-full bg-transparent border-none p-0 text-lg font-bold text-slate-700 focus:ring-0 placeholder:text-slate-300">
              </div>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality Score</span>
                  <lucide-icon name="star" class="w-4 h-4 text-yellow-500"></lucide-icon>
                </div>
                <select class="w-full bg-transparent border-none p-0 text-lg font-bold text-slate-700 focus:ring-0 appearance-none">
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                </select>
              </div>
            </div>

            <div class="space-y-2 mb-8">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <lucide-icon name="file-text" class="w-3 h-3 text-orange-600"></lucide-icon>
                Observations
              </label>
              <textarea placeholder="e.g. Low appetite, very active during feeding, specific supplement added..." rows="4" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-4">
              <button (click)="close.emit()" class="px-8 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
              <button class="px-8 py-3 bg-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">Save Feeding Event</button>
            </div>
          </div>

          <!-- Nutritional Summary Banner -->
          <div class="mt-8 bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                <lucide-icon name="activity" class="w-5 h-5"></lucide-icon>
              </div>
              <div>
                <h4 class="font-bold text-emerald-900">Nutritional Impact</h4>
                <p class="text-xs text-emerald-700">This feeding event contributes to the animal's weekly growth target.</p>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-white/50 rounded-xl p-3 border border-emerald-100">
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Protein</p>
                <p class="text-sm font-bold text-emerald-900">+1.2kg</p>
              </div>
              <div class="bg-white/50 rounded-xl p-3 border border-emerald-100">
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Energy</p>
                <p class="text-sm font-bold text-emerald-900">14.5 MJ</p>
              </div>
              <div class="bg-white/50 rounded-xl p-3 border border-emerald-100">
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Fiber</p>
                <p class="text-sm font-bold text-emerald-900">2.4kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LogFeedingEventComponent {
  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();
}
