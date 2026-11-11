import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CropService } from '../../../services/crop.service';
import { FieldMapService, MapElement } from '../../../services/field-map.service';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planting-calendar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
  template: `
    <div class="p-6 max-w-8xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button routerLink="/crops/planting" class="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors">
            <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
          </button>
          <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <lucide-icon name="calendar-days" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Planting Calendar</h1>
            <p class="text-sm text-slate-500">Timeline view of planting schedules and upcoming events.</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="openNewPlantingModal()" class="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            New Planting
          </button>
          <div class="h-6 w-px bg-slate-200"></div>
          <button class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
          </button>
          <span class="font-bold text-slate-900 text-sm">September 2024</span>
          <button class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>

      <!-- Upcoming Schedule List (Calendar alternative) -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <lucide-icon name="calendar" class="w-5 h-5 text-emerald-600"></lucide-icon>
          Upcoming Plantings & Harvests
        </h3>
        
        <div class="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          @for (schedule of upcomingSchedule(); track schedule.activityId) {
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <!-- Icon -->
              <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"
                   [ngClass]="{
                     'bg-blue-100 text-blue-600': schedule.status === 'READY',
                     'bg-emerald-100 text-emerald-600': schedule.status === 'PLANNED'
                   }">
                <lucide-icon name="leaf" class="w-4 h-4"></lucide-icon>
              </div>
              
              <!-- Card -->
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-emerald-600 text-sm">{{ schedule.plannedStartDate | date }}</span>
                  <span class="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{{ schedule.status }}</span>
                </div>
                <h4 class="font-bold text-slate-900 mb-1">{{ schedule.activityTitle }}</h4>
                <p class="text-sm text-slate-600 mb-3">{{ schedule.cropVariety }} - {{ schedule.targetField }}</p>
                <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <lucide-icon name="clock" class="w-3 h-3"></lucide-icon>
                  Est: {{ schedule.estimatedDuration }}
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- New Planting Modal -->
      @if (showNewPlantingModal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-900">Start New Planting</h2>
              <button (click)="closeNewPlantingModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto">
              <p class="text-sm text-slate-500 mb-6">Select a field for your new planting cycle, or let our AI suggest the best field based on soil fertility and history.</p>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-2">Select Field</label>
                  <select [(ngModel)]="selectedFieldId" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                    <option value="">-- Choose a field --</option>
                    @for (field of fields; track field.id) {
                      <option [value]="field.id">{{ field.name }} ({{ field.size }} ha)</option>
                    }
                  </select>
                </div>
                
                <div class="relative py-4">
                  <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="w-full border-t border-slate-200"></div>
                  </div>
                  <div class="relative flex justify-center">
                    <span class="bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Or</span>
                  </div>
                </div>

                <button (click)="suggestFieldWithAI()" [disabled]="isSuggesting" class="w-full px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:from-violet-700 hover:to-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  @if (isSuggesting) {
                    <lucide-icon name="loader-2" class="w-4 h-4 animate-spin"></lucide-icon>
                    Analyzing Soil Data...
                  } @else {
                    <lucide-icon name="sparkles" class="w-4 h-4"></lucide-icon>
                    Ask AI for Best Field
                  }
                </button>
                
                @if (aiSuggestion) {
                  <div class="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div class="flex items-start gap-3">
                      <lucide-icon name="sparkles" class="w-5 h-5 text-indigo-600 shrink-0 mt-0.5"></lucide-icon>
                      <div>
                        <h4 class="font-bold text-indigo-900 text-sm">AI Suggestion</h4>
                        <p class="text-sm text-indigo-700 mt-1">{{ aiSuggestion }}</p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
            
            <div class="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button (click)="closeNewPlantingModal()" class="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Cancel
              </button>
              <button 
                (click)="proceedToNewPlanting()" 
                [disabled]="!selectedFieldId"
                class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Proceed to Planting
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PlantingCalendarComponent implements OnInit {
  private cropService = inject(CropService);
  upcomingSchedule = toSignal(this.cropService.getUpcomingSchedule(), { initialValue: [] });
  showNewPlantingModal = false;
  fields: MapElement[] = [];
  selectedFieldId = '';
  isSuggesting = false;
  aiSuggestion = '';

  private fieldMapService = inject(FieldMapService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  ngOnInit() {
    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      this.fieldMapService.loadFieldsForFarm(farmId).subscribe({
        next: (fields) => {
          this.fields = fields.filter(f => f.type === 'CROP_FIELD' || !f.type);
        }
      });
    }
  }

  openNewPlantingModal() {
    this.showNewPlantingModal = true;
    this.selectedFieldId = '';
    this.aiSuggestion = '';
  }

  closeNewPlantingModal() {
    this.showNewPlantingModal = false;
  }

  suggestFieldWithAI() {
    this.isSuggesting = true;
    this.aiSuggestion = '';
    
    // Simulate AI suggestion delay
    setTimeout(() => {
      this.isSuggesting = false;
      if (this.fields.length > 0) {
        // Pick a random field or first field
        const bestField = this.fields[0];
        this.selectedFieldId = bestField.id;
        this.aiSuggestion = `Based on recent soil tests and crop rotation history, "${bestField.name}" has the optimal nitrogen levels and moisture retention for a new planting cycle.`;
      } else {
        this.aiSuggestion = "No available fields found to analyze.";
      }
    }, 1500);
  }

  proceedToNewPlanting() {
    if (this.selectedFieldId) {
      this.closeNewPlantingModal();
      this.router.navigate(['/crops/new-planting'], { queryParams: { fieldId: this.selectedFieldId } });
    }
  }

}
