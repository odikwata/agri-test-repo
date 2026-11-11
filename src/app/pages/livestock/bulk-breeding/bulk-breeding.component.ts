import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { SpeciesService } from '../../../services/species.service';
import { SpeciesResponseModel, SpeciesType } from '../../../models/species.model';

@Component({
  selector: 'app-bulk-breeding',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="p-6  mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Bulk Breeding Record</h1>
        <p class="text-slate-500 text-sm">Log breeding events for an entire Kraal, Pen, or specific Group.</p>
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
                  [ngClass]="targetType() === 'kraal' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                >
                  <lucide-icon name="home" class="w-5 h-5"></lucide-icon>
                  Kraal
                </button>
                <button 
                  (click)="targetType.set('pen')"
                  class="py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2"
                  [ngClass]="targetType() === 'pen' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                >
                  <lucide-icon name="layers" class="w-5 h-5"></lucide-icon>
                  Pen
                </button>
                <button 
                  (click)="targetType.set('group')"
                  class="py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2"
                  [ngClass]="targetType() === 'group' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
                >
                  <lucide-icon name="users" class="w-5 h-5"></lucide-icon>
                  Group
                </button>
                <button 
                  (click)="targetType.set('animal')"
                  class="py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2"
                  [ngClass]="targetType() === 'animal' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'"
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
                    <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none bg-white">
                      <option value="">Select Species</option>
                      @for (s of speciesList(); track s.id) {
                        <option [value]="s.id">{{ s.commonName }}</option>
                      }
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Animal</label>
                    <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none bg-white">
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
                  <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none bg-white">
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
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Type</label>
                <select class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none bg-white">
                  <option>Mating / Insemination</option>
                  <option>Pregnancy Check</option>
                  <option>Birth / Calving</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Date</label>
                <input type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes & Observations</label>
              <textarea placeholder="Add details for this bulk event..." rows="4" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-4 pt-4">
              <button class="px-8 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
              <button class="px-8 py-3 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all">Log Bulk Record</button>
            </div>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="space-y-6">
          <div class="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
            <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
              <lucide-icon name="info" class="w-5 h-5 text-green-400"></lucide-icon>
              Bulk Action Summary
            </h3>
            <div class="space-y-6">
              <div class="flex justify-between items-center">
                <span class="text-xs text-slate-400 font-bold uppercase tracking-widest">Target Animals</span>
                <span class="text-lg font-black text-white">45</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-slate-400 font-bold uppercase tracking-widest">Est. Duration</span>
                <span class="text-lg font-black text-white">2.5 Hours</span>
              </div>
              <div class="pt-6 border-t border-slate-800">
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Impacted Records</p>
                <ul class="space-y-2">
                  <li class="flex items-center gap-2 text-xs text-slate-300">
                    <lucide-icon name="check" class="w-3 h-3 text-green-500"></lucide-icon>
                    Breeding History
                  </li>
                  <li class="flex items-center gap-2 text-xs text-slate-300">
                    <lucide-icon name="check" class="w-3 h-3 text-green-500"></lucide-icon>
                    Gestation Timelines
                  </li>
                  <li class="flex items-center gap-2 text-xs text-slate-300">
                    <lucide-icon name="check" class="w-3 h-3 text-green-500"></lucide-icon>
                    Dashboard Reminders
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-green-50 rounded-3xl border border-green-100 p-8">
            <h4 class="font-bold text-green-900 mb-2">Pro Tip</h4>
            <p class="text-xs text-green-700 leading-relaxed">Bulk logging mating events will automatically update the "Expected Due Date" for all healthy females in the selected group.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BulkBreedingComponent implements OnInit {
  targetType = signal('kraal');
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
