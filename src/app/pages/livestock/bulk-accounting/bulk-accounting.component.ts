import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { SpeciesService } from '../../../services/species.service';
import { SpeciesResponseModel, SpeciesType } from '../../../models/species.model';

@Component({
  selector: 'app-bulk-accounting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="p-6 mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Bulk Accounting Transaction</h1>
        <p class="text-slate-500 text-sm">Record financial entries for an entire Kraal, Pen, or specific Group.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div class="space-y-8">
            <!-- Target Selection -->
            <div class="space-y-4">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Target Type</label>
              <div class="grid grid-cols-4 gap-4">
                <button 
                  (click)="targetType.set('kraal')"
                  class="py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2"
                  [ngClass]="targetType() === 'kraal' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                >
                  <lucide-icon name="home" class="w-5 h-5"></lucide-icon>
                  Kraal
                </button>
                <button 
                  (click)="targetType.set('pen')"
                  class="py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2"
                  [ngClass]="targetType() === 'pen' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                >
                  <lucide-icon name="layers" class="w-5 h-5"></lucide-icon>
                  Pen
                </button>
                <button 
                  (click)="targetType.set('group')"
                  class="py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2"
                  [ngClass]="targetType() === 'group' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                >
                  <lucide-icon name="users" class="w-5 h-5"></lucide-icon>
                  Group
                </button>
                <button 
                  (click)="targetType.set('animal')"
                  class="py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2"
                  [ngClass]="targetType() === 'animal' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                >
                  <lucide-icon name="dog" class="w-5 h-5"></lucide-icon>
                  Animal
                </button>
              </div>
            </div>

            <!-- Specific Target -->
            <div class="space-y-4">
              @if (targetType() === 'animal') {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Species</label>
                    <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none bg-white">
                      <option value="">Select Species</option>
                      @for (s of speciesList(); track s.id) {
                        <option [value]="s.id">{{ s.commonName }}</option>
                      }
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Animal</label>
                    <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none bg-white">
                      <option>Athena (A-42)</option>
                      <option>Luna (L-90)</option>
                      <option>Bessie (B-12)</option>
                    </select>
                  </div>
                </div>
              } @else {
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Select {{ targetType() | titlecase }}
                  </label>
                  <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none bg-white">
                    @if (targetType() === 'kraal') {
                      <option>North Kraal (45 animals)</option>
                      <option>South Kraal (32 animals)</option>
                      <option>East Kraal (12 animals)</option>
                    } @else if (targetType() === 'pen') {
                      <option>Pen A-1 (12 animals)</option>
                      <option>Pen A-2 (10 animals)</option>
                      <option>Pen B-1 (15 animals)</option>
                    } @else {
                      <option>Weaners (24 animals)</option>
                      <option>Premium Bulls (5 animals)</option>
                      <option>High Producers (18 animals)</option>
                    }
                  </select>
                </div>
              }
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Type</label>
                <div class="grid grid-cols-2 gap-4">
                  <button 
                    (click)="transactionType.set('expense')"
                    class="py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2"
                    [ngClass]="transactionType() === 'expense' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                  >
                    <lucide-icon name="arrow-down-right" class="w-4 h-4"></lucide-icon>
                    Expense
                  </button>
                  <button 
                    (click)="transactionType.set('income')"
                    class="py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2"
                    [ngClass]="transactionType() === 'income' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                  >
                    <lucide-icon name="arrow-up-right" class="w-4 h-4"></lucide-icon>
                    Income
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none bg-white">
                  <option>Feed & Nutrition</option>
                  <option>Medical & Vet</option>
                  <option>Equipment & Maintenance</option>
                  <option>Sale of Livestock</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Calculation</label>
                <div class="grid grid-cols-2 gap-4">
                  <button 
                    (click)="calcType.set('perHead')"
                    class="py-3 px-4 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2"
                    [ngClass]="calcType() === 'perHead' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                  >
                    Per Head
                  </button>
                  <button 
                    (click)="calcType.set('total')"
                    class="py-3 px-4 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2"
                    [ngClass]="calcType() === 'total' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                  >
                    Total Amount
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount ($)</label>
                <input type="number" placeholder="0.00" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
              <textarea placeholder="Add details for this bulk transaction..." rows="3" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-4 pt-4">
              <button class="px-8 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
              <button class="px-8 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all">Log Bulk Transaction</button>
            </div>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="space-y-6">
          <div class="bg-amber-600 rounded-3xl p-8 text-white shadow-xl shadow-amber-200">
            <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
              <lucide-icon name="dollar-sign" class="w-5 h-5 text-amber-200"></lucide-icon>
              Financial Summary
            </h3>
            <div class="space-y-6">
              <div class="flex justify-between items-center">
                <span class="text-xs text-amber-100 font-bold uppercase tracking-widest">Target Animals</span>
                <span class="text-lg font-black text-white">45</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-amber-100 font-bold uppercase tracking-widest">Total Transaction</span>
                <span class="text-lg font-black text-white">$1,125.00</span>
              </div>
              <div class="pt-6 border-t border-amber-500">
                <p class="text-[10px] text-amber-100 font-bold uppercase tracking-widest mb-2">Impacted Records</p>
                <ul class="space-y-2">
                  <li class="flex items-center gap-2 text-xs text-amber-100">
                    <lucide-icon name="check" class="w-3 h-3 text-amber-200"></lucide-icon>
                    Individual Animal Ledgers
                  </li>
                  <li class="flex items-center gap-2 text-xs text-amber-100">
                    <lucide-icon name="check" class="w-3 h-3 text-amber-200"></lucide-icon>
                    Herd Profitability Report
                  </li>
                  <li class="flex items-center gap-2 text-xs text-amber-100">
                    <lucide-icon name="check" class="w-3 h-3 text-amber-200"></lucide-icon>
                    Tax Compliance Logs
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-amber-50 rounded-3xl border border-amber-100 p-8">
            <h4 class="font-bold text-amber-900 mb-2">Pro Tip</h4>
            <p class="text-xs text-amber-700 leading-relaxed">Using "Per Head" calculation automatically distributes the cost across all animals in the selected group, simplifying individual animal accounting.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BulkAccountingComponent implements OnInit {
  targetType = signal('kraal');
  transactionType = signal('expense');
  calcType = signal('perHead');
  speciesList = signal<SpeciesResponseModel[]>([]);
  
  private speciesService = inject(SpeciesService);

  ngOnInit() {
    this.speciesService.getAllSpecies().subscribe({
      next: (data) => this.speciesList.set(data.content),
      error: (err) => {
        console.error('Failed to load species', err);
        this.speciesList.set([
          { id: 's1', commonName: 'Cattle', scientificName: 'Bos taurus', type: SpeciesType.ANIMAL, genus: 'Bos', family: 'Bovidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's2', commonName: 'Sheep', scientificName: 'Ovis aries', type: SpeciesType.ANIMAL, genus: 'Ovis', family: 'Bovidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's3', commonName: 'Goats', scientificName: 'Capra hircus', type: SpeciesType.ANIMAL, genus: 'Capra', family: 'Bovidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's4', commonName: 'Pigs', scientificName: 'Sus domesticus', type: SpeciesType.ANIMAL, genus: 'Sus', family: 'Suidae', speciesSpecificData: {}, speciesConfigData: {} }
        ]);
      }
    });
  }
}
