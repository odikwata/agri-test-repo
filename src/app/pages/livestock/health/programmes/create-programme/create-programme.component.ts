import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-programme',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
  template: `
    <div class="mt-4 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center gap-4">
        <button [routerLink]="['..']" class="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
          <lucide-icon name="arrow-left" class="w-6 h-6"></lucide-icon>
        </button>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Create Vaccination Programme</h1>
          <p class="text-sm text-slate-500">Define protocols, schedules, and specific dosages for your livestock health management.</p>
        </div>
      </div>

      <!-- Basics Card -->
      <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-8 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
        <div class="flex flex-col md:flex-row gap-8">
          <div class="w-full md:w-64">
            <div class="aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100 relative group cursor-pointer">
              <img src="https://picsum.photos/seed/farm/400/225" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <lucide-icon name="camera" class="w-8 h-8 text-white"></lucide-icon>
              </div>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">Programme Basics</h4>
            <p class="text-[10px] text-slate-400 leading-relaxed">Every protocol needs a unique identity and clear purpose.</p>
          </div>
          
          <div class="flex-1 space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Programme Name</label>
              <input type="text" placeholder="e.g., Bovine Respiratory Protocol" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
              <textarea rows="4" placeholder="Describe the goals, target age group, or specific conditions for this programme..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Section -->
      <div class="space-y-6 mb-12">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-slate-900 tracking-tight">Vaccination Schedule</h2>
          <button (click)="showAddStepModal.set(true)" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            Add New Step
          </button>
        </div>

        <div class="space-y-4">
          @for (step of steps; track $index) {
            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-6 group">
              <div class="w-12 h-12 rounded-full bg-green-50 flex flex-col items-center justify-center text-green-600 shrink-0">
                <span class="text-lg font-black leading-none">{{ $index + 1 }}</span>
              </div>
              
              <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-1">
                  <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vaccine Name</p>
                  <input type="text" [(ngModel)]="step.name" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                </div>
                <div class="space-y-1">
                  <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Timing</p>
                  <input type="text" [(ngModel)]="step.timing" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                </div>
                <div class="space-y-1">
                  <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dosage</p>
                  <input type="text" [(ngModel)]="step.dosage" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                </div>
              </div>
              
              <button (click)="removeStep($index)" class="p-2 text-slate-300 hover:text-red-500 transition-all">
                <lucide-icon name="trash-2" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
          }

          <!-- Empty State / Add Another -->
          <button 
            (click)="showAddStepModal.set(true)"
            class="w-full py-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-green-500 hover:text-green-500 transition-all group">
            <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-green-50 transition-all">
              <lucide-icon name="plus" class="w-6 h-6"></lucide-icon>
            </div>
            <span class="font-bold text-sm">Add another vaccination step</span>
          </button>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-end gap-4 pt-8 border-t border-slate-200">
        <button [routerLink]="['..']" class="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
        <button class="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/20">Create Programme</button>
      </div>
    </div>

    <!-- Add Step Modal -->
    @if (showAddStepModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <lucide-icon name="plus-circle" class="w-6 h-6"></lucide-icon>
              </div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">Add Vaccination Step</h3>
            </div>
            <button (click)="showAddStepModal.set(false)" class="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
              <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
          
          <div class="p-8 space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Vaccine Name</label>
              <input type="text" placeholder="Enter vaccine name" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
            </div>
            
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Timing</label>
                <input type="text" placeholder="e.g., Day 1, Week 4" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Dosage</label>
                <input type="text" placeholder="e.g., 2 mL" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Administration Method</label>
              <select class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none">
                <option>Select method</option>
                <option>Subcutaneous (SQ)</option>
                <option>Intramuscular (IM)</option>
                <option>Oral</option>
                <option>Intranasal</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Targeted Health Concern</label>
              <input type="text" placeholder="Enter health concern" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Notes</label>
              <textarea rows="3" placeholder="Additional instructions or details..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"></textarea>
            </div>
          </div>

          <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button (click)="showAddStepModal.set(false)" class="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <button (click)="addStep()" class="px-8 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20">Add Step</button>
          </div>
        </div>
      </div>
    }
  `
})
export class CreateProgrammeComponent {
  showAddStepModal = signal(false);
  
  steps = [
    { name: 'Inforce 3', timing: 'Day 1 (At birth)', dosage: '2 mL' },
    { name: '', timing: '', dosage: '' }
  ];

  addStep() {
    this.steps.push({ name: '', timing: '', dosage: '' });
    this.showAddStepModal.set(false);
  }

  removeStep(index: number) {
    this.steps.splice(index, 1);
  }
}
