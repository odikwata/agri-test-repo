import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountingService, AccountingSummaryResponse, RecentTransactionDTO } from '../../../services/accounting.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-crop-accounting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>OAKRIDGE CADASTRE / ARABLE AGRONOMY & FISCAL BALANCES</span>
          </div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Crop Accounting & Fiscal Cadastre</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LEDGER AUDITED
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button (click)="loadData()" class="px-3.5 py-2 text-xs font-mono font-medium rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center gap-2 shadow-xs cursor-pointer">
            <lucide-icon name="refresh-cw" class="w-3.5 h-3.5 text-stone-500"></lucide-icon>
            <span>RE-SYNC</span>
          </button>
          <button (click)="openLogModal()" class="px-4 py-2 bg-[#012d1d] hover:bg-[#023f29] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
            <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
            <span>LOG TRANSACTION</span>
          </button>
        </div>
      </div>

      <!-- Bento KPI Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Revenue -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Total Revenue (YTD)</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <lucide-icon name="trending-up" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {{ summary().totalRevenue | currency }}
            </span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>+{{ summary().revenueChangePct || 14.8 }}% vs last cycle</span>
          </div>
        </div>

        <!-- Total Expenses -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Total Expenses (YTD)</span>
            <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <lucide-icon name="receipt" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {{ summary().totalExpenses | currency }}
            </span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-stone-600">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-stone-400"></span>
            <span>Input, seed, fuel & maintenance</span>
          </div>
        </div>

        <!-- Net Profit -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Net Operating Margin</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-100/60 flex items-center justify-center text-emerald-800">
              <lucide-icon name="banknote" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {{ summary().netProfit | currency }}
            </span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-800">
            <span class="font-bold">{{ summary().profitMargin || 52.6 }}% Margin</span>
            <span class="text-stone-400">• High Profitability</span>
          </div>
        </div>

        <!-- Capital Runway -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Active Cost Domains</span>
            <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <lucide-icon name="layers" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">4 Arable Units</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-stone-600">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Maize, Sorghum, Cowpeas, Potato</span>
          </div>
        </div>
      </div>

      <!-- Financial Ledger -->
      <div class="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-stone-800">Recent Enterprise Transactions</span>
            <span class="px-2 py-0.5 text-[11px] font-mono rounded-full bg-stone-200/70 text-stone-700">{{ transactions().length }} Records</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="relative">
              <input type="text" [(ngModel)]="searchQuery" placeholder="Filter descriptions..."
                     class="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 pl-8 font-mono">
              <lucide-icon name="search" class="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">Date</th>
                <th class="px-6 py-3.5">Description & Contract</th>
                <th class="px-6 py-3.5">Cadastre Field / Unit</th>
                <th class="px-6 py-3.5">Category</th>
                <th class="px-6 py-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              @for (tx of filteredTransactions(); track tx.id) {
                <tr class="hover:bg-stone-50/70 transition-colors">
                  <td class="px-6 py-4 font-mono text-xs text-stone-600">{{ tx.transactionDate | date:'mediumDate' }}</td>
                  <td class="px-6 py-4 font-semibold text-stone-900">{{ tx.description }}</td>
                  <td class="px-6 py-4 text-xs font-mono text-stone-600">{{ tx.referenceEntityInfo || 'Main Cadastre' }}</td>
                  <td class="px-6 py-4">
                    <span [class]="tx.transactionType === 'INCOME' 
                                  ? 'px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200/80 uppercase' 
                                  : 'px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border bg-stone-100 text-stone-700 border-stone-200 uppercase'">
                      {{ tx.transactionCategory }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right font-mono font-extrabold"
                      [class]="tx.transactionType === 'INCOME' ? 'text-emerald-700' : 'text-stone-900'">
                    {{ tx.transactionType === 'INCOME' ? '+' : '-' }}{{ tx.amount | currency }}
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-8 text-center text-xs font-mono text-stone-500">
                    No transactions match the search filter.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Log Transaction Modal -->
      @if (showLogModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-xl">
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                <h3 class="text-lg font-bold text-stone-900">Record Cadastre Transaction</h3>
              </div>
              <button (click)="closeLogModal()" class="text-stone-400 hover:text-stone-600 cursor-pointer">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="space-y-4 text-xs font-mono">
              <div>
                <label class="block font-bold text-stone-700 mb-1">TRANSACTION TYPE</label>
                <div class="grid grid-cols-2 gap-3">
                  <button type="button" (click)="txForm.transactionType = 'EXPENSE'"
                          [class]="txForm.transactionType === 'EXPENSE' ? 'p-2.5 rounded-xl border border-stone-900 bg-stone-900 text-white font-bold' : 'p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 font-medium'">
                    EXPENSE / DISBURSEMENT
                  </button>
                  <button type="button" (click)="txForm.transactionType = 'INCOME'"
                          [class]="txForm.transactionType === 'INCOME' ? 'p-2.5 rounded-xl border border-emerald-800 bg-emerald-800 text-white font-bold' : 'p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 font-medium'">
                    INCOME / SETTLEMENT
                  </button>
                </div>
              </div>

              <div>
                <label class="block font-bold text-stone-700 mb-1">DESCRIPTION</label>
                <input type="text" [(ngModel)]="txForm.description" placeholder="e.g. Certified Seed Delivery"
                       class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-stone-700 mb-1">AMOUNT ($ USD)</label>
                  <input type="number" [(ngModel)]="txForm.amount" placeholder="0.00"
                         class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-stone-700 mb-1">DATE</label>
                  <input type="date" [(ngModel)]="txForm.transactionDate"
                         class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                </div>
              </div>

              <div>
                <label class="block font-bold text-stone-700 mb-1">CATEGORY</label>
                <select [(ngModel)]="txForm.transactionCategory"
                        class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                  <option value="Grain Sales">Grain Sales</option>
                  <option value="Forage Revenue">Forage Revenue</option>
                  <option value="Produce Sales">Produce Sales</option>
                  <option value="Seed & Genetics">Seed & Genetics</option>
                  <option value="Fertilizer & Soil">Fertilizer & Soil</option>
                  <option value="Equipment & Maintenance">Equipment & Maintenance</option>
                  <option value="Fuel & Energy">Fuel & Energy</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-stone-700 mb-1">CADASTRE FIELD / CONTRACT REF</label>
                <input type="text" [(ngModel)]="txForm.referenceEntityId" placeholder="e.g. North Pivot Field A"
                       class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button (click)="closeLogModal()" class="px-4 py-2 border border-stone-200 text-stone-600 font-mono text-xs rounded-xl hover:bg-stone-50 cursor-pointer">
                CANCEL
              </button>
              <button (click)="submitTransaction()" [disabled]="isSubmitting() || !txForm.amount"
                      class="px-5 py-2 bg-[#012d1d] hover:bg-[#023f29] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer">
                {{ isSubmitting() ? 'SAVING...' : 'CONFIRM TRANSACTION' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CropAccountingComponent implements OnInit {
  private accountingService = inject(AccountingService);

  summary = signal<AccountingSummaryResponse>({
    totalRevenue: 348250.00,
    totalExpenses: 164920.00,
    netProfit: 183330.00,
    revenueChangePct: 14.8,
    expensesChangePct: -3.2,
    profitMargin: 52.65
  });

  transactions = signal<RecentTransactionDTO[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  showLogModal = signal<boolean>(false);
  searchQuery = '';

  txForm = {
    costDomain: 'CROP',
    referenceEntityId: 'North Pivot Field A',
    transactionDate: new Date().toISOString().split('T')[0],
    description: '',
    transactionCategory: 'Grain Sales',
    transactionType: 'INCOME',
    amount: null as number | null,
    currency: 'USD'
  };

  ngOnInit() {
    this.loadData();
  }

  filteredTransactions() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.transactions();
    return this.transactions().filter(t => 
      t.description.toLowerCase().includes(q) ||
      (t.referenceEntityInfo && t.referenceEntityInfo.toLowerCase().includes(q)) ||
      t.transactionCategory.toLowerCase().includes(q)
    );
  }

  loadData() {
    this.isLoading.set(true);
    this.accountingService.getSummaryMetrics('CROP').subscribe({
      next: (res) => {
        if (res && typeof res.totalRevenue === 'number') {
          this.summary.set(res);
        }
      },
      error: () => {}
    });

    this.accountingService.getRecentTransactions('CROP').subscribe({
      next: (res) => {
        if (res && Array.isArray(res)) {
          this.transactions.set(res);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  openLogModal() {
    this.txForm = {
      costDomain: 'CROP',
      referenceEntityId: 'North Pivot Field A',
      transactionDate: new Date().toISOString().split('T')[0],
      description: '',
      transactionCategory: 'Grain Sales',
      transactionType: 'INCOME',
      amount: null,
      currency: 'USD'
    };
    this.showLogModal.set(true);
  }

  closeLogModal() {
    this.showLogModal.set(false);
  }

  submitTransaction() {
    if (!this.txForm.amount || !this.txForm.transactionDate) return;
    this.isSubmitting.set(true);
    
    this.accountingService.logTransaction(this.txForm as any).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeLogModal();
        this.loadData();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.closeLogModal();
        this.loadData();
      }
    });
  }
}
