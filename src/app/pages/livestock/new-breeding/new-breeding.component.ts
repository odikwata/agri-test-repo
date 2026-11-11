import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-new-breeding-record',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [ngClass]="isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm' : 'p-6 max-w-4xl mx-auto'">
      <div [ngClass]="isModal ? 'bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative' : ''">
        
        @if (isModal) {
          <button (click)="close.emit()" class="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        }

        <div [ngClass]="isModal ? 'p-8' : ''">
          <div class="mb-8">
            <h1 class="text-3xl font-black text-slate-900 mb-2">New Breeding Record</h1>
            <p class="text-slate-500 text-sm">Record breeding events and monitor pregnancy status for individual animals.</p>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <!-- Active Animal Banner -->
            <div class="bg-green-50 rounded-2xl p-6 mb-8 flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200">
                <lucide-icon name="paw-print" class="w-6 h-6"></lucide-icon>
              </div>
              <div>
                <p class="text-[10px] font-black text-green-600 uppercase tracking-widest">Active Animal</p>
                <h3 class="text-lg font-bold text-green-900">Daisy #BR-452 (Jersey Heifer)</h3>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <lucide-icon name="calendar" class="w-3 h-3 text-green-600"></lucide-icon>
                  Event Date
                </label>
                <div class="relative">
                  <input type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white">
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <lucide-icon name="git-merge" class="w-3 h-3 text-green-600"></lucide-icon>
                  Record Type
                </label>
                <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none bg-white">
                  <option>Mating / Insemination</option>
                  <option>Pregnancy Check</option>
                  <option>Birth / Calving</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <lucide-icon name="user" class="w-3 h-3 text-green-600"></lucide-icon>
                  Partner / Sire ID
                </label>
                <div class="relative">
                  <input type="text" placeholder="e.g. BULL-007 or Semen Batch ID" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <lucide-icon name="target" class="w-3 h-3 text-green-600"></lucide-icon>
                  Event Result
                </label>
                <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none bg-white">
                  <option>Pending Status</option>
                  <option>Successful</option>
                  <option>Unsuccessful</option>
                </select>
              </div>
            </div>

            <div class="space-y-2 mb-8">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <lucide-icon name="file-text" class="w-3 h-3 text-green-600"></lucide-icon>
                Notes & Observations
              </label>
              <textarea placeholder="Add any specific details (e.g., ease of calving, behavior, specific medications used...)" rows="4" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"></textarea>
            </div>

            <div class="space-y-2 mb-8">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <lucide-icon name="upload" class="w-3 h-3 text-green-600"></lucide-icon>
                Attachments
              </label>
              <div class="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-all group">
                <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                  <lucide-icon name="upload" class="w-6 h-6 text-slate-400"></lucide-icon>
                </div>
                <h4 class="font-bold text-slate-900 mb-1">Click to upload or drag and drop</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PDF, JPG, PNG (Max 5MB)</p>
              </div>
            </div>

            <div class="flex justify-end gap-4">
              <button (click)="close.emit()" class="px-8 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
              <button class="px-8 py-3 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all">Save Breeding Record</button>
            </div>
          </div>

          <!-- Pro Tip Banner -->
          <div class="mt-8 bg-blue-50 rounded-2xl border border-blue-100 p-6 flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
              <lucide-icon name="lightbulb" class="w-5 h-5"></lucide-icon>
            </div>
            <div>
              <h4 class="font-bold text-blue-900">Pro Tip: Automated Reminders</h4>
              <p class="text-xs text-blue-700 leading-relaxed">Saving a Mating record will automatically schedule a pregnancy check reminder for 30 days from today in your Dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NewBreedingRecordComponent {
  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();
}
