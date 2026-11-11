import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpeciesService } from '../../../services/species.service';
import { SpeciesResponseModel, SpeciesType } from '../../../models/species.model';

@Component({
  selector: 'app-bulk-health',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>OAKRIDGE CADASTRE / HERD BIOSECURITY & BULK CLINICAL PROTOCOLS</span>
          </div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Bulk Clinical & Vaccination Log</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              VET PROTOCOL ACTIVE
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a routerLink="/livestock/groups" class="px-3.5 py-2 text-xs font-mono font-medium rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all flex items-center gap-2 shadow-xs">
            <lucide-icon name="arrow-left" class="w-3.5 h-3.5 text-stone-500"></lucide-icon>
            <span>BATCH GROUPS</span>
          </a>
          <a routerLink="/livestock/health" class="px-3.5 py-2 text-xs font-mono font-medium rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all flex items-center gap-2 shadow-xs">
            <lucide-icon name="heart-pulse" class="w-3.5 h-3.5 text-stone-500"></lucide-icon>
            <span>HEALTH DASHBOARD</span>
          </a>
        </div>
      </div>

      <!-- Action Feedback Banner -->
      @if (actionFeedback()) {
        <div class="p-4 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-between font-mono text-xs">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{{ actionFeedback() }}</span>
          </div>
          <button (click)="actionFeedback.set(null)" class="text-emerald-300 hover:text-white cursor-pointer">
            <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Clinical Form -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
          <!-- Target Selection -->
          <div class="space-y-3">
            <label class="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block">TARGET BIOSECURITY UNIT</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button 
                type="button"
                (click)="targetType.set('kraal')"
                [class]="targetType() === 'kraal' ? 'py-3 px-4 rounded-xl border-2 border-emerald-800 bg-emerald-50 text-emerald-900 font-bold text-xs font-mono flex flex-col items-center gap-1.5' : 'py-3 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-mono font-medium flex flex-col items-center gap-1.5'"
              >
                <lucide-icon name="home" class="w-4 h-4"></lucide-icon>
                <span>KRAAL ENCLOSURE</span>
              </button>
              <button 
                type="button"
                (click)="targetType.set('pen')"
                [class]="targetType() === 'pen' ? 'py-3 px-4 rounded-xl border-2 border-emerald-800 bg-emerald-50 text-emerald-900 font-bold text-xs font-mono flex flex-col items-center gap-1.5' : 'py-3 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-mono font-medium flex flex-col items-center gap-1.5'"
              >
                <lucide-icon name="layers" class="w-4 h-4"></lucide-icon>
                <span>PEN BAY</span>
              </button>
              <button 
                type="button"
                (click)="targetType.set('group')"
                [class]="targetType() === 'group' ? 'py-3 px-4 rounded-xl border-2 border-emerald-800 bg-emerald-50 text-emerald-900 font-bold text-xs font-mono flex flex-col items-center gap-1.5' : 'py-3 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-mono font-medium flex flex-col items-center gap-1.5'"
              >
                <lucide-icon name="users" class="w-4 h-4"></lucide-icon>
                <span>COHORT BATCH</span>
              </button>
              <button 
                type="button"
                (click)="targetType.set('animal')"
                [class]="targetType() === 'animal' ? 'py-3 px-4 rounded-xl border-2 border-emerald-800 bg-emerald-50 text-emerald-900 font-bold text-xs font-mono flex flex-col items-center gap-1.5' : 'py-3 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-mono font-medium flex flex-col items-center gap-1.5'"
              >
                <lucide-icon name="tag" class="w-4 h-4"></lucide-icon>
                <span>INDIVIDUAL TAG</span>
              </button>
            </div>
          </div>

          <!-- Specific Target Dropdown -->
          <div class="space-y-2">
            <label class="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block">
              SELECT {{ targetType() | uppercase }}
            </label>
            @if (targetType() === 'kraal') {
              <select [(ngModel)]="selectedTarget" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                <option value="Kraal 04 (Replacement Heifer Complex) • 45 Head">Kraal 04 (Replacement Heifer Complex) • 45 Head</option>
                <option value="Kraal 02 (Lactation Parlor Holding) • 68 Head">Kraal 02 (Lactation Parlor Holding) • 68 Head</option>
                <option value="Kraal 01 (Dry Cow Transition) • 24 Head">Kraal 01 (Dry Cow Transition) • 24 Head</option>
                <option value="Kraal 08 (Biosecurity Quarantine Isolation) • 8 Head">Kraal 08 (Biosecurity Quarantine Isolation) • 8 Head</option>
              </select>
            } @else if (targetType() === 'pen') {
              <select [(ngModel)]="selectedTarget" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                <option value="Pen 12 (Replacement Heifers) • 14 Head">Pen 12 (Replacement Heifers) • 14 Head</option>
                <option value="Pen 11 (Weanling Acclimation) • 8 Head">Pen 11 (Weanling Acclimation) • 8 Head</option>
                <option value="Pen 04 (High-Yield Milkers) • 18 Head">Pen 04 (High-Yield Milkers) • 18 Head</option>
              </select>
            } @else if (targetType() === 'group') {
              <select [(ngModel)]="selectedTarget" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                <option value="Cohort Alpha (Spring 2024 Weaners) • 32 Head">Cohort Alpha (Spring 2024 Weaners) • 32 Head</option>
                <option value="Broiler Production Batch #2025-094 • 5,000 Birds">Broiler Production Batch #2025-094 • 5,000 Birds</option>
                <option value="Merino Ewe Mob Delta • 85 Head">Merino Ewe Mob Delta • 85 Head</option>
              </select>
            } @else {
              <select [(ngModel)]="selectedTarget" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                <option value="TAG-9042 • Oakridge Sovereign Belle">TAG-9042 • Oakridge Sovereign Belle (Black Angus Heifer)</option>
                <option value="TAG-881 • Oakridge Black Titan">TAG-881 • Oakridge Black Titan (Stud Bull)</option>
                <option value="TAG-442 • Bessie #AG-442">TAG-442 • Bessie #AG-442 (Dam)</option>
              </select>
            }
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block">CLINICAL PROTOCOL TYPE</label>
              <select [(ngModel)]="form.eventType" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                <option value="7-Way Clostridial Vaccination">7-Way Clostridial Vaccination</option>
                <option value="Broad-Spectrum Deworming (Ivermectin)">Broad-Spectrum Deworming (Ivermectin)</option>
                <option value="BVD-PI Ear Notch & Screen">BVD-PI Ear Notch & Screen</option>
                <option value="Brucellosis RB51 Booster">Brucellosis RB51 Booster</option>
                <option value="Hoof Trimming & Copper Sulfate Footbath">Hoof Trimming & Copper Sulfate Footbath</option>
                <option value="Electrolyte & Vitamin AD3E Therapy">Electrolyte & Vitamin AD3E Therapy</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block">DATE OF ADMINISTRATION</label>
              <input type="date" [(ngModel)]="form.eventDate" class="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block">MEDICATION / BIOLOGICAL BATCH #</label>
              <input type="text" [(ngModel)]="form.medication" placeholder="e.g. UltraChoice 7 (Batch #UC-9912)" class="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
            </div>
            <div class="space-y-1">
              <label class="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block">DOSAGE PER HEAD</label>
              <input type="text" [(ngModel)]="form.dosage" placeholder="e.g. 5 mL Sub-Q (Right Neck)" class="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block">ATTENDING VETERINARIAN / VET TECH</label>
            <input type="text" [(ngModel)]="form.practitioner" placeholder="Dr. Sarah Jenkins (Chief Veterinarian)" class="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
          </div>

          <div class="space-y-1">
            <label class="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block">CLINICAL OBSERVATIONS & NOTES</label>
            <textarea [(ngModel)]="form.notes" rows="3" placeholder="Batch demonstrated uniform body condition. No adverse anaphylactic responses observed during 30-minute post-injection hold..." class="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white resize-none"></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <a routerLink="/livestock/groups" class="px-4 py-2 border border-stone-200 text-stone-600 font-mono text-xs rounded-xl hover:bg-stone-50 cursor-pointer">
              CANCEL
            </a>
            <button (click)="submitBulkHealth()" class="px-5 py-2.5 bg-[#012d1d] hover:bg-[#023f29] text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer">
              <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
              <span>COMMIT BATCH CLINICAL RECORD</span>
            </button>
          </div>
        </div>

        <!-- Biosecurity & Compliance Summary Panel -->
        <div class="space-y-5">
          <div class="bg-stone-900 rounded-2xl p-6 text-white space-y-4 shadow-sm border border-stone-800">
            <div class="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 class="font-bold text-sm font-mono flex items-center gap-2">
                <lucide-icon name="shield-check" class="w-4 h-4 text-emerald-400"></lucide-icon>
                <span>BIOSECURITY PROTOCOL AUDIT</span>
              </h3>
              <span class="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-md">VERIFIED</span>
            </div>

            <div class="space-y-3 font-mono text-xs">
              <div class="flex justify-between items-center text-stone-300">
                <span>Target Head Count:</span>
                <span class="text-white font-bold text-sm">45 Head</span>
              </div>
              <div class="flex justify-between items-center text-stone-300">
                <span>Estimated Dose Draw:</span>
                <span class="text-white font-bold">225 mL</span>
              </div>
              <div class="flex justify-between items-center text-stone-300">
                <span>Withholding Period (Meat):</span>
                <span class="text-amber-400 font-bold">21 Days</span>
              </div>
              <div class="flex justify-between items-center text-stone-300">
                <span>Withholding Period (Milk):</span>
                <span class="text-emerald-400 font-bold">0 Days</span>
              </div>
            </div>

            <div class="pt-3 border-t border-stone-800 space-y-2 text-xs font-mono text-stone-300">
              <span class="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Automated System Triggers</span>
              <div class="flex items-center gap-2 text-stone-300">
                <lucide-icon name="check" class="w-3.5 h-3.5 text-emerald-400"></lucide-icon>
                <span>Updates individual health dossier timestamps</span>
              </div>
              <div class="flex items-center gap-2 text-stone-300">
                <lucide-icon name="check" class="w-3.5 h-3.5 text-emerald-400"></lucide-icon>
                <span>Deducts pharmaceutical inventory reserves</span>
              </div>
              <div class="flex items-center gap-2 text-stone-300">
                <lucide-icon name="check" class="w-3.5 h-3.5 text-emerald-400"></lucide-icon>
                <span>Schedules booster reminders in 21 days</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2 text-xs font-mono text-stone-600">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Cadastre Farm Rule</span>
            <p class="leading-relaxed">
              All biological products must be administered strictly in compliance with cold-chain storage specs (2°C - 8°C). Any temperature excursion automatically invalidates batch registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BulkHealthComponent implements OnInit {
  targetType = signal('kraal');
  selectedTarget = 'Kraal 04 (Replacement Heifer Complex) • 45 Head';
  actionFeedback = signal<string | null>(null);
  speciesList = signal<SpeciesResponseModel[]>([]);
  
  private speciesService = inject(SpeciesService);

  form = {
    eventType: '7-Way Clostridial Vaccination',
    eventDate: new Date().toISOString().split('T')[0],
    medication: 'UltraChoice 7 (Batch #UC-9912)',
    dosage: '5 mL Sub-Q (Right Neck)',
    practitioner: 'Dr. Sarah Jenkins (Chief Veterinarian)',
    notes: 'Batch demonstrated uniform docility. Clear mucous membranes.'
  };

  ngOnInit() {
    this.speciesService.getAllSpecies().subscribe({
      next: (data) => this.speciesList.set(data.content),
      error: () => {
        this.speciesList.set([
          { id: 's1', commonName: 'Cattle', scientificName: 'Bos taurus', type: SpeciesType.ANIMAL, genus: 'Bos', family: 'Bovidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's2', commonName: 'Sheep', scientificName: 'Ovis aries', type: SpeciesType.ANIMAL, genus: 'Ovis', family: 'Bovidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's3', commonName: 'Goats', scientificName: 'Capra hircus', type: SpeciesType.ANIMAL, genus: 'Capra', family: 'Bovidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's4', commonName: 'Pigs', scientificName: 'Sus domesticus', type: SpeciesType.ANIMAL, genus: 'Sus', family: 'Suidae', speciesSpecificData: {}, speciesConfigData: {} }
        ]);
      }
    });
  }

  submitBulkHealth() {
    this.actionFeedback.set(`Successfully logged batch ${this.form.eventType} for ${this.selectedTarget}. 45 animal dossiers synced.`);
  }
}
