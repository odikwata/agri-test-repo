import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Performance Reviews</h1>
        <p class="text-slate-500 text-sm font-medium">Evaluate team performance, set goals, and track professional growth.</p>
      </div>
      <div class="bg-white p-12 rounded-[3rem] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center gap-4">
        <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
          <lucide-icon name="trending-up" class="w-8 h-8"></lucide-icon>
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="text-lg font-black text-slate-900">Performance Module Coming Soon</h3>
          <p class="text-sm text-slate-500 font-medium">KPI tracking and review cycles are currently in development.</p>
        </div>
      </div>
    </div>
  `
})
export class PerformanceComponent {}
