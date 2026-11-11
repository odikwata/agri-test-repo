import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-log-transaction',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [ngClass]="isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm' : 'p-6 max-w-5xl mx-auto'">
      <div [ngClass]="isModal ? 'bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative' : ''">
        
        @if (isModal) {
          <button (click)="close.emit()" class="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        }

        <div [ngClass]="isModal ? 'p-8' : ''">
          <div class="mb-8">
            @if (!isModal) {
              <nav class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <span class="hover:text-slate-600 cursor-pointer">Accounting</span>
                <lucide-icon name="chevron-right" class="w-3 h-3"></lucide-icon>
                <span class="text-slate-900">Log Transaction</span>
              </nav>
            }
            <h1 class="text-3xl font-black text-slate-900 mb-2">Log Transaction</h1>
            <p class="text-slate-500 text-sm">Record a new financial entry for a specific animal or group.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <!-- Main Form -->
            <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div class="space-y-8">
                <!-- Transaction Type -->
                <div class="space-y-4">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Type</label>
                  <div class="grid grid-cols-2 gap-4">
                    <button class="py-3 px-6 rounded-xl border-2 border-green-500 bg-green-50 text-green-700 font-bold text-sm flex items-center justify-center gap-2 transition-all">
                      <lucide-icon name="arrow-down-right" class="w-4 h-4"></lucide-icon>
                      Expense
                    </button>
                    <button class="py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                      <lucide-icon name="arrow-up-right" class="w-4 h-4"></lucide-icon>
                      Income
                    </button>
                  </div>
                </div>

                <!-- Animal and Amount -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Animal ID</label>
                    <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none bg-white">
                      <option>ANGUS-042 (Steer)</option>
                      <option>BOVINE-442 (Cow)</option>
                      <option>JERSEY-452 (Heifer)</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount ($)</label>
                    <div class="relative">
                      <input type="number" placeholder="0.00" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
                    </div>
                  </div>
                </div>

                <!-- Category -->
                <div class="space-y-4">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                  <div class="flex flex-wrap gap-2">
                    @for (cat of ['Feed', 'Medical', 'Equipment', 'Sale', 'Other']; track cat) {
                      <button 
                        class="px-4 py-2 rounded-full text-xs font-bold transition-all border"
                        [ngClass]="cat === 'Feed' ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'"
                      >
                        {{cat}}
                      </button>
                    }
                  </div>
                </div>

                <!-- Description -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea placeholder="Enter transaction details..." rows="3" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"></textarea>
                </div>

                <div class="flex justify-end gap-4 pt-4">
                  <button (click)="close.emit()" class="px-8 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                  <button class="px-8 py-3 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all">Save Transaction</button>
                </div>
              </div>
            </div>

            <!-- Sidebar Info -->
            <div class="space-y-6">
              <!-- Calendar Card -->
              <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                  <button class="p-1 hover:bg-slate-100 rounded"><lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon></button>
                  <span class="text-sm font-bold text-slate-900">October 2023</span>
                  <button class="p-1 hover:bg-slate-100 rounded"><lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon></button>
                </div>
                <div class="grid grid-cols-7 gap-1 text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div class="grid grid-cols-7 gap-1 text-center">
                  @for (day of [28,29,30,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; track day) {
                    <div 
                      class="h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer"
                      [ngClass]="day === 5 ? 'bg-green-500 text-white shadow-lg shadow-green-200 scale-110' : 'text-slate-600 hover:bg-slate-50'"
                    >
                      {{day}}
                    </div>
                  }
                </div>
              </div>

              <!-- Animal Summary -->
              <div class="bg-green-50 rounded-2xl border border-green-100 p-6">
                <h3 class="font-bold text-green-900 mb-6 flex items-center gap-2">
                  <lucide-icon name="info" class="w-5 h-5"></lucide-icon>
                  Animal Summary
                </h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-green-600 font-medium">Total Expenses (YTD)</span>
                    <span class="text-sm font-black text-green-900">$1,240.00</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-green-600 font-medium">Market Value</span>
                    <span class="text-sm font-black text-green-900">$3,100.00</span>
                  </div>
                  <div class="pt-4 border-t border-green-200 flex justify-between items-center">
                    <span class="text-xs text-green-600 font-medium">Net Profit/Loss</span>
                    <span class="text-sm font-black text-green-600">+$1,860.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          @if (!isModal) {
            <!-- Recent Transactions Table -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="p-6 border-b border-slate-100">
                <h3 class="font-bold text-slate-900">Recent Transactions for ANGUS-042</h3>
              </div>
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/50 border-b border-slate-200">
                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr>
                    <td class="px-6 py-4 text-sm font-bold text-slate-600">Oct 02, 2023</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-widest rounded-full">Feed</span>
                    </td>
                    <td class="px-6 py-4 text-sm font-black text-red-600 text-right">-$45.00</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 text-sm font-bold text-slate-600">Sep 28, 2023</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-full">Medical</span>
                    </td>
                    <td class="px-6 py-4 text-sm font-black text-red-600 text-right">-$120.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class LogTransactionComponent {
  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();
}
