import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-feed-schedules',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Active Feeding Schedule -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-slate-900">Active Feeding Schedule</h3>
        <button class="text-green-600 text-sm font-bold flex items-center gap-1 hover:underline">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
          New Group
        </button>
      </div>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 border-b border-slate-200">
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kraal / Pen ID</th>
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Livestock Type</th>
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Feed Mix</th>
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Ration</th>
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr>
            <td class="px-6 py-4 font-bold text-slate-900">Kraal 04</td>
            <td class="px-6 py-4 text-xs text-slate-600">Dairy Cows (High Yield)</td>
            <td class="px-6 py-4 text-xs text-slate-600">Mix Alpha-7</td>
            <td class="px-6 py-4 text-xs text-slate-600">18.5kg / head</td>
            <td class="px-6 py-4 text-xs text-slate-600">06:00, 14:00, 20:00</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest rounded-full">On Track</span>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 font-bold text-slate-900">Pen 12</td>
            <td class="px-6 py-4 text-xs text-slate-600">Beef Heifers</td>
            <td class="px-6 py-4 text-xs text-slate-600">Grower Mix B</td>
            <td class="px-6 py-4 text-xs text-slate-600">12.0kg / head</td>
            <td class="px-6 py-4 text-xs text-slate-600">07:30, 16:30</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest rounded-full">On Track</span>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 font-bold text-slate-900">Kraal 02</td>
            <td class="px-6 py-4 text-xs text-slate-600">Calves (Nursery)</td>
            <td class="px-6 py-4 text-xs text-slate-600">Starter Pack</td>
            <td class="px-6 py-4 text-xs text-slate-600">4.2kg / head</td>
            <td class="px-6 py-4 text-xs text-slate-600">05:00, 11:00, 17:00, 23:00</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-full">Pending Feed</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class FeedSchedulesComponent {}
