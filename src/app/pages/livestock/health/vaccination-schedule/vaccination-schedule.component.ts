import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-vaccination-schedule',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Vaccination Schedule</h2>
          <p class="text-slate-500">Manage and track upcoming vaccinations for your livestock.</p>
        </div>
        <button class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20">
          <lucide-icon name="plus-circle" class="w-5 h-5"></lucide-icon>
          Schedule Vaccination
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Search Animal</label>
          <div class="relative">
            <input type="text" placeholder="ID or Name..." class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20">
            <lucide-icon name="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
          </div>
        </div>
        <div class="w-48">
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</label>
          <select class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20">
            <option>All Status</option>
            <option>Upcoming</option>
            <option>Overdue</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <!-- Schedule List -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Animal</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Vaccine</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">L1</div>
                  <div>
                    <div class="font-bold text-slate-900 text-sm">Luna</div>
                    <div class="text-[10px] text-slate-500">Golden Retriever</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-900">DHPP Booster</div>
                <div class="text-[10px] text-slate-500">Distemper/Parvo</div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">Nov 15, 2023</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">Upcoming</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-green-600 hover:text-green-700 font-bold text-xs">Log Completion</button>
              </td>
            </tr>
            <tr class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">M1</div>
                  <div>
                    <div class="font-bold text-slate-900 text-sm">Milo</div>
                    <div class="text-[10px] text-slate-500">Tabby Cat</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-900">Rabies Booster</div>
                <div class="text-[10px] text-slate-500">Annual Booster</div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">Oct 20, 2023</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-full">Overdue</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-green-600 hover:text-green-700 font-bold text-xs">Log Completion</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class VaccinationScheduleComponent {}
