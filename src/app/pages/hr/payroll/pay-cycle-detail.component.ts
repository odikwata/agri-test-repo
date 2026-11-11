import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pay-cycle-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            <a routerLink="/hr/payroll" class="hover:underline">Payroll</a>
            <lucide-icon name="chevron-right" class="w-3 h-3"></lucide-icon>
            <span>Active Cycles</span>
          </div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Current Pay Cycle</h1>
          <div class="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <lucide-icon name="calendar" class="w-4 h-4"></lucide-icon>
            <span>October 1, 2023 - October 15, 2023</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 uppercase tracking-widest">
            <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
            Download Reports
          </button>
          <button class="bg-[#00FF22] hover:bg-[#00E61F] text-slate-900 px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 uppercase tracking-widest">
            <lucide-icon name="rocket" class="w-4 h-4"></lucide-icon>
            Process Payroll
          </button>
        </div>
      </div>

      <!-- Summary Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Gross Pay</p>
            <lucide-icon name="banknote" class="w-5 h-5 text-slate-200"></lucide-icon>
          </div>
          <div>
            <p class="text-3xl font-black text-slate-900">$145,200.00</p>
            <p class="text-[10px] font-bold text-emerald-600 mt-1">+4.2% <span class="text-slate-400">from last cycle</span></p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Deductions</p>
            <lucide-icon name="landmark" class="w-5 h-5 text-slate-200"></lucide-icon>
          </div>
          <div>
            <p class="text-3xl font-black text-slate-900">$28,450.00</p>
            <p class="text-[10px] font-bold text-amber-600 mt-1">Taxes, 401k, Insurance</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2rem] border border-emerald-500 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Total Net Pay</p>
            <lucide-icon name="piggy-bank" class="w-5 h-5 text-emerald-100"></lucide-icon>
          </div>
          <div>
            <p class="text-3xl font-black text-emerald-600">$116,750.00</p>
            <p class="text-[10px] font-bold text-emerald-600 mt-1">Funds ready for disbursement</p>
          </div>
        </div>
      </div>

      <!-- Employee Breakdown -->
      <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-slate-900 tracking-tight">Employee Breakdown</h2>
          <div class="flex items-center gap-2">
            <button class="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <lucide-icon name="filter" class="w-5 h-5"></lucide-icon>
            </button>
            <button class="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <lucide-icon name="more-horizontal" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>

        <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Pay</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deductions</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Pay</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let emp of employees" class="group hover:bg-slate-50/50 transition-colors">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                      {{ emp.initials }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-slate-900">{{ emp.name }}</span>
                      <span class="text-[10px] font-bold text-slate-400">{{ emp.role }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6 text-sm font-bold text-slate-900">{{ emp.gross }}</td>
                <td class="px-8 py-6 text-sm font-bold text-red-500">{{ emp.deductions }}</td>
                <td class="px-8 py-6 text-sm font-bold text-emerald-600">{{ emp.net }}</td>
                <td class="px-8 py-6">
                  <span class="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                    Pending
                  </span>
                </td>
                <td class="px-8 py-6">
                  <button class="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <lucide-icon name="edit" class="w-4 h-4"></lucide-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Pagination -->
          <div class="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 4 of 24 employees</p>
            <div class="flex items-center gap-2">
              <button class="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-white rounded-lg transition-all">Prev</button>
              <button class="w-8 h-8 bg-emerald-500 text-white text-xs font-black rounded-lg shadow-lg shadow-emerald-500/20">1</button>
              <button class="w-8 h-8 hover:bg-white text-slate-500 text-xs font-bold rounded-lg transition-all">2</button>
              <button class="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-white rounded-lg transition-all">Next</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Finalize Banner -->
      <div class="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-6">
          <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <lucide-icon name="clipboard-check" class="w-6 h-6"></lucide-icon>
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-lg font-black text-slate-900">Ready to finalize?</h3>
            <p class="text-sm text-slate-500 font-medium">Review all details before processing. Changes cannot be undone once confirmed.</p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <button class="bg-[#00FF22] hover:bg-[#00E61F] text-slate-900 px-12 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 transition-all uppercase tracking-widest">
            Finalize Payroll
          </button>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-disbursement scheduled for Oct 18, 2023</p>
        </div>
      </div>
    </div>
  `
})
export class PayCycleDetailComponent {
  employees = [
    { name: 'Alex Rivera', role: 'Software Engineer', initials: 'AR', gross: '$5,000.00', deductions: '$950.00', net: '$4,050.00' },
    { name: 'Sarah Chen', role: 'Product Manager', initials: 'SC', gross: '$6,200.00', deductions: '$1,100.00', net: '$5,100.00' },
    { name: 'Marcus Thorne', role: 'HR Director', initials: 'MT', gross: '$4,800.00', deductions: '$880.00', net: '$3,920.00' },
    { name: 'Janice Hobbs', role: 'Lead Designer', initials: 'JH', gross: '$5,500.00', deductions: '$1,020.00', net: '$4,480.00' }
  ];
}
