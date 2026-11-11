import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-lab-results',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Lab Results</h2>
          <p class="text-slate-500">View and manage laboratory test results for your livestock.</p>
        </div>
        <button class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20">
          <lucide-icon name="upload" class="w-5 h-5"></lucide-icon>
          Upload Lab Result
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4 mb-2">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <lucide-icon name="flask-conical" class="w-5 h-5"></lucide-icon>
            </div>
            <span class="text-sm font-bold text-slate-500">Pending Tests</span>
          </div>
          <div class="text-3xl font-black text-slate-900">12</div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4 mb-2">
            <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <lucide-icon name="alert-circle" class="w-5 h-5"></lucide-icon>
            </div>
            <span class="text-sm font-bold text-slate-500">Abnormal Results</span>
          </div>
          <div class="text-3xl font-black text-red-600">3</div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4 mb-2">
            <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <lucide-icon name="check-circle" class="w-5 h-5"></lucide-icon>
            </div>
            <span class="text-sm font-bold text-slate-500">Completed This Month</span>
          </div>
          <div class="text-3xl font-black text-slate-900">45</div>
        </div>
      </div>

      <!-- Results List -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 class="font-bold text-slate-900">Recent Results</h3>
          <div class="flex gap-2">
            <button class="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <lucide-icon name="filter" class="w-4 h-4"></lucide-icon>
            </button>
            <button class="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <lucide-icon name="search" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>
        <div class="divide-y divide-slate-200">
          <div class="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <lucide-icon name="file-text" class="w-6 h-6"></lucide-icon>
              </div>
              <div>
                <h4 class="font-bold text-slate-900">Blood Panel - Complete</h4>
                <p class="text-xs text-slate-500">Animal ID: LUNA-001 • Date: Oct 25, 2023</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">Normal</span>
              </div>
              <button class="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">View Report</button>
            </div>
          </div>
          <div class="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <lucide-icon name="file-text" class="w-6 h-6"></lucide-icon>
              </div>
              <div>
                <h4 class="font-bold text-slate-900">Fecal Examination</h4>
                <p class="text-xs text-slate-500">Animal ID: MILO-002 • Date: Oct 22, 2023</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <span class="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-full">Abnormal</span>
              </div>
              <button class="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">View Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LabResultsComponent {}
