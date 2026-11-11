import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-run-payroll',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Run Payroll</h1>
          <div class="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <lucide-icon name="calendar" class="w-4 h-4"></lucide-icon>
            <span>Cycle: Oct 1 - Oct 15, 2023</span>
          </div>
        </div>
        <button class="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 uppercase tracking-widest">
          <lucide-icon name="settings" class="w-4 h-4"></lucide-icon>
          Edit Cycle Settings
        </button>
      </div>

      <!-- Stepper -->
      <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-emerald-500/20">1</div>
              <span class="text-sm font-black text-slate-900">Review</span>
            </div>
            <div class="flex items-center gap-3 opacity-40">
              <div class="w-8 h-8 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-black">2</div>
              <span class="text-sm font-black text-slate-900">Verify</span>
            </div>
            <div class="flex items-center gap-3 opacity-40">
              <div class="w-8 h-8 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-black">3</div>
              <span class="text-sm font-black text-slate-900">Disburse</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Step 1: 33% Complete</span>
            <div class="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="w-1/3 h-full bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Gross Pay</p>
          <p class="text-3xl font-black text-slate-900">$45,200.00</p>
        </div>
        <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Deductions</p>
          <p class="text-3xl font-black text-slate-900">$8,450.00</p>
        </div>
        <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
          <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Total Net Pay</p>
          <p class="text-3xl font-black text-emerald-600">$36,750.00</p>
        </div>
      </div>

      <!-- Employee Table -->
      <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-8 py-4 w-12">
                <div class="w-5 h-5 border-2 border-emerald-500 rounded bg-emerald-500 flex items-center justify-center">
                  <lucide-icon name="check" class="w-3 h-3 text-white"></lucide-icon>
                </div>
              </th>
              <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
              <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Pay</th>
              <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deductions</th>
              <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Pay</th>
              <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr *ngFor="let emp of employees" class="group hover:bg-slate-50/50 transition-colors">
              <td class="px-8 py-6">
                <div class="w-5 h-5 border-2 border-emerald-500 rounded bg-emerald-500 flex items-center justify-center">
                  <lucide-icon name="check" class="w-3 h-3 text-white"></lucide-icon>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                    <img [src]="emp.avatar" [alt]="emp.name" class="w-full h-full object-cover">
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
                <span class="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Ready
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 4 of 24 employees</p>
          <div class="flex items-center gap-2">
            <button class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Previous</button>
            <button class="w-8 h-8 bg-emerald-50 text-emerald-600 text-xs font-black rounded-lg">1</button>
            <button class="w-8 h-8 hover:bg-white text-slate-500 text-xs font-bold rounded-lg transition-all">2</button>
            <button class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Next</button>
          </div>
        </div>
      </div>

      <!-- Finalize Banner -->
      <div class="bg-[#151619] rounded-[2rem] p-10 flex items-center justify-between shadow-2xl">
        <div class="flex flex-col gap-2 max-w-lg">
          <h3 class="text-2xl font-black text-white tracking-tight">Ready to finalize?</h3>
          <p class="text-sm text-slate-400 font-medium leading-relaxed">Once you finalize, the payments will be scheduled for verification. Please double-check all deductions and net pay amounts.</p>
        </div>
        <div class="flex items-center gap-4">
          <button class="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-sm transition-all uppercase tracking-widest">
            Save as Draft
          </button>
          <button class="bg-[#00FF22] hover:bg-[#00E61F] text-slate-900 px-12 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-3 uppercase tracking-widest">
            <lucide-icon name="check-circle" class="w-5 h-5"></lucide-icon>
            Finalize & Process Payroll
          </button>
        </div>
      </div>
    </div>
  `
})
export class RunPayrollComponent {
  employees = [
    { name: 'Alex Rivera', role: 'Senior Developer', avatar: 'https://i.pravatar.cc/150?u=alex', gross: '$4,000.00', deductions: '$800.00', net: '$3,200.00' },
    { name: 'Jordan Smith', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?u=jordan', gross: '$3,500.00', deductions: '$700.00', net: '$2,800.00' },
    { name: 'Taylor Wong', role: 'UX Lead', avatar: 'https://i.pravatar.cc/150?u=taylor', gross: '$5,200.00', deductions: '$1,100.00', net: '$4,100.00' },
    { name: 'Casey Jones', role: 'Operations Specialist', avatar: 'https://i.pravatar.cc/150?u=casey', gross: '$2,800.00', deductions: '$500.00', net: '$2,300.00' }
  ];
}
