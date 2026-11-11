import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payroll-cycles',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Payroll Cycles</h1>
          <p class="text-slate-500 text-sm font-medium">Manage and track your organization's payroll runs and history</p>
        </div>
        <button [routerLink]="['/hr/payroll/run']" class="bg-[#00FF22] hover:bg-[#00E61F] text-slate-900 px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 uppercase tracking-widest">
          <lucide-icon name="plus-circle" class="w-4 h-4"></lucide-icon>
          Start New Run
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <lucide-icon name="banknote" class="w-5 h-5"></lucide-icon>
            </div>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Gross Pay (MTD)</p>
            <p class="text-3xl font-black text-slate-900">$452,000.00</p>
            <p class="text-[10px] font-bold text-emerald-600 mt-1">+5.2% <span class="text-slate-400">from last month</span></p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <lucide-icon name="users" class="w-5 h-5"></lucide-icon>
            </div>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Employees</p>
            <p class="text-3xl font-black text-slate-900">1,240</p>
            <p class="text-[10px] font-bold text-slate-400 mt-1">No change this period</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <lucide-icon name="clipboard-check" class="w-5 h-5"></lucide-icon>
            </div>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Cycles</p>
            <p class="text-3xl font-black text-slate-900">3</p>
            <p class="text-[10px] font-bold text-emerald-600 mt-1">+1 <span class="text-slate-400">since yesterday</span></p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-8 border-b border-slate-200">
          <button class="pb-4 text-sm font-black text-emerald-500 border-b-2 border-emerald-500">All Cycles</button>
          <button class="pb-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Drafts</button>
          <button class="pb-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Processing</button>
          <button class="pb-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Completed</button>
        </div>

        <!-- Cycles Table -->
        <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle Name</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Range</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Employees</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Pay</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let cycle of cycles" class="group hover:bg-slate-50/50 transition-colors">
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-900">{{ cycle.name }}</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {{ cycle.id }}</span>
                  </div>
                </td>
                <td class="px-8 py-6 text-sm font-bold text-slate-500">{{ cycle.dateRange }}</td>
                <td class="px-8 py-6 text-sm font-bold text-slate-500">{{ cycle.employees }}</td>
                <td class="px-8 py-6 text-sm font-bold text-slate-900">{{ cycle.grossPay || '--' }}</td>
                <td class="px-8 py-6">
                  <span [class]="getStatusClass(cycle.status)" class="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 w-fit">
                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {{ cycle.status }}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <a [routerLink]="['/hr/payroll/view', cycle.id]" class="text-xs font-black text-emerald-500 hover:underline uppercase tracking-widest">
                    {{ cycle.status === 'DRAFT' ? 'Edit' : 'View' }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Pagination -->
          <div class="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p class="text-xs font-bold text-slate-400">Showing 1 to 4 of 24 results</p>
            <div class="flex items-center gap-2">
              <button class="p-2 text-slate-400 hover:bg-white rounded-lg transition-all border border-slate-200">
                <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
              </button>
              <button class="p-2 text-slate-400 hover:bg-white rounded-lg transition-all border border-slate-200">
                <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PayrollCyclesComponent {
  cycles = [
    {
      id: 'PAY-2023-11-01',
      name: 'Monthly Payroll - Nov 2023',
      dateRange: 'Nov 01 - Nov 30, 2023',
      employees: 1242,
      grossPay: '',
      status: 'DRAFT'
    },
    {
      id: 'PAY-2023-10-15',
      name: 'Bi-Weekly - Mid Oct',
      dateRange: 'Oct 15 - Oct 29, 2023',
      employees: 450,
      grossPay: '$112,500.00',
      status: 'PROCESSING'
    },
    {
      id: 'PAY-2023-10-01',
      name: 'Monthly Payroll - Oct 2023',
      dateRange: 'Oct 01 - Oct 31, 2023',
      employees: 1240,
      grossPay: '$452,000.00',
      status: 'COMPLETED'
    },
    {
      id: 'PAY-2023-BN-01',
      name: 'Off-cycle Bonus',
      dateRange: 'Oct 20, 2023',
      employees: 12,
      grossPay: '$24,000.00',
      status: 'COMPLETED'
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'DRAFT': return 'bg-slate-100 text-slate-500';
      case 'PROCESSING': return 'bg-amber-50 text-amber-600';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  }
}
