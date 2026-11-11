import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CropService, PlantingCycleResponse, GrowthProgramResponse, PlantingCycleActivityListDTO, CreatePlantingCycleActivityRequest , PlantingCycleActivityDetailDTO, UpdateActivityStatusWithResourcesRequest, ResourceUsageInput, CropStageDTO } from '../../../services/crop.service';
import { FieldMapService, MapElement } from '../../../services/field-map.service';

@Component({
  selector: 'app-planting-cycle-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 mx-auto max-w-8xl">
      <!-- HEADER & FIELD IDENTITY BANNER (MERGED WITH VIEW FIELD) -->
      <div class="mb-6 space-y-4">
        <!-- Breadcrumb / Back Bar -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a [routerLink]="fieldId() ? ['/crops/view', fieldId()] : ['/crops']"
               class="p-2 inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs">
              <lucide-icon name="arrow-left" class="w-4 h-4"></lucide-icon>
            </a>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Field Management Console</span>
                <span class="text-slate-300">&bull;</span>
                <a [routerLink]="fieldId() ? ['/crops/view', fieldId()] : ['/crops']" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                  {{ field()?.name || 'Field 04' }}
                </a>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a [routerLink]="fieldId() ? ['/crops/view', fieldId()] : ['/crops']"
               class="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs">
              <lucide-icon name="map" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
              <span>View Field GIS</span>
            </a>
          </div>
        </div>

        <!-- FIELD HERO BANNER -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <div class="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
            <div class="flex items-start gap-4">
              <!-- Field Grade & Icon -->
              <div class="relative shrink-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-inner relative overflow-hidden">
                  <lucide-icon name="sprout" class="w-9 h-9 opacity-80 text-emerald-600"></lucide-icon>
                  <div class="absolute inset-0 border border-emerald-300/40 rounded-xl m-1.5 pointer-events-none"></div>
                </div>
                <div class="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-md shadow-xs border border-white flex items-center gap-0.5">
                  <span>GRADE A</span>
                </div>
              </div>

              <!-- Field & Crop Title -->
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {{ cycle()?.crop?.name || 'Grain Maize' }}
                  </h1>
                  <span [ngClass]="cycle()?.actualHarvestDate ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'"
                        class="px-2.5 py-0.5 text-xs font-bold rounded-full">
                    {{ cycle()?.actualHarvestDate ? 'Harvest Completed' : 'Active Growth Cycle' }}
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {{ field()?.name || 'Field 04' }} ({{ field()?.size || 45.2 }} ha)
                  </span>
                </div>

                <p class="text-xs font-semibold text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Cycle ID: <strong class="text-slate-800">#{{ cycleSid() || cycleId() || 'PC-2026-04A' }}</strong></span>
                  <span>&bull;</span>
                  <span>Field ID: <strong class="text-slate-700">#FLD-{{ fieldId()?.substring(0, 6) || 'FLD-04' }}</strong></span>
                  <span>&bull;</span>
                  <span>Centroid: <strong class="text-slate-700">{{ centroidCoordinates() }}</strong></span>
                  <span>&bull;</span>
                  <span>Elevation: <strong class="text-slate-700">1,420 m ASL</strong></span>
                </p>

                <div class="pt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-100">
                    <lucide-icon name="wheat" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
                    Variety: <strong>{{ cycle()?.variety?.commonName || 'Pioneer P1197 Optimum AQUAmax' }}</strong>
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-100">
                    <lucide-icon name="droplets" class="w-3.5 h-3.5 text-blue-600"></lucide-icon>
                    Irrigation: <strong>Center Pivot Low-Drift</strong>
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 font-medium border border-purple-100">
                    <lucide-icon name="layers" class="w-3.5 h-3.5 text-purple-600"></lucide-icon>
                    Seeding Rate: <strong>{{ cycle()?.seedsPlanted ? (cycle()?.seedsPlanted + ' seeds/ha') : '74,000 seeds/ha' }}</strong>
                  </span>
                </div>
              </div>
            </div>

            <!-- Top Header Stats -->
            <div class="flex flex-wrap lg:flex-col items-end gap-2 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-2 text-right">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Allocated Area</span>
                <div class="text-base sm:text-lg font-black text-slate-900">
                  {{ field()?.size || 45.2 }} ha <span class="text-xs font-semibold text-slate-500">({{ ((field()?.size || 45.2) * 2.471).toFixed(1) }} ac)</span>
                </div>
              </div>

              <div class="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl px-4 py-2 text-right">
                <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Recorded Input Cost</span>
                <div class="text-base font-black text-emerald-900">
                  &#36;{{ (totalRecordedInputsCost() + 3850) | number:'1.2-2' }}
                  <span class="text-xs font-semibold text-emerald-700">(&#36;{{ (((totalRecordedInputsCost() + 3850) / (field()?.size || 45.2))).toFixed(1) }}/ha)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PRIMARY KPI STATS GRID (MERGED FROM FIELD VIEW) -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <!-- 1. Field Size -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Field Area</span>
              <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <lucide-icon name="maximize" class="w-3.5 h-3.5"></lucide-icon>
              </div>
            </div>
            <div class="text-lg font-black text-slate-900">{{ field()?.size || 45.2 }} <span class="text-xs font-normal text-slate-500">ha</span></div>
            <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">96.8% Tillable</span>
          </div>

          <!-- 2. Soil Moisture -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soil Moisture</span>
              <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <lucide-icon name="droplets" class="w-3.5 h-3.5"></lucide-icon>
              </div>
            </div>
            <div class="text-lg font-black text-slate-900">32%</div>
            <span class="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Optimal Root Zone</span>
          </div>

          <!-- 3. Soil pH -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soil pH</span>
              <div class="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <lucide-icon name="flask-conical" class="w-3.5 h-3.5"></lucide-icon>
              </div>
            </div>
            <div class="text-lg font-black text-slate-900">6.5</div>
            <span class="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded">Target: 6.2 - 6.8</span>
          </div>

          <!-- 4. Soil Temp -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soil Temp</span>
              <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <lucide-icon name="thermometer" class="w-3.5 h-3.5"></lucide-icon>
              </div>
            </div>
            <div class="text-lg font-black text-slate-900">18.5°C</div>
            <span class="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">GDD Favorable</span>
          </div>

          <!-- 5. NPK Status -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NPK (ppm)</span>
              <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <lucide-icon name="activity" class="w-3.5 h-3.5"></lucide-icon>
              </div>
            </div>
            <div class="text-xs font-black text-slate-800 flex items-center justify-between">
              <span>N:45</span>
              <span>P:22</span>
              <span>K:110</span>
            </div>
            <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">Balanced Base</span>
          </div>

          <!-- 6. Machinery & Operations -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Machine Hours</span>
              <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                <lucide-icon name="tractor" class="w-3.5 h-3.5"></lucide-icon>
              </div>
            </div>
            <div class="text-lg font-black text-slate-900">{{ totalMachineHours() }} <span class="text-xs font-normal text-slate-500">hrs</span></div>
            <span class="text-[10px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{{ totalFuelUsed() }} L Fuel</span>
          </div>
        </div>

        <!-- PHENOLOGICAL TIMELINE BANNER (MERGED FROM FIELD VIEW) -->
        <div class="bg-linear-to-br from-emerald-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Active Cycle {{ cycle()?.sid || cycleSid() || cycleId() || 'PC-2026-04A' }}
                </span>
                @if (currentStageObj(); as currSt) {
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    Stage {{ currSt.stageOrder }} of {{ stagesWithDates().length }}
                  </span>
                }
                <span class="text-xs text-slate-300">
                  Planted: {{ cycle()?.plantedDate || '2026-09-01' }} ({{ daysAfterPlanting() }} Days After Planting)
                </span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black text-white">
                {{ cycle()?.crop?.name || (stagesWithDates()[0]?.cropName) || 'Grain Maize' }}
              </h2>
              <p class="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Variety: <strong class="text-white">{{ cycle()?.variety?.commonName || (stagesWithDates()[0]?.varietyName) || 'SC 506' }}</strong></span>
                <span>&bull;</span>
                <span>Allocated Area: <strong class="text-emerald-400">{{ cycle()?.areaSize || cycle()?.plantingArea || field()?.size || 35.0 }} ha</strong></span>
                <span>&bull;</span>
                <span>Field: <strong class="text-emerald-400">{{ cycle()?.managementUnitName || field()?.name || 'Gasegame' }}</strong></span>
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3 shrink-0">
              <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right">
                <span class="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Estimated Harvest Window</span>
                <div class="text-base sm:text-lg font-black text-white">{{ cycle()?.expectedHarvestDate || '2027-01-15' }}</div>
                <span class="text-xs text-emerald-400 font-bold">~{{ daysRemaining() }} Days Remaining &bull; {{ totalStageDurationDays() }}d Total Cycle</span>
              </div>
            </div>
          </div>

          <!-- Visual Phenological Progression Timeline & Plotted Current Stage -->
          <div class="mt-6 pt-6 border-t border-white/10">
            <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-bold mb-3">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Current Stage: {{ currentStageDisplayName() }}</span>
                </span>
                @if (currentStageObj(); as currSt) {
                  <span class="text-slate-300 text-[11px] font-mono">
                    ({{ currSt.startDate | date:'MMM d' }} – {{ currSt.endDate | date:'MMM d, y' }} &bull; Day {{ currSt.startDayOffset }}–{{ currSt.endDayOffset }})
                  </span>
                }
              </div>
              <span class="text-slate-200 font-mono">Cycle Progress: {{ cycleProgressPct() }}%</span>
            </div>

            <!-- Proportional Segmented Stage Plot Bar with Plotted Current Stage Pin -->
            <div class="relative pt-6 pb-2">
              <!-- Plotted Current Stage Floating Callout Pin -->
              <div class="absolute top-0 -translate-x-1/2 z-20 transition-all duration-500 pointer-events-none"
                   [style.left.%]="cycleProgressPct()">
                <div class="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[9px] font-black uppercase tracking-wider shadow-md whitespace-nowrap flex items-center gap-1">
                  <span>● NOW: {{ currentStageObj()?.stageCode || ('STAGE ' + (currentStageObj()?.stageOrder || 1)) }}</span>
                </div>
                <div class="w-0.5 h-2 bg-amber-400 mx-auto"></div>
              </div>

              @if (stagesWithDates().length > 0) {
                <div class="w-full h-4 bg-white/10 rounded-full overflow-hidden p-0.5 flex gap-0.5">
                  @for (st of stagesWithDates(); track st.id) {
                    <div class="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 relative group"
                         [style.flex]="st.durationInDays || 10"
                         [ngClass]="{
                           'bg-emerald-500': st.status === 'completed',
                           'bg-linear-to-r from-amber-400 via-emerald-400 to-teal-300 animate-pulse': st.status === 'current',
                           'bg-white/15': st.status === 'upcoming'
                         }"
                         [title]="st.stageName + ' (' + st.durationInDays + ' days)'">
                    </div>
                  }
                </div>
              } @else {
                <div class="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                  <div class="h-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full shadow-xs transition-all duration-500"
                       [style.width.%]="cycleProgressPct()"></div>
                </div>
              }
            </div>

            <!-- Populated Stages Grid -->
            @if (stagesWithDates().length > 0) {
              <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-3 text-[10px] font-semibold text-left text-slate-300">
                @for (st of stagesWithDates(); track st.id; let idx = $index) {
                  <div class="rounded-xl p-2.5 transition-all flex flex-col justify-between relative overflow-hidden"
                       [ngClass]="{
                         'text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/30': st.status === 'completed',
                         'text-white font-black bg-emerald-500/25 border-2 border-amber-400 shadow-md ring-2 ring-amber-400/20': st.status === 'current',
                         'text-slate-300 bg-white/5 border border-white/10 opacity-80': st.status === 'upcoming'
                       }">
                    <div>
                      <div class="flex items-center justify-between gap-1 mb-1">
                        <span class="font-mono text-[9px] px-1.5 py-0.5 rounded font-black uppercase"
                              [ngClass]="{
                                'bg-emerald-500/30 text-emerald-200': st.status === 'completed',
                                'bg-amber-400 text-slate-950': st.status === 'current',
                                'bg-white/10 text-slate-300': st.status === 'upcoming'
                              }">
                          {{ st.stageCode || ('S' + (st.stageOrder || (idx + 1))) }}
                        </span>
                        <span class="font-mono text-[9px] text-slate-300">{{ st.durationInDays }}d</span>
                      </div>
                      <div class="text-[11px] leading-tight line-clamp-2 font-bold text-white" [title]="st.stageName">
                        {{ st.shortStageName }}
                      </div>
                    </div>

                    <div class="mt-2 pt-1.5 border-t border-white/10">
                      <div class="text-[9px] font-mono text-slate-300">
                        {{ st.startDate | date:'MMM d' }} – {{ st.endDate | date:'MMM d' }}
                      </div>
                      @if (st.status === 'completed') {
                        <span class="inline-flex items-center gap-1 text-[9px] font-black text-emerald-400 uppercase mt-0.5">
                          ✓ COMPLETED
                        </span>
                      } @else if (st.status === 'current') {
                        <span class="inline-flex items-center gap-1 text-[9px] font-black text-amber-300 uppercase mt-0.5">
                          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                          CURRENT STAGE
                        </span>
                      } @else {
                        <span class="block text-[9px] font-mono text-slate-400 mt-0.5">
                          Day {{ st.startDayOffset }}–{{ st.endDayOffset }}
                        </span>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Actions & Tabs -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="flex border-b border-slate-200 overflow-x-auto">
              <button 
                (click)="activeTab.set('program')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'program' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="list-todo" class="w-4 h-4"></lucide-icon>
                Growth Program
              </button>
              <button 
                (click)="activeTab.set('activities')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'activities' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="activity" class="w-4 h-4"></lucide-icon>
                Activities
              </button>
              <button 
                (click)="activeTab.set('recommendation')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'recommendation' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="lightbulb" class="w-4 h-4"></lucide-icon>
                Recommendation
              </button>
              <button 
                (click)="activeTab.set('accounting')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'accounting' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="calculator" class="w-4 h-4"></lucide-icon>
                Accounting
              </button>
              <button 
                (click)="activeTab.set('watering')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'watering' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="droplets" class="w-4 h-4"></lucide-icon>
                Watering
              </button>
              <button 
                (click)="activeTab.set('harvesting')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'harvesting' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="wheat" class="w-4 h-4"></lucide-icon>
                Harvesting
              </button>
              <button 
                (click)="activeTab.set('fertility')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'fertility' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="flask-conical" class="w-4 h-4"></lucide-icon>
                Soil & Fertility
              </button>
              <button 
                (click)="activeTab.set('inputs')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'inputs' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="tractor" class="w-4 h-4"></lucide-icon>
                Inputs & Telemetry
              </button>
              <button 
                (click)="activeTab.set('scouting')"
                class="flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 whitespace-nowrap"
                [ngClass]="activeTab() === 'scouting' ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'"
              >
                <lucide-icon name="eye" class="w-4 h-4"></lucide-icon>
                Scouting Logs
              </button>
            </div>

            <div class="p-6">
              
              @if (activeTab() === 'program') {
                @if (stagesWithDates().length > 0 || growthProgram()) {
                  <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
                    <div>
                      <h3 class="text-lg font-bold text-slate-800">
                        Growth Program: {{ growthProgram()?.name || cycle()?.growthProgram?.name || (cycle()?.crop?.name ? (cycle()?.crop?.name + ' Phenological Program') : 'Standard Crop Growth Stages') }}
                      </h3>
                      <p class="text-xs text-slate-500 mt-0.5">
                        {{ stagesWithDates().length }} phenological stages &bull; Total cycle {{ totalStageDurationDays() }} days &bull; Current: <strong class="text-emerald-700">{{ currentStageDisplayName() }}</strong>
                      </p>
                    </div>
                    <div class="flex items-center gap-2">
                      @if (currentStageObj(); as curr) {
                        <span class="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-black rounded-full flex items-center gap-1.5">
                          <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          Stage {{ curr.stageOrder }}/{{ stagesWithDates().length }}: {{ curr.stageCode || curr.shortStageName }}
                        </span>
                      }
                      <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">On Track</span>
                    </div>
                  </div>

                  <!-- Plotted Stage Progression Chart (Visualizing All Cycle Stages & Current Stage Position) -->
                  @if (stagesWithDates().length > 0) {
                    <div class="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Plotted Planting Cycle Stage Trajectory
                        </span>
                        <div class="flex items-center gap-4 text-[11px] font-semibold">
                          <span class="flex items-center gap-1.5 text-emerald-700">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed
                          </span>
                          <span class="flex items-center gap-1.5 text-blue-700 font-black">
                            <span class="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-200"></span> Current Stage (Plotted)
                          </span>
                          <span class="flex items-center gap-1.5 text-slate-500">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Upcoming
                          </span>
                        </div>
                      </div>

                      <!-- Horizontal Plotted Nodes -->
                      <div class="relative pt-3 pb-2 overflow-x-auto">
                        <div class="min-w-[640px] grid gap-2"
                             [style.grid-template-columns]="'repeat(' + stagesWithDates().length + ', minmax(0, 1fr))'">
                          @for (st of stagesWithDates(); track st.id; let idx = $index) {
                            <div class="relative flex flex-col items-center text-center p-2.5 rounded-xl border transition-all"
                                 [ngClass]="{
                                   'bg-emerald-50/70 border-emerald-200 text-emerald-900': st.status === 'completed',
                                   'bg-blue-50 border-2 border-blue-500 text-blue-950 shadow-sm scale-[1.02] z-10': st.status === 'current',
                                   'bg-white border-slate-200/80 text-slate-500': st.status === 'upcoming'
                                 }">
                              @if (st.status === 'current') {
                                <span class="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider mb-1">
                                  ● CURRENT
                                </span>
                              } @else if (st.status === 'completed') {
                                <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase mb-1">
                                  ✓ Done
                                </span>
                              } @else {
                                <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-semibold uppercase mb-1">
                                  Stage {{ st.stageOrder || (idx + 1) }}
                                </span>
                              }

                              <div class="text-xs font-black">
                                {{ st.stageCode || ('S' + (st.stageOrder || (idx + 1))) }}
                              </div>
                              <div class="text-[10px] font-medium leading-tight line-clamp-2 mt-0.5" [title]="st.stageName">
                                {{ st.shortStageName }}
                              </div>
                              <div class="mt-1.5 pt-1 border-t border-slate-200/60 w-full text-[9px] font-mono opacity-80">
                                {{ st.startDate | date:'MMM d' }} – {{ st.endDate | date:'MMM d' }}
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }

                  <div class="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                    @for (stage of stagesWithDates(); track stage.id) {
                      <div class="relative pl-6"
                           [ngClass]="stage.status === 'current' ? 'bg-blue-50/40 -ml-2 pl-8 py-4 pr-4 rounded-2xl border-2 border-blue-200/80 shadow-xs' : ''">
                        <!-- Dot Indicator -->
                        @if (stage.status === 'completed') {
                          <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white"></div>
                        } @else if (stage.status === 'current') {
                          <div class="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-white border-4 border-blue-600 flex items-center justify-center shadow-sm">
                            <div class="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                          </div>
                        } @else {
                          <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                        }

                        <div class="mb-2">
                          <h4 class="font-bold flex flex-wrap items-center gap-2"
                              [ngClass]="stage.status === 'upcoming' ? 'text-slate-500' : 'text-slate-800'">
                            <span class="text-xs font-mono font-bold text-slate-400">#{{ stage.stageOrder }}</span>
                            @if (stage.stageCode) {
                              <span class="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {{ stage.stageCode }}
                              </span>
                            }
                            <span>{{ stage.stageName }}</span>
                            @if (stage.status === 'completed') {
                              <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Completed</span>
                            } @else if (stage.status === 'current') {
                              <span class="text-xs font-black text-white bg-blue-600 px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                CURRENT STAGE
                              </span>
                            } @else {
                              <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Upcoming</span>
                            }
                          </h4>
                          <p class="text-sm text-slate-500">
                            {{ stage.startDate | date:'mediumDate' }} - {{ stage.endDate | date:'mediumDate' }} &bull; {{ stage.durationInDays }} days
                            @if (stage.startDayOffset && stage.endDayOffset) {
                              <span class="text-xs text-slate-400 ml-1">(Day {{ stage.startDayOffset }} to {{ stage.endDayOffset }})</span>
                            }
                          </p>
                        </div>

                        @if (stage.growthParameterSpecs && stage.growthParameterSpecs.length > 0) {
                          <div class="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            @for (param of stage.growthParameterSpecs; track param.id || param.elementName) {
                              <div class="px-3 py-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-2">
                                <div>
                                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {{ param.elementName }} @if (param.elementSymbol) { ({{ param.elementSymbol }}) }
                                  </div>
                                  <div class="text-xs font-extrabold text-slate-800 mt-0.5">
                                    Target: {{ param.targetValue | number:'1.0-2' }} {{ param.unit }}
                                  </div>
                                </div>
                                @if (param.minValue || param.maxValue) {
                                  <span class="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                    {{ param.minValue | number:'1.0-1' }}–{{ param.maxValue | number:'1.0-1' }} {{ param.unit }}
                                  </span>
                                }
                              </div>
                            }
                          </div>
                        }

                        @if (stage.growthActivityStageActivities && stage.growthActivityStageActivities.length) {
                          <div class="rounded-xl border p-4 space-y-3"
                               [ngClass]="{
                                 'bg-slate-50 border-slate-100': stage.status === 'completed',
                                 'bg-white border-2 border-blue-200 shadow-sm': stage.status === 'current',
                                 'bg-slate-50/50 border-slate-100 opacity-75': stage.status === 'upcoming'
                               }">
                            @for (activity of stage.growthActivityStageActivities; track activity.id) {
                              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2.5 last:pb-0 border-b last:border-b-0 border-slate-100">
                                <label class="flex items-start gap-3"
                                       [ngClass]="stage.status === 'upcoming' ? 'cursor-not-allowed' : 'cursor-pointer group'">
                                  <input type="checkbox"
                                         [disabled]="stage.status === 'upcoming' || stage.status === 'completed'"
                                         [checked]="stage.status === 'completed' || completedActivities().has(activity.id)"
                                         (change)="toggleActivity(activity.id)"
                                         class="w-4 h-4 mt-0.5 rounded border-slate-300"
                                         [ngClass]="{
                                           'text-emerald-600 focus:ring-emerald-500': stage.status !== 'upcoming',
                                           'text-slate-300': stage.status === 'upcoming'
                                         }">
                                  <div>
                                    <div class="flex flex-wrap items-center gap-2">
                                      <span class="text-sm font-medium"
                                            [ngClass]="{
                                              'text-slate-600 line-through': stage.status === 'completed' || completedActivities().has(activity.id),
                                              'text-slate-800 group-hover:text-slate-950 font-bold': stage.status === 'current' && !completedActivities().has(activity.id),
                                              'text-slate-600': stage.status === 'upcoming'
                                            }">
                                        {{ activity.name }}
                                      </span>
                                      @if (activity.activityType) {
                                        <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                          {{ activity.activityType }}
                                        </span>
                                      }
                                      @if (activity.mandatory) {
                                        <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                          Mandatory
                                        </span>
                                      }
                                    </div>
                                    @if (activity.notes) {
                                      <p class="text-xs text-slate-500 mt-0.5">{{ activity.notes }}</p>
                                    }
                                    @if (activity.dosage || activity.brandRecommendation || activity.applicationMethod) {
                                      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-1">
                                        @if (activity.dosage) { <span>Dosage: <strong class="text-slate-700">{{ activity.dosage }}</strong></span> }
                                        @if (activity.brandRecommendation && activity.brandRecommendation !== 'N/A') { <span>Input: <strong class="text-slate-700">{{ activity.brandRecommendation }}</strong></span> }
                                        @if (activity.applicationMethod) { <span>Method: <strong class="text-slate-700">{{ activity.applicationMethod }}</strong></span> }
                                      </div>
                                    }
                                  </div>
                                </label>
                                @if (activity.minStartDay || activity.maxStartDay) {
                                  <span class="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                                    Day {{ activity.minStartDay || activity.maxStartDay }}@if (activity.minStartDay && activity.maxStartDay && activity.minStartDay !== activity.maxStartDay) {–{{ activity.maxStartDay }}}
                                  </span>
                                }
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-12">
                    <lucide-icon name="loader" class="w-8 h-8 animate-spin mx-auto text-slate-400 mb-4"></lucide-icon>
                    <p class="text-slate-500">Loading Growth Program Stages...</p>
                  </div>
                }
              }
              
              
              
              @if (activeTab() === 'activities') {
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-slate-800">Activities</h3>
                  <button (click)="showLogActivityModal.set(true)" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                    Log Activity
                  </button>
                </div>

                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                   <div class="flex bg-slate-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
                      <button (click)="activitySubTab.set('ongoing')" [class]="activitySubTab() === 'ongoing' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap">Today & Ongoing</button>
                      <button (click)="activitySubTab.set('planned')" [class]="activitySubTab() === 'planned' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap">Planned</button>
                      <button (click)="activitySubTab.set('completed')" [class]="activitySubTab() === 'completed' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap">Completed</button>
                      <button (click)="activitySubTab.set('expired')" [class]="activitySubTab() === 'expired' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap">Expired</button>
                   </div>
                   <div class="flex gap-2 w-full md:w-auto overflow-x-auto">
                      <select [ngModel]="activityTypeFilter()" (ngModelChange)="activityTypeFilter.set($event)" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                          <option value="">All Types</option>
                          <option value="CROP_HEALTH">Crop Health</option>
                          <option value="CROP_NUTRITION">Crop Nutrition</option>
                          <option value="ANIMAL_HEALTH">Animal Health</option>
                          <option value="ANIMAL_NUTRITION">Animal Nutrition</option>
                          <option value="MAINTENANCE">Maintenance</option>
                          <option value="GENERAL">General</option>
                          <option value="NUTRITION">Nutrition</option>
                          <option value="HEALTH">Health</option>
                          <option value="PROTECTION">Protection</option>
                          <option value="FERTILIZATION">Fertilization</option>
                          <option value="PEST_CONTROL">Pest Control</option>
                      </select>
                      <select [ngModel]="activityPriorityFilter()" (ngModelChange)="activityPriorityFilter.set($event)" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                          <option value="">All Priorities</option>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">Critical</option>
                      </select>
                   </div>
                </div>

                <div class="space-y-4">
                  @for (activity of filteredActivities(); track activity.id) {
                    <div class="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50 shadow-sm">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" 
                           [ngClass]="getActivityColorClass(activity.activityType)">
                        <lucide-icon [name]="getActivityIcon(activity.activityType)" class="w-5 h-5"></lucide-icon>
                      </div>
                      <div class="flex-1">
                        <div class="flex justify-between items-start">
                          <div>
                            <p class="font-bold text-slate-800">{{ getStatusLabel(activity.activityType) }}</p>
                            <p class="text-sm text-slate-500 mt-0.5">{{ activity.description }}</p>
                            <div class="flex items-center gap-3 mt-2 text-xs font-medium text-slate-500">
                               <span class="flex items-center gap-1"><lucide-icon name="user" class="w-3 h-3"></lucide-icon> {{ activity.assignee || 'Unassigned' }}</span>
                               <span class="flex items-center gap-1 px-2 py-0.5 rounded-full" [ngClass]="getStatusClass(activity.currentStatus)">{{ getStatusLabel(activity.currentStatus) }}</span>
                            </div>
                          </div>
                          <div class="flex flex-col items-end gap-2">
                             <span class="text-xs font-bold text-slate-400">{{ activity.plannedStartDate | date:'mediumDate' }}</span>
                             <button (click)="viewActivityDetails(activity.id)" class="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                               View Details <lucide-icon name="arrow-right" class="w-3 h-3"></lucide-icon>
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  } @empty {
                    <div class="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <lucide-icon name="activity" class="w-8 h-8 mx-auto text-slate-400 mb-2"></lucide-icon>
                        <p class="font-bold text-slate-600">No activities found</p>
                        <p class="text-sm mt-1">Activities logged for this cycle will appear here.</p>
                    </div>
                  }
                </div>
              }
              
              @if (activeTab() === 'recommendation') {
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-slate-800">Recommendations</h3>
                  <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                    New Application
                  </button>
                </div>
                
                <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-4">
                  <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <lucide-icon name="info" class="w-5 h-5"></lucide-icon>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-800 text-sm">Next Recommended Application</h4>
                    <p class="text-sm text-slate-600 mt-1">Based on growth stage, apply Nitrogen top dressing in 5 days.</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="p-4 border border-slate-200 rounded-xl">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <h4 class="font-bold text-slate-800">NPK 10-10-10</h4>
                        <p class="text-sm text-slate-500">Liquid application &bull; Applied: Yesterday</p>
                      </div>
                      <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">50 L/acre</span>
                    </div>
                  </div>
                  <div class="p-4 border border-slate-200 rounded-xl">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <h4 class="font-bold text-slate-800">Starter Fertilizer NPK 18-46-0</h4>
                        <p class="text-sm text-slate-500">Granular &bull; Applied: {{ cycle()?.plantedDate }} (At Planting)</p>
                      </div>
                      <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">100 kg/acre</span>
                    </div>
                  </div>
                </div>
              }

              @if (activeTab() === 'accounting') {
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-slate-800">Financial Overview & Accounting</h3>
                  <div class="flex gap-2">
                    <button (click)="showLogActivityModal.set(true)" class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                      Log Expense
                    </button>
                    <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
                      Export Report
                    </button>
                  </div>
                </div>
                
                <div class="mb-8 p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                   <h4 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
                       <lucide-icon name="bar-chart-3" class="w-5 h-5 text-emerald-600"></lucide-icon>
                       Profitability Forecast
                   </h4>
                   
                   <div class="space-y-4">
                       <div>
                           <div class="flex justify-between items-end mb-2">
                               <span class="text-sm font-bold text-emerald-700">Projected Income</span>
                               <span class="text-lg font-black text-emerald-700">{{ projectedIncome() | currency }}</span>
                           </div>
                           <div class="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div class="h-full bg-emerald-500 rounded-full" style="width: 100%"></div>
                           </div>
                       </div>
                       
                       <div>
                           <div class="flex justify-between items-end mb-2">
                               <span class="text-sm font-bold text-red-700">Total Expenses (Activities)</span>
                               <span class="text-lg font-black text-red-700">{{ totalActivityCost() | currency }}</span>
                           </div>
                           <div class="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div class="h-full bg-red-500 rounded-full transition-all" [style.width]="projectedIncome() > 0 ? (totalActivityCost() / projectedIncome() * 100 > 100 ? 100 : totalActivityCost() / projectedIncome() * 100) + '%' : '0%'"></div>
                           </div>
                       </div>
                       
                       <div class="pt-4 mt-2 border-t border-slate-100">
                           <div class="flex justify-between items-end">
                               <span class="text-sm font-bold text-slate-600">Estimated Profit (Margin)</span>
                               <div class="text-right">
                                  <span class="text-2xl font-black" [ngClass]="estimatedProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'">
                                      {{ estimatedProfit() | currency }}
                                  </span>
                                  <span class="ml-2 text-sm font-bold px-2 py-0.5 rounded-full" [ngClass]="estimatedProfit() >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
                                      {{ roi() }}% ROI
                                  </span>
                               </div>
                           </div>
                       </div>
                   </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div class="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <p class="text-sm font-bold text-slate-500 mb-1">Total Expenses (Activities)</p>
                    <p class="text-2xl font-black text-red-600">{{ totalActivityCost() | currency }}</p>
                  </div>
                  <div class="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <p class="text-sm font-bold text-slate-500 mb-1">Projected Income</p>
                    <p class="text-2xl font-black text-emerald-600">{{ projectedIncome() | currency }}</p>
                  </div>
                  <div class="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <p class="text-sm font-bold text-slate-500 mb-1">Estimated Profit</p>
                    <p class="text-2xl font-black" [ngClass]="estimatedProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'">
                      {{ estimatedProfit() | currency }}
                    </p>
                  </div>
                  <div class="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <p class="text-sm font-bold text-slate-500 mb-1">Est. ROI</p>
                    <p class="text-2xl font-black" [ngClass]="estimatedProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'">
                      {{ roi() }}%
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div class="lg:col-span-1 space-y-6">
                    <div class="p-5 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
                      <h4 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                         <lucide-icon name="trending-up" class="w-4 h-4 text-emerald-600"></lucide-icon>
                         Income Projection Model
                      </h4>
                      <div class="space-y-4">
                        <div>
                           <label class="block text-sm font-bold text-slate-700 mb-1">Expected Yield (Tons)</label>
                           <input type="number" [ngModel]="expectedYield()" (ngModelChange)="expectedYield.set($event)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        </div>
                        <div>
                           <label class="block text-sm font-bold text-slate-700 mb-1">Expected Market Price ($ / Ton)</label>
                           <input type="number" [ngModel]="expectedPrice()" (ngModelChange)="expectedPrice.set($event)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        </div>
                        <div class="pt-4 border-t border-slate-200">
                           <div class="flex justify-between items-center">
                              <span class="text-sm font-bold text-slate-600">Calculated Income:</span>
                              <span class="font-black text-emerald-600">{{ projectedIncome() | currency }}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="lg:col-span-2">
                    <div class="p-5 border border-slate-200 rounded-xl bg-white shadow-sm h-full">
                      <div class="flex justify-between items-center mb-6">
                        <h4 class="font-bold text-slate-800 flex items-center gap-2">
                           <lucide-icon name="pie-chart" class="w-4 h-4 text-blue-600"></lucide-icon>
                           Expenses Breakdown (By Activity)
                        </h4>
                      </div>
                      
                      @if (activities().length === 0) {
                         <div class="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <lucide-icon name="receipt" class="w-8 h-8 mx-auto text-slate-400 mb-2"></lucide-icon>
                            <p class="font-bold text-slate-600">No activities recorded</p>
                            <p class="text-sm mt-1">Log activities with costs to see the breakdown here.</p>
                         </div>
                      } @else {
                         <div class="space-y-3">
                           @for (activity of activities(); track activity.id) {
                             @if (activity.estimatedCost || activity.actualCost) {
                               <div class="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                                 <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" [ngClass]="getActivityColorClass(activity.activityType)">
                                      <lucide-icon [name]="getActivityIcon(activity.activityType)" class="w-4 h-4"></lucide-icon>
                                    </div>
                                    <div>
                                      <p class="font-bold text-slate-800 text-sm">{{ getStatusLabel(activity.activityType) }}</p>
                                      <p class="text-xs text-slate-500 line-clamp-1">{{ activity.description }}</p>
                                    </div>
                                 </div>
                                 <div class="text-right">
                                    <p class="font-black text-slate-700">{{ (activity.actualCost || activity.estimatedCost || 0) | currency }}</p>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                       {{ activity.actualCost ? 'ACTUAL' : 'ESTIMATED' }}
                                    </p>
                                    <button (click)="viewActivityDetails(activity.id)" class="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 justify-end w-full">
                                      Details <lucide-icon name="arrow-right" class="w-3 h-3"></lucide-icon>
                                    </button>
                                 </div>
                               </div>
                             }
                           }
                           
                           @if (totalActivityCost() === 0) {
                              <div class="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                                <p class="font-bold text-slate-600">No costs recorded yet</p>
                                <p class="text-sm mt-1">Update your activities with estimated or actual costs.</p>
                             </div>
                           }
                         </div>
                      }
                    </div>
                  </div>
                </div>
              }
              
              @if (activeTab() === 'watering') {
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-slate-800">Irrigation Management</h3>
                  <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <lucide-icon name="play" class="w-4 h-4"></lucide-icon>
                    Start Irrigation
                  </button>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p class="text-xs font-bold uppercase text-blue-500 mb-1">Total Applied (This Week)</p>
                    <p class="text-2xl font-black text-blue-900">45 <span class="text-sm font-normal">mm</span></p>
                  </div>
                  <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p class="text-xs font-bold uppercase text-slate-500 mb-1">Evapotranspiration (ETc)</p>
                    <p class="text-2xl font-black text-slate-800">38 <span class="text-sm font-normal">mm</span></p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="p-4 border border-slate-200 rounded-xl">
                    <div class="flex justify-between items-center mb-1">
                      <h4 class="font-bold text-slate-800">Drip Irrigation Run</h4>
                      <span class="text-sm font-bold text-slate-600">15 mm</span>
                    </div>
                    <p class="text-sm text-slate-500">Today &bull; Duration: 2 hrs 30 mins</p>
                  </div>
                  <div class="p-4 border border-slate-200 rounded-xl">
                    <div class="flex justify-between items-center mb-1">
                      <h4 class="font-bold text-slate-800">Drip Irrigation Run</h4>
                      <span class="text-sm font-bold text-slate-600">15 mm</span>
                    </div>
                    <p class="text-sm text-slate-500">3 days ago &bull; Duration: 2 hrs 30 mins</p>
                  </div>
                  <div class="p-4 border border-slate-200 rounded-xl">
                    <div class="flex justify-between items-center mb-1">
                      <h4 class="font-bold text-slate-800">Rainfall</h4>
                      <span class="text-sm font-bold text-blue-600">12 mm</span>
                    </div>
                    <p class="text-sm text-slate-500">5 days ago</p>
                  </div>
                </div>
              }
              
              @if (activeTab() === 'harvesting') {
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-slate-800">Harvesting Management</h3>
                  <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                    Log Harvest
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div class="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p class="text-xs font-bold uppercase text-amber-600 mb-1">Expected Yield</p>
                    <p class="text-2xl font-black text-amber-900">4,500 <span class="text-sm font-normal">kg</span></p>
                  </div>
                  <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p class="text-xs font-bold uppercase text-emerald-600 mb-1">Total Harvested</p>
                    <p class="text-2xl font-black text-emerald-900">1,200 <span class="text-sm font-normal">kg</span></p>
                  </div>
                  <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p class="text-xs font-bold uppercase text-slate-500 mb-1">Remaining (Est.)</p>
                    <p class="text-2xl font-black text-slate-800">3,300 <span class="text-sm font-normal">kg</span></p>
                  </div>
                </div>
                
                <div class="w-full bg-slate-100 rounded-full h-3 mb-8 overflow-hidden flex">
                  <div class="bg-emerald-500 h-full" style="width: 26.6%"></div>
                </div>
                
                <h4 class="font-bold text-slate-700 mb-4">Harvest Logs</h4>
                <div class="space-y-4">
                  <div class="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                        <lucide-icon name="tractor" class="w-5 h-5"></lucide-icon>
                      </div>
                      <div>
                        <h5 class="font-bold text-slate-800">First Pass (Manual)</h5>
                        <p class="text-sm text-slate-500">2 days ago &bull; Logged by: Farm Manager</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-black text-emerald-700 text-lg">1,200 kg</p>
                      <p class="text-xs text-slate-500">Quality: Grade A</p>
                    </div>
                  </div>
                  
                  <div class="p-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed text-center">
                    <lucide-icon name="wheat" class="w-8 h-8 text-slate-400 mx-auto mb-2"></lucide-icon>
                    <p class="font-medium text-slate-600">No further harvest logs.</p>
                    <p class="text-sm text-slate-400">Click 'Log Harvest' to record new yields.</p>
                  </div>
                </div>
              }

              @if (activeTab() === 'fertility') {
                <div class="space-y-6">
                  <div class="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <h3 class="text-lg font-bold text-slate-800">Field Soil Fertility & Chemistry Profile</h3>
                      <p class="text-xs text-slate-500">Real-time macronutrient assays, soil pH buffer status, and application records.</p>
                    </div>
                  </div>

                  <!-- Quick Stats Grid -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                      <span class="text-[11px] font-bold text-slate-400 uppercase">Soil pH</span>
                      <div class="text-2xl font-black text-slate-800 my-1">6.5</div>
                      <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal (6.2 - 6.8)</span>
                    </div>

                    <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                      <span class="text-[11px] font-bold text-slate-400 uppercase">Nitrogen (N)</span>
                      <div class="text-2xl font-black text-slate-800 my-1">45 <span class="text-xs font-normal">ppm</span></div>
                      <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Side-Dress Due</span>
                    </div>

                    <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                      <span class="text-[11px] font-bold text-slate-400 uppercase">Phosphorus (P)</span>
                      <div class="text-2xl font-black text-slate-800 my-1">22 <span class="text-xs font-normal">ppm</span></div>
                      <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
                    </div>

                    <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                      <span class="text-[11px] font-bold text-slate-400 uppercase">Potassium (K)</span>
                      <div class="text-2xl font-black text-slate-800 my-1">110 <span class="text-xs font-normal">ppm</span></div>
                      <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
                    </div>
                  </div>

                  <!-- Historical Applications -->
                  <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Application History</h4>
                    <div class="space-y-3">
                      <div class="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                        <div class="flex justify-between items-start mb-1.5">
                          <div>
                            <h5 class="font-bold text-sm text-slate-800">Liquid Starter 10-34-0 + Zn-EDTA</h5>
                            <p class="text-xs text-slate-500">14 May 2026 &bull; Applied by: Crew Leader Jackson &bull; Planter In-Furrow</p>
                          </div>
                          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">50 L/ha</span>
                        </div>
                        <p class="text-xs text-slate-600 leading-relaxed">Starter polyphosphate placed directly in furrow with seed to stimulate root zone emergence.</p>
                      </div>

                      <div class="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                        <div class="flex justify-between items-start mb-1.5">
                          <div>
                            <h5 class="font-bold text-sm text-slate-800">Agricultural Calcific Lime Application</h5>
                            <p class="text-xs text-slate-500">15 Oct 2025 &bull; Applied by: Sarah Smith &bull; Spreader Truck #04</p>
                          </div>
                          <span class="px-2.5 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">1,200 kg/ha</span>
                        </div>
                        <p class="text-xs text-slate-600 leading-relaxed">Fall lime conditioning to buffer pH from 5.9 to 6.5 optimal range.</p>
                      </div>
                    </div>
                  </div>
                </div>
              }

              @if (activeTab() === 'inputs') {
                <div class="space-y-6">
                  <!-- Header -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 class="text-lg font-bold text-slate-800">Recorded Field Inputs & Machinery Telemetry</h3>
                      <p class="text-xs text-slate-500">Comprehensive breakdown of seeds, fertilizers, crop chemistry, fuel, and labour hours.</p>
                    </div>
                  </div>

                  <!-- Summary Cards Row -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                      <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Recorded Cost</span>
                      <div class="text-xl font-black text-emerald-950 mt-1">&#36;{{ totalRecordedInputsCost() | number:'1.2-2' }}</div>
                      <span class="text-[10px] text-emerald-700 font-semibold block mt-0.5">&#36;{{ (totalRecordedInputsCost() / (field()?.size || 45.2)).toFixed(2) }}/ha</span>
                    </div>

                    <div class="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                      <span class="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Total Diesel Fuel</span>
                      <div class="text-xl font-black text-amber-950 mt-1">{{ totalFuelUsed() }} L</div>
                      <span class="text-[10px] text-amber-700 font-semibold block mt-0.5">{{ (totalFuelUsed() / (field()?.size || 45.2)).toFixed(1) }} L/ha</span>
                    </div>

                    <div class="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
                      <span class="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Machine Run Time</span>
                      <div class="text-xl font-black text-blue-950 mt-1">{{ totalMachineHours() }} hrs</div>
                      <span class="text-[10px] text-blue-700 font-semibold block mt-0.5">Efficiency target met</span>
                    </div>

                    <div class="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl">
                      <span class="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Labour Hours</span>
                      <div class="text-xl font-black text-purple-950 mt-1">{{ totalLabourHours() }} hrs</div>
                      <span class="text-[10px] text-purple-700 font-semibold block mt-0.5">Crew passes logged</span>
                    </div>
                  </div>

                  <!-- Table of Entered Inputs -->
                  <div class="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
                    <div class="overflow-x-auto">
                      <table class="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                            <th class="p-3.5">Category</th>
                            <th class="p-3.5">Input Item / Model</th>
                            <th class="p-3.5">Date</th>
                            <th class="p-3.5">Rate / Qty</th>
                            <th class="p-3.5 text-right">Total Cost</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-medium">
                          @for (item of fieldInputs(); track item.id) {
                            <tr class="hover:bg-slate-50/60 transition-colors">
                              <td class="p-3.5">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                                      [ngClass]="item.category === 'SEED' ? 'bg-teal-100 text-teal-800' : (item.category === 'FERTILIZER' ? 'bg-emerald-100 text-emerald-800' : (item.category === 'CHEMISTRY' ? 'bg-purple-100 text-purple-800' : (item.category === 'MACHINERY' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800')))">
                                  {{ item.category }}
                                </span>
                              </td>
                              <td class="p-3.5">
                                <strong class="text-slate-900 block font-bold">{{ item.name }}</strong>
                                <span class="text-[11px] text-slate-500">{{ item.notes }}</span>
                              </td>
                              <td class="p-3.5 text-slate-600">{{ item.date }}</td>
                              <td class="p-3.5 font-bold text-slate-800">
                                {{ item.quantity }} {{ item.measurementUnit }}
                              </td>
                              <td class="p-3.5 text-right font-black text-slate-900">
                                &#36;{{ item.totalCost | number:'1.2-2' }}
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              }

              @if (activeTab() === 'scouting') {
                <div class="space-y-6">
                  <div class="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <h3 class="text-lg font-bold text-slate-800">Field Scouting Observations & Agronomic Diagnosis</h3>
                      <p class="text-xs text-slate-500">Multispectral drone telemetry, pest sweeps, and soil moisture observations.</p>
                    </div>
                  </div>

                  <div class="space-y-4">
                    @for (obs of scoutingLogs(); track obs.id) {
                      <div class="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                          <div>
                            <div class="flex items-center gap-2">
                              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                                    [ngClass]="obs.severity === 'HIGH' ? 'bg-red-100 text-red-800' : (obs.severity === 'MODERATE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')">
                                {{ obs.severity }} SEVERITY &bull; {{ obs.issueCategory }}
                              </span>
                              <span class="text-xs text-slate-400 font-semibold">{{ obs.date }}</span>
                            </div>
                            <h4 class="text-base font-bold text-slate-900 mt-1.5">{{ obs.locationDetails }}</h4>
                            <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ obs.description }}</p>
                          </div>
                          <span class="px-2.5 py-1 text-xs font-bold rounded-lg shrink-0"
                                [ngClass]="obs.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                            {{ obs.status }}
                          </span>
                        </div>

                        <!-- Agronomic Remedy Box -->
                        <div class="mt-3 p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs text-slate-800 flex items-start gap-2">
                          <lucide-icon name="lightbulb" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></lucide-icon>
                          <div>
                            <strong class="text-emerald-900">Recommended Agronomic Action: </strong>
                            {{ obs.remedyAction }}
                          </div>
                        </div>

                        <div class="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                          <span>Scout: <strong class="text-slate-700">{{ obs.scoutName }}</strong></span>
                          <span>Crop Stage: <strong class="text-slate-700">{{ obs.cropStage }}</strong></span>
                          <span>Affected Area: <strong class="text-slate-700">{{ obs.affectedAreaPct }}%</strong></span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Sidebar / Sensor & Field Geometry Data -->
        <div class="space-y-6">
          <!-- Mini GIS Boundary Map Card (from Field View) -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <lucide-icon name="satellite" class="w-4 h-4 text-emerald-600"></lucide-icon>
                  Field GIS & Satellite Preview
                </h3>
                <p class="text-[11px] text-slate-500">GIS boundary, NDVI vigour & sensor placement.</p>
              </div>

              <!-- Layer Selector -->
              <div class="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button (click)="mapLayer.set('satellite')"
                        [class]="mapLayer() === 'satellite' ? 'px-2 py-0.5 bg-white text-slate-900 rounded-md shadow-2xs' : 'px-2 py-0.5 text-slate-600 hover:text-slate-900'">
                  Sat
                </button>
                <button (click)="mapLayer.set('ndvi')"
                        [class]="mapLayer() === 'ndvi' ? 'px-2 py-0.5 bg-white text-emerald-700 rounded-md shadow-2xs' : 'px-2 py-0.5 text-slate-600 hover:text-slate-900'">
                  NDVI
                </button>
                <button (click)="mapLayer.set('moisture')"
                        [class]="mapLayer() === 'moisture' ? 'px-2 py-0.5 bg-white text-blue-700 rounded-md shadow-2xs' : 'px-2 py-0.5 text-slate-600 hover:text-slate-900'">
                  Moist
                </button>
              </div>
            </div>

            <!-- Interactive SVG Map Canvas -->
            <div class="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center group">
              <!-- Satellite/NDVI Backdrop Pattern -->
              <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:14px_14px]"></div>

              @if (mapLayer() === 'satellite') {
                <div class="absolute inset-0 bg-cover bg-center opacity-30"
                     style="background-image: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);"></div>
              } @else if (mapLayer() === 'ndvi') {
                <div class="absolute inset-0 bg-linear-to-tr from-amber-600/20 via-emerald-500/30 to-green-600/40"></div>
              } @else {
                <div class="absolute inset-0 bg-linear-to-br from-blue-900/30 via-cyan-600/25 to-blue-500/30"></div>
              }

              <!-- Dynamic SVG Field Polygon -->
              <svg class="w-full h-full p-3 relative z-10" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="fieldGradCycle" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="#059669" stop-opacity="0.2" />
                  </linearGradient>
                </defs>
                <polygon [attr.points]="computedSvgPolygon()"
                         fill="url(#fieldGradCycle)"
                         stroke="#10b981"
                         stroke-width="2.5"
                         class="transition-all duration-300 drop-shadow-md" />
                <circle cx="120" cy="95" r="4.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="170" cy="115" r="4.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="150" cy="100" r="45" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4,4" opacity="0.6" />
              </svg>

              <!-- Map Legend & Coordinate Overlay -->
              <div class="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-1 rounded-lg text-[9px] font-mono border border-slate-700">
                <span>{{ centroidCoordinates() }}</span>
              </div>

              <div class="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-lg text-[9px] font-bold flex items-center gap-1 border border-slate-700">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="mapLayer() === 'ndvi' ? 'bg-emerald-400' : (mapLayer() === 'moisture' ? 'bg-blue-400' : 'bg-amber-400')"></span>
                <span class="capitalize">{{ mapLayer() }}</span>
              </div>
            </div>

            <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-500 text-[11px]">2 LoRa Mesh Probes Online</span>
              <a [routerLink]="fieldId() ? ['/crops/view', fieldId()] : ['/crops']" class="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Field Console <lucide-icon name="arrow-right" class="w-3 h-3"></lucide-icon>
              </a>
            </div>
          </div>

          <!-- Live Sensor Data Card -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                <lucide-icon name="activity" class="w-5 h-5 text-emerald-600"></lucide-icon>
                Live Sensor Telemetry
              </h3>
              <button (click)="showSensorHistory.set(true)" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <lucide-icon name="history" class="w-4 h-4"></lucide-icon> History
              </button>
            </div>
            
            <div class="space-y-6">
              <!-- Soil Moisture -->
              <div>
                <div class="flex justify-between items-end mb-2">
                  <div class="flex items-center gap-2">
                    <lucide-icon name="droplets" class="w-4 h-4 text-blue-500"></lucide-icon>
                    <span class="font-bold text-slate-700 text-sm">Soil Moisture</span>
                  </div>
                  <span class="font-black text-slate-900">32%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 32%"></div>
                </div>
                <div class="flex justify-between text-[10px] font-medium text-slate-400">
                  <span>Dry</span>
                  <span>Optimal</span>
                  <span>Wet</span>
                </div>
              </div>

              <!-- Soil pH -->
              <div>
                <div class="flex justify-between items-end mb-2">
                  <div class="flex items-center gap-2">
                    <lucide-icon name="test-tube" class="w-4 h-4 text-amber-500"></lucide-icon>
                    <span class="font-bold text-slate-700 text-sm">Soil pH</span>
                  </div>
                  <span class="font-black text-slate-900">6.8</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div class="bg-amber-500 h-2 rounded-full" style="width: 68%"></div>
                </div>
                <div class="flex justify-between text-[10px] font-medium text-slate-400">
                  <span>Acidic</span>
                  <span>Neutral</span>
                  <span>Alkaline</span>
                </div>
              </div>
              
              <!-- NPK Levels -->
              <div class="pt-4 border-t border-slate-100">
                <span class="font-bold text-slate-700 text-sm mb-4 block">NPK Levels</span>
                <div class="grid grid-cols-3 gap-3">
                  <div class="text-center p-2 bg-slate-50 rounded-lg">
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Nitrogen</p>
                    <p class="font-black text-slate-800 mt-1">42<span class="text-xs font-normal">ppm</span></p>
                    <div class="w-full bg-slate-200 rounded-full h-1 mt-2">
                      <div class="bg-emerald-500 h-1 rounded-full" style="width: 60%"></div>
                    </div>
                  </div>
                  <div class="text-center p-2 bg-slate-50 rounded-lg">
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Phosphorus</p>
                    <p class="font-black text-slate-800 mt-1">20<span class="text-xs font-normal">ppm</span></p>
                    <div class="w-full bg-slate-200 rounded-full h-1 mt-2">
                      <div class="bg-emerald-500 h-1 rounded-full" style="width: 75%"></div>
                    </div>
                  </div>
                  <div class="text-center p-2 bg-slate-50 rounded-lg">
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Potassium</p>
                    <p class="font-black text-slate-800 mt-1">105<span class="text-xs font-normal">ppm</span></p>
                    <div class="w-full bg-slate-200 rounded-full h-1 mt-2">
                      <div class="bg-emerald-500 h-1 rounded-full" style="width: 85%"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- AI Analysis -->
              <div class="pt-4 border-t border-slate-100">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-bold text-slate-700 text-sm flex items-center gap-2">
                    <lucide-icon name="zap" class="w-4 h-4 text-amber-500"></lucide-icon>
                    AI Sensor Analysis
                  </span>
                  <button (click)="analyzeSensorData()" [disabled]="analyzing()" class="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded hover:bg-amber-100 disabled:opacity-50 transition-colors">
                    {{ analyzing() ? 'Analyzing...' : 'Analyze' }}
                  </button>
                </div>
                @if (aiAnalysis()) {
                  <div class="p-3 bg-amber-50 rounded-lg text-sm text-slate-700 border border-amber-100 leading-relaxed shadow-sm">
                    {{ aiAnalysis() }}
                  </div>
                } @else {
                  <p class="text-xs text-slate-500 italic">Click analyze to compare live readings with expected stage conditions.</p>
                }
              </div>

              <!-- Soil Temp -->
              <div class="pt-4 border-t border-slate-100">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <lucide-icon name="thermometer" class="w-4 h-4 text-red-500"></lucide-icon>
                    <span class="font-bold text-slate-700 text-sm">Soil Temp</span>
                  </div>
                  <span class="font-black text-slate-900">22°C</span>
                </div>
              </div>

            </div>
          </div>
          
          <div class="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
            <h3 class="font-bold text-emerald-800 mb-2">Growth Stage</h3>
            <p class="text-2xl font-black text-emerald-900 mb-1">V6 Stage</p>
            <p class="text-sm text-emerald-700 mb-4">6 visible collars &bull; Rapid growth phase</p>
            <div class="w-full bg-emerald-200 rounded-full h-2">
              <div class="bg-emerald-600 h-2 rounded-full" style="width: 45%"></div>
            </div>
          </div>

        </div>
      </div>

      <!-- Activity Detail Modal -->
      @if (showActivityDetailModal()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            @if (isLoadingActivityDetail()) {
              <div class="p-12 flex flex-col items-center justify-center text-slate-500">
                <lucide-icon name="loader" class="w-8 h-8 animate-spin mb-4 text-emerald-600"></lucide-icon>
                <p class="font-bold">Loading details...</p>
              </div>
            } @else { @if (selectedActivityDetail(); as detail) {
              <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm" [ngClass]="getActivityColorClass(detail.activityType)">
                    <lucide-icon [name]="getActivityIcon(detail.activityType)" class="w-5 h-5"></lucide-icon>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-slate-800">{{ getStatusLabel(detail.activityType) }}</h2>
                    <p class="text-sm text-slate-500">ID: {{ detail.id }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <button (click)="openUpdateStatusModal()" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <lucide-icon name="pencil" class="w-4 h-4"></lucide-icon>
                    Update Status
                  </button>
                  <button (click)="closeActivityDetailModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
                  </button>
                </div>
              </div>
              <div class="p-6 overflow-y-auto">
                <div class="space-y-6">
                  
                  <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                     <p class="text-sm font-medium text-slate-700">{{ detail.description }}</p>
                     <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                           <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                           <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" [ngClass]="getStatusClass(detail.currentStage.status || 'SCHEDULED')">
                              {{ getStatusLabel(detail.currentStage.status || 'SCHEDULED') }}
                           </span>
                        </div>
                        <div>
                           <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
                           <span class="text-sm font-bold text-slate-700">{{ detail.priority }}</span>
                        </div>
                        <div>
                           <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assignee</p>
                           <span class="text-sm font-bold text-slate-700">{{ detail.assignee || 'Unassigned' }}</span>
                        </div>
                        <div>
                           <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Area</p>
                           <span class="text-sm font-bold text-slate-700">{{ detail.targetAreaHa ? detail.targetAreaHa + ' Ha' : 'N/A' }}</span>
                        </div>
                     </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div class="border border-slate-200 rounded-xl p-4">
                        <h4 class="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                           <lucide-icon name="calendar" class="w-4 h-4 text-emerald-600"></lucide-icon>
                           Schedule
                        </h4>
                        <div class="space-y-2 text-sm">
                           <div class="flex justify-between">
                              <span class="text-slate-500">Planned Start:</span>
                              <span class="font-medium text-slate-800">{{ detail.plannedStartDate | date:'mediumDate' }}</span>
                           </div>
                           <div class="flex justify-between">
                              <span class="text-slate-500">Planned End:</span>
                              <span class="font-medium text-slate-800">{{ detail.plannedEndDate | date:'mediumDate' }}</span>
                           </div>
                           @if (detail.actualStartDate) {
                             <div class="flex justify-between">
                                <span class="text-slate-500">Actual Start:</span>
                                <span class="font-medium text-emerald-600">{{ detail.actualStartDate | date:'mediumDate' }}</span>
                             </div>
                           }
                           @if (detail.actualEndDate) {
                             <div class="flex justify-between">
                                <span class="text-slate-500">Actual End:</span>
                                <span class="font-medium text-emerald-600">{{ detail.actualEndDate | date:'mediumDate' }}</span>
                             </div>
                           }
                        </div>
                     </div>

                     <div class="border border-slate-200 rounded-xl p-4">
                        <h4 class="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                           <lucide-icon name="dollar-sign" class="w-4 h-4 text-emerald-600"></lucide-icon>
                           Financials
                        </h4>
                        <div class="space-y-2 text-sm">
                           <div class="flex justify-between items-center">
                              <span class="text-slate-500">Estimated Cost:</span>
                              <span class="font-medium text-slate-800">{{ detail.estimatedCost | currency }}</span>
                           </div>
                           <div class="flex justify-between items-center pt-2 border-t border-slate-100">
                              <span class="text-slate-500 font-bold">Actual Cost:</span>
                              <span class="font-black text-emerald-600 text-lg">{{ detail.actualCost | currency }}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  @if (detail.stageHistory && detail.stageHistory.length > 0) {
                     <div>
                        <h4 class="font-bold text-slate-800 text-sm mb-3">Stage History</h4>
                        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
                           <table class="w-full text-left text-sm">
                              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                                 <tr>
                                    <th class="px-4 py-2">Date</th>
                                    <th class="px-4 py-2">Status</th>
                                    <th class="px-4 py-2">Updated By</th>
                                    <th class="px-4 py-2">Remarks</th>
                                 </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100">
                                 @for (stage of detail.stageHistory; track stage.id) {
                                    <tr>
                                       <td class="px-4 py-3 whitespace-nowrap text-slate-500">{{ stage.enteredOn | date:'mediumDate' }}</td>
                                       <td class="px-4 py-3 whitespace-nowrap">
                                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" [ngClass]="getStatusClass(stage.status)">
                                             {{ getStatusLabel(stage.status) }}
                                          </span>
                                       </td>
                                       <td class="px-4 py-3 whitespace-nowrap text-slate-800">{{ stage.updatedBy || 'System' }}</td>
                                       <td class="px-4 py-3 text-slate-600 min-w-[200px]">{{ stage.remarks || '-' }}</td>
                                    </tr>
                                 }
                              </tbody>
                           </table>
                        </div>
                     </div>
                  }

                  @if (detail.resourcesUsed && detail.resourcesUsed.length > 0) {
                     <div>
                        <h4 class="font-bold text-slate-800 text-sm mb-3">Resources Used</h4>
                        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
                           <table class="w-full text-left text-sm">
                              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                                 <tr>
                                    <th class="px-4 py-2">Resource</th>
                                    <th class="px-4 py-2 text-right">Quantity</th>
                                    <th class="px-4 py-2 text-right">Total Cost</th>
                                 </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100">
                                 @for (res of detail.resourcesUsed; track res.id) {
                                    <tr>
                                       <td class="px-4 py-2 font-medium text-slate-800">{{ res.resourceName }}</td>
                                       <td class="px-4 py-2 text-right text-slate-600">{{ res.quantityUsed }} {{ res.unitOfMeasure }}</td>
                                       <td class="px-4 py-2 text-right text-slate-800 font-bold">{{ res.totalCost | currency }}</td>
                                    </tr>
                                 }
                              </tbody>
                           </table>
                        </div>
                     </div>
                  }

                </div>
              </div>
            } @else {
              <div class="p-12 flex flex-col items-center justify-center text-slate-500">
                <p class="font-bold">Failed to load activity details.</p>
              </div>
            } }
          </div>
        </div>
      }
<!-- Update Status Modal -->
      @if (showUpdateStatusModal()) {
        <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[60] p-4">
          <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <lucide-icon name="pencil" class="w-5 h-5 text-emerald-600"></lucide-icon>
                Update Activity Status
              </h2>
              <button (click)="closeUpdateStatusModal()" class="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <div class="p-6 overflow-y-auto">
              <form [formGroup]="updateStatusForm" (ngSubmit)="submitUpdateStatus()" class="space-y-6">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">New Status *</label>
                        <select formControlName="status" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="">Select Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="ASSIGNED">Assigned</option>
                            <option value="DUE">Due</option>
                            <option value="OVERDUE">Overdue</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="PARKED">Parked / On Hold</option>
                            <option value="PENDING_VERIFICATION">Pending Verification</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="SKIPPED">Skipped</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NOT_DONE">Not Done</option>
                        </select>
                        @if (updateStatusForm.get('status')?.touched && updateStatusForm.get('status')?.invalid) {
                          <p class="text-xs text-red-500 mt-1">Status is required.</p>
                        }
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Updated By</label>
                        <input type="text" formControlName="updatedBy" placeholder="e.g. John Doe" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Remarks</label>
                    <textarea formControlName="remarks" rows="2" placeholder="Add any notes about this status change..." class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                </div>

                <div class="border-t border-slate-200 pt-6">
                    <div class="flex items-center justify-between mb-4">
                       <h3 class="font-bold text-slate-800 flex items-center gap-2">
                          <lucide-icon name="box" class="w-4 h-4 text-slate-500"></lucide-icon>
                          Resources Used (Optional)
                       </h3>
                       <button type="button" (click)="addResourceUsage()" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon> Add Resource
                       </button>
                    </div>

                    <div formArrayName="resourcesUsed" class="space-y-4">
                       @for (resourceCtrl of resourcesUsedControls.controls; track $index) {
                          <div [formGroupName]="$index" class="p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                             <button type="button" (click)="removeResourceUsage($index)" class="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                             </button>
                             
                             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                   <label class="block text-xs font-bold text-slate-700 mb-1">Resource Type *</label>
                                   <select formControlName="resourceType" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                      <option value="INVENTORY_ITEM">Inventory Item</option>
                                      <option value="LABOR">Labor</option>
                                      <option value="MACHINERY">Machinery</option>
                                   </select>
                                </div>
                                <div>
                                   <label class="block text-xs font-bold text-slate-700 mb-1">Resource Name</label>
                                   <input type="text" formControlName="resourceName" placeholder="e.g. NPK Fertilizer" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                </div>
                                <div>
                                   <label class="block text-xs font-bold text-slate-700 mb-1">Quantity Used *</label>
                                   <input type="number" step="0.01" formControlName="quantityUsed" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                </div>
                                <div>
                                   <label class="block text-xs font-bold text-slate-700 mb-1">Unit of Measure *</label>
                                   <select formControlName="unitOfMeasure" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                      <option value="KILOGRAM">Kilogram (kg)</option>
                                      <option value="LITRE">Litre (L)</option>
                                      <option value="MILLILITRE">Millilitre (ml)</option>
                                      <option value="PIECE">Piece</option>
                                      <option value="HOUR">Hour</option>
                                   </select>
                                </div>
                             </div>
                          </div>
                       }
                       @if (resourcesUsedControls.controls.length === 0) {
                          <div class="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
                             <p class="text-sm text-slate-500">No resources logged for this update.</p>
                          </div>
                       }
                    </div>
                </div>
              </form>
            </div>
            <div class="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50 rounded-b-2xl">
              <button (click)="closeUpdateStatusModal()" type="button" class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button (click)="submitUpdateStatus()" [disabled]="isSubmittingUpdateStatus() || updateStatusForm.invalid" class="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                @if (isSubmittingUpdateStatus()) {
                  <lucide-icon name="loader" class="w-4 h-4 animate-spin"></lucide-icon>
                  Saving...
                } @else {
                  Save Status
                }
              </button>
            </div>
          </div>
        </div>
      }
<!-- Log Activity Modal -->
      @if (showLogActivityModal()) {
        <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <lucide-icon name="activity" class="w-5 h-5 text-emerald-600"></lucide-icon>
                Log New Activity
              </h2>
              <button (click)="showLogActivityModal.set(false)" class="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <div class="p-6 overflow-y-auto">
              <form [formGroup]="logActivityForm" (ngSubmit)="submitActivity()" class="space-y-4">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Activity Type *</label>
                        <select formControlName="activityType" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="">Select Type</option>
                            <option value="CROP_HEALTH">Crop Health</option>
                            <option value="CROP_NUTRITION">Crop Nutrition</option>
                            <option value="ANIMAL_HEALTH">Animal Health</option>
                            <option value="ANIMAL_NUTRITION">Animal Nutrition</option>
                            <option value="MAINTENANCE">Maintenance</option>
                            <option value="GENERAL">General</option>
                            <option value="NUTRITION">Nutrition</option>
                            <option value="HEALTH">Health</option>
                            <option value="PROTECTION">Protection</option>
                            <option value="FERTILIZATION">Fertilization</option>
                            <option value="PEST_CONTROL">Pest Control</option>
                        </select>
                        @if (logActivityForm.get('activityType')?.touched && logActivityForm.get('activityType')?.invalid) {
                          <p class="text-xs text-red-500 mt-1">Activity Type is required.</p>
                        }
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                        <select formControlName="priority" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Description *</label>
                    <input type="text" formControlName="description" placeholder="e.g. Applied 15mm using drip lines" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    @if (logActivityForm.get('description')?.touched && logActivityForm.get('description')?.invalid) {
                      <p class="text-xs text-red-500 mt-1">Description is required.</p>
                    }
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Planned Start Date *</label>
                        <input type="date" formControlName="plannedStartDate" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        @if (logActivityForm.get('plannedStartDate')?.touched && logActivityForm.get('plannedStartDate')?.invalid) {
                          <p class="text-xs text-red-500 mt-1">Start Date is required.</p>
                        }
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Planned End Date *</label>
                        <input type="date" formControlName="plannedEndDate" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        @if (logActivityForm.get('plannedEndDate')?.touched && logActivityForm.get('plannedEndDate')?.invalid) {
                          <p class="text-xs text-red-500 mt-1">End Date is required.</p>
                        }
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Assignee</label>
                        <input type="text" formControlName="assignee" placeholder="John Doe" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Target Area (Ha)</label>
                        <input type="number" step="0.01" formControlName="targetAreaHa" placeholder="0.0" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2 sm:col-span-1">
                        <label class="block text-sm font-bold text-slate-700 mb-1">Estimated Cost</label>
                        <input type="number" step="0.01" formControlName="estimatedCost" placeholder="0.00" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Remarks</label>
                    <textarea formControlName="remarks" rows="2" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" (click)="showLogActivityModal.set(false)" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                    <button type="submit" [disabled]="logActivityForm.invalid || isSubmittingActivity()" class="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all">
                        @if (isSubmittingActivity()) {
                           <lucide-icon name="loader" class="w-4 h-4 animate-spin"></lucide-icon> Saving...
                        } @else {
                           Save Activity
                        }
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }

      <!-- History Modal -->
      @if (showSensorHistory()) {
        <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <lucide-icon name="history" class="w-5 h-5 text-slate-500"></lucide-icon>
                Sensor History (Last 7 Days)
              </h2>
              <button (click)="showSensorHistory.set(false)" class="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <div class="p-6 overflow-y-auto">
              <div class="space-y-4">
                <div class="grid grid-cols-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
                  <div>Date</div>
                  <div>Moisture</div>
                  <div>pH</div>
                  <div>NPK (ppm)</div>
                </div>
                @for (record of mockHistory; track record.date) {
                  <div class="grid grid-cols-4 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 items-center">
                    <div>{{ record.date | date:'shortDate' }}</div>
                    <div class="flex items-center gap-1 text-blue-600"><lucide-icon name="droplets" class="w-3 h-3"></lucide-icon> {{ record.moisture }}%</div>
                    <div class="flex items-center gap-1 text-amber-600"><lucide-icon name="test-tube" class="w-3 h-3"></lucide-icon> {{ record.ph }}</div>
                    <div class="text-slate-500 text-xs">{{ record.n }}/{{ record.p }}/{{ record.k }}</div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PlantingCycleManagementComponent implements OnInit {
  http = inject(HttpClient);
  showSensorHistory = signal(false);
  aiAnalysis = signal<string | null>(null);
  analyzing = signal(false);
  activities = signal<PlantingCycleActivityListDTO[]>([]);
  
  activitySubTab = signal<'ongoing' | 'planned' | 'completed' | 'expired'>('ongoing');
  activityTypeFilter = signal<string>('');
  activityPriorityFilter = signal<string>('');

  expectedYield = signal<number>(500); // Default 500 tons
  expectedPrice = signal<number>(150); // Default $150 per ton
  
  totalActivityCost = computed(() => {
     return this.activities().reduce((sum, act) => sum + (act.actualCost || act.estimatedCost || 0), 0);
  });
  
  projectedIncome = computed(() => {
     return this.expectedYield() * this.expectedPrice();
  });
  
  estimatedProfit = computed(() => {
     return this.projectedIncome() - this.totalActivityCost();
  });
  
  roi = computed(() => {
     const cost = this.totalActivityCost();
     if (cost === 0) return 0;
     return ((this.estimatedProfit() / cost) * 100).toFixed(1);
  });

  filteredActivities = computed(() => {
     let list = this.activities();
     const now = new Date();
     now.setHours(0, 0, 0, 0);

     list = list.filter(a => {
         const status = (a.currentStatus || '').toUpperCase();
         const start = new Date(a.plannedStartDate);
         const end = new Date(a.plannedEndDate);
         start.setHours(0, 0, 0, 0);
         end.setHours(0, 0, 0, 0);
         
         const isOngoing = ['IN_PROGRESS', 'PENDING_VERIFICATION', 'DUE'].includes(status) || (start <= now && end >= now && !['COMPLETED', 'OVERDUE', 'CANCELLED', 'SKIPPED', 'NOT_DONE'].includes(status));
         const isPlanned = ['DRAFT', 'SCHEDULED', 'ASSIGNED', 'PARKED'].includes(status) || (start > now && !['COMPLETED', 'IN_PROGRESS', 'OVERDUE', 'CANCELLED', 'SKIPPED', 'NOT_DONE'].includes(status));
         const isCompleted = status === 'COMPLETED';
         const isExpired = ['OVERDUE', 'NOT_DONE'].includes(status) || (end < now && !['COMPLETED', 'CANCELLED', 'SKIPPED'].includes(status));

         if (this.activitySubTab() === 'ongoing') return isOngoing;
         if (this.activitySubTab() === 'planned') return isPlanned;
         if (this.activitySubTab() === 'completed') return isCompleted;
         if (this.activitySubTab() === 'expired') return isExpired;
         
         return true;
     });

     if (this.activityTypeFilter()) {
         list = list.filter(a => a.activityType === this.activityTypeFilter());
     }
     if (this.activityPriorityFilter()) {
         list = list.filter(a => a.priority === this.activityPriorityFilter());
     }
     
     return list;
  });

  fb = inject(FormBuilder);
  showUpdateStatusModal = signal(false);
  isSubmittingUpdateStatus = signal(false);

  updateStatusForm: FormGroup = this.fb.nonNullable.group({
    status: ['', Validators.required],
    remarks: [''],
    updatedBy: [''],
    resourcesUsed: this.fb.array([])
  });

  get resourcesUsedControls() {
    return this.updateStatusForm.get('resourcesUsed') as FormArray;
  }

  addResourceUsage() {
    this.resourcesUsedControls.push(this.fb.group({
      resourceType: ['INVENTORY_ITEM', Validators.required],
      resourceName: [''],
      quantityUsed: [0, [Validators.required, Validators.min(0.01)]],
      unitOfMeasure: ['KILOGRAM', Validators.required]
    }));
  }

  removeResourceUsage(index: number) {
    this.resourcesUsedControls.removeAt(index);
  }

  openUpdateStatusModal() {
    const currentDetail = this.selectedActivityDetail();
    if (currentDetail) {
      this.updateStatusForm.reset({
        status: currentDetail.currentStage?.status && currentDetail.currentStage.status !== 'SCHEDULED' ? currentDetail.currentStage.status : 'PENDING',
        remarks: '',
        updatedBy: ''
      });
      this.resourcesUsedControls.clear();
      this.showUpdateStatusModal.set(true);
    }
  }

  closeUpdateStatusModal() {
    this.showUpdateStatusModal.set(false);
  }

  submitUpdateStatus() {
    if (this.updateStatusForm.invalid) {
      this.updateStatusForm.markAllAsTouched();
      return;
    }

    const currentDetail = this.selectedActivityDetail();
    if (!currentDetail) return;

    const formValue = this.updateStatusForm.value;
    const payload: any = {
      status: formValue.status
    };
    if (formValue.remarks) payload.remarks = formValue.remarks;
    if (formValue.updatedBy) payload.updatedBy = formValue.updatedBy;
    if (formValue.resourcesUsed && formValue.resourcesUsed.length > 0) {
      payload.resourcesUsed = formValue.resourcesUsed.map((r: any) => ({
        ...r,
        quantityUsed: Number(r.quantityUsed)
      }));
    }
    
    this.isSubmittingUpdateStatus.set(true);
    this.cropService.updateActivityStatus(currentDetail.id, payload).subscribe({
      next: () => {
        this.isSubmittingUpdateStatus.set(false);
        this.closeUpdateStatusModal();
        // Refresh the detail view
        this.viewActivityDetails(currentDetail.id);
        // Refresh the list as well if needed
        const cycle = this.cycle();
        if (cycle) {
           this.cropService.getPlantingCycleActivities(cycle.id, 0, 100, {}).subscribe({
              next: (activitiesRes) => this.activities.set(activitiesRes.content)
           });
        }
      },
      error: (err) => {
        console.error('Failed to update status', err);
        this.isSubmittingUpdateStatus.set(false);
      }
    });
  }

  showLogActivityModal = signal(false);
  showActivityDetailModal = signal(false);
  isLoadingActivityDetail = signal(false);
  selectedActivityDetail = signal<PlantingCycleActivityDetailDTO | null>(null);

  viewActivityDetails(id: string) {
    this.showActivityDetailModal.set(true);
    this.isLoadingActivityDetail.set(true);
    this.cropService.getPlantingCycleActivity(id).subscribe({
      next: (detail) => {
        this.selectedActivityDetail.set(detail);
        this.isLoadingActivityDetail.set(false);
      },
      error: (err) => {
        console.error('Failed to load activity detail', err);
        this.isLoadingActivityDetail.set(false);
      }
    });
  }

  closeActivityDetailModal() {
    this.showActivityDetailModal.set(false);
    this.selectedActivityDetail.set(null);
  }

  isSubmittingActivity = signal(false);

  logActivityForm: FormGroup = this.fb.nonNullable.group({
    description: ['', Validators.required],
    activityType: ['', Validators.required],
    priority: ['MEDIUM'],
    assignee: [''],
    plannedStartDate: ['', Validators.required],
    plannedEndDate: ['', Validators.required],
    targetAreaHa: [null as number | null],
    estimatedCost: [null as number | null],
    remarks: ['']
  });

  submitActivity() {
    if (this.logActivityForm.invalid) {
      this.logActivityForm.markAllAsTouched();
      return;
    }

    const formValue = this.logActivityForm.getRawValue();
    const cycleId = this.cycleId();
    if (!cycleId) return;

    const request: CreatePlantingCycleActivityRequest = {
      ...formValue,
      plantingCycleId: cycleId
    };

    this.isSubmittingActivity.set(true);
    this.cropService.createPlantingCycleActivity(request).subscribe({
      next: (res) => {
        this.isSubmittingActivity.set(false);
        this.showLogActivityModal.set(false);
        this.logActivityForm.reset({ priority: 'MEDIUM' });
        // Refresh activities
        this.cropService.getPlantingCycleActivities(cycleId, 0, 100, {}).subscribe({
          next: (activitiesRes) => this.activities.set(activitiesRes.content),
          error: (err) => console.error('Failed to refresh activities', err)
        });
      },
      error: (err) => {
        console.error('Failed to log activity', err);
        this.isSubmittingActivity.set(false);
      }
    });
  }

  getActivityIcon(type: string): string {
      const t = (type || '').toLowerCase();
      if (t.includes('irrigat') || t.includes('water')) return 'droplets';
      if (t.includes('fertili')) return 'flask-conical';
      if (t.includes('protect') || t.includes('spray') || t.includes('pest')) return 'shield';
      if (t.includes('plant') || t.includes('seed')) return 'sprout';
      if (t.includes('harvest')) return 'tractor';
      return 'activity';
  }

  getActivityColorClass(type: string): string {
      const t = (type || '').toLowerCase();
      if (t.includes('irrigat') || t.includes('water')) return 'bg-blue-100 text-blue-600';
      if (t.includes('fertili')) return 'bg-emerald-100 text-emerald-600';
      if (t.includes('protect') || t.includes('spray') || t.includes('pest')) return 'bg-amber-100 text-amber-600';
      if (t.includes('plant') || t.includes('seed')) return 'bg-emerald-100 text-emerald-600';
      return 'bg-slate-200 text-slate-600';
  }

  getStatusClass(status: string): string {
      switch (status) {
          case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
          case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
          case 'OVERDUE': case 'NOT_DONE': return 'bg-red-100 text-red-700';
          case 'CANCELLED': case 'SKIPPED': case 'PARKED': case 'DRAFT': return 'bg-slate-200 text-slate-600';
          case 'PENDING_VERIFICATION': case 'DUE': return 'bg-amber-100 text-amber-700';
          case 'SCHEDULED': case 'ASSIGNED': return 'bg-indigo-100 text-indigo-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  }

  getStatusLabel(status: string): string {
      if (!status) return 'Unknown';
      if (status === 'PARKED') return 'Parked / On Hold';
      return status.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  
  mockHistory = [
    { date: new Date(Date.now() - 86400000 * 0), moisture: 32, ph: 6.8, n: 42, p: 35, k: 60 },
    { date: new Date(Date.now() - 86400000 * 1), moisture: 34, ph: 6.8, n: 43, p: 35, k: 61 },
    { date: new Date(Date.now() - 86400000 * 2), moisture: 36, ph: 6.9, n: 45, p: 36, k: 62 },
    { date: new Date(Date.now() - 86400000 * 3), moisture: 28, ph: 6.7, n: 40, p: 34, k: 58 },
    { date: new Date(Date.now() - 86400000 * 4), moisture: 30, ph: 6.8, n: 41, p: 35, k: 59 },
    { date: new Date(Date.now() - 86400000 * 5), moisture: 38, ph: 6.9, n: 46, p: 38, k: 64 },
    { date: new Date(Date.now() - 86400000 * 6), moisture: 40, ph: 7.0, n: 48, p: 40, k: 65 },
  ];

  analyzeSensorData() {
    this.analyzing.set(true);
    const cropName = this.cycle()?.crop?.name || 'Unknown Crop';
    const currentStage = this.stagesWithDates().find(s => s.status === 'current')?.stageName || 'Unknown Stage';
    
    const requestBody = {
      crop: cropName,
      growthStage: currentStage,
      sensorData: {
        moisture: '32%',
        ph: '6.8',
        npk: '42/35/60 ppm'
      }
    };
    
    this.http.post<{analysis: string}>('/api/ai/sensor-analysis', requestBody).subscribe({
      next: (res) => {
        this.aiAnalysis.set(res.analysis);
        this.analyzing.set(false);
      },
      error: (err) => {
        console.error(err);
        this.aiAnalysis.set('Failed to analyze sensor data. Please try again.');
        this.analyzing.set(false);
      }
    });
  }

  private route = inject(ActivatedRoute);
  
  cycleId = signal<string | null>(null);
  cycleSid = signal<string | null>(null);
  fieldId = signal<string | null>(null);
  completedActivities = signal<Set<string>>(new Set());

  toggleActivity(activityId: string) {
    const current = this.completedActivities();
    const next = new Set(current);
    if (next.has(activityId)) {
      next.delete(activityId);
    } else {
      next.add(activityId);
    }
    this.completedActivities.set(next);
  }
  growthProgram = signal<GrowthProgramResponse | null>(null);
  cropStages = signal<CropStageDTO[]>([]);
  cycle = signal<PlantingCycleResponse | null>(null);
  private cropService = inject(CropService);
  activeTab = signal<'program' | 'activities' | 'recommendation' | 'accounting' | 'watering' | 'harvesting' | 'overview' | 'fertility' | 'inputs' | 'scouting'>('program');

  fieldInputs = signal<any[]>([
    {
      id: 'inp-1',
      category: 'SEED',
      name: 'Pioneer P1197 Optimum AQUAmax Seed Maize',
      measurementUnit: 'Bags (80k)',
      quantity: 42,
      unitCost: 285,
      totalCost: 11970,
      date: '14 May 2026',
      notes: 'High drought-tolerance hybrid, treated with Poncho/VOTiVO'
    },
    {
      id: 'inp-2',
      category: 'FERTILIZER',
      name: 'Liquid Starter 10-34-0 Polyphosphate',
      measurementUnit: 'Liters',
      quantity: 2260,
      unitCost: 1.25,
      totalCost: 2825,
      date: '14 May 2026',
      notes: 'Placed 50 L/ha in-furrow with seed'
    },
    {
      id: 'inp-3',
      category: 'CHEMISTRY',
      name: 'Zn-EDTA 9% Chelate + Bio-Inoculant',
      measurementUnit: 'Liters',
      quantity: 135,
      unitCost: 12.50,
      totalCost: 1687.50,
      date: '14 May 2026',
      notes: 'In-furrow micronutrient blend for early rooting vigor'
    },
    {
      id: 'inp-4',
      category: 'MACHINERY',
      name: 'John Deere 8370R Seeding & Planter Rig',
      measurementUnit: 'Hours',
      quantity: 18.5,
      unitCost: 85.00,
      totalCost: 1572.50,
      machineryModel: 'JD 8370R + 1775NT',
      fuelUsedLiters: 245,
      operatingHours: 18.5,
      date: '14 May 2026',
      notes: 'Total fuel consumption 245 L diesel'
    },
    {
      id: 'inp-5',
      category: 'LABOUR',
      name: 'Seeding Crew & Agronomic Calibration',
      measurementUnit: 'Hours',
      quantity: 36,
      unitCost: 28.00,
      totalCost: 1008.00,
      labourHours: 36,
      labourCrewSize: 2,
      labourWageRate: 28,
      date: '14 May 2026',
      notes: '2 operators across 18 operating hours'
    },
    {
      id: 'inp-6',
      category: 'CHEMISTRY',
      name: 'Dual II Magnum Herbicide (S-Metolachlor)',
      measurementUnit: 'Liters',
      quantity: 115,
      unitCost: 24.00,
      totalCost: 2760,
      date: '16 May 2026',
      notes: 'Pre-emergence grass and broadleaf residual herbicide'
    }
  ]);

  totalRecordedInputsCost = computed(() => {
    return this.fieldInputs().reduce((acc, item) => acc + (item.totalCost || 0), 0);
  });

  totalFuelUsed = computed(() => {
    return this.fieldInputs().reduce((acc, item) => acc + (item.fuelUsedLiters || 0), 0);
  });

  totalMachineHours = computed(() => {
    return this.fieldInputs().reduce((acc, item) => acc + (item.operatingHours || 0), 0);
  });

  totalLabourHours = computed(() => {
    return this.fieldInputs().reduce((acc, item) => acc + (item.labourHours || 0), 0);
  });

  scoutingLogs = signal<any[]>([
    {
      id: 'sc-1',
      date: '28 May 2026',
      scoutName: 'Dr. Sarah Alston',
      issueCategory: 'PEST',
      severity: 'LOW',
      cropStage: 'V4 Stage',
      affectedAreaPct: 2.5,
      locationDetails: 'North border rows adjacent to conservation buffer',
      description: 'Localized corn leaf aphid colonies observed on upper leaves. Predator ladybird beetles actively feeding.',
      remedyAction: 'Continue weekly scouting; economic threshold (50% plants infested) not reached. No chemical spray required.',
      status: 'INVESTIGATING'
    },
    {
      id: 'sc-2',
      date: '20 May 2026',
      scoutName: 'Marcus Vance',
      issueCategory: 'MOISTURE',
      severity: 'MODERATE',
      cropStage: 'VE Emergence',
      affectedAreaPct: 4.0,
      locationDetails: 'East terrace drainage hollow',
      description: 'Minor crusting after heavy rainfall event impeding seedling emergence.',
      remedyAction: 'Light rotary hoe pass executed to break crust. Coleoptile emergence restored to 96%.',
      status: 'RESOLVED'
    }
  ]);

  stagesWithDates = computed(() => {
    try {
      const apiStages = this.cropStages();
      const program = this.growthProgram();
      const cycle = this.cycle();

      const rawStages: any[] = (Array.isArray(apiStages) && apiStages.length > 0)
        ? apiStages
        : (program?.growthStageList || (program as any)?.stages || []);

      if (!Array.isArray(rawStages) || rawStages.length === 0) return [];

      const sortedStages = [...rawStages].filter(s => !!s).sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0));

      const rawPlanted = cycle?.plantedDate || '2026-05-14';
      const parsedPlanted = new Date(rawPlanted);
      const plantedDate = isNaN(parsedPlanted.getTime()) ? new Date('2026-05-14') : parsedPlanted;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let currentStartDate = new Date(plantedDate);
      let runningDayOffset = 1;

      const cycleCurrentStageId = cycle?.currentGrowthStage?.id;
      const cycleCurrentStageOrder = cycle?.currentGrowthStage?.stageOrder;

      const hasExplicitCurrentOrCompleted = sortedStages.some(
        (s: any) => s.isCurrentStage === true || ['COMPLETED', 'CURRENT'].includes((s.status || '').toUpperCase())
      );

      return sortedStages.map((stage: any, index: number) => {
        const duration = Number(stage.durationInDays || stage.baselineDurationDays || stage.daps || 14) || 14;
        const startDayOffset = Number(stage.startDayOffset) || runningDayOffset;
        const endDayOffset = Number(stage.endDayOffset) || (startDayOffset + duration - 1);
        runningDayOffset = endDayOffset + 1;

        const startDate = stage.plannedStartDate ? new Date(stage.plannedStartDate) : new Date(currentStartDate);
        const endDate = stage.plannedEndDate ? new Date(stage.plannedEndDate) : (() => {
          const d = new Date(startDate);
          d.setDate(d.getDate() + duration);
          return d;
        })();

        currentStartDate = new Date(endDate);

        let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
        const apiStatus = (stage.status || '').toUpperCase();
        const sOrder = stage.stageOrder || (index + 1);

        if (hasExplicitCurrentOrCompleted) {
          if (stage.isCurrentStage || apiStatus === 'CURRENT') {
            status = 'current';
          } else if (apiStatus === 'COMPLETED') {
            status = 'completed';
          } else {
            status = 'upcoming';
          }
        } else if (cycleCurrentStageId || cycleCurrentStageOrder) {
          if ((cycleCurrentStageId && (stage.id === cycleCurrentStageId || stage.growthStageId === cycleCurrentStageId)) ||
              (cycleCurrentStageOrder && sOrder === cycleCurrentStageOrder)) {
            status = 'current';
          } else if (cycleCurrentStageOrder && sOrder < cycleCurrentStageOrder) {
            status = 'completed';
          } else {
            status = 'upcoming';
          }
        } else {
          if (today > endDate) {
            status = 'completed';
          } else if (today >= startDate && today <= endDate) {
            status = 'current';
          } else {
            status = 'upcoming';
          }
        }

        const activities = Array.isArray(stage.growthProgramStageActivities) && stage.growthProgramStageActivities.length > 0
          ? stage.growthProgramStageActivities
          : (Array.isArray(stage.growthActivityStageActivities)
              ? stage.growthActivityStageActivities
              : (Array.isArray(stage.activities) ? stage.activities : []));

        const rawName: string = stage.stageName || stage.name || `Growth Stage ${index + 1}`;
        const stageCode: string = stage.growthStageSpecificData?.code || '';
        const shortStageName = rawName.includes(' - ') ? rawName.split(' - ').slice(1).join(' - ') : rawName;

        return {
          ...stage,
          id: stage.id || `stage-${index}`,
          stageOrder: sOrder,
          stageName: rawName,
          shortStageName,
          stageCode,
          durationInDays: duration,
          startDayOffset,
          endDayOffset,
          growthParameterSpecs: Array.isArray(stage.growthParameterSpecs) ? stage.growthParameterSpecs : [],
          growthActivityStageActivities: activities.map((act: any, aIdx: number) => ({
            ...act,
            id: act?.id || `act-${index}-${aIdx}`,
            name: act?.name || act?.title || 'Field Activity',
            activityType: act?.activityType || act?.stageActivityType || 'SCOUTING'
          })),
          startDate,
          endDate,
          status
        };
      });
    } catch (e) {
      console.error('Error computing stagesWithDates:', e);
      return [];
    }
  });

  totalStageDurationDays = computed(() => {
    return this.stagesWithDates().reduce((sum, s) => sum + (Number(s.durationInDays) || 0), 0);
  });

  currentStageObj = computed(() => {
    const stages = this.stagesWithDates();
    return stages.find(s => s.status === 'current') || null;
  });

  currentStageDisplayName = computed(() => {
    const curr = this.currentStageObj();
    if (curr) return curr.stageName;
    if (this.cycle()?.currentGrowthStage?.stageName) return this.cycle()!.currentGrowthStage!.stageName;
    const stages = this.stagesWithDates();
    return stages[0]?.stageName || 'R1 - Silking & Pollination';
  });

  cycleProgressPct = computed(() => {
    const stages = this.stagesWithDates();
    if (!stages.length) return 52;
    const totalDays = stages.reduce((sum, s) => sum + (Number(s.durationInDays) || 0), 0) || 130;
    const completedDays = stages
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + (Number(s.durationInDays) || 0), 0);
    const currentStage = stages.find(s => s.status === 'current');
    const currentContribution = currentStage ? Math.round((Number(currentStage.durationInDays) || 0) * 0.5) : 0;
    return Math.min(100, Math.max(5, Math.round(((completedDays + currentContribution) / totalDays) * 100)));
  });

  private fieldMapService = inject(FieldMapService);
  field = signal<MapElement | null>(null);
  mapLayer = signal<'satellite' | 'ndvi' | 'moisture'>('satellite');

  centroidCoordinates = computed(() => {
    const paths = this.field()?.paths;
    if (!paths || paths.length === 0) return '39.7540° N, 104.9720° W';
    const avgLat = paths.reduce((s, p) => s + p.lat, 0) / paths.length;
    const avgLng = paths.reduce((s, p) => s + p.lng, 0) / paths.length;
    const latStr = `${Math.abs(avgLat).toFixed(4)}° ${avgLat >= 0 ? 'N' : 'S'}`;
    const lngStr = `${Math.abs(avgLng).toFixed(4)}° ${avgLng >= 0 ? 'E' : 'W'}`;
    return `${latStr}, ${lngStr}`;
  });

  computedSvgPolygon = computed(() => {
    const paths = this.field()?.paths;
    if (!paths || paths.length < 3) {
      return '50,25 240,35 270,165 190,185 45,150';
    }
    const lats = paths.map(p => p.lat);
    const lngs = paths.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const dLat = (maxLat - minLat) || 0.001;
    const dLng = (maxLng - minLng) || 0.001;

    return paths.map(p => {
      const x = Math.round(((p.lng - minLng) / dLng) * 220 + 40);
      const y = Math.round((1 - (p.lat - minLat) / dLat) * 140 + 30);
      return `${x},${y}`;
    }).join(' ');
  });

  daysAfterPlanting = computed(() => {
    const planted = this.cycle()?.plantedDate;
    if (!planted) return 70;
    const diff = Math.floor((Date.now() - new Date(planted).getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  });

  daysRemaining = computed(() => {
    const harvest = this.cycle()?.expectedHarvestDate;
    if (!harvest) return 66;
    const diff = Math.ceil((new Date(harvest).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  });

  private loadStagesForCycle(cycleId: string, cycleRes?: PlantingCycleResponse) {
    // 1. Primary call: Explicit Planting Cycle stages endpoint (/api/v1/crop/planting-cycle/{id}/stages)
    this.cropService.getStagesByPlantingCycle(cycleId).subscribe(stages => {
      if (Array.isArray(stages) && stages.length > 0) {
        this.cropStages.set(stages);
        return;
      }
      // 2. Fallback: Auto-resolving stage endpoint (/api/v1/crop/stages/{id})
      const lookupId = cycleRes?.growthProgram?.id || cycleRes?.variety?.id || cycleRes?.crop?.id || cycleRes?.crop?.name || cycleId;
      this.cropService.getCropStagesById(lookupId).subscribe(resolvedStages => {
        if (Array.isArray(resolvedStages) && resolvedStages.length > 0) {
          this.cropStages.set(resolvedStages);
          return;
        }
        // 3. Final fallback: Get all crop stages from external server (/api/v1/crop/stages)
        this.cropService.getCropStages({
          plantingCycleId: cycleId,
          programId: cycleRes?.growthProgram?.id,
          breedId: cycleRes?.variety?.id,
          speciesId: cycleRes?.crop?.id
        }).subscribe(allStages => {
          if (Array.isArray(allStages) && allStages.length > 0) {
            this.cropStages.set(allStages);
          } else {
            this.cropService.getCropStages().subscribe(defaultStages => {
              if (Array.isArray(defaultStages) && defaultStages.length > 0) {
                this.cropStages.set(defaultStages);
              }
            });
          }
        });
      });
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const fId = params.get('fieldId');
      this.fieldId.set(fId);
      if (fId) {
        this.loadField(fId);
      }
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const sid = params.get('sid');
      this.cycleId.set(id);
      this.cycleSid.set(sid);
      if (id) {
        this.loadStagesForCycle(id);

        this.cropService.getPlantingCycle(id).subscribe({
          next: (res) => {
            this.cycle.set(res);
            this.loadStagesForCycle(id, res);
            if (res.growthProgram?.id) {
              this.cropService.getGrowthProgramById(res.growthProgram.id).subscribe({
                next: (gp) => this.growthProgram.set(gp),
                error: (err) => console.error('Failed to load growth program', err)
              });
            }
            const unitId = res.fieldId || res.managementUnitId;
            if (!this.fieldId() && unitId) {
              this.fieldId.set(unitId);
              this.loadField(unitId);
            }
          },
          error: (err) => console.error(err)
        });

        this.cropService.getPlantingCycleActivities(id, 0, 100, {}).subscribe({
          next: (res) => {
             this.activities.set(res.content);
          },
          error: (err) => console.error(err)
        });
      }
    });
  }

  private loadField(fId: string) {
    const elements = this.fieldMapService.elements();
    const found = elements.find(e => e.id === fId);
    if (found) {
      this.field.set(found);
    } else {
      this.fieldMapService.loadFieldsForFarm('farm-1').subscribe(els => {
        const match = els.find(e => e.id === fId);
        if (match) {
          this.field.set(match);
        } else if (els.length > 0) {
          this.field.set(els[0]);
        }
      });
    }
  }
}
