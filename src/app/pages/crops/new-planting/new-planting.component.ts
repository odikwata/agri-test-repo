import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CropService, CropSpeciesResponse, CropVarietyResponse, GrowthProgramDropDownList, CropStageDTO } from '../../../services/crop.service';
import { FieldMapService, MapElement } from '../../../services/field-map.service';
import { SessionService } from '../../../services/session.service';

export interface PlantingInputItem {
  id: string;
  category: 'SEED' | 'FERTILIZER' | 'CHEMISTRY' | 'MACHINERY' | 'LABOUR' | 'AMENDMENT' | 'OTHER';
  name: string;
  measurementUnit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  // Machinery specific
  fuelUsedLiters?: number;
  operatingHours?: number;
  machineryType?: string;
  // Labour specific
  laborWorkers?: number;
  laborHours?: number;
  laborActivity?: string;
  // Notes / formulation
  notes?: string;
}

interface GrowthPlanOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-new-planting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-8xl mx-auto space-y-6">
      <!-- Action / Notification Feedback Banner -->
      @if (actionFeedback()) {
        <div class="p-3.5 bg-emerald-900 text-emerald-100 rounded-xl text-xs font-mono font-bold flex items-center justify-between shadow-lg border border-emerald-700 animate-in fade-in duration-200">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
            <span>{{ actionFeedback() }}</span>
          </div>
          <button (click)="actionFeedback.set(null)" class="text-emerald-300 hover:text-white cursor-pointer">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      }

      <!-- Page Header matching Register New Animal & Herd Enrollment -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <a routerLink="/crops" class="text-slate-400 hover:text-[#012d1d] transition-colors flex items-center gap-1 text-xs font-bold">
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Crop Management</span>
            </a>
            <span class="text-slate-300">&bull;</span>
            <span class="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">ISOBUS SPEC REV 3.2</span>
            <span class="text-slate-300">&bull;</span>
            <span class="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              DRAFT #CYC-2025-042
            </span>
          </div>
          <h1 class="font-heading text-2xl font-bold text-slate-900 tracking-tight">New Planting Cycle</h1>
          <p class="text-xs text-slate-500 mt-1">Multi-stage field cadastre assignment, precision varietal genetics, variable rate seed prescriptions, and telemetry calibration.</p>
        </div>

        <!-- Quick Action Buttons matching Register New Animal -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <a routerLink="/crops" class="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Cancel</span>
          </a>
          <button type="button" (click)="saveDraft()" class="px-4 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">save</span>
            <span>{{ isDraftSaved() ? 'Draft Saved ✓' : 'Save Draft' }}</span>
          </button>
          <button type="button" (click)="save()" [disabled]="isSaving()" class="px-5 py-2.5 bg-[#012d1d] text-white hover:bg-[#1b4332] rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
            @if (!isSaving()) {
              <span class="material-symbols-outlined text-[18px]">verified</span>
            } @else {
              <span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            }
            <span>{{ isSaving() ? 'Saving Planting...' : 'Confirm & Lock Planting Cycle' }}</span>
          </button>
        </div>
      </div>

      <!-- Top Multi-Stage Stepper Ribbon from Uploaded Image -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <!-- Step 1 (Active) -->
          <div 
            (click)="activeStep.set(1)"
            [class]="activeStep() === 1 ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600' : 'border-slate-200 hover:bg-slate-50'"
            class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer">
            <div 
              [class]="activeStep() === 1 ? 'bg-[#012d1d] text-white' : 'bg-slate-100 text-slate-600'"
              class="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0">
              01
            </div>
            <div class="min-w-0">
              <div class="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-800">
                {{ activeStep() === 1 ? 'STAGE 1 • ACTIVE' : 'STAGE 1' }}
              </div>
              <div class="text-xs font-bold text-slate-900 truncate">Field Cadastre</div>
            </div>
          </div>

          <!-- Step 2 -->
          <div 
            (click)="activeStep.set(2)"
            [class]="activeStep() === 2 ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600' : 'border-slate-200 hover:bg-slate-50'"
            class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer">
            <div 
              [class]="activeStep() === 2 ? 'bg-[#012d1d] text-white' : 'bg-slate-100 text-slate-600'"
              class="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0">
              02
            </div>
            <div class="min-w-0">
              <div class="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500">
                {{ activeStep() === 2 ? 'STAGE 2 • ACTIVE' : 'STAGE 2' }}
              </div>
              <div class="text-xs font-bold text-slate-900 truncate">Seed &amp; Hybrid</div>
            </div>
          </div>

          <!-- Step 3 -->
          <div 
            (click)="activeStep.set(3)"
            [class]="activeStep() === 3 ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600' : 'border-slate-200 hover:bg-slate-50'"
            class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer">
            <div 
              [class]="activeStep() === 3 ? 'bg-[#012d1d] text-white' : 'bg-slate-100 text-slate-600'"
              class="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0">
              03
            </div>
            <div class="min-w-0">
              <div class="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500">
                {{ activeStep() === 3 ? 'STAGE 3 • ACTIVE' : 'STAGE 3' }}
              </div>
              <div class="text-xs font-bold text-slate-900 truncate">Soil Telemetry</div>
            </div>
          </div>

          <!-- Step 4 -->
          <div 
            (click)="activeStep.set(4)"
            [class]="activeStep() === 4 ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600' : 'border-slate-200 hover:bg-slate-50'"
            class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer">
            <div 
              [class]="activeStep() === 4 ? 'bg-[#012d1d] text-white' : 'bg-slate-100 text-slate-600'"
              class="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0">
              04
            </div>
            <div class="min-w-0">
              <div class="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500">
                {{ activeStep() === 4 ? 'STAGE 4 • ACTIVE' : 'STAGE 4' }}
              </div>
              <div class="text-xs font-bold text-slate-900 truncate">Fertility &amp; Inputs</div>
            </div>
          </div>

          <!-- Step 5 -->
          <div 
            (click)="activeStep.set(5)"
            [class]="activeStep() === 5 ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600' : 'border-slate-200 hover:bg-slate-50'"
            class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer col-span-2 md:col-span-1">
            <div 
              [class]="activeStep() === 5 ? 'bg-[#012d1d] text-white' : 'bg-slate-100 text-slate-600'"
              class="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0">
              05
            </div>
            <div class="min-w-0">
              <div class="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500">
                {{ activeStep() === 5 ? 'STAGE 5 • ACTIVE' : 'STAGE 5' }}
              </div>
              <div class="text-xs font-bold text-slate-900 truncate">Fleet &amp; Telemetry</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Summary Status Strip -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="material-symbols-outlined text-emerald-800 text-lg">agriculture</span>
          <span class="font-heading text-xs font-bold uppercase tracking-wider text-slate-700">Agronomic Intake Protocol</span>
          <span class="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
            Selected Field: {{ selectedFieldName() }} &bull; {{ plantingArea() }} ha ({{ (plantingArea() * 2.471).toFixed(1) }} AC)
          </span>
        </div>
        <div class="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-emerald-700 text-base">cloud_done</span>
            <span class="font-mono text-[11px]">Auto-saved {{ lastSavedText() }}</span>
          </div>
        </div>
      </div>

      <!-- Primary Content Grid (Main Form 8 Cols + Live Preview / Cadastre Cards 4 Cols) -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start mb-12">
        
        <!-- LEFT 8 COLS: Detailed Planting Intake Forms Styled matching Add-Animal -->
        <div class="xl:col-span-8 flex flex-col gap-6">

          <!-- SECTION A: Core Agronomic Taxonomies & Field Allocation -->
          <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-emerald-700 text-xl">psychology_alt</span>
                <div>
                  <h2 class="font-heading text-base font-bold text-slate-900">Section A: Crop Taxonomy &amp; Management Parcel</h2>
                  <p class="text-xs text-slate-500">Official botanical classifications, growth protocols, and target field zoning</p>
                </div>
              </div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Step 1 Linked Data
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Crop -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Crop Species *</label>
                <select 
                  [ngModel]="selectedCropId()" 
                  (ngModelChange)="onCropChange($event)" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                  @for (crop of availableCrops(); track crop.id) {
                    <option [value]="crop.id">{{ crop.commonName }}</option>
                  }
                </select>
              </div>

              <!-- Seed Type / Variety -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Seed Type / Variety *</label>
                <select 
                  [ngModel]="seedType()" 
                  (ngModelChange)="onVarietyChange($event)"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                  @for (variety of availableVarieties(); track variety.id) {
                    <option [value]="variety.id">{{ variety.commonName }}</option>
                  }
                </select>
              </div>

              <!-- Growth Plan -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Growth Plan &amp; Protocol *</label>
                <select 
                  [ngModel]="selectedGrowthProgramId()" 
                  (ngModelChange)="onGrowthProgramChange($event)"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                  @for (prog of availableGrowthPlans(); track prog.id) {
                    <option [value]="prog.id">{{ prog.name }}</option>
                  }
                </select>
              </div>

              <!-- Target Field -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Target Field Parcel *</label>
                <select 
                  [ngModel]="selectedField()" 
                  (ngModelChange)="onFieldChange($event)"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                  @for (field of availableFields(); track field.id) {
                    <option [value]="field.id">{{ field.name }} ({{ field.size || 74.2 }} ha / {{ ((field.size || 74.2) * 2.471).toFixed(1) }} AC)</option>
                  }
                </select>
                <p class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <lucide-icon name="layers" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></lucide-icon>
                  <span>Fields support multiple concurrent active planting cycles (intercrops & split parcels).</span>
                </p>
              </div>

              <!-- Actual Planting Date -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Actual Planting Date *</label>
                <input 
                  type="date" 
                  [ngModel]="plantingDate()" 
                  (ngModelChange)="onPlantingDateChange($event)" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>

              <!-- Expected Harvest Date -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Expected Harvest Window Date *</label>
                <input 
                  type="date" 
                  [ngModel]="expectedHarvestDate()" 
                  (ngModelChange)="expectedHarvestDate.set($event)" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>

              <!-- Optional Planting Starting Method -->
              @if (availablePlantingMethods().length > 0) {
                <div class="flex flex-col gap-1 md:col-span-2">
                  <label class="text-xs font-bold text-slate-700">Planting Initiation Method</label>
                  <select 
                    [ngModel]="plantingStartingMethod()" 
                    (ngModelChange)="plantingStartingMethod.set($event)"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                    @for (method of availablePlantingMethods(); track method) {
                      <option [value]="method">{{ formatMethod(method) }}</option>
                    }
                  </select>
                </div>
              }
            </div>

            <!-- Live Phenological Growth Stages Preview from External API -->
            @if (previewStages().length > 0) {
              <div class="pt-3 border-t border-slate-100 space-y-2.5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span class="text-xs font-bold text-slate-800">
                      Phenological Growth Stages ({{ previewStages().length }} Stages &bull; {{ previewTotalDurationDays() }} Days Total)
                    </span>
                  </div>
                  @if (previewStages()[0]?.cropName) {
                    <span class="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {{ previewStages()[0].cropName }} @if (previewStages()[0]?.varietyName) { &bull; {{ previewStages()[0].varietyName }} }
                    </span>
                  }
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  @for (st of previewStages(); track st.id; let idx = $index) {
                    <div class="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex flex-col justify-between gap-2">
                      <div>
                        <div class="flex items-center justify-between gap-1.5">
                          <span class="font-mono text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                            Stage {{ st.stageOrder || (idx + 1) }} @if (st.growthStageSpecificData?.code) { &bull; {{ st.growthStageSpecificData?.code }} }
                          </span>
                          <span class="font-mono text-[10px] font-bold text-slate-500">
                            {{ st.durationInDays }}d (D{{ st.startDayOffset || 1 }}–{{ st.endDayOffset || st.durationInDays }})
                          </span>
                        </div>
                        <div class="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                          {{ st.stageName }}
                        </div>
                      </div>
                      @if (st.growthParameterSpecs && st.growthParameterSpecs.length > 0) {
                        <div class="flex flex-wrap gap-1 pt-1 border-t border-slate-200/60">
                          @for (p of st.growthParameterSpecs; track p.id || p.elementName) {
                            <span class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                              {{ p.elementSymbol || p.parameterCode || p.elementName }}: {{ p.targetValue | number:'1.0-1' }} {{ p.unit }}
                            </span>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </section>

          <!-- SECTION B: Spatial Geometry & Field Dimensions -->
          <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-emerald-700 text-xl">straighten</span>
                <div>
                  <h2 class="font-heading text-base font-bold text-slate-900">Section B: Spatial Dimensions &amp; Row Geometry</h2>
                  <p class="text-xs text-slate-500">Row configuration, total active length, and parcel coverage metrics</p>
                </div>
              </div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Geometry Link
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Number of Rows -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Number of Rows</label>
                <input 
                  type="number" 
                  [ngModel]="numberOfRows()" 
                  (ngModelChange)="onRowsOrLengthChange($event, 'rows')"
                  min="1" 
                  placeholder="e.g. 24" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>

              <!-- Row Length (m) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Row Length (m)</label>
                <input 
                  type="number" 
                  [ngModel]="rowLength()" 
                  (ngModelChange)="onRowsOrLengthChange($event, 'length')"
                  min="0" 
                  placeholder="e.g. 820" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>

              <!-- Planting Area (ha) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Planting Area (ha)</label>
                <input 
                  type="number" 
                  [ngModel]="plantingArea()" 
                  (ngModelChange)="onAreaManualChange($event)"
                  min="0" 
                  step="0.1" 
                  placeholder="e.g. 74.2" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                @if (percentageOfField() !== null) {
                  <p class="text-[10px] text-slate-500 font-mono font-medium">
                    {{ percentageOfField() | number:'1.0-1' }}% of selected parcel
                  </p>
                }
              </div>
            </div>
          </section>

          <!-- SECTION C: Calibrated Metrics, Spacing & Prescriptions -->
          <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-emerald-700 text-xl">tune</span>
                <div>
                  <h2 class="font-heading text-base font-bold text-slate-900">Section C: Agronomic Calibration &amp; Seeding Rates</h2>
                  <p class="text-xs text-slate-500">Precise seed placement, depth sensors, target populations, and expected yield</p>
                </div>
              </div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Telemetry Specs
              </span>
            </div>

            <!-- Two Highlights: Calculated Population and Calculated Expected Yield -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Calculated Population -->
              <div class="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span class="text-[11px] uppercase tracking-wider font-bold text-emerald-900">Calculated Population</span>
                  </div>
                  <div class="text-lg font-bold font-mono text-[#012d1d] mt-0.5">{{ formattedPopulation() }}</div>
                  <div class="text-[10px] text-emerald-700 font-mono">Auto-computed per hectare</div>
                </div>
                <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span class="material-symbols-outlined text-xl">calculate</span>
                </div>
              </div>

              <!-- Calculated Expected Yield -->
              <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-[11px] uppercase tracking-wider font-bold text-slate-600">Expected Yield (Model NDVI v2)</span>
                  </div>
                  <div class="text-lg font-bold font-mono text-slate-900 mt-0.5">{{ calculatedExpectedYieldDisplay() }}</div>
                  <div class="text-[10px] text-slate-500 font-mono">Calibrated against historical cycle</div>
                </div>
                <div class="w-9 h-9 rounded-lg bg-slate-200/80 text-slate-700 flex items-center justify-center">
                  <span class="material-symbols-outlined text-xl">trending_up</span>
                </div>
              </div>
            </div>

            <!-- Calibration Numerical Inputs -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <!-- Actual Expected Yield (tons) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Actual Expected Yield (tons)</label>
                <input 
                  type="number" 
                  [ngModel]="actualExpectedYieldTons()" 
                  (ngModelChange)="actualExpectedYieldTons.set($event)"
                  min="0" 
                  step="0.1" 
                  placeholder="e.g. 710.0" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>

              <!-- Actual Row Spacing (cm) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Actual Row Spacing (cm)</label>
                <input 
                  type="number" 
                  [ngModel]="actualRowSpacing()" 
                  (ngModelChange)="onSpacingChange($event, 'row')"
                  min="0" 
                  step="0.1" 
                  placeholder="e.g. 76.2" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>

              <!-- Actual Plant Spacing (cm) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Actual Plant Spacing (cm)</label>
                <input 
                  type="number" 
                  [ngModel]="actualPlantSpacing()" 
                  (ngModelChange)="onSpacingChange($event, 'plant')"
                  min="0" 
                  step="0.1" 
                  placeholder="e.g. 15.5" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>

              <!-- Actual Planting Depth (cm) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Actual Planting Depth (cm)</label>
                <input 
                  type="number" 
                  [ngModel]="actualPlantingDepth()" 
                  (ngModelChange)="actualPlantingDepth.set($event)"
                  min="0" 
                  step="0.5" 
                  placeholder="e.g. 5.0" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>

              <!-- Actual Seeds per Hole -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Actual Seeds per Hole</label>
                <input 
                  type="number" 
                  [ngModel]="actualSeedsPerHole()" 
                  (ngModelChange)="actualSeedsPerHole.set($event)"
                  min="1" 
                  placeholder="e.g. 1" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>
            </div>
          </section>

          <!-- SECTION D: Soil Telemetry, Seedbed & Weather (From Uploaded Design) -->
          <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-emerald-700 text-xl">sensors</span>
                <div>
                  <h2 class="font-heading text-base font-bold text-slate-900">Section D: Soil Telemetry, Seedbed &amp; Microclimate</h2>
                  <p class="text-xs text-slate-500">Live in-situ IoT probes, moisture saturation, organic matter, and compaction</p>
                </div>
              </div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Telemetry Link Active
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Soil Moisture (VWC) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Soil Moisture (% VWC)</label>
                <input 
                  type="number" 
                  [ngModel]="soilMoisture()" 
                  (ngModelChange)="soilMoisture.set($event)"
                  min="0" 
                  max="100"
                  step="0.1" 
                  placeholder="e.g. 26.4" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                <span class="text-[10px] text-emerald-700 font-mono font-medium">Optimal seedbed germination moisture</span>
              </div>

              <!-- Soil Temperature (°C) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Soil Temperature (10cm depth, °C)</label>
                <input 
                  type="number" 
                  [ngModel]="soilTemperature()" 
                  (ngModelChange)="soilTemperature.set($event)"
                  step="0.1" 
                  placeholder="e.g. 14.8" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                <span class="text-[10px] text-slate-500 font-mono font-medium">Exceeds 10°C baseline for corn</span>
              </div>

              <!-- Soil pH -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Topsoil pH Level</label>
                <input 
                  type="number" 
                  [ngModel]="soilPh()" 
                  (ngModelChange)="soilPh.set($event)"
                  min="3" 
                  max="10"
                  step="0.1" 
                  placeholder="e.g. 6.8" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                <span class="text-[10px] text-emerald-700 font-mono font-medium">Ideal neutral-optimal nutrient uptake</span>
              </div>

              <!-- Organic Matter (%) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Organic Matter (%)</label>
                <input 
                  type="number" 
                  [ngModel]="organicMatterPct()" 
                  (ngModelChange)="organicMatterPct.set($event)"
                  min="0" 
                  max="20"
                  step="0.1" 
                  placeholder="e.g. 4.2" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                <span class="text-[10px] text-slate-500 font-mono font-medium">High humic reserve</span>
              </div>

              <!-- Tillage Practice -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Seedbed Tillage Method</label>
                <select 
                  [ngModel]="tillageMethod()" 
                  (ngModelChange)="tillageMethod.set($event)"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                  <option value="Strip-Till Precision">Strip-Till Precision (Row-Cleaned)</option>
                  <option value="No-Till Direct Drill">No-Till Direct Drill</option>
                  <option value="Conventional Disk / Harrow">Conventional Disk / Harrow</option>
                  <option value="Minimum Till Vertical">Minimum Till Vertical</option>
                </select>
              </div>

              <!-- Compaction Penetration Resistance (PSI) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Soil Compaction Index (PSI)</label>
                <input 
                  type="number" 
                  [ngModel]="compactionPsi()" 
                  (ngModelChange)="compactionPsi.set($event)"
                  min="50" 
                  max="500" 
                  placeholder="e.g. 175" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                <span class="text-[10px] text-emerald-700 font-mono font-medium">&lt;200 PSI: Non-limiting root zone</span>
              </div>
            </div>
          </section>

          <!-- SECTION E: Fertility, In-Furrow Inputs & Starter Chemistry -->
          <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-emerald-700 text-xl">science</span>
                <div>
                  <h2 class="font-heading text-base font-bold text-slate-900">Section E: In-Furrow Fertility, Starter Chemistry &amp; Inputs</h2>
                  <p class="text-xs text-slate-500">Record seed, starter fertilizer, crop protection, machinery run-time &amp; precision labor</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                  {{ plantingInputs().length }} Inputs Logged
                </span>
                <button 
                  type="button" 
                  (click)="openAddInputModal('FERTILIZER')"
                  class="px-3.5 py-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer">
                  <span class="material-symbols-outlined text-sm">add_circle</span>
                  <span>Add Input Item</span>
                </button>
              </div>
            </div>

            <!-- Pre-plant / In-Furrow Quick Settings -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/60">
              <!-- Starter Fertilizer Type -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Starter Fertilizer Formulation</label>
                <select 
                  [ngModel]="starterFertilizer()" 
                  (ngModelChange)="starterFertilizer.set($event)"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                  <option value="Liquid 10-34-0 Ammonium Polyphosphate">Liquid 10-34-0 Ammonium Polyphosphate</option>
                  <option value="Liquid 9-18-9 Low-Salt Starter">Liquid 9-18-9 Low-Salt Pop-Up</option>
                  <option value="Dry 18-46-0 (DAP) Micro-Banded">Dry 18-46-0 (DAP) Micro-Banded</option>
                  <option value="Urea Ammonium Nitrate (UAN 32% + Agrotain)">Urea Ammonium Nitrate (UAN 32% + Agrotain)</option>
                </select>
              </div>

              <!-- Starter Rate (L/ha or kg/ha) -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Starter Application Rate (L/ha)</label>
                <input 
                  type="number" 
                  [ngModel]="starterRateLPerHa()" 
                  (ngModelChange)="starterRateLPerHa.set($event)"
                  min="0" 
                  step="1" 
                  placeholder="e.g. 50" 
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
              </div>

              <!-- In-Furrow Biological / Micronutrient -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">In-Furrow Biological &amp; Micro-Zinc</label>
                <select 
                  [ngModel]="inFurrowBio()" 
                  (ngModelChange)="inFurrowBio.set($event)"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                  <option value="Zn-EDTA 9% + Mycorrhizal Inoculant">Zn-EDTA 9% Chelate + Mycorrhizal Fungi</option>
                  <option value="Azospirillum N-Fixing Biological">Azospirillum Free-Living N-Fixer</option>
                  <option value="Seaweed Bio-Stimulant + Fulvic Acid">Seaweed Bio-Stimulant + Fulvic Acid</option>
                  <option value="None / Standard Seeding">None / Standard Seeding</option>
                </select>
              </div>

              <!-- Pre-Emerge Herbicide / Protection -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Pre-Emergence Residual Chemistry</label>
                <select 
                  [ngModel]="preEmergeHerbicide()" 
                  (ngModelChange)="preEmergeHerbicide.set($event)"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600">
                  <option value="S-Metolachlor + Mesotrione + Atrazine">S-Metolachlor + Mesotrione + Atrazine (Acuron® eq.)</option>
                  <option value="Acetochlor + Flumetsulam">Acetochlor + Flumetsulam (TripleFLEX®)</option>
                  <option value="Dimethenamid-P + Saflufenacil">Dimethenamid-P + Saflufenacil (Sharpen® tank-mix)</option>
                  <option value="Untreated / Mechanical Cultivation">Untreated / Organic Mechanical Cultivation</option>
                </select>
              </div>
            </div>

            <!-- Category Fast Filter / Add Bar -->
            <div class="flex items-center justify-between gap-2 flex-wrap pt-1">
              <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-slate-500">list_alt</span>
                <span>Entered Field Inputs Ledger</span>
              </span>
              <div class="flex items-center gap-1.5 flex-wrap">
                <button type="button" (click)="openAddInputModal('MACHINERY')" class="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer">
                  <span class="material-symbols-outlined text-xs">agriculture</span>
                  <span>+ Machinery (Fuel/Hrs)</span>
                </button>
                <button type="button" (click)="openAddInputModal('LABOUR')" class="px-2.5 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer">
                  <span class="material-symbols-outlined text-xs">engineering</span>
                  <span>+ Labour</span>
                </button>
                <button type="button" (click)="openAddInputModal('FERTILIZER')" class="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer">
                  <span class="material-symbols-outlined text-xs">science</span>
                  <span>+ Fertilizer / Chem</span>
                </button>
              </div>
            </div>

            <!-- TABLE OF ENTERED INPUTS -->
            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              @if (plantingInputs().length === 0) {
                <div class="p-8 text-center bg-slate-50/50">
                  <span class="material-symbols-outlined text-3xl text-slate-400 mb-1">inventory_2</span>
                  <p class="text-xs font-bold text-slate-700">No input records logged yet</p>
                  <p class="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">Click "Add Input Item" above to record fertilizers, seed batches, machinery fuel &amp; hours, or field labour.</p>
                  <button 
                    type="button" 
                    (click)="openAddInputModal('FERTILIZER')" 
                    class="mt-3 px-3 py-1.5 bg-[#012d1d] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
                    <span class="material-symbols-outlined text-xs">add</span>
                    <span>Add First Input</span>
                  </button>
                </div>
              } @else {
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-slate-50/90 text-slate-700 border-b border-slate-200 font-bold">
                        <th class="py-2.5 px-3">Input Type</th>
                        <th class="py-2.5 px-3">Description &amp; Telemetry</th>
                        <th class="py-2.5 px-3 text-right">Measurement / Qty</th>
                        <th class="py-2.5 px-3 text-right">Unit Rate</th>
                        <th class="py-2.5 px-3 text-right">Total Cost</th>
                        <th class="py-2.5 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                      @for (item of plantingInputs(); track item.id) {
                        <tr class="hover:bg-slate-50/60 transition-colors">
                          <!-- Category Badge -->
                          <td class="py-2.5 px-3 whitespace-nowrap align-top">
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
                              [class.bg-amber-50]="item.category === 'MACHINERY'"
                              [class.text-amber-900]="item.category === 'MACHINERY'"
                              [class.border-amber-200]="item.category === 'MACHINERY'"
                              [class.bg-blue-50]="item.category === 'LABOUR'"
                              [class.text-blue-900]="item.category === 'LABOUR'"
                              [class.border-blue-200]="item.category === 'LABOUR'"
                              [class.bg-emerald-50]="item.category === 'FERTILIZER'"
                              [class.text-emerald-900]="item.category === 'FERTILIZER'"
                              [class.border-emerald-200]="item.category === 'FERTILIZER'"
                              [class.bg-purple-50]="item.category === 'CHEMISTRY'"
                              [class.text-purple-900]="item.category === 'CHEMISTRY'"
                              [class.border-purple-200]="item.category === 'CHEMISTRY'"
                              [class.bg-lime-50]="item.category === 'SEED'"
                              [class.text-lime-900]="item.category === 'SEED'"
                              [class.border-lime-200]="item.category === 'SEED'"
                              [class.bg-slate-100]="item.category !== 'MACHINERY' && item.category !== 'LABOUR' && item.category !== 'FERTILIZER' && item.category !== 'CHEMISTRY' && item.category !== 'SEED'"
                              [class.text-slate-800]="item.category !== 'MACHINERY' && item.category !== 'LABOUR' && item.category !== 'FERTILIZER' && item.category !== 'CHEMISTRY' && item.category !== 'SEED'"
                              [class.border-slate-200]="item.category !== 'MACHINERY' && item.category !== 'LABOUR' && item.category !== 'FERTILIZER' && item.category !== 'CHEMISTRY' && item.category !== 'SEED'">
                              <span class="material-symbols-outlined text-[13px]">{{ formatInputCategoryBadge(item.category).icon }}</span>
                              <span>{{ formatInputCategoryBadge(item.category).text }}</span>
                            </span>
                          </td>

                          <!-- Name & Custom Details (Machinery Fuel/Hours or Labour) -->
                          <td class="py-2.5 px-3 align-top">
                            <div class="font-bold text-slate-800">{{ item.name }}</div>
                            @if (item.category === 'MACHINERY') {
                              <div class="mt-1 flex items-center gap-2 flex-wrap text-[11px] font-mono">
                                @if (item.fuelUsedLiters) {
                                  <span class="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                                    <span class="material-symbols-outlined text-[12px]">local_gas_station</span>
                                    <span>{{ item.fuelUsedLiters }} L Fuel</span>
                                  </span>
                                }
                                @if (item.operatingHours) {
                                  <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                                    <span class="material-symbols-outlined text-[12px]">schedule</span>
                                    <span>{{ item.operatingHours }} hrs run</span>
                                  </span>
                                }
                                @if (item.machineryType) {
                                  <span class="text-slate-500 font-sans text-[10px]">{{ item.machineryType }}</span>
                                }
                              </div>
                            } @else if (item.category === 'LABOUR') {
                              <div class="mt-1 flex items-center gap-2 flex-wrap text-[11px] font-mono">
                                @if (item.laborWorkers) {
                                  <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-200 font-bold">
                                    <span class="material-symbols-outlined text-[12px]">groups</span>
                                    <span>{{ item.laborWorkers }} worker{{ item.laborWorkers > 1 ? 's' : '' }}</span>
                                  </span>
                                }
                                @if (item.laborHours) {
                                  <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                                    <span class="material-symbols-outlined text-[12px]">schedule</span>
                                    <span>{{ item.laborHours }} hrs/worker</span>
                                  </span>
                                }
                                @if (item.laborActivity) {
                                  <span class="text-slate-600 font-sans text-[10px] italic">{{ item.laborActivity }}</span>
                                }
                              </div>
                            }
                            @if (item.notes) {
                              <div class="text-[10px] text-slate-500 mt-0.5">{{ item.notes }}</div>
                            }
                          </td>

                          <!-- Measurement / Quantity -->
                          <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap align-top">
                            {{ item.quantity.toLocaleString() }} <span class="text-slate-500 font-sans font-normal text-[11px]">{{ item.measurementUnit }}</span>
                          </td>

                          <!-- Unit Rate -->
                          <td class="py-2.5 px-3 text-right font-mono text-slate-600 whitespace-nowrap align-top">
                            &#36;{{ item.unitCost.toFixed(2) }}<span class="text-slate-400 font-sans text-[10px]">/{{ item.measurementUnit }}</span>
                          </td>

                          <!-- Total Cost -->
                          <td class="py-2.5 px-3 text-right font-mono font-bold text-[#012d1d] whitespace-nowrap align-top">
                            &#36;{{ item.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                          </td>

                          <!-- Action Buttons -->
                          <td class="py-2.5 px-3 text-center whitespace-nowrap align-top">
                            <div class="inline-flex items-center gap-1">
                              <button 
                                type="button" 
                                (click)="openEditInputModal(item)" 
                                title="Edit Input" 
                                class="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 cursor-pointer transition-colors">
                                <span class="material-symbols-outlined text-sm">edit</span>
                              </button>
                              <button 
                                type="button" 
                                (click)="removeInput(item.id)" 
                                title="Delete Input" 
                                class="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 cursor-pointer transition-colors">
                                <span class="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>

            <!-- Cost Summary Strip keeping Total Cycle Cost -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#012d1d] text-xl">receipt_long</span>
                  <div>
                    <span class="font-bold text-slate-900 text-sm">Estimated Total Cycle Cost:</span>
                    <span class="font-mono text-slate-600 ml-1.5 font-medium">Seed ({{ seedOutlayDisplay() }}) + Recorded Field Inputs (&#36;{{ totalRecordedInputsCost().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }})</span>
                  </div>
                </div>
                <!-- Telemetry quick rollups -->
                <div class="flex items-center gap-3 text-[11px] text-slate-500 font-mono pl-7">
                  <span>Fuel: <strong class="text-amber-800">{{ totalMachineryFuelUsed() }} L</strong></span>
                  <span>&bull;</span>
                  <span>Machinery: <strong class="text-slate-800">{{ totalMachineryHours() }} hrs</strong></span>
                  <span>&bull;</span>
                  <span>Field Labour: <strong class="text-blue-800">{{ totalLabourHours() }} hrs</strong></span>
                </div>
              </div>
              <div class="flex flex-col sm:items-end justify-center">
                <div class="flex items-baseline gap-1.5">
                  <span class="font-mono font-bold text-lg text-[#012d1d]">{{ totalCycleInputCostDisplay() }}</span>
                  <span class="text-xs font-mono font-bold text-emerald-800">(&#36;{{ costPerHectareDisplay() }}/ha)</span>
                </div>
                <span class="text-[10px] text-slate-500 font-sans">Full cycle gross input outlay across {{ plantingArea() }} ha</span>
              </div>
            </div>
          </section>

          <!-- Action Footer inside Left Column -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a routerLink="/crops" class="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-base">close</span>
              <span>Cancel Cycle</span>
            </a>

            <div class="flex items-center gap-2 font-mono text-xs text-slate-500">
              <span class="font-bold text-[#012d1d]">Cycle Status</span>
              <span class="text-slate-300">&bull;</span>
              <span class="font-bold text-slate-700">Draft Ready for Field Release</span>
            </div>

            <button type="button" (click)="save()" [disabled]="isSaving()" class="w-full sm:w-auto px-6 py-2.5 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer disabled:opacity-50">
              @if (!isSaving()) {
                <span class="material-symbols-outlined text-base">verified</span>
              } @else {
                <span class="material-symbols-outlined text-base animate-spin">progress_activity</span>
              }
              <span>{{ isSaving() ? 'Saving Planting...' : 'Confirm & Save Planting' }}</span>
            </button>
          </div>
        </div>

        <!-- RIGHT 4 COLS: Persistent Live Agronomic Preview & Cadastre Cards styled to match Add-Animal right column -->
        <div class="xl:col-span-4 flex flex-col gap-6 sticky top-20">

          <!-- CARD 1: Field Cadastre Map Card -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-[#012d1d]">
                <span class="material-symbols-outlined text-lg">map</span>
                <span class="font-heading text-xs font-bold uppercase tracking-wider">Field Cadastre GIS</span>
              </div>
              <span class="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                {{ fieldZone() }}
              </span>
            </div>

            <!-- Satellite / SVG Contour Map Preview -->
            <div class="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-[#e4ede7] select-none shadow-inner">
              <svg class="w-full h-full object-cover" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gisBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#b8d8c2" />
                    <stop offset="50%" stop-color="#d4e7da" />
                    <stop offset="100%" stop-color="#a8ceb5" />
                  </linearGradient>
                  <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#7fb5c8" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#5a9eb4" stop-opacity="0.8" />
                  </linearGradient>
                  <pattern id="cropGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2d6a4f" stroke-width="0.3" stroke-opacity="0.25"/>
                  </pattern>
                </defs>

                <rect width="400" height="200" fill="url(#gisBg)" />
                <rect width="400" height="200" fill="url(#cropGrid)" />

                <!-- River Waterway -->
                <path d="M-10,40 Q80,70 160,50 T320,80 T420,60 L420,100 Q320,120 160,90 T-10,80 Z" fill="url(#riverGrad)" />

                <!-- Cadastre Field Polygon Parcel -->
                <polygon points="50,110 180,95 240,165 90,185" fill="#52b788" fill-opacity="0.35" stroke="#1b4332" stroke-width="2" stroke-dasharray="4 2" />
                <polygon points="190,95 340,85 365,150 245,160" fill="#74c69d" fill-opacity="0.25" stroke="#2d6a4f" stroke-width="1.5" />
                
                <!-- Adjacent Field -->
                <polygon points="40,30 130,20 145,55 55,65" fill="#40916c" fill-opacity="0.2" stroke="#2d6a4f" stroke-width="1" />

                <!-- Elevation Contours -->
                <path d="M 0,140 Q 150,130 400,160" fill="none" stroke="#2d6a4f" stroke-width="0.6" stroke-opacity="0.4" />
                <path d="M 0,170 Q 200,160 400,180" fill="none" stroke="#2d6a4f" stroke-width="0.6" stroke-opacity="0.4" />

                <!-- Active Harvester / Equipment Marker -->
                <circle cx="140" cy="135" r="4" fill="#0466c8" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="140" cy="135" r="9" fill="#0466c8" fill-opacity="0.25" />
              </svg>

              <!-- Map Overlay: Top-Left NDVI Badge -->
              <div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1.5 shadow-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>NDVI Index: 0.81 High Harvester</span>
              </div>

              <!-- Reserve Marker on Map -->
              <div class="absolute top-8 right-6 text-right opacity-80 pointer-events-none">
                <div class="text-[10px] font-bold text-slate-800 flex items-center justify-end gap-1">
                  <span>Klauenberg</span>
                  <span class="w-3 h-3 rounded-full bg-[#012d1d] text-white flex items-center justify-center text-[8px]">▲</span>
                </div>
                <div class="text-[9px] text-slate-600">Prairie Reserve</div>
              </div>

              <!-- Map Overlay: Bottom-Left Location & Soil -->
              <div class="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-white drop-shadow-sm flex flex-col leading-tight bg-slate-900/50 px-2 py-1 rounded backdrop-blur-xs">
                <span class="font-semibold">{{ fieldCoordinatesDisplay() }}</span>
                <span class="text-white/90">Sandy Clay Loam (pH {{ soilPh() }})</span>
              </div>

              <!-- Map Overlay: Bottom-Right Soil Moisture -->
              <div class="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-white drop-shadow-sm text-right flex flex-col leading-tight bg-slate-900/50 px-2 py-1 rounded backdrop-blur-xs">
                <span class="font-bold text-emerald-300">{{ soilMoisture() }}% VWC</span>
                <span class="text-white/90">Optimal Moist</span>
              </div>
            </div>

            <!-- Cadastre Stats Beneath Map -->
            <div class="grid grid-cols-2 gap-4 pt-3 mt-1 border-t border-slate-100 font-mono">
              <div>
                <div class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">PERMITTED CAP</div>
                <div class="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{{ permittedCapDisplay() }}</div>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">DRAINAGE PIPE</div>
                <div class="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                  <span class="text-emerald-700 font-bold">Tile Active</span>
                  <span class="text-slate-500 font-normal">(100%)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 2: Seed Allocation & Inventory Outlay -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-[#012d1d]">
                <span class="material-symbols-outlined text-lg">inventory_2</span>
                <span class="font-heading text-xs font-bold uppercase tracking-wider">Seed Allocation</span>
              </div>
              <span class="font-mono text-[10px] text-slate-500 font-semibold truncate max-w-[150px]" [title]="selectedVarietyName()">
                {{ selectedVarietyName() }}
              </span>
            </div>

            <div class="space-y-3">
              <div class="flex items-baseline justify-between text-xs">
                <span class="text-slate-500 font-medium">Total Target Population</span>
                <span class="font-bold font-mono text-slate-900">{{ totalTargetPopulationDisplay() }} seeds</span>
              </div>

              <div class="flex items-baseline justify-between text-xs">
                <span class="text-slate-500 font-medium">Bag Units Required (80k/bag)</span>
                <span class="font-bold font-mono text-emerald-700">{{ bagUnitsRequiredDisplay() }} Bags</span>
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-slate-100 rounded-full h-1.5 my-2 overflow-hidden">
                <div class="bg-emerald-600 h-full rounded-full transition-all duration-500" [style.width.%]="allocationProgress()"></div>
              </div>

              <!-- Estimated Seed Outlay Box -->
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div class="text-[11px] font-bold text-slate-500">Estimated Seed Outlay</div>
                  <div class="text-base font-bold text-slate-900 font-mono">{{ seedOutlayDisplay() }}</div>
                </div>
                <div class="text-[11px] font-mono text-slate-400 text-right">
                  $310.00 / 80k seed unit
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 3: Fleet Machinery & Precision Dispatch (From Uploaded Design) -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-[#012d1d]">
                <span class="material-symbols-outlined text-lg">precision_manufacturing</span>
                <span class="font-heading text-xs font-bold uppercase tracking-wider">Fleet &amp; ISOBUS Dispatch</span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                SF-RTK ±1.2cm
              </span>
            </div>

            <div class="space-y-3">
              <!-- Tractor & Planter Unit -->
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <span class="material-symbols-outlined text-lg">agriculture</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900">{{ fleetRigName() }}</span>
                    <span class="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">READY</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ fleetPlanterSpec() }}</p>
                </div>
              </div>

              <!-- Operator & Telemetry Link -->
              <div class="space-y-2 text-xs font-mono">
                <div class="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span class="text-slate-500">Assigned Operator</span>
                  <span class="font-bold text-slate-800 flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs text-slate-400">person</span>
                    Marcus Vance (Lead Precision)
                  </span>
                </div>
                <div class="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span class="text-slate-500">Guidance Swath / A-B Line</span>
                  <span class="font-bold text-slate-800">Heading 359.8° N-S</span>
                </div>
                <div class="flex justify-between items-center py-1.5">
                  <span class="text-slate-500">ISOBUS Prescription File</span>
                  <span class="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">TASKDATA.XML Sync</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 4: Variable Rate Prescription -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-[#012d1d]">
                <span class="material-symbols-outlined text-lg">tune</span>
                <span class="font-heading text-xs font-bold uppercase tracking-wider">Variable Rate Prescription</span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                Active Multi-Zone
              </span>
            </div>

            <!-- Zone Distribution Breakdown -->
            <div class="space-y-2 text-xs text-slate-600 font-mono">
              <div class="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span class="text-slate-500">Zone 1 &bull; High Potential Flat</span>
                <span class="font-bold text-slate-800">88,000 / ha (35%)</span>
              </div>
              <div class="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span class="text-slate-500">Zone 2 &bull; Central Basin</span>
                <span class="font-bold text-slate-800">{{ formattedPopulation() }} (45%)</span>
              </div>
              <div class="flex justify-between items-center py-1.5">
                <span class="text-slate-500">Zone 3 &bull; Sandy Ridge Knoll</span>
                <span class="font-bold text-slate-800">74,000 / ha (20%)</span>
              </div>
            </div>
          </div>

          <!-- CARD 5: Breeding Characteristics (Replacing Agronomic Validations) -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-emerald-200/80 bg-emerald-50/20 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-[#012d1d]">
                <span class="material-symbols-outlined text-lg text-emerald-700">biotech</span>
                <span class="font-heading text-xs font-bold uppercase tracking-wider">Breeding Characteristics</span>
              </div>
              <span class="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                GENETICS SPEC
              </span>
            </div>

            <div class="space-y-3">
              <!-- Varietal Genetic Trait Highlights -->
              <div class="space-y-2 text-xs">
                <div class="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                  <div class="w-6 h-6 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-sm">dna</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-slate-900 text-xs">{{ breedingProfile().traitName }}</div>
                    <div class="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {{ breedingProfile().traitDescription }}
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                  <div class="w-6 h-6 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-sm">shield</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-slate-900 text-xs">{{ breedingProfile().defenseTitle }}</div>
                    <div class="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {{ breedingProfile().defenseDescription }}
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                  <div class="w-6 h-6 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-sm">grain</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-slate-900 text-xs">{{ breedingProfile().yieldMaturityTitle }}</div>
                    <div class="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {{ breedingProfile().yieldMaturityDescription }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Varietal Agronomic Parameters -->
              <div class="pt-3 border-t border-emerald-200/60">
                <h4 class="text-xs font-bold text-emerald-950 mb-2.5 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm text-emerald-700">eco</span>
                  <span>Phenology &amp; Agronomic Guidelines</span>
                </h4>
                <ul class="space-y-2 text-xs text-slate-600">
                  <li class="flex justify-between border-b border-emerald-100/80 pb-1.5">
                    <span class="text-slate-500">Days to Emerge</span>
                    <span class="font-bold font-mono text-slate-800">{{ breedingProfile().daysToEmerge }}</span>
                  </li>
                  <li class="flex justify-between border-b border-emerald-100/80 pb-1.5">
                    <span class="text-slate-500">Relative Maturity Window</span>
                    <span class="font-bold font-mono text-slate-800">{{ breedingProfile().daysToHarvest }}</span>
                  </li>
                  <li class="flex justify-between border-b border-emerald-100/80 pb-1.5">
                    <span class="text-slate-500">Expected Yield Range</span>
                    <span class="font-bold font-mono text-emerald-800">{{ breedingProfile().expectedYieldRange }}</span>
                  </li>
                  <li class="flex justify-between border-b border-emerald-100/80 pb-1.5">
                    <span class="text-slate-500">Germination Benchmark</span>
                    <span class="font-bold font-mono text-slate-800">{{ breedingProfile().germinationRate }}</span>
                  </li>
                  <li class="flex justify-between pb-0.5">
                    <span class="text-slate-500">Light Profile &amp; Season</span>
                    <span class="font-medium text-slate-800">{{ breedingProfile().lightAndSeason }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- INPUT ITEM ENTRY / EDIT MODAL -->
      @if (showInputModal()) {
        <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 my-8">
            
            <!-- Modal Header -->
            <div class="p-5 bg-gradient-to-r from-[#012d1d] to-[#1b4332] text-white flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-emerald-400 text-2xl">
                  {{ editingInputId() ? 'edit_note' : 'add_circle' }}
                </span>
                <div>
                  <h3 class="font-heading font-bold text-base leading-tight">
                    {{ editingInputId() ? 'Edit Field Input Record' : 'Record New Field Input' }}
                  </h3>
                  <p class="text-[11px] text-emerald-200">
                    Log precise input measurements, active ingredients, machinery hours or field labor
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                (click)="closeInputModal()" 
                class="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <!-- Modal Body Form -->
            <div class="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <!-- Category Selector -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Input Category</span>
                  <span class="text-[11px] font-normal text-slate-500">Determines required fields</span>
                </label>
                <div class="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  <button 
                    type="button" 
                    (click)="onModalCategoryChange('FERTILIZER')"
                    [class.bg-emerald-800]="inputModalCategory() === 'FERTILIZER'"
                    [class.text-white]="inputModalCategory() === 'FERTILIZER'"
                    [class.border-emerald-900]="inputModalCategory() === 'FERTILIZER'"
                    [class.bg-slate-50]="inputModalCategory() !== 'FERTILIZER'"
                    [class.text-slate-700]="inputModalCategory() !== 'FERTILIZER'"
                    class="p-2 border rounded-xl text-center flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-base">science</span>
                    <span>Fertilizer</span>
                  </button>
                  <button 
                    type="button" 
                    (click)="onModalCategoryChange('CHEMISTRY')"
                    [class.bg-emerald-800]="inputModalCategory() === 'CHEMISTRY'"
                    [class.text-white]="inputModalCategory() === 'CHEMISTRY'"
                    [class.border-emerald-900]="inputModalCategory() === 'CHEMISTRY'"
                    [class.bg-slate-50]="inputModalCategory() !== 'CHEMISTRY'"
                    [class.text-slate-700]="inputModalCategory() !== 'CHEMISTRY'"
                    class="p-2 border rounded-xl text-center flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-base">pest_control</span>
                    <span>Chemical</span>
                  </button>
                  <button 
                    type="button" 
                    (click)="onModalCategoryChange('MACHINERY')"
                    [class.bg-emerald-800]="inputModalCategory() === 'MACHINERY'"
                    [class.text-white]="inputModalCategory() === 'MACHINERY'"
                    [class.border-emerald-900]="inputModalCategory() === 'MACHINERY'"
                    [class.bg-slate-50]="inputModalCategory() !== 'MACHINERY'"
                    [class.text-slate-700]="inputModalCategory() !== 'MACHINERY'"
                    class="p-2 border rounded-xl text-center flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-base">agriculture</span>
                    <span>Machinery</span>
                  </button>
                  <button 
                    type="button" 
                    (click)="onModalCategoryChange('LABOUR')"
                    [class.bg-emerald-800]="inputModalCategory() === 'LABOUR'"
                    [class.text-white]="inputModalCategory() === 'LABOUR'"
                    [class.border-emerald-900]="inputModalCategory() === 'LABOUR'"
                    [class.bg-slate-50]="inputModalCategory() !== 'LABOUR'"
                    [class.text-slate-700]="inputModalCategory() !== 'LABOUR'"
                    class="p-2 border rounded-xl text-center flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-base">engineering</span>
                    <span>Labour</span>
                  </button>
                  <button 
                    type="button" 
                    (click)="onModalCategoryChange('OTHER')"
                    [class.bg-emerald-800]="inputModalCategory() === 'OTHER'"
                    [class.text-white]="inputModalCategory() === 'OTHER'"
                    [class.border-emerald-900]="inputModalCategory() === 'OTHER'"
                    [class.bg-slate-50]="inputModalCategory() !== 'OTHER'"
                    [class.text-slate-700]="inputModalCategory() !== 'OTHER'"
                    class="p-2 border rounded-xl text-center flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-base">inventory_2</span>
                    <span>Other</span>
                  </button>
                </div>
              </div>

              <!-- Input Name / Description -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-800">
                  {{ inputModalCategory() === 'MACHINERY' ? 'Operation / Implement Name' : inputModalCategory() === 'LABOUR' ? 'Labour Crew / Role Name' : 'Input / Product Name' }}
                  <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  [ngModel]="inputModalName()" 
                  (ngModelChange)="inputModalName.set($event)"
                  [placeholder]="inputModalCategory() === 'MACHINERY' ? 'e.g. Planter Rig & 410hp Power Unit' : inputModalCategory() === 'LABOUR' ? 'e.g. Row-unit Calibration & Seed Crew' : 'e.g. Liquid 10-34-0 Starter Fertilizer'"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white">
              </div>

              <!-- MACHINERY SPECIFIC FIELDS: Fuel Used & Operating Hours -->
              @if (inputModalCategory() === 'MACHINERY') {
                <div class="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-3">
                  <div class="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <span class="material-symbols-outlined text-amber-700 text-sm">precision_manufacturing</span>
                    <span>Machinery Telemetry &amp; Fuel Burn</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1">
                      <label class="text-[11px] font-bold text-amber-900">Machinery Unit / Model</label>
                      <input 
                        type="text" 
                        [ngModel]="inputModalMachineryType()" 
                        (ngModelChange)="inputModalMachineryType.set($event)"
                        placeholder="e.g. John Deere 8R 410" 
                        class="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-amber-600">
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="text-[11px] font-bold text-amber-900">Total Fuel Used (Liters)</label>
                      <div class="relative">
                        <input 
                          type="number" 
                          [ngModel]="inputModalFuelUsed()" 
                          (ngModelChange)="inputModalFuelUsed.set($event)"
                          min="0" 
                          step="1"
                          placeholder="e.g. 480" 
                          class="w-full pl-2.5 pr-8 py-1.5 bg-white border border-amber-200 rounded-lg font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-600">
                        <span class="absolute right-2.5 top-1.5 text-[10px] font-bold text-amber-800">L</span>
                      </div>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="text-[11px] font-bold text-amber-900">Operating Hours (hrs)</label>
                      <div class="relative">
                        <input 
                          type="number" 
                          [ngModel]="inputModalOperatingHours()" 
                          (ngModelChange)="inputModalOperatingHours.set($event); inputModalQuantity.set($event)"
                          min="0" 
                          step="0.5"
                          placeholder="e.g. 14.5" 
                          class="w-full pl-2.5 pr-10 py-1.5 bg-white border border-amber-200 rounded-lg font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-600">
                        <span class="absolute right-2.5 top-1.5 text-[10px] font-bold text-amber-800">hrs</span>
                      </div>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="text-[11px] font-bold text-amber-900">Machine Rate (&#36;/hr)</label>
                      <div class="relative">
                        <span class="absolute left-2.5 top-1.5 text-[10px] font-bold text-slate-400">&#36;</span>
                        <input 
                          type="number" 
                          [ngModel]="inputModalUnitCost()" 
                          (ngModelChange)="inputModalUnitCost.set($event)"
                          min="0" 
                          step="1"
                          placeholder="e.g. 120" 
                          class="w-full pl-6 pr-2.5 py-1.5 bg-white border border-amber-200 rounded-lg font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-600">
                      </div>
                    </div>
                  </div>
                </div>
              }

              <!-- LABOUR SPECIFIC FIELDS -->
              @if (inputModalCategory() === 'LABOUR') {
                <div class="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-3">
                  <div class="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <span class="material-symbols-outlined text-blue-700 text-sm">groups</span>
                    <span>Field Labour Allocation &amp; Hours</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1">
                      <label class="text-[11px] font-bold text-blue-900">Number of Workers</label>
                      <input 
                        type="number" 
                        [ngModel]="inputModalLaborWorkers()" 
                        (ngModelChange)="inputModalLaborWorkers.set($event)"
                        min="1" 
                        step="1"
                        placeholder="e.g. 2" 
                        class="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-blue-600">
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="text-[11px] font-bold text-blue-900">Hours per Worker (hrs)</label>
                      <input 
                        type="number" 
                        [ngModel]="inputModalLaborHours()" 
                        (ngModelChange)="inputModalLaborHours.set($event)"
                        min="0" 
                        step="0.5"
                        placeholder="e.g. 14.5" 
                        class="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-blue-600">
                    </div>

                    <div class="flex flex-col gap-1 sm:col-span-2">
                      <label class="text-[11px] font-bold text-blue-900">Task / Activity Description</label>
                      <input 
                        type="text" 
                        [ngModel]="inputModalLaborActivity()" 
                        (ngModelChange)="inputModalLaborActivity.set($event)"
                        placeholder="e.g. Planter operation, seed tender dispatch, seed depth audit" 
                        class="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-blue-600">
                    </div>
                  </div>
                </div>
              }

              <!-- GENERAL QUANTITY & MEASUREMENT UNIT (Shown if not machinery) -->
              @if (inputModalCategory() !== 'MACHINERY') {
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-bold text-slate-800">
                      {{ inputModalCategory() === 'LABOUR' ? 'Total Billable Man-Hrs' : 'Quantity Used' }}
                    </label>
                    <input 
                      type="number" 
                      [ngModel]="inputModalCategory() === 'LABOUR' ? (inputModalLaborWorkers() * inputModalLaborHours()) : inputModalQuantity()" 
                      (ngModelChange)="inputModalQuantity.set($event)"
                      min="0" 
                      step="any"
                      placeholder="0" 
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white">
                  </div>

                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-bold text-slate-800">Unit of Measure</label>
                    <select 
                      [ngModel]="inputModalUnit()" 
                      (ngModelChange)="inputModalUnit.set($event)"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white">
                      @if (inputModalCategory() === 'LABOUR') {
                        <option value="hrs">Hours (hrs)</option>
                        <option value="days">Days</option>
                        <option value="shifts">Shifts</option>
                      } @else {
                        <option value="L">Liters (L)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="bags">Bags (80k seed/bag)</option>
                        <option value="tons">Metric Tons (t)</option>
                        <option value="gallons">Gallons (US)</option>
                        <option value="units">Units</option>
                      }
                    </select>
                  </div>

                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-bold text-slate-800">Unit Cost (&#36;)</label>
                    <div class="relative">
                      <span class="absolute left-3 top-2 text-xs font-bold text-slate-400">&#36;</span>
                      <input 
                        type="number" 
                        [ngModel]="inputModalUnitCost()" 
                        (ngModelChange)="inputModalUnitCost.set($event)"
                        min="0" 
                        step="0.01"
                        placeholder="0.00" 
                        class="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white">
                    </div>
                  </div>
                </div>
              }

              <!-- Calculated Total Cost Preview -->
              <div class="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                <span class="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-emerald-700 text-base">payments</span>
                  <span>Calculated Line Outlay:</span>
                </span>
                <span class="font-mono font-bold text-base text-[#012d1d]">
                  &#36;{{ ((inputModalCategory() === 'MACHINERY' ? inputModalOperatingHours() : inputModalCategory() === 'LABOUR' ? (inputModalLaborWorkers() * inputModalLaborHours()) : inputModalQuantity()) * inputModalUnitCost()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </span>
              </div>

              <!-- Notes / Formulation -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-800">Operational Notes &amp; Batch Code (Optional)</label>
                <textarea 
                  [ngModel]="inputModalNotes()" 
                  (ngModelChange)="inputModalNotes.set($event)"
                  rows="2" 
                  placeholder="e.g. Lot #AK-904, applied via starter micro-tubing at 50 L/ha rate" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white resize-none"></textarea>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button 
                type="button" 
                (click)="closeInputModal()" 
                class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                Cancel
              </button>
              <button 
                type="button" 
                (click)="saveInputModal()" 
                class="px-5 py-2 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer">
                <span class="material-symbols-outlined text-sm">check</span>
                <span>{{ editingInputId() ? 'Update Record' : 'Add to Ledger' }}</span>
              </button>
            </div>

          </div>
        </div>
      }

    </div>
  `
})
export class NewPlantingComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cropService = inject(CropService);
  private fieldMapService = inject(FieldMapService);
  private sessionService = inject(SessionService);

  // Stepper active step signal
  activeStep = signal<number>(1);

  // Form Signals initialized with screenshot defaults
  selectedCropId = signal<string>('e9095e2d-f6b6-45a7-bc42-302177188988'); // Dent Corn / Field Maize
  seedType = signal<string>('pioneer-p1197am');
  selectedGrowthProgramId = signal<string>('high-yield-intensive-2025');
  selectedField = signal<string>('field-07-north-river');
  plantingDate = signal<string>('2025-04-18');
  expectedHarvestDate = signal<string>('2025-09-28');
  numberOfRows = signal<number>(24);
  rowLength = signal<number>(820);
  plantingArea = signal<number>(74.2);
  actualExpectedYieldTons = signal<number>(710.0);
  actualRowSpacing = signal<number>(76.2);
  actualPlantSpacing = signal<number>(15.5);
  actualPlantingDepth = signal<number>(5.0);
  actualSeedsPerHole = signal<number>(1);
  plantingStartingMethod = signal<string>('DIRECT_SEEDING');

  // Soil Telemetry & Seedbed Inputs (Section D)
  soilMoisture = signal<number>(26.4);
  soilTemperature = signal<number>(14.8);
  soilPh = signal<number>(6.8);
  organicMatterPct = signal<number>(4.2);
  tillageMethod = signal<string>('Strip-Till Precision');
  compactionPsi = signal<number>(175);

  // In-Furrow Fertility, Starter Chemistry & Protection (Section E)
  starterFertilizer = signal<string>('Liquid 10-34-0 Ammonium Polyphosphate');
  starterRateLPerHa = signal<number>(50);
  inFurrowBio = signal<string>('Zn-EDTA 9% + Mycorrhizal Inoculant');
  preEmergeHerbicide = signal<string>('S-Metolachlor + Mesotrione + Atrazine');

  // Section E: Inputs Matrix & Logged Input Items
  showInputModal = signal<boolean>(false);
  editingInputId = signal<string | null>(null);

  // Input Modal Form Fields
  inputModalCategory = signal<'SEED' | 'FERTILIZER' | 'CHEMISTRY' | 'MACHINERY' | 'LABOUR' | 'AMENDMENT' | 'OTHER'>('FERTILIZER');
  inputModalName = signal<string>('');
  inputModalUnit = signal<string>('L');
  inputModalQuantity = signal<number>(0);
  inputModalUnitCost = signal<number>(0);
  // Machinery specific
  inputModalMachineryType = signal<string>('John Deere 8R 410 Tractor');
  inputModalFuelUsed = signal<number>(0);
  inputModalOperatingHours = signal<number>(0);
  // Labour specific
  inputModalLaborWorkers = signal<number>(1);
  inputModalLaborHours = signal<number>(0);
  inputModalLaborActivity = signal<string>('Field Application & Calibration');
  inputModalNotes = signal<string>('');

  // Initial recorded inputs
  plantingInputs = signal<PlantingInputItem[]>([
    {
      id: 'input-1',
      category: 'FERTILIZER',
      name: 'Liquid 10-34-0 Ammonium Polyphosphate',
      measurementUnit: 'L',
      quantity: 3710,
      unitCost: 1.30,
      totalCost: 4823.00,
      notes: 'In-furrow starter pop-up banded at 50 L/ha'
    },
    {
      id: 'input-2',
      category: 'CHEMISTRY',
      name: 'S-Metolachlor + Mesotrione + Atrazine',
      measurementUnit: 'L',
      quantity: 185.5,
      unitCost: 16.80,
      totalCost: 3116.40,
      notes: 'Pre-emergence residual herbicide band'
    },
    {
      id: 'input-3',
      category: 'MACHINERY',
      name: 'Planter Rig & Power Unit (JD 8R 410 + ExactEmerge 24R)',
      measurementUnit: 'hrs',
      quantity: 14.5,
      unitCost: 120.00,
      totalCost: 1740.00,
      machineryType: 'John Deere 8R 410 + 24-Row Planter',
      operatingHours: 14.5,
      fuelUsedLiters: 480,
      notes: 'Field operation with ISOBUS section control & high-speed planting'
    },
    {
      id: 'input-4',
      category: 'LABOUR',
      name: 'Precision Planting Operators & Agronomist',
      measurementUnit: 'hrs',
      quantity: 29.0,
      unitCost: 35.00,
      totalCost: 1015.00,
      laborWorkers: 2,
      laborHours: 14.5,
      laborActivity: 'Planter operation, seed tender dispatch & row-check',
      notes: 'Marcus Vance + 1 Seed tender technician'
    }
  ]);

  // Fleet & ISOBUS Dispatch details
  fleetRigName = signal<string>('John Deere 8R 410 &bull; 24-Row ExactEmerge™');
  fleetPlanterSpec = signal<string>('Electric-drive meters with individual row hydraulic downforce');

  isSaving = signal<boolean>(false);
  isDraftSaved = signal<boolean>(false);
  lastSavedText = signal<string>('1 min ago');
  actionFeedback = signal<string | null>(null);

  // API data
  apiCrops = signal<CropSpeciesResponse[]>([]);
  apiVarieties = signal<CropVarietyResponse[]>([]);
  apiFields = signal<MapElement[]>([]);
  apiGrowthPrograms = signal<GrowthProgramDropDownList[]>([]);

  // Default Fallbacks matching the image specification
  defaultCrops: CropSpeciesResponse[] = [
    { id: 'e9095e2d-f6b6-45a7-bc42-302177188988', commonName: 'Dent Corn / Field Maize' },
    { id: '7c144f03-83b9-4dff-a946-7a080d3473a3', commonName: 'Sorghum (Mabele)' },
    { id: 'd15828a2-a9d7-4ae1-bcf3-ef3fee1f7b70', commonName: 'Cowpea (Dinawa)' },
    { id: 'df507f20-b6bf-4fff-bfc9-6672e3b1224e', commonName: 'Sugar Bean' },
    { id: '1f43a0e7-8c65-4f2b-8a9d-54c3e8b1d9c2', commonName: 'Potato' }
  ];

  defaultVarieties: CropVarietyResponse[] = [
    {
      id: 'pioneer-p1197am',
      commonName: 'Pioneer® P1197AM™ (Optimum® AcreMax®)',
      scientificName: 'Zea mays L.',
      breedSpecificData: {
        origin: 'Pioneer Hi-Bred / Corteva',
        category: 'High-Yield Yellow Dent Grain',
        attributes: [
          'Optimum® AcreMax® dual-mode European Corn Borer protection',
          'Elite drought tolerance with accelerated silk emergence under moisture stress',
          'Industry-benchmark stay-green, intact ear droop, and standability'
        ],
        planting_details: {
          seasons: ['SPRING', 'SUMMER'],
          light_profile: 'Full Sun',
          days_to_emerge: { min: 4, max: 7 },
          row_spacing_cm: 76.2,
          plant_spacing_cm: 15.5,
          planting_depth_cm: 5.0,
          seeds_per_hole: 1,
          estimated_germination_rate_pct: 98,
          planting_starting_method: ['DIRECT_SEEDING', 'PRECISION_PLANTER']
        },
        harvesting_details: {
          days_to_harvest: { min: 110, max: 125 },
          harvest_window_days: 18,
          expected_yield_per_hectare_tons: { min: 8.5, max: 14.5 },
          estimated_loss_pct: 3
        }
      }
    },
    {
      id: 'bfcd72b1-e0ed-4511-9786-d6260c1ee125',
      commonName: 'SC 506 (Desert Walker)',
      scientificName: 'Zea mays',
      breedSpecificData: {
        origin: 'Seed Co',
        category: 'Yellow Grain Hybrid',
        attributes: [
          'Yellow grain hybrid, early maturing (125-135 days)',
          'Exceptional drought and heat tolerance ("Desert Walker")',
          'High Maize Streak Virus (MSV) and Cob Rot tolerance'
        ],
        planting_details: {
          seasons: ['SUMMER'],
          light_profile: 'Full Sun',
          days_to_emerge: { min: 5, max: 9 },
          row_spacing_cm: 75,
          plant_spacing_cm: 20,
          planting_depth_cm: 5,
          seeds_per_hole: 1,
          estimated_germination_rate_pct: 96,
          planting_starting_method: ['DIRECT_SEEDING']
        },
        harvesting_details: {
          days_to_harvest: { min: 125, max: 135 },
          harvest_window_days: 15,
          expected_yield_per_hectare_tons: { min: 5.5, max: 9.5 },
          estimated_loss_pct: 4
        }
      }
    },
    {
      id: 'ab52218d-15e8-425d-a104-b063dfb3101d',
      commonName: 'SC 719 (Irrigated High-Potential)',
      scientificName: 'Zea mays',
      breedSpecificData: {
        origin: 'Seed Co',
        category: 'White Grain Hybrid',
        attributes: [
          'White grain hybrid, late maturing (145-155 days)',
          'High yield potential under commercial irrigation',
          'Excellent standability and large uniform cobs'
        ],
        planting_details: {
          seasons: ['SUMMER'],
          light_profile: 'Full Sun',
          days_to_emerge: { min: 5, max: 9 },
          row_spacing_cm: 75,
          plant_spacing_cm: 20,
          planting_depth_cm: 5,
          seeds_per_hole: 1,
          estimated_germination_rate_pct: 96,
          planting_starting_method: ['DIRECT_SEEDING']
        },
        harvesting_details: {
          days_to_harvest: { min: 145, max: 155 },
          harvest_window_days: 21,
          expected_yield_per_hectare_tons: { min: 10, max: 18 },
          estimated_loss_pct: 3
        }
      }
    }
  ];

  defaultFields: MapElement[] = [
    {
      id: 'field-07-north-river',
      name: 'Field 07 — North River Alfalfa & Maize',
      type: 'field',
      size: 74.2,
      paths: [{ lat: 42.8421, lng: -93.6190 }]
    },
    {
      id: 'field-pivot-a',
      name: 'Pivot Field A — Upper Basin',
      type: 'field',
      size: 65.0,
      paths: [{ lat: 42.8450, lng: -93.6210 }]
    },
    {
      id: 'field-south-coulee',
      name: 'Field 03 — South Coulee',
      type: 'field',
      size: 42.8,
      paths: [{ lat: 42.8390, lng: -93.6150 }]
    }
  ];

  defaultGrowthPlans: GrowthPlanOption[] = [
    { id: 'high-yield-intensive-2025', name: 'High-Yield Intensive Plan (2025)' },
    { id: 'standard-irrigated-protocol', name: 'Standard Commercial Irrigated Protocol' },
    { id: 'climate-smart-dryland', name: 'Climate-Smart Drought Defense Protocol' }
  ];

  // Computed Combined Lists
  availableCrops = computed(() => {
    const api = this.apiCrops().filter(c => (c as any).type === 'CROP' || !('type' in c));
    if (api.length > 0) {
      const hasDent = api.some(c => c.commonName.toLowerCase().includes('maize') || c.commonName.toLowerCase().includes('corn'));
      return hasDent ? api : [...this.defaultCrops, ...api];
    }
    return this.defaultCrops;
  });

  availableVarieties = computed(() => {
    const api = this.apiVarieties();
    if (api.length > 0) {
      const hasPioneer = api.some(v => v.id === 'pioneer-p1197am');
      return hasPioneer ? api : [this.defaultVarieties[0], ...api];
    }
    return this.defaultVarieties;
  });

  availableFields = computed(() => {
    const api = this.apiFields();
    if (api.length > 0) {
      return api;
    }
    return this.defaultFields;
  });

  availableGrowthPlans = computed(() => {
    const api = this.apiGrowthPrograms();
    if (api.length > 0) {
      return api;
    }
    return this.defaultGrowthPlans;
  });

  // Active Selected Objects
  selectedVariety = computed(() => {
    const currentId = this.seedType();
    return this.availableVarieties().find(v => v.id === currentId) || this.defaultVarieties[0];
  });

  selectedVarietyName = computed(() => {
    const v = this.selectedVariety();
    return v ? v.commonName : 'Pioneer® P1197AM™';
  });

  selectedFieldObj = computed(() => {
    const currentId = this.selectedField();
    return this.availableFields().find(f => f.id === currentId) || this.defaultFields[0];
  });

  selectedFieldName = computed(() => {
    const field = this.selectedFieldObj();
    return field ? field.name : 'Field 07 — North River';
  });

  availablePlantingMethods = computed(() => {
    const v = this.selectedVariety();
    return v?.breedSpecificData?.planting_details?.planting_starting_method || ['DIRECT_SEEDING', 'PRECISION_PLANTER'];
  });

  // Agronomic Calculations matching the screenshot
  calculatedPopulationPerHa = computed(() => {
    const rowCm = this.actualRowSpacing() || 76.2;
    const plantCm = this.actualPlantSpacing() || 15.5;
    const seedsPerHole = this.actualSeedsPerHole() || 1;

    // Area per plant in m² = (rowCm / 100) * (plantCm / 100)
    const areaPerPlant = (rowCm / 100) * (plantCm / 100);
    if (areaPerPlant <= 0) return 82450;

    // Plants per hectare (10,000 m²)
    const plantsPerHa = (10000 / areaPerPlant) * seedsPerHole;
    return Math.round(plantsPerHa);
  });

  formattedPopulation = computed(() => {
    const pop = this.calculatedPopulationPerHa();
    return `${pop.toLocaleString()} plants/ha`;
  });

  totalTargetPopulation = computed(() => {
    const pop = this.calculatedPopulationPerHa();
    const area = this.plantingArea() || 74.2;
    return Math.round(pop * area);
  });

  totalTargetPopulationDisplay = computed(() => {
    return this.totalTargetPopulation().toLocaleString();
  });

  bagUnitsRequired = computed(() => {
    const totalSeeds = this.totalTargetPopulation();
    // 80,000 seeds per commercial bag unit
    const bags = totalSeeds / 80000;
    return Number(bags.toFixed(1));
  });

  bagUnitsRequiredDisplay = computed(() => {
    return this.bagUnitsRequired().toLocaleString();
  });

  allocationProgress = computed(() => {
    const bags = this.bagUnitsRequired();
    return Math.min(100, Math.max(10, Math.round((bags / 90) * 100)));
  });

  seedOutlayCost = computed(() => {
    const bags = this.bagUnitsRequired();
    return bags * 310;
  });

  seedOutlayDisplay = computed(() => {
    return `$${this.seedOutlayCost().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  });

  totalRecordedInputsCost = computed(() => {
    return this.plantingInputs().reduce((acc, item) => acc + (item.totalCost || 0), 0);
  });

  totalCycleInputCost = computed(() => {
    const seed = this.seedOutlayCost();
    const recorded = this.totalRecordedInputsCost();
    return seed + recorded;
  });

  totalCycleInputCostDisplay = computed(() => {
    return `$${this.totalCycleInputCost().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  });

  costPerHectareDisplay = computed(() => {
    const area = this.plantingArea() || 74.2;
    if (area <= 0) return '0.00';
    return (this.totalCycleInputCost() / area).toFixed(2);
  });

  totalMachineryFuelUsed = computed(() => {
    return this.plantingInputs()
      .filter(i => i.category === 'MACHINERY')
      .reduce((acc, i) => acc + (i.fuelUsedLiters || 0), 0);
  });

  totalMachineryHours = computed(() => {
    return this.plantingInputs()
      .filter(i => i.category === 'MACHINERY')
      .reduce((acc, i) => acc + (i.operatingHours || 0), 0);
  });

  totalLabourHours = computed(() => {
    return this.plantingInputs()
      .filter(i => i.category === 'LABOUR')
      .reduce((acc, i) => acc + (i.laborHours || 0), 0);
  });

  calculatedExpectedYieldTons = computed(() => {
    const area = this.plantingArea() || 74.2;
    const variety = this.selectedVariety();
    const yieldDetails = variety?.breedSpecificData?.harvesting_details?.expected_yield_per_hectare_tons;
    
    let yieldPerHa = 9.2; // Default benchmark from image (~9.2 t/ha)
    if (yieldDetails) {
      const min = yieldDetails.min || 0;
      const max = yieldDetails.max || 0;
      if (max > 0) {
        yieldPerHa = (min + max) / 2;
      }
    }
    return Number((area * yieldPerHa).toFixed(1));
  });

  calculatedExpectedYieldDisplay = computed(() => {
    const tons = this.calculatedExpectedYieldTons();
    const area = this.plantingArea() || 74.2;
    const tPerHa = area > 0 ? (tons / area).toFixed(1) : '9.2';
    return `${tons.toLocaleString()} tons (~${tPerHa} t/ha)`;
  });

  percentageOfField = computed(() => {
    const area = this.plantingArea();
    const field = this.selectedFieldObj();
    if (!area || !field || !field.size) return null;
    return (area / field.size) * 100;
  });

  permittedCapDisplay = computed(() => {
    const field = this.selectedFieldObj();
    if (field && field.size) {
      const ac = (field.size * 2.471).toFixed(1);
      return `${ac} AC`;
    }
    return '185.4 AC';
  });

  fieldCoordinatesDisplay = computed(() => {
    const field = this.selectedFieldObj();
    if (field && field.paths && field.paths.length > 0) {
      const lat = field.paths[0].lat;
      const lng = field.paths[0].lng;
      const latDir = lat >= 0 ? 'N' : 'S';
      const lngDir = lng >= 0 ? 'E' : 'W';
      return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
    }
    return '42.8421° N, 93.6190° W';
  });

  fieldZone = computed(() => {
    return 'Zone 7A';
  });

  // Breeding Characteristics (Replacing Agronomic Validations)
  breedingProfile = computed(() => {
    const v = this.selectedVariety();
    const breedData = v?.breedSpecificData;
    const planting = breedData?.planting_details;
    const harvest = breedData?.harvesting_details;
    const attributes = breedData?.attributes || [];

    const traitName = v?.commonName || 'Pioneer® P1197AM™ (Optimum® AcreMax®)';
    const traitDescription = attributes.length > 0 
      ? attributes[0] 
      : 'Optimum® AcreMax® dual-mode European Corn Borer protection with superior standability and stalk strength.';

    const defenseTitle = 'Stress & Disease Tolerance';
    const defenseDescription = attributes.length > 1 
      ? attributes[1] 
      : 'Elite drought tolerance with accelerated silk emergence under moisture stress and robust stay-green.';

    const yieldMaturityTitle = 'Ear Architecture & Yield Index';
    const yieldMaturityDescription = attributes.length > 2
      ? attributes[2]
      : 'Semi-flex ear architecture with high test-weight grain and intact harvest window stability.';

    const daysToEmerge = planting?.days_to_emerge 
      ? `${planting.days_to_emerge.min} - ${planting.days_to_emerge.max} days` 
      : '4 - 7 days';

    const daysToHarvest = harvest?.days_to_harvest 
      ? `${harvest.days_to_harvest.min} - ${harvest.days_to_harvest.max} days (CRM: 112)` 
      : '110 - 125 days (CRM: 112)';

    const expectedYieldRange = harvest?.expected_yield_per_hectare_tons 
      ? `${harvest.expected_yield_per_hectare_tons.min} - ${harvest.expected_yield_per_hectare_tons.max} t/ha` 
      : '8.5 - 14.5 t/ha';

    const germinationRate = planting?.estimated_germination_rate_pct 
      ? `${planting.estimated_germination_rate_pct}% Certified` 
      : '98% Certified';

    const seasons = planting?.seasons?.join(', ') || 'Spring / Summer';
    const light = planting?.light_profile || 'Full Sun';

    return {
      traitName,
      traitDescription,
      defenseTitle,
      defenseDescription,
      yieldMaturityTitle,
      yieldMaturityDescription,
      daysToEmerge,
      daysToHarvest,
      expectedYieldRange,
      germinationRate,
      lightAndSeason: `${light} &bull; ${seasons}`
    };
  });

  ngOnInit() {
    // Check route params
    this.route.queryParams.subscribe(params => {
      if (params['fieldId']) {
        this.selectedField.set(params['fieldId']);
      }
    });

    // Load available crops from server
    this.cropService.getCropSpecies().subscribe({
      next: (res) => {
        if (res && res.content && res.content.length > 0) {
          this.apiCrops.set(res.content);
        }
      },
      error: (err) => console.error('Failed to load crop species', err)
    });

    // Load varieties and stages for current crop
    this.loadVarietiesForCrop(this.selectedCropId());
    this.loadPreviewStages();

    // Load farm fields
    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      this.fieldMapService.loadFieldsForFarm(farmId).subscribe({
        next: (fields) => {
          if (fields && fields.length > 0) {
            this.apiFields.set(fields);
            if (!this.selectedField() || this.selectedField() === 'field-07-north-river') {
              this.selectedField.set(fields[0].id);
            }
          }
        },
        error: (err) => console.error('Failed to load fields for farm', err)
      });
    }
  }

  previewStages = signal<CropStageDTO[]>([]);
  previewTotalDurationDays = computed(() => {
    return this.previewStages().reduce((sum, s) => sum + (Number(s.durationInDays) || 0), 0);
  });

  loadPreviewStages() {
    const speciesId = this.selectedCropId();
    const breedId = this.seedType();
    const programId = this.selectedGrowthProgramId();

    // 1. Try filtered crop stages endpoint (/api/v1/crop/stages)
    this.cropService.getCropStages({
      speciesId: speciesId || undefined,
      breedId: breedId || undefined,
      programId: programId || undefined
    }).subscribe(stages => {
      if (Array.isArray(stages) && stages.length > 0) {
        this.previewStages.set([...stages].sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0)));
        this.recalculateHarvestDate();
        return;
      }
      // 2. Try explicit variety or species stage endpoint (/api/v1/crop/variety/{id}/stages or /api/v1/crop/species/{id}/stages)
      const lookupId = breedId || speciesId || 'e9095e2d-f6b6-45a7-bc42-302177188988';
      this.cropService.getCropStagesById(lookupId).subscribe(resolved => {
        if (Array.isArray(resolved) && resolved.length > 0) {
          this.previewStages.set([...resolved].sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0)));
          this.recalculateHarvestDate();
          return;
        }
        // 3. Fallback to all crop stages (/api/v1/crop/stages)
        this.cropService.getCropStages().subscribe(allStages => {
          if (Array.isArray(allStages) && allStages.length > 0) {
            this.previewStages.set([...allStages].sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0)));
            this.recalculateHarvestDate();
          }
        });
      });
    });
  }

  loadVarietiesForCrop(cropId: string) {
    if (!cropId) return;
    this.cropService.getCropVarieties(cropId).subscribe({
      next: (varieties) => {
        if (varieties && varieties.length > 0) {
          this.apiVarieties.set(varieties);
        }
      },
      error: (err) => console.error('Failed to load varieties', err)
    });
  }

  onCropChange(cropId: string) {
    this.selectedCropId.set(cropId);
    this.loadVarietiesForCrop(cropId);
    this.loadPreviewStages();
    
    // Reset or update growth programs
    const varietyId = this.seedType();
    if (cropId && varietyId) {
      this.cropService.getGrowthPrograms(cropId, varietyId).subscribe({
        next: (progs) => this.apiGrowthPrograms.set(progs),
        error: () => this.apiGrowthPrograms.set([])
      });
    }
  }

  onVarietyChange(varietyId: string) {
    this.seedType.set(varietyId);
    const variety = this.availableVarieties().find(v => v.id === varietyId);
    
    if (variety?.breedSpecificData?.planting_details) {
      const p = variety.breedSpecificData.planting_details;
      if (p.row_spacing_cm) this.actualRowSpacing.set(p.row_spacing_cm);
      if (p.plant_spacing_cm) this.actualPlantSpacing.set(p.plant_spacing_cm);
      if (p.planting_depth_cm) this.actualPlantingDepth.set(p.planting_depth_cm);
      if (p.seeds_per_hole) this.actualSeedsPerHole.set(p.seeds_per_hole);
    }

    this.loadPreviewStages();
    this.recalculateHarvestDate();
  }

  onGrowthProgramChange(programId: string) {
    this.selectedGrowthProgramId.set(programId);
    this.loadPreviewStages();
  }

  onFieldChange(fieldId: string) {
    this.selectedField.set(fieldId);
    const field = this.availableFields().find(f => f.id === fieldId);
    if (field && field.size) {
      this.plantingArea.set(Number(field.size.toFixed(2)));
    }
  }

  onPlantingDateChange(date: string) {
    this.plantingDate.set(date);
    this.recalculateHarvestDate();
  }

  recalculateHarvestDate() {
    const pDate = this.plantingDate();
    if (!pDate) return;
    const variety = this.selectedVariety();
    const harvestDetails = variety?.breedSpecificData?.harvesting_details;
    const stageDuration = this.previewTotalDurationDays();

    if (harvestDetails?.days_to_harvest) {
      const min = harvestDetails.days_to_harvest.min || 110;
      const max = harvestDetails.days_to_harvest.max || 125;
      const avgDays = Math.round((min + max) / 2);
      
      const d = new Date(pDate);
      d.setDate(d.getDate() + avgDays);
      this.expectedHarvestDate.set(d.toISOString().split('T')[0]);
    } else if (stageDuration > 0) {
      const d = new Date(pDate);
      d.setDate(d.getDate() + stageDuration);
      this.expectedHarvestDate.set(d.toISOString().split('T')[0]);
    }
  }

  onRowsOrLengthChange(val: number, type: 'rows' | 'length') {
    if (type === 'rows') this.numberOfRows.set(val);
    if (type === 'length') this.rowLength.set(val);

    const rows = this.numberOfRows();
    const len = this.rowLength();
    const spacing = this.actualRowSpacing() || 76.2;

    if (rows && len && spacing) {
      const totalLength = rows * len;
      const areaInM2 = totalLength * (spacing / 100);
      const ha = Number((areaInM2 / 10000).toFixed(2));
      if (ha > 0 && ha < 1000) {
        this.plantingArea.set(ha);
      }
    }
  }

  onSpacingChange(val: number, type: 'row' | 'plant') {
    if (type === 'row') this.actualRowSpacing.set(val);
    if (type === 'plant') this.actualPlantSpacing.set(val);
  }

  onAreaManualChange(val: number) {
    this.plantingArea.set(val);
  }

  // --- Section E: Input Modal & Matrix Handlers ---
  openAddInputModal(category: 'SEED' | 'FERTILIZER' | 'CHEMISTRY' | 'MACHINERY' | 'LABOUR' | 'AMENDMENT' | 'OTHER' = 'FERTILIZER') {
    this.editingInputId.set(null);
    this.inputModalCategory.set(category);
    this.inputModalNotes.set('');

    // Prepopulate sensible defaults based on category
    if (category === 'MACHINERY') {
      this.inputModalName.set('Planter / Tractor Application Unit');
      this.inputModalUnit.set('hrs');
      this.inputModalQuantity.set(10);
      this.inputModalUnitCost.set(110);
      this.inputModalOperatingHours.set(10);
      this.inputModalFuelUsed.set(280);
      this.inputModalMachineryType.set('John Deere 8R 410 Tractor');
    } else if (category === 'LABOUR') {
      this.inputModalName.set('Precision Planter Operator & Calibration Team');
      this.inputModalUnit.set('hrs');
      this.inputModalQuantity.set(20);
      this.inputModalUnitCost.set(32);
      this.inputModalLaborWorkers.set(2);
      this.inputModalLaborHours.set(10);
      this.inputModalLaborActivity.set('Row-unit depth calibration & seed metering check');
    } else if (category === 'FERTILIZER') {
      this.inputModalName.set('Micro-Zinc Chelate & Sulfur Band (10-34-0 eq.)');
      this.inputModalUnit.set('L');
      this.inputModalQuantity.set(1500);
      this.inputModalUnitCost.set(1.45);
    } else if (category === 'CHEMISTRY') {
      this.inputModalName.set('Pre-Emerge Residual Broadleaf Chemistry');
      this.inputModalUnit.set('L');
      this.inputModalQuantity.set(120);
      this.inputModalUnitCost.set(18.50);
    } else {
      this.inputModalName.set('');
      this.inputModalUnit.set('kg');
      this.inputModalQuantity.set(0);
      this.inputModalUnitCost.set(0);
    }

    this.showInputModal.set(true);
  }

  openEditInputModal(item: PlantingInputItem) {
    this.editingInputId.set(item.id);
    this.inputModalCategory.set(item.category);
    this.inputModalName.set(item.name);
    this.inputModalUnit.set(item.measurementUnit);
    this.inputModalQuantity.set(item.quantity);
    this.inputModalUnitCost.set(item.unitCost);
    this.inputModalNotes.set(item.notes || '');

    if (item.category === 'MACHINERY') {
      this.inputModalMachineryType.set(item.machineryType || '');
      this.inputModalFuelUsed.set(item.fuelUsedLiters || 0);
      this.inputModalOperatingHours.set(item.operatingHours || item.quantity);
    } else if (item.category === 'LABOUR') {
      this.inputModalLaborWorkers.set(item.laborWorkers || 1);
      this.inputModalLaborHours.set(item.laborHours || item.quantity);
      this.inputModalLaborActivity.set(item.laborActivity || '');
    }

    this.showInputModal.set(true);
  }

  closeInputModal() {
    this.showInputModal.set(false);
    this.editingInputId.set(null);
  }

  onModalCategoryChange(category: 'SEED' | 'FERTILIZER' | 'CHEMISTRY' | 'MACHINERY' | 'LABOUR' | 'AMENDMENT' | 'OTHER') {
    this.inputModalCategory.set(category);
    if (category === 'MACHINERY') {
      this.inputModalUnit.set('hrs');
      if (!this.inputModalMachineryType()) this.inputModalMachineryType.set('John Deere 8R 410');
    } else if (category === 'LABOUR') {
      this.inputModalUnit.set('hrs');
    } else if (category === 'FERTILIZER' || category === 'CHEMISTRY') {
      if (this.inputModalUnit() === 'hrs') this.inputModalUnit.set('L');
    }
  }

  saveInputModal() {
    const name = this.inputModalName().trim();
    if (!name) {
      alert('Please enter an input name or description.');
      return;
    }

    const cat = this.inputModalCategory();
    let qty = Number(this.inputModalQuantity()) || 0;
    const unitCost = Number(this.inputModalUnitCost()) || 0;

    // For machinery or labour, sync quantity if operating hours is given
    if (cat === 'MACHINERY' && this.inputModalOperatingHours() > 0) {
      qty = Number(this.inputModalOperatingHours());
    } else if (cat === 'LABOUR') {
      const workers = Number(this.inputModalLaborWorkers()) || 1;
      const hours = Number(this.inputModalLaborHours()) || 0;
      if (hours > 0) {
        qty = workers * hours;
      }
    }

    const total = qty * unitCost;

    const newItem: PlantingInputItem = {
      id: this.editingInputId() || `input-${Date.now()}`,
      category: cat,
      name,
      measurementUnit: this.inputModalUnit() || 'units',
      quantity: qty,
      unitCost,
      totalCost: Number(total.toFixed(2)),
      notes: this.inputModalNotes().trim() || undefined,
      machineryType: cat === 'MACHINERY' ? this.inputModalMachineryType() : undefined,
      fuelUsedLiters: cat === 'MACHINERY' ? Number(this.inputModalFuelUsed()) : undefined,
      operatingHours: cat === 'MACHINERY' ? Number(this.inputModalOperatingHours()) : undefined,
      laborWorkers: cat === 'LABOUR' ? Number(this.inputModalLaborWorkers()) : undefined,
      laborHours: cat === 'LABOUR' ? Number(this.inputModalLaborHours()) : undefined,
      laborActivity: cat === 'LABOUR' ? this.inputModalLaborActivity() : undefined
    };

    if (this.editingInputId()) {
      this.plantingInputs.update(list =>
        list.map(i => i.id === this.editingInputId() ? newItem : i)
      );
      this.actionFeedback.set(`Input "${newItem.name}" updated successfully.`);
    } else {
      this.plantingInputs.update(list => [...list, newItem]);
      this.actionFeedback.set(`Input "${newItem.name}" added to cycle matrix.`);
    }

    this.closeInputModal();
  }

  removeInput(id: string) {
    const item = this.plantingInputs().find(i => i.id === id);
    this.plantingInputs.update(list => list.filter(i => i.id !== id));
    if (item) {
      this.actionFeedback.set(`Removed input "${item.name}".`);
    }
  }

  formatInputCategoryBadge(cat: string): { bg: string, text: string, icon: string } {
    switch (cat) {
      case 'MACHINERY':
        return { bg: 'bg-amber-100 text-amber-900 border-amber-300', text: 'Machinery', icon: 'agriculture' };
      case 'LABOUR':
        return { bg: 'bg-blue-100 text-blue-900 border-blue-300', text: 'Labour', icon: 'engineering' };
      case 'FERTILIZER':
        return { bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', text: 'Fertilizer', icon: 'science' };
      case 'CHEMISTRY':
        return { bg: 'bg-purple-100 text-purple-900 border-purple-300', text: 'Chemistry', icon: 'pest_control' };
      case 'SEED':
        return { bg: 'bg-lime-100 text-lime-900 border-lime-300', text: 'Seed', icon: 'psychiatry' };
      default:
        return { bg: 'bg-slate-100 text-slate-800 border-slate-300', text: cat, icon: 'inventory_2' };
    }
  }

  formatMethod(method: string): string {
    return method.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  saveDraft() {
    this.isDraftSaved.set(true);
    this.lastSavedText.set('Just now');
    this.actionFeedback.set(`Draft #CYC-2025-042 successfully saved locally with current varietal specs and GPS geometry.`);
    try {
      const draftData = {
        cropId: this.selectedCropId(),
        seedType: this.seedType(),
        fieldId: this.selectedField(),
        plantingDate: this.plantingDate(),
        expectedHarvestDate: this.expectedHarvestDate(),
        area: this.plantingArea(),
        rows: this.numberOfRows(),
        length: this.rowLength(),
        population: this.calculatedPopulationPerHa(),
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('oakridge_planting_cycle_draft', JSON.stringify(draftData));
    } catch (e) {
      console.warn('Could not persist draft to localStorage', e);
    }

    setTimeout(() => {
      this.isDraftSaved.set(false);
      this.actionFeedback.set(null);
    }, 4000);
  }

  save() {
    this.isSaving.set(true);

    const payload = {
      breedId: this.seedType(),
      managementUnitId: this.selectedField(),
      growthProgramId: this.selectedGrowthProgramId() || undefined,
      plantedDate: this.plantingDate() || undefined,
      expectedPlantingDate: this.plantingDate() || undefined,
      expectedHarvestDate: this.expectedHarvestDate() || undefined,
      areaSize: this.plantingArea() || undefined,
      seedsPlanted: this.totalTargetPopulation() || undefined,
      numberOfRows: this.numberOfRows() || undefined,
      rowLength: this.rowLength() || undefined,
      plantingArea: this.plantingArea() || undefined,
      expectedYield: this.actualExpectedYieldTons() || undefined,
      rowSpacing: this.actualRowSpacing() || undefined,
      plantSpacing: this.actualPlantSpacing() || undefined,
      plantingDepth: this.actualPlantingDepth() || undefined,
      seedsPerHole: this.actualSeedsPerHole() || undefined,
      plantingMethod: this.plantingStartingMethod() || undefined
    };

    this.cropService.createPlantingCycle(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/crops/view', this.selectedField()]);
      },
      error: (err) => {
        console.error('Failed to create planting cycle', err);
        this.isSaving.set(false);
        this.router.navigate(['/crops']);
      }
    });
  }
}
