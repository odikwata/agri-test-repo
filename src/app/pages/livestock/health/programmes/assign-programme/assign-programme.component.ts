import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-programme',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
  template: `
    <div class="mt-4 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center gap-4">
        <button [routerLink]="['..']" class="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
          <lucide-icon name="arrow-left" class="w-6 h-6"></lucide-icon>
        </button>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Assign Vaccination Programme</h1>
          <p class="text-sm text-slate-500">Link a health protocol to your livestock and generate their upcoming schedule.</p>
        </div>
      </div>

      <div class="space-y-8">
        <!-- Step 1: Select Programme -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-sm">1</div>
            <h3 class="text-lg font-black text-slate-900">Select Programme</h3>
          </div>
          
          <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Vaccination Programme</label>
              <div class="relative">
                <select class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none font-bold text-slate-700">
                  <option>Calf Starter Pack (VAX-2024-001)</option>
                  <option>Annual Herd Booster (VAX-2024-002)</option>
                  <option>Pre-Lambing Health Pack (VAX-2024-003)</option>
                </select>
                <lucide-icon name="chevron-down" class="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></lucide-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Define Target -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-sm">2</div>
            <h3 class="text-lg font-black text-slate-900">Define Target</h3>
          </div>
          
          <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
            <div class="space-y-4">
              <p class="text-sm font-bold text-slate-700">What are you linking this to?</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                @for (type of targetTypes; track type.id) {
                  <button 
                    (click)="selectedTargetType.set(type.id)"
                    [ngClass]="selectedTargetType() === type.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                    class="py-4 px-4 rounded-2xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-3">
                    <lucide-icon [name]="type.icon" class="w-6 h-6"></lucide-icon>
                    {{ type.label }}
                  </button>
                }
              </div>
            </div>

            <div class="space-y-4">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Select {{ selectedTargetType() | titlecase }}(s)</label>
              <div class="relative">
                <lucide-icon name="search" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                <input type="text" [placeholder]="'Search ' + selectedTargetType() + 's by name or ID...'" class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2">
                  Kraal A <lucide-icon name="x" class="w-3 h-3 cursor-pointer hover:text-red-500"></lucide-icon>
                </span>
                <span class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2">
                  Kraal C <lucide-icon name="x" class="w-3 h-3 cursor-pointer hover:text-red-500"></lucide-icon>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Schedule Start -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-sm">3</div>
            <h3 class="text-lg font-black text-slate-900">Schedule Start</h3>
          </div>
          
          <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Programme Start Date</label>
              <div class="relative">
                <input type="date" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-bold text-slate-700">
              </div>
              <p class="text-[10px] text-slate-400 italic">Tasks will be auto-generated relative to this date based on the programme configuration.</p>
            </div>
          </div>
        </div>

        <!-- Preview & Action -->
        <div class="bg-green-50 border border-green-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center text-green-600 shrink-0 shadow-sm">
              <lucide-icon name="info" class="w-6 h-6"></lucide-icon>
            </div>
            <div>
              <h4 class="font-black text-slate-900 mb-1">Schedule Preview</h4>
              <p class="text-sm text-slate-600 leading-relaxed">
                This will create <span class="font-bold text-slate-900">5 vaccination tasks</span> over the next 6 months for <span class="font-bold text-slate-900">45 animals</span> in <span class="underline decoration-green-300">Kraal A</span> and <span class="underline decoration-green-300">Kraal C</span>.
              </p>
            </div>
          </div>
          
          <button class="w-full md:w-auto px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-500/30 group">
            Generate Schedule
            <lucide-icon name="zap" class="w-5 h-5 group-hover:animate-pulse"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class AssignProgrammeComponent {
  selectedTargetType = signal('kraal');

  targetTypes = [
    { id: 'kraal', label: 'Kraal', icon: 'layout-grid' },
    { id: 'group', label: 'Animal Group', icon: 'users' },
    { id: 'individual', label: 'Individual', icon: 'hash' },
    { id: 'pen', label: 'Specific Pen', icon: 'layers' }
  ];
}
