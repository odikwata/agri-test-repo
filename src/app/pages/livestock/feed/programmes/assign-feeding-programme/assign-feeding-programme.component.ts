import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assign-feeding-programme',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb & Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>OAKRIDGE CADASTRE / NUTRITION & FEEDING PROTOCOLS</span>
          </div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Assign Feeding Programme</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              NUTRITION DISPATCH
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a [routerLink]="['..']" class="px-3.5 py-2 text-xs font-mono font-medium rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all flex items-center gap-2 shadow-xs">
            <lucide-icon name="arrow-left" class="w-3.5 h-3.5 text-stone-500"></lucide-icon>
            <span>BACK TO PROGRAMMES</span>
          </a>
        </div>
      </div>

      <!-- Main Form Container -->
      <div class="max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="p-6 sm:p-8 space-y-8">
          <!-- Step 1: Select Programme -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-xs">1</span>
              <h3 class="text-lg font-bold text-stone-900">Select Nutrition Programme</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
              <div class="space-y-1.5">
                <label class="text-xs font-mono font-bold text-stone-600 uppercase tracking-wider block">FEEDING RECIPE / PROGRAMME</label>
                <div class="relative">
                  <select class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-all font-mono text-xs font-bold text-stone-800">
                    <option>High-Yield Lactation TMR Recipe #L-04</option>
                    <option>Replacement Heifer Growth Mix #GH-02</option>
                    <option>Winter Rangeland Protein Lick Block</option>
                    <option>Weanling Calf Starter Pellet Protocol</option>
                  </select>
                  <lucide-icon name="chevron-down" class="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"></lucide-icon>
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-mono font-bold text-stone-600 uppercase tracking-wider block">START DATE OF RATION</label>
                <input type="date" value="2026-10-05" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-all font-mono text-xs font-bold text-stone-800">
              </div>
            </div>
          </div>

          <!-- Step 2: Select Target -->
          <div class="space-y-4 pt-4 border-t border-stone-100">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-xs">2</span>
              <h3 class="text-lg font-bold text-stone-900">Select Target Enclosure or Cohort</h3>
            </div>
            
            <div class="pl-10 space-y-4">
              <div class="flex p-1 bg-stone-100 rounded-xl w-fit font-mono text-xs">
                <button 
                  type="button"
                  (click)="targetType.set('kraal')"
                  [class]="targetType() === 'kraal' ? 'bg-white text-emerald-900 font-bold shadow-xs px-4 py-2 rounded-lg' : 'text-stone-600 font-medium px-4 py-2 hover:text-stone-900'">
                  KRAAL ENCLOSURE
                </button>
                <button 
                  type="button"
                  (click)="targetType.set('group')"
                  [class]="targetType() === 'group' ? 'bg-white text-emerald-900 font-bold shadow-xs px-4 py-2 rounded-lg' : 'text-stone-600 font-medium px-4 py-2 hover:text-stone-900'">
                  COHORT GROUP
                </button>
                <button 
                  type="button"
                  (click)="targetType.set('pen')"
                  [class]="targetType() === 'pen' ? 'bg-white text-emerald-900 font-bold shadow-xs px-4 py-2 rounded-lg' : 'text-stone-600 font-medium px-4 py-2 hover:text-stone-900'">
                  PEN BAY
                </button>
              </div>

              <div class="space-y-1.5 max-w-md">
                <label class="text-xs font-mono font-bold text-stone-600 uppercase tracking-wider block">CADASTRE HOUSING SELECTION</label>
                <div class="relative">
                  <select class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-all font-mono text-xs font-bold text-stone-800">
                    <option>Kraal 04 (Replacement Heifer Complex) • 45 Head</option>
                    <option>Kraal 02 (Lactation Parlor Holding) • 68 Head</option>
                    <option>Kraal 01 (Dry Cow Transition) • 24 Head</option>
                    <option>Pen 12 (Replacement Heifers) • 14 Head</option>
                  </select>
                  <lucide-icon name="chevron-down" class="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Schedule Preview -->
          <div class="space-y-4 pt-4 border-t border-stone-100">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-xs">3</span>
              <h3 class="text-lg font-bold text-stone-900">Ration Distribution Schedule</h3>
            </div>
            
            <div class="pl-10">
              <div class="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden font-mono text-xs">
                <div class="divide-y divide-stone-200/70">
                  <!-- Morning -->
                  <div class="p-4 flex items-center justify-between hover:bg-white transition-all">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-xl bg-emerald-100 flex flex-col items-center justify-center text-emerald-800">
                        <span class="text-[9px] font-bold uppercase">DAY 1</span>
                        <span class="text-xs font-extrabold">MON</span>
                      </div>
                      <div>
                        <h4 class="font-bold text-stone-900">Morning TMR Dispense</h4>
                        <p class="text-stone-500 text-[11px]">Corn Silage (18kg/hd) + Protein Concentrate (2.5kg) + Macro Minerals</p>
                      </div>
                    </div>
                    <span class="text-stone-400 font-bold">06:30 AM</span>
                  </div>

                  <!-- Afternoon -->
                  <div class="p-4 flex items-center justify-between hover:bg-white transition-all">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-xl bg-emerald-100 flex flex-col items-center justify-center text-emerald-800">
                        <span class="text-[9px] font-bold uppercase">DAY 1</span>
                        <span class="text-xs font-extrabold">MON</span>
                      </div>
                      <div>
                        <h4 class="font-bold text-stone-900">Afternoon Forage Top-Up</h4>
                        <p class="text-stone-500 text-[11px]">Alfalfa Hay (6kg/hd) - Free Choice Bunk Access</p>
                      </div>
                    </div>
                    <span class="text-stone-400 font-bold">04:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-5 bg-stone-50 border-t border-stone-200 flex justify-end gap-3 items-center">
          <a [routerLink]="['..']" class="px-4 py-2 border border-stone-200 text-stone-600 font-mono text-xs rounded-xl hover:bg-white cursor-pointer">
            CANCEL
          </a>
          <button class="px-5 py-2.5 bg-[#012d1d] hover:bg-[#023f29] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer">
            <span>DISPATCH FEEDING PROGRAMME</span>
            <lucide-icon name="send" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class AssignFeedingProgrammeComponent {
  targetType = signal('kraal');
}
