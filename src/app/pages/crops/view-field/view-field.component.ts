import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CropService, PlantingCycleListResponse, PlantingCycleResponse, CropStageDTO } from '../../../services/crop.service';
import { FieldMapService, MapElement } from '../../../services/field-map.service';
import { SoilNotificationService, SoilAlert } from '../../../services/soil-notification.service';
import { GrowthTrendsChartComponent } from '../../../components/growth-trends-chart.component';

export interface FieldActivity {
  id: string;
  type: 'TILLAGE' | 'PLANTING' | 'SPRAYING' | 'IRRIGATION' | 'FERTILIZING' | 'SCOUTING' | 'MOWING' | 'HARVEST';
  title: string;
  date: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  operator: string;
  equipment?: string;
  product?: string;
  rate?: string;
  weather?: string;
  notes: string;
}

export interface FieldInputRecord {
  id: string;
  category: 'SEED' | 'FERTILIZER' | 'CHEMISTRY' | 'MACHINERY' | 'LABOUR' | 'AMENDMENT' | 'OTHER';
  name: string;
  measurementUnit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  machineryModel?: string;
  fuelUsedLiters?: number;
  operatingHours?: number;
  labourHours?: number;
  labourCrewSize?: number;
  labourWageRate?: number;
  date: string;
  notes?: string;
}

export interface ScoutingObservation {
  id: string;
  date: string;
  scoutName: string;
  issueCategory: 'PEST' | 'DISEASE' | 'WEED' | 'DEFICIENCY' | 'MOISTURE';
  severity: 'LOW' | 'MODERATE' | 'CRITICAL';
  cropStage: string;
  affectedAreaPct: number;
  locationDetails: string;
  description: string;
  remedyAction: string;
  status: 'INVESTIGATING' | 'TREATED' | 'RESOLVED';
}

export interface FieldTransaction {
  id: string;
  type: 'EXPENSE' | 'INCOME';
  category: string;
  description: string;
  amount: number;
  date: string;
  referenceNo: string;
}

@Component({
  selector: 'app-view-field',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    LucideAngularModule, 
    RouterModule,
    GrowthTrendsChartComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-50/60 pb-16">
      <!-- TOP BREADCRUMB & CONTEXT BAR -->
      <div class="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <!-- Breadcrumbs -->
            <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <a routerLink="/crops" class="hover:text-emerald-700 flex items-center gap-1.5 transition-colors">
                <lucide-icon name="arrow-left" class="w-3.5 h-3.5"></lucide-icon>
                <span>Field Map</span>
              </a>
              <span class="text-slate-300">/</span>
              <span class="text-slate-400">Management Units</span>
              <span class="text-slate-300">/</span>
              <span class="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs">{{ field()?.name || 'Field Details' }}</span>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex items-center gap-2">
              <button (click)="openActivityModal()" 
                      class="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs">
                <lucide-icon name="activity" class="w-3.5 h-3.5 text-blue-600"></lucide-icon>
                <span class="hidden sm:inline">Log</span> Activity
              </button>

              <button (click)="openInputModal()" 
                      class="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs">
                <lucide-icon name="plus" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
                Record Input
              </button>

              <button (click)="openAddCycleModal()"
                      class="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                      title="Add concurrent active planting cycle or intercrop">
                <lucide-icon name="layers" class="w-3.5 h-3.5 text-purple-600"></lucide-icon>
                <span class="hidden sm:inline">+ Active</span> Cycle
              </button>

              <a routerLink="/crops/edit" 
                 class="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs">
                <lucide-icon name="edit" class="w-3.5 h-3.5 text-amber-600"></lucide-icon>
                Edit Boundary
              </a>

              <a routerLink="/crops/new-planting" [queryParams]="{ fieldId: field()?.id }" 
                 class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all">
                <lucide-icon name="sprout" class="w-3.5 h-3.5"></lucide-icon>
                Plan Cycle
              </a>

              <button (click)="openDossierModal()" 
                      class="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                      title="Export Field Dossier">
                <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        @if (field()) {
          <!-- SOIL DEVIATION ALERT (IF ACTIVE) -->
          @if (fieldAlert(); as alert) {
            <div class="p-5 rounded-2xl border transition-all shadow-xs"
                 [ngClass]="alert.severity === 'critical' ? 'bg-red-50/90 border-red-200 ring-1 ring-red-200' : 'bg-amber-50/90 border-amber-200 ring-1 ring-amber-200'">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div class="flex items-start gap-3.5">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                       [ngClass]="alert.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'">
                    <lucide-icon name="triangle-alert" class="w-5 h-5"></lucide-icon>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                            [ngClass]="alert.severity === 'critical' ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'">
                        {{ alert.severity === 'critical' ? 'CRITICAL SOIL DEVIATION' : 'SOIL HEALTH WARNING' }}
                      </span>
                      <span class="text-xs font-bold text-slate-600">Crop: {{ alert.cropName }}</span>
                    </div>
                    <h3 class="text-base font-bold text-slate-900 mt-1">{{ alert.title }}</h3>
                    <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">{{ alert.message }}</p>
                    
                    <div class="mt-2.5 p-3 bg-white/95 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start gap-2 shadow-2xs">
                      <lucide-icon name="lightbulb" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></lucide-icon>
                      <div>
                        <span class="font-bold text-emerald-800">Agronomic Remedy: </span>
                        {{ alert.recommendation }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex sm:flex-col gap-2 shrink-0">
                  <button (click)="soilService.resolveAlert(alert.id)"
                          class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs">
                    <lucide-icon name="check" class="w-3.5 h-3.5"></lucide-icon>
                    Mark Resolved
                  </button>
                  <button (click)="soilService.dismissAlert(alert.id)"
                          class="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- FIELD HERO HEADER BANNER -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div class="flex items-start gap-5">
                <!-- Soil Rating Badge / Field Icon Avatar -->
                <div class="relative shrink-0">
                  <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-inner relative overflow-hidden">
                    <lucide-icon name="map" class="w-12 h-12 opacity-40"></lucide-icon>
                    <!-- Mini elevation contour effect -->
                    <div class="absolute inset-0 border border-emerald-300/40 rounded-xl m-2 pointer-events-none"></div>
                  </div>
                  <!-- Grade Pill -->
                  <div class="absolute -bottom-2 -right-2 px-2.5 py-1 bg-emerald-600 text-white text-xs font-black rounded-lg shadow-sm border-2 border-white flex items-center gap-1"
                       title="Soil Classification Grade">
                    <span>GRADE</span>
                    <span class="text-sm font-black">A</span>
                  </div>
                </div>

                <!-- Field Identity Details -->
                <div class="space-y-1.5">
                  <div class="flex flex-wrap items-center gap-2.5">
                    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{{ field()?.name || 'Unnamed Field' }}</h1>
                    @if (activeCycles().length > 1) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
                        <lucide-icon name="layers" class="w-3.5 h-3.5 text-purple-600"></lucide-icon>
                        Multi-Crop ({{ activeCycles().length }} Active Cycles)
                      </span>
                    } @else if (activeCycles().length === 1) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        In Season (1 Active Cycle)
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Fallow / Unseeded
                      </span>
                    }
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {{ field()?.type === 'field' ? 'Center Pivot Field' : 'Management Unit' }}
                    </span>
                  </div>

                  <p class="text-xs font-semibold text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>ID: <strong class="text-slate-800">#FLD-{{ field()?.id?.substring(0, 6) }}</strong></span>
                    <span>&bull;</span>
                    <span>GPS Centroid: <strong class="text-slate-700">{{ centroidCoordinates() }}</strong></span>
                    <span>&bull;</span>
                    <span>Elevation: <strong class="text-slate-700">1,420 m ASL</strong></span>
                    <span>&bull;</span>
                    <span>Slope: <strong class="text-slate-700">1.2% (Grade A Flat)</strong></span>
                  </p>

                  <div class="pt-2 flex flex-wrap items-center gap-2 text-xs">
                    <!-- Multi-Crop / Active Cycle Badges -->
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium border border-slate-200">
                      <lucide-icon name="sprout" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
                      <span class="font-bold text-slate-800">Active Cycles ({{ activeCycles().length }}):</span>
                      <div class="flex flex-wrap items-center gap-1.5 ml-1">
                        @for (ac of activeCycles(); track ac.id) {
                          <span class="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-xs font-bold text-slate-800 flex items-center gap-1 shadow-2xs">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {{ ac.crop.split('(')[0].trim() }}
                            @if (ac.areaHa) {
                              <span class="text-[10px] text-emerald-700 font-bold">({{ ac.areaHa }} ha)</span>
                            }
                          </span>
                        }
                      </div>
                    </div>
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-100">
                      <lucide-icon name="droplets" class="w-3.5 h-3.5 text-blue-600"></lucide-icon>
                      Irrigation: <strong>Center Pivot Low-Drift</strong>
                    </span>
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-100">
                      <lucide-icon name="circle-check" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
                      Soil Health: <strong>Prime Silty Clay Loam</strong>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Top Overview Quick Stats Pills -->
              <div class="flex flex-wrap lg:flex-col items-end gap-2 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-right flex items-center lg:block gap-3">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total / Net Plantable</span>
                  <div class="text-lg font-black text-slate-900">
                    {{ field()?.size || 45.2 }} ha <span class="text-xs font-semibold text-slate-500">({{ ((field()?.size || 45.2) * 2.471).toFixed(1) }} ac)</span>
                  </div>
                </div>

                <div class="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl px-4 py-2 text-right flex items-center lg:block gap-3">
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Season Input Investment</span>
                  <div class="text-base font-black text-emerald-900">
                    $\{{ (totalRecordedInputsCost() + 3850) | number:'1.2-2' }}
                    <span class="text-xs font-semibold text-emerald-700">(&#36;{{ (((totalRecordedInputsCost() + 3850) / (field()?.size || 45.2))).toFixed(1) }}/ha)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PRIMARY KPI STATS GRID -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <!-- 1. Field Size -->
            <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Field Area</span>
                <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <lucide-icon name="maximize" class="w-3.5 h-3.5"></lucide-icon>
                </div>
              </div>
              <div class="text-xl font-black text-slate-900">{{ field()?.size || 45.2 }} <span class="text-xs font-normal text-slate-500">ha</span></div>
              <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">96.8% Tillable</span>
            </div>

            <!-- 2. Soil Moisture -->
            <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soil Moisture</span>
                <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <lucide-icon name="droplets" class="w-3.5 h-3.5"></lucide-icon>
                </div>
              </div>
              <div class="text-xl font-black text-slate-900">32%</div>
              <span class="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Optimal Root Zone</span>
            </div>

            <!-- 3. Soil pH -->
            <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soil pH</span>
                <div class="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <lucide-icon name="flask-conical" class="w-3.5 h-3.5"></lucide-icon>
                </div>
              </div>
              <div class="text-xl font-black text-slate-900">6.5</div>
              <span class="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded">Target: 6.2 - 6.8</span>
            </div>

            <!-- 4. Soil Temp -->
            <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soil Temp</span>
                <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <lucide-icon name="thermometer" class="w-3.5 h-3.5"></lucide-icon>
                </div>
              </div>
              <div class="text-xl font-black text-slate-900">18.5°C</div>
              <span class="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">GDD Favorable</span>
            </div>

            <!-- 5. NPK Status -->
            <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NPK (ppm)</span>
                <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <lucide-icon name="activity" class="w-3.5 h-3.5"></lucide-icon>
                </div>
              </div>
              <div class="text-sm font-black text-slate-800 flex items-center justify-between">
                <span>N:45</span>
                <span>P:22</span>
                <span>K:110</span>
              </div>
              <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">Balanced Base</span>
            </div>

            <!-- 6. Machinery & Operations -->
            <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Machine Hours</span>
                <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                  <lucide-icon name="tractor" class="w-3.5 h-3.5"></lucide-icon>
                </div>
              </div>
              <div class="text-xl font-black text-slate-900">{{ totalMachineHours() }} <span class="text-xs font-normal text-slate-500">hrs</span></div>
              <span class="text-[10px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{{ totalFuelUsed() }} L Fuel Used</span>
            </div>
          </div>

          <!-- MAIN NAVIGATION TABS -->
          <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <!-- Tab Headers -->
            <div class="flex items-center gap-1 px-4 sm:px-6 pt-4 border-b border-slate-200 overflow-x-auto scrollbar-none bg-slate-50/50">
              <button (click)="activeTab.set('overview')"
                      [class]="activeTab() === 'overview' ? 'px-4 py-3 text-xs font-black text-emerald-700 border-b-2 border-emerald-600 bg-white rounded-t-xl shadow-2xs transition-all flex items-center gap-1.5' : 'px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-t-xl transition-all flex items-center gap-1.5'">
                <lucide-icon name="layout-dashboard" class="w-4 h-4"></lucide-icon>
                <span>Overview</span>
              </button>

              <button (click)="activeTab.set('planting')"
                      [class]="activeTab() === 'planting' ? 'px-4 py-3 text-xs font-black text-emerald-700 border-b-2 border-emerald-600 bg-white rounded-t-xl shadow-2xs transition-all flex items-center gap-1.5' : 'px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-t-xl transition-all flex items-center gap-1.5'">
                <lucide-icon name="sprout" class="w-4 h-4"></lucide-icon>
                <span>Plantings & Cycles</span>
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{{ activeCycles().length }} active</span>
              </button>

              <button (click)="activeTab.set('growth')"
                      [class]="activeTab() === 'growth' ? 'px-4 py-3 text-xs font-black text-emerald-700 border-b-2 border-emerald-600 bg-white rounded-t-xl shadow-2xs transition-all flex items-center gap-1.5' : 'px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-t-xl transition-all flex items-center gap-1.5'">
                <lucide-icon name="trending-up" class="w-4 h-4 text-emerald-600"></lucide-icon>
                <span>Growth Trends</span>
              </button>

              <button (click)="activeTab.set('fertility')"
                      [class]="activeTab() === 'fertility' ? 'px-4 py-3 text-xs font-black text-emerald-700 border-b-2 border-emerald-600 bg-white rounded-t-xl shadow-2xs transition-all flex items-center gap-1.5' : 'px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-t-xl transition-all flex items-center gap-1.5'">
                <lucide-icon name="flask-conical" class="w-4 h-4"></lucide-icon>
                <span>Soil & Sensors</span>
              </button>

              <button (click)="activeTab.set('activities')"
                      [class]="activeTab() === 'activities' ? 'px-4 py-3 text-xs font-black text-emerald-700 border-b-2 border-emerald-600 bg-white rounded-t-xl shadow-2xs transition-all flex items-center gap-1.5' : 'px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-t-xl transition-all flex items-center gap-1.5'">
                <lucide-icon name="activity" class="w-4 h-4"></lucide-icon>
                <span>Activities</span>
                <span class="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">{{ activities().length }}</span>
              </button>

              <button (click)="activeTab.set('inputs')"
                      [class]="activeTab() === 'inputs' ? 'px-4 py-3 text-xs font-black text-emerald-700 border-b-2 border-emerald-600 bg-white rounded-t-xl shadow-2xs transition-all flex items-center gap-1.5' : 'px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-t-xl transition-all flex items-center gap-1.5'">
                <lucide-icon name="tractor" class="w-4 h-4"></lucide-icon>
                <span>Inputs & Telemetry</span>
                <span class="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">{{ fieldInputs().length }}</span>
              </button>

              <button (click)="activeTab.set('scouting')"
                      [class]="activeTab() === 'scouting' ? 'px-4 py-3 text-xs font-black text-emerald-700 border-b-2 border-emerald-600 bg-white rounded-t-xl shadow-2xs transition-all flex items-center gap-1.5' : 'px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-t-xl transition-all flex items-center gap-1.5'">
                <lucide-icon name="eye" class="w-4 h-4"></lucide-icon>
                <span>Scouting & Issues</span>
                <span class="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">{{ scoutingLogs().length }}</span>
              </button>

              <button (click)="activeTab.set('accounting')"
                      [class]="activeTab() === 'accounting' ? 'px-4 py-3 text-xs font-black text-emerald-700 border-b-2 border-emerald-600 bg-white rounded-t-xl shadow-2xs transition-all flex items-center gap-1.5' : 'px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-t-xl transition-all flex items-center gap-1.5'">
                <lucide-icon name="calculator" class="w-4 h-4"></lucide-icon>
                <span>Financials</span>
              </button>
            </div>

            <!-- TAB CONTENT CONTAINER -->
            <div class="p-6 sm:p-8">
              <!-- ================= 1. OVERVIEW TAB ================= -->
              @if (activeTab() === 'overview') {
                <div class="space-y-8">
                  <!-- MULTI-CYCLE SELECTOR & CONCURRENT OVERVIEW BAR -->
                  @if (activeCycles().length > 1) {
                    <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                          <lucide-icon name="layers" class="w-5 h-5"></lucide-icon>
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <h3 class="text-sm font-black text-slate-900">Concurrent Active Planting Cycles ({{ activeCycles().length }})</h3>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800">Intercrop / Split Field</span>
                          </div>
                          <p class="text-xs text-slate-500">Multiple active cycles in this field. Select a cycle below to inspect phenological telemetry.</p>
                        </div>
                      </div>

                      <!-- Cycle Switcher Pill Buttons -->
                      <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                        @for (ac of activeCycles(); track ac.id; let idx = $index) {
                          <button (click)="selectActiveCycleByIndex(idx)"
                                  [class]="selectedActiveCycleIndex() === idx ? 'px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-2 transition-all' : 'px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2'">
                            <span class="w-2 h-2 rounded-full" [class]="selectedActiveCycleIndex() === idx ? 'bg-white' : 'bg-emerald-500'"></span>
                            <span>{{ ac.crop.split('(')[0].trim() }}</span>
                            @if (ac.areaHa) {
                              <span [class]="selectedActiveCycleIndex() === idx ? 'text-emerald-100 text-[10px]' : 'text-slate-400 text-[10px]'">({{ ac.areaHa }} ha)</span>
                            }
                          </button>
                        }
                        <button (click)="openAddCycleModal()"
                                class="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all">
                          <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                          <span>+ Add Cycle</span>
                        </button>
                      </div>
                    </div>
                  }

                  <!-- ACTIVE PHENOLOGY & CROP BANNER (DYNAMIC TO CURRENT ACTIVE CYCLE) -->
                  @if (currentActiveCycle()) {
                    <div class="bg-linear-to-br from-emerald-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
                      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div class="space-y-2">
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                              Active Cycle {{ currentActiveCycle()?.sid || currentActiveCycle()?.id }}
                            </span>
                            @if (currentActiveCycle()?.plantingPattern) {
                              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/10">
                                {{ currentActiveCycle()?.plantingPattern }}
                              </span>
                            }
                            <span class="text-xs text-slate-300">
                              Planted: {{ currentActiveCycle()?.plantedDate }} ({{ currentActiveCycle()?.daysAfterPlanting || 52 }} Days After Planting)
                            </span>
                          </div>
                          <h2 class="text-2xl sm:text-3xl font-black text-white">{{ currentActiveCycle()?.crop }}</h2>
                          <p class="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>Variety: <strong class="text-white">{{ currentActiveCycle()?.varietyName || 'Pioneer P1197 Optimum AQUAmax' }}</strong></span>
                            <span>&bull;</span>
                            <span>Allocated Area: <strong class="text-emerald-400">{{ currentActiveCycle()?.areaHa || (field()?.size || 45.2) }} ha ({{ currentActiveCycle()?.allocationPercentage || 100 }}% of field)</strong></span>
                            <span>&bull;</span>
                            <span>Projected Yield: <strong class="text-emerald-400">{{ currentActiveCycle()?.targetYield || '11.4 t/ha' }}</strong></span>
                          </p>
                        </div>

                        <div class="flex flex-wrap items-center gap-3 shrink-0">
                          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right">
                            <span class="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Estimated Harvest Window</span>
                            <div class="text-base sm:text-lg font-black text-white">{{ currentActiveCycle()?.expectedHarvestDate }}</div>
                            <span class="text-xs text-emerald-400 font-bold">~{{ 120 - (currentActiveCycle()?.daysAfterPlanting || 52) }} Days Remaining</span>
                          </div>
                          <a [routerLink]="['/planting-cycle', currentActiveCycle()?.id]" [queryParams]="{ fieldId: fieldId() }"
                             class="px-4 py-3 bg-white/15 hover:bg-white/25 text-white text-xs font-black rounded-2xl border border-white/25 shadow-sm transition-all flex items-center gap-2 backdrop-blur-md"
                             title="View full planting cycle details, growth stages, activities and accounting">
                            <lucide-icon name="external-link" class="w-4 h-4 text-emerald-400"></lucide-icon>
                            <span>View More Details</span>
                          </a>
                          <button (click)="openHarvestModal(currentActiveCycle()!)"
                                  class="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-2xl shadow-sm transition-all flex items-center gap-1.5"
                                  title="Record actual harvest for this specific active cycle">
                            <lucide-icon name="wheat" class="w-4 h-4"></lucide-icon>
                            Record Harvest
                          </button>
                        </div>
                      </div>

                      <!-- Visual Phenological Progression Timeline (Populated & Plotted Current Stage) -->
                      <div class="mt-6 pt-6 border-t border-white/10">
                        <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-bold mb-2">
                          <span class="text-emerald-300 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            {{ activeCycleCurrentStageLabel() }}
                            @if (activeCycleCurrentStageObj(); as curSt) {
                              @if (curSt.plannedStartDate && curSt.plannedEndDate) {
                                <span class="text-[10px] font-medium text-emerald-200/80 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                                  {{ curSt.plannedStartDate }} → {{ curSt.plannedEndDate }}
                                </span>
                              }
                            }
                          </span>
                          <span class="text-slate-300">Cycle Progress: {{ activeCycleProgressPct() }}%</span>
                        </div>

                        <!-- Segmented Stage Plot Bar with Floating Current-Stage Pin -->
                        <div class="relative pt-5 pb-2">
                          <div class="absolute top-0 -translate-x-1/2 z-10 flex flex-col items-center transition-all duration-500"
                               [style.left.%]="activeCycleProgressPct()">
                            <span class="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-md whitespace-nowrap">
                              ● NOW: {{ activeCycleCurrentStageObj()?.growthStageSpecificData?.code || activeCycleCurrentStageObj()?.stageName || 'CURRENT' }}
                            </span>
                            <div class="w-0.5 h-2 bg-emerald-300"></div>
                          </div>

                          @if (activeCycleStages().length > 0) {
                            <div class="w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5 flex gap-0.5">
                              @for (st of activeCycleStages(); track st.id) {
                                <div class="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 relative overflow-hidden"
                                     [style.flex]="st.durationInDays || 10"
                                     [title]="st.stageName + ' (' + (st.status || 'UPCOMING') + ')'"
                                     [class]="(st.isCurrentStage || st.status === 'CURRENT')
                                       ? 'bg-linear-to-r from-emerald-400 via-teal-300 to-amber-300 ring-1 ring-white shadow-sm'
                                       : (st.status === 'COMPLETED' ? 'bg-emerald-500/85' : 'bg-white/15')">
                                </div>
                              }
                            </div>
                          } @else {
                            <div class="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                              <div class="h-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full shadow-xs transition-all duration-500"
                                   [style.width.%]="activeCycleProgressPct()"></div>
                            </div>
                          }
                        </div>

                        <!-- Populated Planting Cycle Stages Grid -->
                        @if (activeCycleStages().length > 0) {
                          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-3 text-[10px] font-semibold text-center text-slate-300">
                            @for (st of activeCycleStages(); track st.id; let idx = $index) {
                              <div class="rounded-xl px-2 py-2 transition-all flex flex-col justify-between"
                                   [class]="(st.isCurrentStage || st.status === 'CURRENT')
                                     ? 'text-emerald-200 font-black bg-emerald-500/25 border-2 border-emerald-400 shadow-md scale-[1.02]'
                                     : (st.status === 'COMPLETED' ? 'text-emerald-300 font-bold bg-white/10 border border-emerald-500/30' : 'text-slate-300 bg-white/5 border border-white/10')">
                                <div>
                                  <div class="flex items-center justify-between gap-1 mb-0.5">
                                    <span class="text-[9px] font-black px-1.5 py-0.2 rounded bg-black/25 text-white/90">
                                      {{ st.growthStageSpecificData?.code || ('S' + (st.stageOrder || (idx + 1))) }}
                                    </span>
                                    <span class="text-[8px] font-bold opacity-80">{{ st.durationInDays }}d</span>
                                  </div>
                                  <div class="truncate text-left text-[10px] leading-tight mt-0.5" [title]="st.stageName">
                                    {{ st.stageOrder || (idx + 1) }}. {{ st.stageName }}
                                  </div>
                                </div>
                                <div class="mt-1.5 pt-1 border-t border-white/10 text-left">
                                  @if (st.isCurrentStage || st.status === 'CURRENT') {
                                    <span class="block text-[8px] font-black text-emerald-300 uppercase tracking-wider">● CURRENT STAGE</span>
                                  } @else if (st.status === 'COMPLETED') {
                                    <span class="block text-[8px] text-emerald-400 font-bold uppercase">✓ COMPLETED</span>
                                  } @else {
                                    <span class="block text-[8px] text-slate-400 uppercase">UPCOMING (D{{ st.startDayOffset }}–{{ st.endDayOffset }})</span>
                                  }
                                  @if (st.plannedStartDate) {
                                    <span class="block text-[8px] text-white/70 truncate">{{ st.plannedStartDate }} → {{ st.plannedEndDate }}</span>
                                  }
                                </div>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <!-- CONCURRENT ACTIVE CYCLES COMPARISON MATRIX (When multiple active cycles exist) -->
                  @if (activeCycles().length > 1) {
                    <div class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                            <lucide-icon name="layers" class="w-4 h-4 text-purple-600"></lucide-icon>
                            Concurrent Active Planting Cycles in this Field ({{ activeCycles().length }})
                          </h3>
                          <p class="text-xs text-slate-500">Each active cycle has its own agronomic targets, inputs, and harvest schedules.</p>
                        </div>
                        <button (click)="openAddCycleModal()" class="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5 w-fit">
                          <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                          Add Another Active Cycle
                        </button>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        @for (cycle of activeCycles(); track cycle.id; let idx = $index) {
                          <div class="p-5 rounded-2xl border transition-all"
                               [class]="selectedActiveCycleIndex() === idx ? 'border-emerald-500 bg-emerald-50/20 shadow-xs' : 'border-slate-200/90 bg-slate-50/50 hover:border-slate-300'">
                            <div class="flex items-start justify-between gap-3 mb-3">
                              <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs"
                                     [class]="idx === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'">
                                  #0{{ idx + 1 }}
                                </div>
                                <div>
                                  <div class="flex items-center gap-2">
                                    <h4 class="font-bold text-sm text-slate-900">{{ cycle.crop }}</h4>
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active"></span>
                                  </div>
                                  <p class="text-xs text-slate-500">{{ cycle.varietyName || 'Hybrid Variety' }}</p>
                                </div>
                              </div>
                              <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                {{ cycle.plantingPattern || 'Sector' }}
                              </span>
                            </div>

                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3.5 text-xs">
                              <div class="p-2.5 rounded-xl bg-white border border-slate-100">
                                <span class="text-[10px] font-bold text-slate-400 block uppercase">Allocated Area</span>
                                <span class="font-black text-slate-800">{{ cycle.areaHa || '25' }} ha</span>
                                <span class="text-[10px] text-slate-500 block">({{ cycle.allocationPercentage || 50 }}% of field)</span>
                              </div>
                              <div class="p-2.5 rounded-xl bg-white border border-slate-100">
                                <span class="text-[10px] font-bold text-slate-400 block uppercase">Planted / DAP</span>
                                <span class="font-black text-slate-800">{{ cycle.daysAfterPlanting || 45 }} DAP</span>
                                <span class="text-[10px] text-slate-500 block">{{ cycle.plantedDate }}</span>
                              </div>
                              <div class="p-2.5 rounded-xl bg-white border border-slate-100 sm:col-span-1 col-span-2">
                                <span class="text-[10px] font-bold text-slate-400 block uppercase">Est. Harvest</span>
                                <span class="font-black text-emerald-700">{{ cycle.expectedHarvestDate }}</span>
                                <span class="text-[10px] text-slate-500 block">Target: {{ cycle.targetYield || '9.5 t/ha' }}</span>
                              </div>
                            </div>

                            <!-- Progress mini-bar -->
                            <div class="mb-4">
                              <div class="flex justify-between text-[11px] font-bold mb-1">
                                <span class="text-slate-700">{{ cycle.currentStage || 'Vegetative Growth' }}</span>
                                <span class="text-emerald-700">{{ cycle.cycleProgressPercentage || 40 }}%</span>
                              </div>
                              <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div class="h-full bg-emerald-600 rounded-full" [style.width.%]="cycle.cycleProgressPercentage || 40"></div>
                              </div>
                            </div>

                            <div class="flex items-center justify-between pt-3 border-t border-slate-200/60 gap-2">
                              <div class="flex items-center gap-2">
                                <button (click)="selectedActiveCycleIndex.set(idx)"
                                        class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                                  <lucide-icon name="eye" class="w-3.5 h-3.5"></lucide-icon>
                                  <span>{{ selectedActiveCycleIndex() === idx ? 'Inspecting' : 'Inspect' }}</span>
                                </button>
                                <a [routerLink]="['/planting-cycle', cycle.id]" [queryParams]="{ fieldId: fieldId() }"
                                   class="text-xs font-black text-slate-700 hover:text-emerald-700 flex items-center gap-1 hover:underline">
                                  <lucide-icon name="external-link" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
                                  <span>View Details</span>
                                </a>
                              </div>

                              <div class="flex items-center gap-2">
                                <button (click)="openActivityModal()"
                                        class="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-2xs">
                                  + Activity
                                </button>
                                <button (click)="openHarvestModal(cycle)"
                                        class="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1">
                                  <lucide-icon name="wheat" class="w-3 h-3"></lucide-icon>
                                  Harvest
                                </button>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <!-- 2-COLUMN SECTION: SATELLITE MAP PREVIEW + WEATHER & SENSORS -->
                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- Left: Mini GIS Boundary Map Card -->
                    <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div class="flex items-center justify-between mb-4">
                          <div>
                            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                              <lucide-icon name="satellite" class="w-4 h-4 text-emerald-600"></lucide-icon>
                              Field Geometry & Satellite NDVI Preview
                            </h3>
                            <p class="text-xs text-slate-500">Polygon boundaries, biomass vigour, and sensor probe placement.</p>
                          </div>
                          
                          <!-- Layer Selector -->
                          <div class="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                            <button (click)="mapLayer.set('satellite')" 
                                    [class]="mapLayer() === 'satellite' ? 'px-2.5 py-1 bg-white text-slate-900 rounded-lg shadow-2xs' : 'px-2.5 py-1 text-slate-600 hover:text-slate-900'">
                              Satellite
                            </button>
                            <button (click)="mapLayer.set('ndvi')" 
                                    [class]="mapLayer() === 'ndvi' ? 'px-2.5 py-1 bg-white text-emerald-700 rounded-lg shadow-2xs' : 'px-2.5 py-1 text-slate-600 hover:text-slate-900'">
                              NDVI
                            </button>
                            <button (click)="mapLayer.set('moisture')" 
                                    [class]="mapLayer() === 'moisture' ? 'px-2.5 py-1 bg-white text-blue-700 rounded-lg shadow-2xs' : 'px-2.5 py-1 text-slate-600 hover:text-slate-900'">
                              Moisture
                            </button>
                          </div>
                        </div>

                        <!-- Interactive SVG Map Canvas -->
                        <div class="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center group">
                          <!-- Satellite/NDVI Backdrop Pattern -->
                          <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          
                          @if (mapLayer() === 'satellite') {
                            <div class="absolute inset-0 bg-cover bg-center opacity-30"
                                 style="background-image: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);"></div>
                          } @else if (mapLayer() === 'ndvi') {
                            <!-- NDVI Biomass Gradient Simulation -->
                            <div class="absolute inset-0 bg-linear-to-tr from-amber-600/20 via-emerald-500/30 to-green-600/40"></div>
                          } @else {
                            <!-- Moisture Layer Simulation -->
                            <div class="absolute inset-0 bg-linear-to-br from-blue-900/30 via-cyan-600/25 to-blue-500/30"></div>
                          }

                          <!-- Dynamic SVG Field Polygon -->
                          <svg class="w-full h-full p-4 relative z-10" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
                            <defs>
                              <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
                                <stop offset="100%" stop-color="#059669" stop-opacity="0.2" />
                              </linearGradient>
                            </defs>
                            <!-- Boundary Polygon -->
                            <polygon [attr.points]="computedSvgPolygon()"
                                     fill="url(#fieldGrad)"
                                     stroke="#10b981"
                                     stroke-width="2.5"
                                     stroke-dasharray="none"
                                     class="transition-all duration-300 drop-shadow-md" />
                            
                            <!-- Sensor Probe 1 -->
                            <circle cx="120" cy="95" r="4.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" />
                            <!-- Sensor Probe 2 -->
                            <circle cx="170" cy="115" r="4.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" />
                            
                            <!-- Center pivot circle overlay if pivot field -->
                            <circle cx="150" cy="100" r="45" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4,4" opacity="0.6" />
                          </svg>

                          <!-- Map Legend & Coordinate Overlay -->
                          <div class="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-[10px] font-mono flex items-center gap-3 border border-slate-700">
                            <span>Centroid: {{ centroidCoordinates() }}</span>
                            <span class="text-slate-400">|</span>
                            <span>Perimeter: 2.84 km</span>
                          </div>

                          <div class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 border border-slate-700">
                            <span class="w-2 h-2 rounded-full" [ngClass]="mapLayer() === 'ndvi' ? 'bg-emerald-400' : (mapLayer() === 'moisture' ? 'bg-blue-400' : 'bg-amber-400')"></span>
                            <span class="capitalize">{{ mapLayer() }} Layer Active</span>
                          </div>
                        </div>
                      </div>

                      <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div class="text-xs text-slate-500 font-medium">
                          Sensors: <strong class="text-slate-700">2 Wireless LoRa Mesh Probes Online</strong>
                        </div>
                        <a routerLink="/crops/edit" class="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                          Full GIS Editor <lucide-icon name="arrow-right" class="w-3.5 h-3.5"></lucide-icon>
                        </a>
                      </div>
                    </div>

                    <!-- Right: Weather Microclimate & Next Actions -->
                    <div class="lg:col-span-5 space-y-6">
                      <!-- Weather & Microclimate Widget -->
                      <div class="bg-linear-to-br from-blue-50/70 to-indigo-50/40 rounded-3xl border border-blue-200/80 p-6 shadow-2xs">
                        <div class="flex items-center justify-between mb-4">
                          <h3 class="text-sm font-bold text-blue-900 flex items-center gap-2">
                            <lucide-icon name="sun" class="w-4 h-4 text-amber-500"></lucide-icon>
                            Microclimate & Agronomic Conditions
                          </h3>
                          <span class="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Station #ST-09</span>
                        </div>

                        <div class="grid grid-cols-2 gap-3 mb-4">
                          <div class="bg-white/80 rounded-2xl p-3.5 border border-blue-100">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Air Temp</span>
                            <div class="text-xl font-black text-slate-900">23.5°C</div>
                            <span class="text-[10px] text-slate-500">Humidity 58%</span>
                          </div>
                          <div class="bg-white/80 rounded-2xl p-3.5 border border-blue-100">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GDD Accumulation</span>
                            <div class="text-xl font-black text-slate-900">685 GDD</div>
                            <span class="text-[10px] text-emerald-700 font-bold">+35 vs 5-yr avg</span>
                          </div>
                          <div class="bg-white/80 rounded-2xl p-3.5 border border-blue-100">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wind & Spray Delta</span>
                            <div class="text-xl font-black text-slate-900">8 km/h <span class="text-xs font-normal">NE</span></div>
                            <span class="text-[10px] text-emerald-700 font-bold">Safe for spraying</span>
                          </div>
                          <div class="bg-white/80 rounded-2xl p-3.5 border border-blue-100">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Precipitation (48h)</span>
                            <div class="text-xl font-black text-slate-900">12.0 mm</div>
                            <span class="text-[10px] text-blue-700 font-bold">Rain expected Thurs</span>
                          </div>
                        </div>

                        <div class="p-3 bg-white/90 rounded-2xl border border-blue-100 text-xs text-slate-700 flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <lucide-icon name="lightbulb" class="w-4 h-4 text-amber-500 shrink-0"></lucide-icon>
                            <span>Optimal window for side-dress nitrogen in <strong>3 days</strong>.</span>
                          </div>
                        </div>
                      </div>

                      <!-- Upcoming Operations Card -->
                      <div class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs">
                        <div class="flex items-center justify-between mb-4">
                          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <lucide-icon name="calendar" class="w-4 h-4 text-emerald-600"></lucide-icon>
                            Upcoming Scheduled Operations
                          </h3>
                          <button (click)="openActivityModal()" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                            + Add Task
                          </button>
                        </div>

                        <div class="space-y-3">
                          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <lucide-icon name="flask-conical" class="w-4 h-4"></lucide-icon>
                              </div>
                              <div>
                                <h4 class="text-xs font-bold text-slate-900">Side-Dress Nitrogen UAN 32%</h4>
                                <p class="text-[10px] text-slate-500">Scheduled: 15 Jun 2026 &bull; Target: 140 kg/ha</p>
                              </div>
                            </div>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Due in 3d</span>
                          </div>

                          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                <lucide-icon name="droplets" class="w-4 h-4"></lucide-icon>
                              </div>
                              <div>
                                <h4 class="text-xs font-bold text-slate-900">Pivot Irrigation Cycle (20mm)</h4>
                                <p class="text-[10px] text-slate-500">Scheduled: 18 Jun 2026 &bull; Center Pivot #1</p>
                              </div>
                            </div>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">Scheduled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              <!-- ================= 2. PLANTINGS & CYCLES TAB ================= -->
              @if (activeTab() === 'planting') {
                <div>
                  @if (!selectedPlanting()) {
                    <!-- 1. ACTIVE PLANTING CYCLES SECTION (CAN BE MULTIPLE) -->
                    <div class="mb-10">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <div class="flex items-center gap-2.5">
                            <h2 class="text-lg font-bold text-slate-900">Active Planting Cycles ({{ activeCycles().length }})</h2>
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              Growing In Field
                            </span>
                          </div>
                          <p class="text-xs text-slate-500 mt-0.5">
                            Active planting cycles can be more than one in a field to accommodate strip-till intercropping, double-cropping, companion planting, or parcel splits.
                          </p>
                        </div>
                        <div class="flex items-center gap-2">
                          <button (click)="openAddCycleModal()"
                                  class="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs">
                            <lucide-icon name="layers" class="w-3.5 h-3.5 text-purple-600"></lucide-icon>
                            + Add Concurrent Active Cycle
                          </button>
                        </div>
                      </div>

                      @if (activeCycles().length === 0) {
                        <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                          <lucide-icon name="sprout" class="w-8 h-8 text-slate-300 mx-auto mb-2"></lucide-icon>
                          <p class="text-xs text-slate-600 font-bold mb-1">No active planting cycles in this field</p>
                          <p class="text-xs text-slate-400 mb-3">Field parcel is currently fallow or awaiting seeding execution.</p>
                          <button (click)="openAddCycleModal()" class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs">
                            Seed New Cycle
                          </button>
                        </div>
                      } @else {
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          @for (cycle of activeCycles(); track cycle.id; let idx = $index) {
                            <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden flex flex-col justify-between">
                              <!-- Top tag row -->
                              <div>
                                <div class="flex items-start justify-between gap-3 mb-3">
                                  <div class="flex items-center gap-3">
                                    <div class="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                                      <lucide-icon name="sprout" class="w-5 h-5"></lucide-icon>
                                    </div>
                                    <div>
                                      <div class="flex items-center gap-2">
                                        <h3 class="font-black text-base text-slate-900">{{ cycle.crop }}</h3>
                                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                          Active
                                        </span>
                                      </div>
                                      <p class="text-xs font-semibold text-slate-500">{{ cycle.varietyName || 'Hybrid Crop' }} &bull; <strong class="text-slate-700">#{{ cycle.sid || cycle.id }}</strong></p>
                                    </div>
                                  </div>

                                  <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                                    {{ cycle.plantingPattern || 'Active Partition' }}
                                  </span>
                                </div>

                                <!-- Allocation & Dates Grid -->
                                <div class="grid grid-cols-3 gap-2.5 my-3.5 text-xs">
                                  <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span class="text-[10px] font-bold text-slate-400 block uppercase">Parcel Area</span>
                                    <span class="font-black text-slate-900">{{ cycle.areaHa || '25' }} ha</span>
                                    <span class="text-[10px] text-slate-500 block">({{ cycle.allocationPercentage || 50 }}% of field)</span>
                                  </div>
                                  <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span class="text-[10px] font-bold text-slate-400 block uppercase">Planted Date</span>
                                    <span class="font-black text-slate-900">{{ cycle.daysAfterPlanting || 52 }} DAP</span>
                                    <span class="text-[10px] text-slate-500 block">{{ cycle.plantedDate }}</span>
                                  </div>
                                  <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span class="text-[10px] font-bold text-slate-400 block uppercase">Est. Harvest</span>
                                    <span class="font-black text-emerald-700">{{ cycle.expectedHarvestDate }}</span>
                                    <span class="text-[10px] text-slate-500 block">Target: {{ cycle.targetYield || '11.4 t/ha' }}</span>
                                  </div>
                                </div>

                                <!-- Phenology Stage & Progress -->
                                <div class="mb-4 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                                  <div class="flex justify-between items-center text-xs font-bold mb-1.5">
                                    <span class="text-emerald-900 flex items-center gap-1.5">
                                      <lucide-icon name="trending-up" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
                                      Stage: {{ cycle.currentStage || 'Vegetative (V6)' }}
                                    </span>
                                    <span class="text-emerald-700 font-black">{{ cycle.cycleProgressPercentage || 48 }}% Complete</span>
                                  </div>
                                  <div class="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-emerald-600 rounded-full transition-all duration-500" [style.width.%]="cycle.cycleProgressPercentage || 48"></div>
                                  </div>
                                </div>
                              </div>

                              <!-- Action Buttons Footer -->
                              <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center gap-3">
                                  <button (click)="selectCycle(cycle)"
                                          class="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5">
                                    <lucide-icon name="eye" class="w-3.5 h-3.5"></lucide-icon>
                                    <span>Inspect</span>
                                  </button>
                                  <a [routerLink]="['/planting-cycle', cycle.id]" [queryParams]="{ fieldId: fieldId() }"
                                     class="text-xs font-black text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 hover:underline px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                                    <lucide-icon name="external-link" class="w-3.5 h-3.5"></lucide-icon>
                                    <span>View More Details</span>
                                  </a>
                                </div>

                                <div class="flex items-center gap-2">
                                  <button (click)="openActivityModal()"
                                          class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                                    + Operation
                                  </button>
                                  <button (click)="openHarvestModal(cycle)"
                                          class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-2xs transition-colors flex items-center gap-1">
                                    <lucide-icon name="wheat" class="w-3.5 h-3.5"></lucide-icon>
                                    Record Harvest
                                  </button>
                                </div>
                              </div>
                            </div>
                          }
                        </div>
                      }
                    </div>

                    <!-- 2. PLANNED SEEDING CYCLES SECTION -->
                    <div class="mb-10 pt-6 border-t border-slate-100">
                      <div class="flex justify-between items-center mb-4">
                        <div>
                          <h2 class="text-base font-bold text-slate-900">Planned Seeding Cycles ({{ plannedCycles().length }})</h2>
                          <p class="text-xs text-slate-500">Pre-season agronomic projections awaiting seeding date execution.</p>
                        </div>
                        <a routerLink="/crops/new-planting" [queryParams]="{ fieldId: field()?.id }" 
                           class="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100 transition-colors">
                          <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                          Plan Future Cycle
                        </a>
                      </div>

                      @if (plannedCycles().length === 0) {
                        <div class="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100">
                          <p class="text-xs text-slate-500 italic">No pending planned cycles for this management unit.</p>
                        </div>
                      } @else {
                        <div class="space-y-3">
                          @for (cycle of plannedCycles(); track cycle.id) {
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 gap-4">
                              <div class="flex items-center gap-3.5">
                                <div class="w-11 h-11 bg-white rounded-xl shadow-2xs flex items-center justify-center border border-amber-200 text-amber-600 shrink-0">
                                  <lucide-icon name="calendar" class="w-5 h-5"></lucide-icon>
                                </div>
                                <div>
                                  <h4 class="font-bold text-sm text-slate-900">{{ cycle.crop }} <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full ml-1.5">Planned</span></h4>
                                  <p class="text-xs text-slate-500">Target Seeding: <strong class="text-slate-700">{{ cycle.expectedPlantingDate || 'Fall 2026' }}</strong> &bull; Harvest: <strong class="text-slate-700">{{ cycle.expectedHarvestDate || 'TBD' }}</strong></p>
                                </div>
                              </div>
                              <div class="flex items-center gap-2">
                                <button (click)="openAddActualsModal(cycle)" class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                                  <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                                  Mark Seeded (Add Actuals)
                                </button>
                              </div>
                            </div>
                          }
                        </div>
                      }
                    </div>

                    <!-- 3. COMPLETED HARVESTS & HISTORICAL ARCHIVE SECTION -->
                    <div class="pt-6 border-t border-slate-100">
                      <div class="flex justify-between items-center mb-4">
                        <div>
                          <h2 class="text-base font-bold text-slate-900">Completed Seasons & Historical Archive ({{ completedCycles().length }})</h2>
                          <p class="text-xs text-slate-500">Archival records of harvested crops, historical phenology, and yields.</p>
                        </div>
                        <button (click)="exportPlantingHistory()" class="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                          <lucide-icon name="download" class="w-3.5 h-3.5 text-slate-500"></lucide-icon>
                          Export Log
                        </button>
                      </div>

                      @if (completedCycles().length === 0) {
                        <div class="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100">
                          <p class="text-xs text-slate-500 italic">No completed historical cycles archived yet.</p>
                        </div>
                      } @else {
                        <div class="space-y-3">
                          @for (cycle of completedCycles(); track cycle.id) {
                            <div (click)="selectCycle(cycle)" class="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/20 transition-all shadow-2xs">
                              <div class="flex items-center gap-3.5">
                                <div class="w-11 h-11 bg-slate-100 rounded-xl shadow-2xs flex items-center justify-center border border-slate-200 text-slate-600 shrink-0">
                                  <lucide-icon name="archive" class="w-5 h-5"></lucide-icon>
                                </div>
                                <div>
                                  <h4 class="font-bold text-sm text-slate-900">{{ cycle.crop }}</h4>
                                  <p class="text-xs text-slate-500">
                                    Seeded: <strong class="text-slate-700">{{ cycle.plantedDate }}</strong> &bull; Harvested: <strong class="text-emerald-700">{{ cycle.actualHarvestDate }}</strong>
                                    &bull; Yield: <strong class="text-slate-800">{{ cycle.targetYield || '7.4 t/ha' }}</strong>
                                  </p>
                                </div>
                              </div>
                              <div class="flex items-center gap-3">
                                <a [routerLink]="['/planting-cycle', cycle.id]" [queryParams]="{ fieldId: fieldId() }"
                                   (click)="$event.stopPropagation()"
                                   class="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs">
                                  <lucide-icon name="external-link" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
                                  <span>View Details</span>
                                </a>
                                <span class="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">
                                  Completed & Harvested
                                </span>
                                <lucide-icon name="chevron-right" class="w-4 h-4 text-slate-400"></lucide-icon>
                              </div>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  } @else {
                    <!-- SELECTED PLANTING DETAIL VIEW -->
                    <div class="mb-6">
                      <button (click)="selectedPlanting.set(null)" class="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-4 px-3 py-1.5 bg-slate-100 rounded-lg">
                        <lucide-icon name="arrow-left" class="w-3.5 h-3.5"></lucide-icon>
                        Back to Planting History
                      </button>
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div class="flex items-center gap-2">
                            <h2 class="text-2xl font-black text-slate-900">{{ selectedPlanting()?.crop?.name }}</h2>
                            <span [ngClass]="!selectedPlanting()?.actualHarvestDate ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'" class="px-3 py-1 text-xs font-bold rounded-full">
                              {{ selectedPlanting()?.actualHarvestDate ? 'Completed' : 'Active Growth' }}
                            </span>
                          </div>
                          <p class="text-xs text-slate-500 font-medium mt-0.5">Cycle ID: {{ selectedPlanting()?.sid || selectedPlanting()?.id }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                          <a [routerLink]="['/planting-cycle', selectedPlanting()?.id]" [queryParams]="{ fieldId: fieldId() }" 
                             class="px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-emerald-700 transition-colors flex items-center gap-2">
                            <lucide-icon name="external-link" class="w-4 h-4"></lucide-icon>
                            <span>View Full Cycle Details &amp; Management</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div class="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80">
                        <h3 class="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
                          <lucide-icon name="info" class="w-4 h-4 text-emerald-600"></lucide-icon>
                          Agronomic Cycle Details
                        </h3>
                        <div class="space-y-3 text-xs">
                          <div class="flex justify-between border-b border-slate-200 pb-2">
                            <span class="text-slate-500">Planting Date</span>
                            <span class="font-bold text-slate-900">{{ selectedPlanting()?.plantedDate }}</span>
                          </div>
                          @if (selectedPlanting()?.expectedHarvestDate) {
                            <div class="flex justify-between border-b border-slate-200 pb-2">
                              <span class="text-slate-500">Expected Harvest</span>
                              <span class="font-bold text-slate-900">{{ selectedPlanting()?.expectedHarvestDate }}</span>
                            </div>
                          }
                          @if (selectedPlanting()?.actualHarvestDate) {
                            <div class="flex justify-between border-b border-slate-200 pb-2">
                              <span class="text-slate-500">Harvest Date</span>
                              <span class="font-bold text-slate-900">{{ selectedPlanting()?.actualHarvestDate }}</span>
                            </div>
                          }
                          <div class="flex justify-between border-b border-slate-200 pb-2">
                            <span class="text-slate-500">Seed Variety</span>
                            <span class="font-bold text-slate-900">{{ selectedPlanting()?.variety?.commonName || 'Pioneer P1197 Optimum AQUAmax' }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-slate-500">Seeding Population</span>
                            <span class="font-bold text-slate-900">{{ selectedPlanting()?.seedsPlanted ? (selectedPlanting()?.seedsPlanted + ' seeds/ha') : '74,000 seeds/ha' }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80">
                        <h3 class="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
                          <lucide-icon name="activity" class="w-4 h-4 text-emerald-600"></lucide-icon>
                          Milestone Operations
                        </h3>
                        <div class="space-y-3 text-xs">
                          <div class="flex gap-3 items-center">
                            <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <lucide-icon name="check" class="w-3.5 h-3.5"></lucide-icon>
                            </div>
                            <div>
                              <p class="font-bold text-slate-800">Seeded & In-Furrow Treated</p>
                              <p class="text-[10px] text-slate-500">Completed on {{ selectedPlanting()?.plantedDate }}</p>
                            </div>
                          </div>
                          <div class="flex gap-3 items-center">
                            <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                              <lucide-icon name="droplets" class="w-3.5 h-3.5"></lucide-icon>
                            </div>
                            <div>
                              <p class="font-bold text-slate-800">Irrigation Cycle 1 (25 mm)</p>
                              <p class="text-[10px] text-slate-500">Center Pivot rotation completed</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Populated Planting Cycle Stages for Selected Cycle -->
                    @if (selectedPlantingStages().length > 0) {
                      <div class="mt-6 bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <div>
                            <h3 class="font-bold text-sm text-slate-900 flex items-center gap-2">
                              <lucide-icon name="sprout" class="w-4 h-4 text-emerald-600"></lucide-icon>
                              Planting Cycle Stages & Plotted Current Stage ({{ selectedPlantingStages().length }} Stages)
                            </h3>
                            <p class="text-[11px] text-slate-500">Enriched schedule from <code class="font-mono text-[10px] text-emerald-700">GET /api/v1/crop/planting-cycle/{{ selectedPlanting()?.id }}/stages</code></p>
                          </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          @for (st of selectedPlantingStages(); track st.id; let idx = $index) {
                            <div class="p-3.5 rounded-xl border transition-all"
                                 [class]="(st.isCurrentStage || st.status === 'CURRENT')
                                   ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-xs'
                                   : (st.status === 'COMPLETED' ? 'bg-white border-emerald-200' : 'bg-white border-slate-200/80')">
                              <div class="flex items-center justify-between gap-1 mb-1">
                                <span class="text-[10px] font-black px-2 py-0.5 rounded uppercase"
                                      [class]="(st.isCurrentStage || st.status === 'CURRENT') ? 'bg-emerald-600 text-white' : (st.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600')">
                                  {{ st.growthStageSpecificData?.code || ('Stage ' + (st.stageOrder || (idx + 1))) }}
                                </span>
                                <span class="text-[10px] font-bold text-slate-500">Day {{ st.startDayOffset }}–{{ st.endDayOffset }} ({{ st.durationInDays }}d)</span>
                              </div>
                              <p class="text-xs font-extrabold text-slate-900">{{ st.stageOrder || (idx + 1) }}. {{ st.stageName }}</p>
                              @if (st.plannedStartDate && st.plannedEndDate) {
                                <p class="text-[10px] font-semibold text-slate-500 mt-1">{{ st.plannedStartDate }} → {{ st.plannedEndDate }}</p>
                              }
                              <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-black">
                                @if (st.isCurrentStage || st.status === 'CURRENT') {
                                  <span class="text-emerald-700 flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                    CURRENT STAGE
                                  </span>
                                } @else if (st.status === 'COMPLETED') {
                                  <span class="text-emerald-600">✓ COMPLETED</span>
                                } @else {
                                  <span class="text-slate-400">UPCOMING</span>
                                }
                                <span class="text-slate-400">{{ (st.growthProgramStageActivities || []).length }} tasks</span>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  }
                </div>
              }

              <!-- ================= 3. GROWTH TRENDS TAB ================= -->
              @if (activeTab() === 'growth') {
                <div class="space-y-6">
                  <div class="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <h2 class="text-lg font-bold text-slate-900">Historical Growth Trends & Plotted Planting Cycle Stages</h2>
                      <p class="text-xs text-slate-500">Visualizing plant height development, phenological stage progression, and current stage plot against benchmark curves.</p>
                    </div>
                  </div>
                  <app-growth-trends-chart
                    [stages]="activeCycleStages()"
                    [plantingCycleId]="currentActiveCycle()?.id || null">
                  </app-growth-trends-chart>
                </div>
              }

              <!-- ================= 4. SOIL & FERTILITY TAB ================= -->
              @if (activeTab() === 'fertility') {
                <div class="space-y-8">
                  <!-- Fertility Header & Sync -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                      <div>
                        <h2 class="text-lg font-bold text-slate-900">Soil Fertility & Multi-Depth Probe Telemetry</h2>
                        <p class="text-xs text-slate-500">Real-time IoT soil sensor network synchronized across the management unit.</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button (click)="syncSensors()" 
                              class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 transition-colors">
                        <lucide-icon name="refresh-cw" class="w-3.5 h-3.5" [class.animate-spin]="isSyncingSensors()"></lucide-icon>
                        Sync Sensors
                      </button>
                      <button (click)="openInputModal('FERTILIZER')" 
                              class="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                        <lucide-icon name="plus" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
                        Log Soil Amendment
                      </button>
                    </div>
                  </div>

                  <!-- Multi-Depth Moisture Sensor Profiles -->
                  <div>
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Multi-Depth Hydration Profile</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <!-- 10cm -->
                      <div class="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-xs font-bold text-slate-500">10 cm (Topsoil Zone)</span>
                          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Good</span>
                        </div>
                        <div class="text-3xl font-black text-slate-900 mb-2">29%</div>
                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full bg-blue-500 rounded-full w-[58%]"></div>
                        </div>
                        <span class="text-[10px] text-slate-400 mt-2 block">Evaporative front active</span>
                      </div>

                      <!-- 30cm -->
                      <div class="p-5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/10 shadow-2xs">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-xs font-bold text-emerald-800">30 cm (Primary Root Zone)</span>
                          <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Optimal</span>
                        </div>
                        <div class="text-3xl font-black text-slate-900 mb-2">34%</div>
                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full bg-emerald-500 rounded-full w-[68%]"></div>
                        </div>
                        <span class="text-[10px] text-emerald-700 mt-2 block font-medium">Optimal root zone water availability</span>
                      </div>

                      <!-- 60cm -->
                      <div class="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-xs font-bold text-slate-500">60 cm (Subsoil Reserve)</span>
                          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Abundant</span>
                        </div>
                        <div class="text-3xl font-black text-slate-900 mb-2">38%</div>
                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full bg-blue-600 rounded-full w-[76%]"></div>
                        </div>
                        <span class="text-[10px] text-slate-400 mt-2 block">Deep aquifer buffer intact</span>
                      </div>
                    </div>
                  </div>

                  <!-- NPK Macronutrients & Chemical Parameters -->
                  <div>
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Macronutrients & Chemical Health</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <!-- pH -->
                      <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                        <span class="text-[11px] font-bold text-slate-400 uppercase">Soil pH</span>
                        <div class="text-2xl font-black text-slate-800 my-1">6.5</div>
                        <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal (6.2 - 6.8)</span>
                      </div>

                      <!-- N -->
                      <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                        <span class="text-[11px] font-bold text-slate-400 uppercase">Nitrogen (N)</span>
                        <div class="text-2xl font-black text-slate-800 my-1">45 <span class="text-xs font-normal">ppm</span></div>
                        <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Side-Dress Due</span>
                      </div>

                      <!-- P -->
                      <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                        <span class="text-[11px] font-bold text-slate-400 uppercase">Phosphorus (P)</span>
                        <div class="text-2xl font-black text-slate-800 my-1">22 <span class="text-xs font-normal">ppm</span></div>
                        <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
                      </div>

                      <!-- K -->
                      <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                        <span class="text-[11px] font-bold text-slate-400 uppercase">Potassium (K)</span>
                        <div class="text-2xl font-black text-slate-800 my-1">110 <span class="text-xs font-normal">ppm</span></div>
                        <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
                      </div>
                    </div>
                  </div>

                  <!-- Historical Applications -->
                  <div>
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Application History</h3>
                    <div class="space-y-3">
                      <div class="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                        <div class="flex justify-between items-start mb-1.5">
                          <div>
                            <h4 class="font-bold text-sm text-slate-800">Liquid Starter 10-34-0 + Zn-EDTA</h4>
                            <p class="text-xs text-slate-500">14 May 2026 &bull; Applied by: Crew Leader Jackson &bull; Planter In-Furrow</p>
                          </div>
                          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">50 L/ha</span>
                        </div>
                        <p class="text-xs text-slate-600 leading-relaxed">Starter polyphosphate placed directly in furrow with seed to stimulate root zone emergence.</p>
                      </div>

                      <div class="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                        <div class="flex justify-between items-start mb-1.5">
                          <div>
                            <h4 class="font-bold text-sm text-slate-800">Agricultural Calcific Lime Application</h4>
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

              <!-- ================= 5. ACTIVITIES TAB ================= -->
              @if (activeTab() === 'activities') {
                <div class="space-y-6">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h2 class="text-lg font-bold text-slate-900">Field Operations & Activity Log</h2>
                      <p class="text-xs text-slate-500">Complete chronological timeline of farm machinery, spraying, and labour passes.</p>
                    </div>
                    <button (click)="openActivityModal()" class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                      <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                      Log New Activity
                    </button>
                  </div>

                  <div class="space-y-3.5">
                    @for (act of activities(); track act.id) {
                      <div class="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div class="flex items-start gap-3.5">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                                 [ngClass]="getActivityBadgeClass(act.type)">
                              <lucide-icon [name]="getActivityIcon(act.type)" class="w-5 h-5"></lucide-icon>
                            </div>
                            <div>
                              <div class="flex items-center gap-2">
                                <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                                      [ngClass]="act.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : (act.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800')">
                                  {{ act.status }}
                                </span>
                                <span class="text-xs text-slate-500 font-semibold">{{ act.date }}</span>
                              </div>
                              <h3 class="text-sm font-bold text-slate-900 mt-1">{{ act.title }}</h3>
                              <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ act.notes }}</p>
                              
                              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
                                <span>Operator: <strong class="text-slate-700">{{ act.operator }}</strong></span>
                                @if (act.equipment) {
                                  <span>Equipment: <strong class="text-slate-700">{{ act.equipment }}</strong></span>
                                }
                                @if (act.rate) {
                                  <span>Application Rate: <strong class="text-slate-700">{{ act.rate }}</strong></span>
                                }
                              </div>
                            </div>
                          </div>

                          <div class="shrink-0 flex sm:flex-col items-end gap-1">
                            <span class="text-[11px] font-bold text-slate-400 capitalize">{{ act.type.toLowerCase() }}</span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- ================= 6. INPUTS & TELEMETRY TAB (SECTION E) ================= -->
              @if (activeTab() === 'inputs') {
                <div class="space-y-6">
                  <!-- Header & Action -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h2 class="text-lg font-bold text-slate-900">Recorded Field Inputs & Machinery Telemetry</h2>
                      <p class="text-xs text-slate-500">Comprehensive breakdown of seeds, fertilizers, crop chemistry, fuel, and labour hours.</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button (click)="openInputModal('MACHINERY')" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs">
                        <lucide-icon name="tractor" class="w-3.5 h-3.5 text-amber-600"></lucide-icon>
                        + Machinery
                      </button>
                      <button (click)="openInputModal('LABOUR')" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs">
                        <lucide-icon name="users" class="w-3.5 h-3.5 text-blue-600"></lucide-icon>
                        + Labour
                      </button>
                      <button (click)="openInputModal('FERTILIZER')" class="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs">
                        <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                        Add Input
                      </button>
                    </div>
                  </div>

                  <!-- Summary Cards Row -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                      <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Recorded Cost</span>
                      <div class="text-xl font-black text-emerald-950 mt-1">$\{{ totalRecordedInputsCost() | number:'1.2-2' }}</div>
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
                      <span class="text-[10px] text-purple-700 font-semibold block mt-0.5">Crew operations logged</span>
                    </div>
                  </div>

                  <!-- Table of Entered Inputs -->
                  <div class="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
                    <div class="overflow-x-auto">
                      <table class="w-full text-left text-xs text-slate-700">
                        <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                          <tr>
                            <th class="px-4 py-3">Category</th>
                            <th class="px-4 py-3">Product / Resource</th>
                            <th class="px-4 py-3">Usage / Measurements</th>
                            <th class="px-4 py-3">Telemetry (Fuel / Hours)</th>
                            <th class="px-4 py-3 text-right">Unit Rate</th>
                            <th class="px-4 py-3 text-right">Total Outlay</th>
                            <th class="px-4 py-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                          @for (item of fieldInputs(); track item.id) {
                            <tr class="hover:bg-slate-50/60 transition-colors">
                              <td class="px-4 py-3 whitespace-nowrap">
                                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                                      [ngClass]="getInputCategoryBadgeClass(item.category)">
                                  {{ item.category }}
                                </span>
                              </td>
                              <td class="px-4 py-3 font-bold text-slate-900">
                                {{ item.name }}
                                @if (item.machineryModel) {
                                  <span class="block text-[10px] text-slate-500 font-normal">Model: {{ item.machineryModel }}</span>
                                }
                              </td>
                              <td class="px-4 py-3 font-medium text-slate-600">
                                {{ item.quantity }} {{ item.measurementUnit }}
                              </td>
                              <td class="px-4 py-3 text-[11px] text-slate-600">
                                @if (item.category === 'MACHINERY') {
                                  <span class="font-bold text-amber-700">{{ item.fuelUsedLiters || 0 }} L Fuel</span> &bull; 
                                  <span>{{ item.operatingHours || 0 }} hrs</span>
                                } @else if (item.category === 'LABOUR') {
                                  <span class="font-bold text-blue-700">{{ item.labourHours || 0 }} hrs</span> &bull; 
                                  <span>{{ item.labourCrewSize || 1 }} Crew</span>
                                } @else {
                                  <span class="text-slate-400">&mdash;</span>
                                }
                              </td>
                              <td class="px-4 py-3 text-right font-medium text-slate-600">
                                $\{{ item.unitCost | number:'1.2-2' }}/{{ item.measurementUnit }}
                              </td>
                              <td class="px-4 py-3 text-right font-black text-slate-900">
                                $\{{ item.totalCost | number:'1.2-2' }}
                              </td>
                              <td class="px-4 py-3 text-center">
                                <button (click)="removeInput(item.id)" class="text-slate-400 hover:text-red-600 p-1 rounded transition-colors" title="Remove Entry">
                                  <lucide-icon name="trash-2" class="w-3.5 h-3.5"></lucide-icon>
                                </button>
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              }

              <!-- ================= 7. SCOUTING & ISSUES TAB ================= -->
              @if (activeTab() === 'scouting') {
                <div class="space-y-6">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h2 class="text-lg font-bold text-slate-900">Agronomic Scouting & Weed/Pest Pressure</h2>
                      <p class="text-xs text-slate-500">In-field observations, geotagged issues, and preventative remedy recommendations.</p>
                    </div>
                    <button (click)="openScoutingModal()" class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                      <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                      Log Observation
                    </button>
                  </div>

                  <div class="space-y-3.5">
                    @for (log of scoutingLogs(); track log.id) {
                      <div class="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div class="space-y-2">
                            <div class="flex items-center gap-2">
                              <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                                    [ngClass]="log.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : (log.severity === 'MODERATE' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800')">
                                {{ log.severity }} RISK
                              </span>
                              <span class="text-xs font-bold text-slate-700 capitalize">{{ log.issueCategory }} Observation</span>
                              <span class="text-slate-300">&bull;</span>
                              <span class="text-xs text-slate-500">{{ log.date }} by {{ log.scoutName }}</span>
                            </div>

                            <p class="text-xs text-slate-800 leading-relaxed font-medium">{{ log.description }}</p>

                            <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-xs text-emerald-900 flex items-start gap-2">
                              <lucide-icon name="circle-check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></lucide-icon>
                              <div>
                                <span class="font-bold">Recommended Agronomic Remedy: </span>
                                {{ log.remedyAction }}
                              </div>
                            </div>

                            <div class="text-[11px] text-slate-500 flex items-center gap-4 pt-1">
                              <span>Location: <strong class="text-slate-700">{{ log.locationDetails }}</strong></span>
                              <span>&bull;</span>
                              <span>Affected Area: <strong class="text-slate-700">{{ log.affectedAreaPct }}% of field</strong></span>
                            </div>
                          </div>

                          <div class="shrink-0">
                            <span class="px-2.5 py-1 text-xs font-bold rounded-lg"
                                  [ngClass]="log.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'">
                              {{ log.status }}
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- ================= 8. FINANCIALS & ACCOUNTING TAB ================= -->
              @if (activeTab() === 'accounting') {
                <div class="space-y-6">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h2 class="text-lg font-bold text-slate-900">Field Financials & Gross Margin Economics</h2>
                      <p class="text-xs text-slate-500">P&L ledger, input expenditures, projected revenue, and unit margins.</p>
                    </div>
                    <button (click)="openTransactionModal()" class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                      <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                      Log Transaction
                    </button>
                  </div>

                  <!-- Financial KPI Strip -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-2xs">
                      <span class="text-xs text-emerald-800 font-bold uppercase tracking-wider block mb-1">Projected Gross Revenue</span>
                      <div class="text-3xl font-black text-emerald-950">$138,400.00</div>
                      <span class="text-xs text-emerald-700 mt-1 block">Based on 11.4 t/ha @ $270/tonne</span>
                    </div>

                    <div class="p-6 rounded-2xl bg-red-50 border border-red-100 shadow-2xs">
                      <span class="text-xs text-red-800 font-bold uppercase tracking-wider block mb-1">Total Operating Expenses</span>
                      <div class="text-3xl font-black text-red-950">$\{{ (totalRecordedInputsCost() + 8500) | number:'1.2-2' }}</div>
                      <span class="text-xs text-red-700 mt-1 block">&#36;{{ (((totalRecordedInputsCost() + 8500) / (field()?.size || 45.2))).toFixed(2) }}/ha cost</span>
                    </div>

                    <div class="p-6 rounded-2xl bg-blue-50 border border-blue-100 shadow-2xs">
                      <span class="text-xs text-blue-800 font-bold uppercase tracking-wider block mb-1">Estimated Net Margin</span>
                      <div class="text-3xl font-black text-blue-950">$\{{ (138400 - (totalRecordedInputsCost() + 8500)) | number:'1.2-2' }}</div>
                      <span class="text-xs text-blue-700 mt-1 block">67.4% projected return on land</span>
                    </div>
                  </div>

                  <!-- Recent Transactions Ledger -->
                  <div>
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Transactions & Invoices</h3>
                    <div class="space-y-3">
                      @for (tx of transactions(); track tx.id) {
                        <div class="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                          <div class="flex items-center gap-3.5">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                 [ngClass]="tx.type === 'EXPENSE' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'">
                              <lucide-icon [name]="tx.type === 'EXPENSE' ? 'arrow-down-right' : 'arrow-up-right'" class="w-5 h-5"></lucide-icon>
                            </div>
                            <div>
                              <h4 class="font-bold text-xs text-slate-900">{{ tx.description }}</h4>
                              <p class="text-[11px] text-slate-500">{{ tx.date }} &bull; Ref: {{ tx.referenceNo }} &bull; {{ tx.category }}</p>
                            </div>
                          </div>
                          <div class="text-right">
                            <div class="text-sm font-black" [ngClass]="tx.type === 'EXPENSE' ? 'text-red-700' : 'text-emerald-700'">
                              {{ tx.type === 'EXPENSE' ? '-' : '+' }}&#36;{{ tx.amount | number:'1.2-2' }}
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        } @else {
          <!-- FIELD NOT FOUND EMPTY STATE -->
          <div class="flex flex-col items-center justify-center p-20 text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <lucide-icon name="map-pin-off" class="w-16 h-16 mb-4 opacity-20 text-slate-400"></lucide-icon>
            <p class="text-lg font-bold text-slate-800">Field management unit not found</p>
            <p class="text-xs text-slate-500 mt-1">Please select an existing parcel from the interactive GIS farm map.</p>
            <a routerLink="/crops" class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors">
              Return to Field Map
            </a>
          </div>
        }
      </div>

      <!-- ================= MODALS ================= -->

      <!-- 1. ADD ACTUALS MODAL -->
      @if (showAddActualsModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">Add Actual Seeding Details</h2>
                <p class="text-xs text-slate-500">Record field execution date to commence phenology tracking.</p>
              </div>
              <button (click)="closeAddActualsModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Actual Seeding Date</label>
                <input type="date" [(ngModel)]="actualPlantingDate" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Population (Seeds / Hectare)</label>
                <input type="number" [(ngModel)]="actualSeedsPlanted" placeholder="e.g. 74000" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
              </div>
              <p class="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                Saving will activate this planting cycle and begin tracking its GDD and growth trajectory.
              </p>
            </div>
            
            <div class="p-5 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3">
              <button (click)="closeAddActualsModal()" class="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors">
                Cancel
              </button>
              <button (click)="submitActuals()" 
                      [disabled]="isSubmittingActuals() || !actualPlantingDate"
                      class="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                @if (isSubmittingActuals()) {
                  <lucide-icon name="loader" class="w-4 h-4 animate-spin"></lucide-icon>
                  Saving...
                } @else {
                  Save Details
                }
              </button>
            </div>
          </div>
        </div>
      }

      <!-- 2. LOG ACTIVITY MODAL -->
      @if (showActivityModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">Log Field Activity</h2>
                <p class="text-xs text-slate-500">Record operations, spray passes, irrigation, or tillage.</p>
              </div>
              <button (click)="closeActivityModal()" class="text-slate-400 hover:text-slate-600 p-1">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Operation Type</label>
                <select [(ngModel)]="newActivityType" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                  <option value="SPRAYING">Spraying (Herbicide / Fungicide / Foliar)</option>
                  <option value="FERTILIZING">Fertilization (Side-dress / Broadcast)</option>
                  <option value="IRRIGATION">Irrigation Rotation</option>
                  <option value="TILLAGE">Tillage & Seedbed Preparation</option>
                  <option value="SCOUTING">Agronomic Scouting Pass</option>
                  <option value="MOWING">Mowing & Border Trimming</option>
                  <option value="HARVEST">Harvest Execution</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Activity Title</label>
                <input type="text" [(ngModel)]="newActivityTitle" placeholder="e.g. Side-dress UAN 32% Application" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Date</label>
                  <input type="date" [(ngModel)]="newActivityDate" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Status</label>
                  <select [(ngModel)]="newActivityStatus" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                    <option value="COMPLETED">Completed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="SCHEDULED">Scheduled</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Operator / Crew</label>
                  <input type="text" [(ngModel)]="newActivityOperator" placeholder="e.g. John Doe" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Equipment Used</label>
                  <input type="text" [(ngModel)]="newActivityEquipment" placeholder="e.g. Case IH Patriot 4440" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Target Rate / Dosage</label>
                <input type="text" [(ngModel)]="newActivityRate" placeholder="e.g. 140 kg/ha or 25 mm depth" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Agronomic Notes</label>
                <textarea rows="2" [(ngModel)]="newActivityNotes" placeholder="Enter weather conditions, nozzle type, pressure, observations..." class="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"></textarea>
              </div>
            </div>

            <div class="p-5 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3">
              <button (click)="closeActivityModal()" class="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors">
                Cancel
              </button>
              <button (click)="saveActivity()" class="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition-colors">
                Save Activity
              </button>
            </div>
          </div>
        </div>
      }

      <!-- 3. RECORD INPUT MODAL (SECTION E STYLE) -->
      @if (showInputModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">Record Field Input / Telemetry</h2>
                <p class="text-xs text-slate-500">Log chemicals, fertilizers, machinery fuel & hours, or field labour.</p>
              </div>
              <button (click)="closeInputModal()" class="text-slate-400 hover:text-slate-600 p-1">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-4 text-xs">
              <!-- Category Selector Pills -->
              <div>
                <label class="block font-bold text-slate-700 mb-1.5">Input Category</label>
                <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <button type="button" (click)="newInputCategory.set('FERTILIZER')" 
                          [class]="newInputCategory() === 'FERTILIZER' ? 'py-2 bg-emerald-600 text-white font-bold rounded-xl' : 'py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200'">
                    Fertilizer
                  </button>
                  <button type="button" (click)="newInputCategory.set('CHEMISTRY')" 
                          [class]="newInputCategory() === 'CHEMISTRY' ? 'py-2 bg-purple-600 text-white font-bold rounded-xl' : 'py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200'">
                    Chemistry
                  </button>
                  <button type="button" (click)="newInputCategory.set('MACHINERY')" 
                          [class]="newInputCategory() === 'MACHINERY' ? 'py-2 bg-amber-600 text-white font-bold rounded-xl' : 'py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200'">
                    Machinery
                  </button>
                  <button type="button" (click)="newInputCategory.set('LABOUR')" 
                          [class]="newInputCategory() === 'LABOUR' ? 'py-2 bg-blue-600 text-white font-bold rounded-xl' : 'py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200'">
                    Labour
                  </button>
                  <button type="button" (click)="newInputCategory.set('SEED')" 
                          [class]="newInputCategory() === 'SEED' ? 'py-2 bg-teal-600 text-white font-bold rounded-xl' : 'py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200'">
                    Seed
                  </button>
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Item / Product Name</label>
                <input type="text" [(ngModel)]="newInputName" placeholder="e.g. Liquid 10-34-0 or John Deere 8370R" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
              </div>

              <!-- Machinery specific telemetry -->
              @if (newInputCategory() === 'MACHINERY') {
                <div class="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
                  <span class="text-[10px] font-black uppercase tracking-wider text-amber-900 block">Machinery Telemetry</span>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block font-bold text-slate-700 mb-1">Fuel Used (Liters)</label>
                      <input type="number" [(ngModel)]="newInputFuelLiters" placeholder="e.g. 180" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white">
                    </div>
                    <div>
                      <label class="block font-bold text-slate-700 mb-1">Operating Run Time (Hours)</label>
                      <input type="number" [(ngModel)]="newInputOperatingHours" placeholder="e.g. 14.5" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white">
                    </div>
                  </div>
                </div>
              }

              <!-- Labour specific telemetry -->
              @if (newInputCategory() === 'LABOUR') {
                <div class="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-3">
                  <span class="text-[10px] font-black uppercase tracking-wider text-blue-900 block">Labour Hours</span>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block font-bold text-slate-700 mb-1">Total Labour (Hours)</label>
                      <input type="number" [(ngModel)]="newInputLabourHours" placeholder="e.g. 24" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white">
                    </div>
                    <div>
                      <label class="block font-bold text-slate-700 mb-1">Crew Size (Persons)</label>
                      <input type="number" [(ngModel)]="newInputLabourCrewSize" placeholder="e.g. 2" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white">
                    </div>
                  </div>
                </div>
              }

              <!-- General measurements & pricing -->
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Unit</label>
                  <input type="text" [(ngModel)]="newInputUnit" placeholder="L, kg, hrs, bags" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input type="number" [(ngModel)]="newInputQuantity" (ngModelChange)="recalcTotalInputCost()" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Unit Cost ($)</label>
                  <input type="number" [(ngModel)]="newInputUnitCost" (ngModelChange)="recalcTotalInputCost()" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
              </div>

              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span class="font-bold text-slate-600">Calculated Outlay Cost:</span>
                <span class="text-base font-black text-slate-900">&#36;{{ (newInputQuantity * newInputUnitCost) | number:'1.2-2' }}</span>
              </div>
            </div>

            <div class="p-5 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3">
              <button (click)="closeInputModal()" class="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors">
                Cancel
              </button>
              <button (click)="saveInput()" class="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition-colors">
                Save Input Entry
              </button>
            </div>
          </div>
        </div>
      }

      <!-- 4. LOG SCOUTING MODAL -->
      @if (showScoutingModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">Log Scouting Observation</h2>
                <p class="text-xs text-slate-500">Record in-field pests, diseases, weed pressure, or nutritional stress.</p>
              </div>
              <button (click)="closeScoutingModal()" class="text-slate-400 hover:text-slate-600 p-1">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-4 text-xs">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Issue Category</label>
                  <select [(ngModel)]="newScoutingCategory" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                    <option value="PEST">Pest Infestation</option>
                    <option value="DISEASE">Foliar / Root Disease</option>
                    <option value="WEED">Weed Emergence</option>
                    <option value="DEFICIENCY">Nutrient Deficiency</option>
                    <option value="MOISTURE">Moisture Stress / Waterlogging</option>
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Severity Level</label>
                  <select [(ngModel)]="newScoutingSeverity" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                    <option value="LOW">Low (Watch List)</option>
                    <option value="MODERATE">Moderate (Action Required)</option>
                    <option value="CRITICAL">Critical (Immediate Treatment)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Observation Description</label>
                <textarea rows="2" [(ngModel)]="newScoutingDesc" placeholder="e.g. Localized aphid clusters on border rows near treeline..." class="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"></textarea>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Recommended Agronomic Remedy</label>
                <textarea rows="2" [(ngModel)]="newScoutingRemedy" placeholder="e.g. Schedule spot-spray with beneficial-sparing insecticide..." class="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Location Details</label>
                  <input type="text" [(ngModel)]="newScoutingLocation" placeholder="e.g. North-West quadrant" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Affected Area (%)</label>
                  <input type="number" [(ngModel)]="newScoutingAreaPct" placeholder="e.g. 5" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
              </div>
            </div>

            <div class="p-5 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3">
              <button (click)="closeScoutingModal()" class="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors">
                Cancel
              </button>
              <button (click)="saveScoutingLog()" class="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition-colors">
                Save Observation
              </button>
            </div>
          </div>
        </div>
      }

      <!-- 5. LOG TRANSACTION MODAL -->
      @if (showTransactionModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">Log Financial Transaction</h2>
                <p class="text-xs text-slate-500">Record field expenditure invoice or harvest sale revenue.</p>
              </div>
              <button (click)="closeTransactionModal()" class="text-slate-400 hover:text-slate-600 p-1">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Transaction Type</label>
                <div class="grid grid-cols-2 gap-2">
                  <button type="button" (click)="newTxType = 'EXPENSE'"
                          [class]="newTxType === 'EXPENSE' ? 'py-2 bg-red-600 text-white font-bold rounded-xl' : 'py-2 bg-slate-100 text-slate-700 rounded-xl'">
                    Expense
                  </button>
                  <button type="button" (click)="newTxType = 'INCOME'"
                          [class]="newTxType === 'INCOME' ? 'py-2 bg-emerald-600 text-white font-bold rounded-xl' : 'py-2 bg-slate-100 text-slate-700 rounded-xl'">
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Description</label>
                <input type="text" [(ngModel)]="newTxDesc" placeholder="e.g. Side-dress UAN Nitrogen Invoice" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Category</label>
                  <input type="text" [(ngModel)]="newTxCategory" placeholder="e.g. Fertilizer, Seed, Fuel" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Amount ($)</label>
                  <input type="number" [(ngModel)]="newTxAmount" placeholder="e.g. 1450.00" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Reference / Invoice #</label>
                <input type="text" [(ngModel)]="newTxRef" placeholder="e.g. INV-2026-904" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
              </div>
            </div>

            <div class="p-5 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3">
              <button (click)="closeTransactionModal()" class="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors">
                Cancel
              </button>
              <button (click)="saveTransaction()" class="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition-colors">
                Save Record
              </button>
            </div>
          </div>
        </div>
      }

      <!-- 6. FIELD DOSSIER MODAL (PRINT / EXPORT) -->
      @if (showDossierModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <lucide-icon name="file-text" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-900">Field Dossier & Agronomic Audit</h2>
                  <p class="text-xs text-slate-500">Official field profile for agronomists, lenders, and compliance.</p>
                </div>
              </div>
              <button (click)="showDossierModal.set(false)" class="text-slate-400 hover:text-slate-600 p-1">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
              <div class="border-b border-slate-100 pb-4">
                <h3 class="font-bold text-slate-900 text-sm mb-2">Parcel Specifications</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                  <div>Field ID: <strong class="text-slate-900 block">#FLD-{{ field()?.id?.substring(0, 6) }}</strong></div>
                  <div>Area: <strong class="text-slate-900 block">{{ field()?.size || 45.2 }} ha ({{ ((field()?.size || 45.2) * 2.471).toFixed(1) }} ac)</strong></div>
                  <div>Soil Grade: <strong class="text-emerald-700 block">Class A Prime</strong></div>
                  <div>Coordinates: <strong class="text-slate-900 block">{{ centroidCoordinates() }}</strong></div>
                </div>
              </div>

              <div class="border-b border-slate-100 pb-4">
                <h3 class="font-bold text-slate-900 text-sm mb-2">Active Crop & Stand Audit</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-600">
                  <div>Crop: <strong class="text-slate-900 block">{{ currentCropName() }}</strong></div>
                  <div>Hybrid: <strong class="text-slate-900 block">Pioneer P1197 Optimum AQUAmax</strong></div>
                  <div>Seeded: <strong class="text-slate-900 block">14 May 2026</strong></div>
                  <div>Population: <strong class="text-slate-900 block">74,000 seeds/ha</strong></div>
                  <div>Harvest Window: <strong class="text-emerald-700 block">28 Sep - 05 Oct 2026</strong></div>
                  <div>Projected Yield: <strong class="text-emerald-700 block">11.4 t/ha</strong></div>
                </div>
              </div>

              <div>
                <h3 class="font-bold text-slate-900 text-sm mb-2">Inputs & Machinery Summary</h3>
                <div class="grid grid-cols-3 gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>Total Input Cost: <strong class="text-slate-900 block">$\{{ totalRecordedInputsCost() | number:'1.2-2' }}</strong></div>
                  <div>Fuel Consumed: <strong class="text-slate-900 block">{{ totalFuelUsed() }} L</strong></div>
                  <div>Machine Hours: <strong class="text-slate-900 block">{{ totalMachineHours() }} hrs</strong></div>
                </div>
              </div>
            </div>

            <div class="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span class="text-[11px] text-slate-500">Generated on {{ todayString() }}</span>
              <div class="flex items-center gap-2">
                <button (click)="printDossier()" class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                  <lucide-icon name="download" class="w-3.5 h-3.5"></lucide-icon>
                  Print / Export Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      <!-- 7. RECORD HARVEST ACTUALS MODAL -->
      @if (showHarvestModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <lucide-icon name="wheat" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-900">Record Harvest & Close Cycle</h2>
                  <p class="text-xs text-slate-500">Log actual harvest yield for <strong class="text-slate-800">{{ harvestTargetCycle()?.crop }}</strong></p>
                </div>
              </div>
              <button (click)="closeHarvestModal()" class="text-slate-400 hover:text-slate-600 p-1">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-4 text-xs">
              <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-amber-900 flex items-center gap-2.5">
                <lucide-icon name="info" class="w-4 h-4 text-amber-600 shrink-0"></lucide-icon>
                <span>Recording harvest completes this specific active cycle. Other concurrent cycles in this field will continue growing.</span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Harvest Completion Date *</label>
                  <input type="date" [(ngModel)]="harvestDate" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Actual Yield (t/ha) *</label>
                  <input type="number" step="0.1" [(ngModel)]="harvestYield" placeholder="e.g. 11.2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Grain Moisture (%)</label>
                  <input type="number" step="0.1" [(ngModel)]="harvestMoisture" placeholder="e.g. 14.8" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Storage Destination</label>
                  <input type="text" [(ngModel)]="harvestSilo" placeholder="e.g. Silo Bin #04" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Quality Grade Specification</label>
                <input type="text" [(ngModel)]="harvestGrade" placeholder="e.g. Grade 1 Food Corn" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Harvest Notes & Combine Telemetry</label>
                <textarea rows="2" [(ngModel)]="harvestNotes" placeholder="Combine speed, loss monitor, weather conditions during cutting..." class="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"></textarea>
              </div>
            </div>

            <div class="p-5 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3">
              <button (click)="closeHarvestModal()" class="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors">
                Cancel
              </button>
              <button (click)="submitHarvest()" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-colors flex items-center gap-1.5">
                <lucide-icon name="circle-check" class="w-4 h-4"></lucide-icon>
                Confirm Harvest & Archive Cycle
              </button>
            </div>
          </div>
        </div>
      }

      <!-- 8. ADD CONCURRENT ACTIVE PLANTING CYCLE MODAL -->
      @if (showAddCycleModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <lucide-icon name="layers" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-900">Add Concurrent Active Planting Cycle</h2>
                  <p class="text-xs text-slate-500">Seed an intercrop, companion crop, or split parcel in this field.</p>
                </div>
              </div>
              <button (click)="closeAddCycleModal()" class="text-slate-400 hover:text-slate-600 p-1">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-4 text-xs">
              <div class="p-3 bg-purple-50 rounded-2xl border border-purple-200/60 text-purple-900 flex items-center gap-2.5">
                <lucide-icon name="info" class="w-4 h-4 text-purple-600 shrink-0"></lucide-icon>
                <span>This field can have multiple active planting cycles running concurrently alongside existing crops.</span>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Crop Species *</label>
                <select [(ngModel)]="newCycleCrop" (ngModelChange)="onNewCycleCropChange($event)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                  <option value="Soybeans (Enlist E3 Intercrop)">Soybeans (Glycine max) - Companion Intercrop</option>
                  <option value="Cover Cowpeas (Red Ripper)">Cover Cowpeas (Vigna unguiculata) - Nitrogen Fixer</option>
                  <option value="Forage Sorghum (Silage)">Forage Sorghum (Sorghum bicolor) - Strip Planting</option>
                  <option value="Alfalfa (Medicago sativa)">Alfalfa (Medicago sativa) - Understory</option>
                  <option value="Grain Maize (Sweet Corn Border)">Sweet Corn (Zea mays var. saccharata) - Perimeter Strip</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Variety / Hybrid *</label>
                <input type="text" [(ngModel)]="newCycleVariety" placeholder="e.g. Enlist E3 High Protein 2.4RM" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Allocated Area (ha) *</label>
                  <input type="number" step="0.1" [(ngModel)]="newCycleArea" placeholder="e.g. 17.2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Planting Arrangement *</label>
                  <select [(ngModel)]="newCyclePattern" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                    <option value="Intercrop Companion (South Sector)">Intercrop Companion (Strip-Till)</option>
                    <option value="Split Parcel (West Half)">Split Parcel Allocation</option>
                    <option value="Understory Companion">Understory Soil Cover</option>
                    <option value="Perimeter Buffer Strip">Perimeter Buffer Strip</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Planted Date *</label>
                  <input type="date" [(ngModel)]="newCyclePlantedDate" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Expected Harvest Date *</label>
                  <input type="date" [(ngModel)]="newCycleExpectedHarvest" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono">
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Target Yield Projection</label>
                <input type="text" [(ngModel)]="newCycleTargetYield" placeholder="e.g. 3.8 t/ha" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
              </div>
            </div>

            <div class="p-5 border-t border-slate-100 bg-slate-50/80 flex justify-between items-center">
              <a routerLink="/crops/new-planting" [queryParams]="{ fieldId: field()?.id }" class="text-xs font-bold text-emerald-700 hover:underline">
                Use Full Planting Wizard &rarr;
              </a>
              <div class="flex items-center gap-2">
                <button (click)="closeAddCycleModal()" class="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors">
                  Cancel
                </button>
                <button (click)="submitNewActiveCycle()" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5">
                  <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                  Register Active Cycle
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ViewFieldComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fieldMapService = inject(FieldMapService);
  soilService = inject(SoilNotificationService);
  private cropService = inject(CropService);

  fieldId = signal<string | null>(null);
  field = signal<MapElement | null>(null);
  activeTab = signal<'overview' | 'planting' | 'growth' | 'fertility' | 'activities' | 'inputs' | 'scouting' | 'accounting'>('overview');
  mapLayer = signal<'satellite' | 'ndvi' | 'moisture'>('satellite');

  selectedPlanting = signal<PlantingCycleResponse | null>(null);
  plantingCycles = signal<PlantingCycleListResponse[]>([]);
  activeCycles = computed(() => this.plantingCycles().filter(c => !!c.plantedDate && !c.actualHarvestDate));
  plannedCycles = computed(() => this.plantingCycles().filter(c => !c.plantedDate));
  completedCycles = computed(() => this.plantingCycles().filter(c => !!c.actualHarvestDate));
  historyCycles = computed(() => this.plantingCycles().filter(c => !!c.plantedDate));

  selectedActiveCycleIndex = signal<number>(0);
  activeCycleStages = signal<CropStageDTO[]>([]);
  selectedPlantingStages = signal<CropStageDTO[]>([]);
  currentActiveCycle = computed(() => {
    const actives = this.activeCycles();
    if (actives.length === 0) return null;
    const idx = this.selectedActiveCycleIndex();
    return actives[idx] || actives[0];
  });

  activeCycleCurrentStageObj = computed<CropStageDTO | null>(() => {
    const stages = this.activeCycleStages();
    if (!stages.length) return null;
    return stages.find(s => s.isCurrentStage === true || s.status === 'CURRENT') || null;
  });

  activeCycleCurrentStageLabel = computed(() => {
    const current = this.activeCycleCurrentStageObj();
    if (current) {
      const code = current.growthStageSpecificData?.code;
      return `Current Stage: ${code ? code + ' · ' : ''}${current.stageName}`;
    }
    return `Current Stage: ${this.currentActiveCycle()?.currentStage || 'R1 - Silking & Pollination'}`;
  });

  activeCycleProgressPct = computed<number>(() => {
    const cycle = this.currentActiveCycle();
    if (cycle?.cycleProgressPercentage) {
      return Math.round(cycle.cycleProgressPercentage);
    }
    const stages = this.activeCycleStages();
    if (stages.length > 0) {
      const totalDays = stages.reduce((acc, s) => Math.max(acc, s.endDayOffset || 0), 0) || 130;
      const cur = this.activeCycleCurrentStageObj();
      if (cur) {
        const midDay = ((cur.startDayOffset || 1) + (cur.endDayOffset || cur.durationInDays || 10)) / 2;
        return Math.min(100, Math.max(5, Math.round((midDay / totalDays) * 100)));
      }
    }
    return 52;
  });

  selectActiveCycleByIndex(idx: number) {
    this.selectedActiveCycleIndex.set(idx);
    this.loadStagesForCurrentActiveCycle();
  }

  private loadStagesForCurrentActiveCycle() {
    const cycle = this.currentActiveCycle();
    const targetCycleId = cycle?.id || 'ea1c74a5-dcc4-11f1-b299-d71e68a444ea';
    this.cropService.getStagesByPlantingCycle(targetCycleId).subscribe(stages => {
      if (Array.isArray(stages) && stages.length > 0) {
        const sorted = [...stages].sort((a, b) => (a.stageOrder ?? 0) - (b.stageOrder ?? 0));
        this.activeCycleStages.set(sorted);
        return;
      }
      // Fallback to live active cycle stages if custom ID wasn't found
      this.cropService.getStagesByPlantingCycle('ea1c74a5-dcc4-11f1-b299-d71e68a444ea').subscribe(fallbackStages => {
        if (Array.isArray(fallbackStages) && fallbackStages.length > 0) {
          const sorted = [...fallbackStages].sort((a, b) => (a.stageOrder ?? 0) - (b.stageOrder ?? 0));
          this.activeCycleStages.set(sorted);
        }
      });
    });
  }

  // Harvest modal state
  showHarvestModal = signal<boolean>(false);
  harvestTargetCycle = signal<PlantingCycleListResponse | null>(null);
  harvestDate = '';
  harvestYield = 0;
  harvestMoisture = 14.5;
  harvestSilo = 'Silo Bin #03';
  harvestGrade = 'Grade 1 Certified Food Crop';
  harvestNotes = '';

  // Add Active Cycle modal state
  showAddCycleModal = signal<boolean>(false);
  newCycleCrop = 'Soybeans (Enlist E3 Intercrop)';
  newCycleVariety = 'Enlist E3 High Protein 2.4RM';
  newCycleArea = 17.2;
  newCyclePattern = 'Intercrop Companion (South Sector)';
  newCyclePlantedDate = '';
  newCycleExpectedHarvest = '';
  newCycleTargetYield = '3.8 t/ha';

  fieldAlert = computed(() => {
    const id = this.fieldId();
    if (!id) return null;
    return this.soilService.activeAlerts().find((a: SoilAlert) => a.fieldId === id) || null;
  });

  currentCropName = computed(() => {
    const actives = this.activeCycles();
    if (actives.length === 0) return 'Fallow / Unseeded';
    if (actives.length === 1) return actives[0].crop;
    return actives.map(a => a.crop.split('(')[0].trim()).join(' + ');
  });

  cropThreshold = computed(() => {
    return this.soilService.getThresholdForCrop(this.currentCropName());
  });

  centroidCoordinates = computed(() => {
    const paths = this.field()?.paths;
    if (!paths || paths.length === 0) return '39.7540° N, 104.9720° W';
    const avgLat = paths.reduce((s, p) => s + p.lat, 0) / paths.length;
    const avgLng = paths.reduce((s, p) => s + p.lng, 0) / paths.length;
    const latStr = `&#36;{Math.abs(avgLat).toFixed(4)}° &#36;{avgLat >= 0 ? 'N' : 'S'}`;
    const lngStr = `&#36;{Math.abs(avgLng).toFixed(4)}° &#36;{avgLng >= 0 ? 'E' : 'W'}`;
    return `&#36;{latStr}, &#36;{lngStr}`;
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
      return `&#36;{x},&#36;{y}`;
    }).join(' ');
  });

  // ================= FIELD ACTIVITIES =================
  activities = signal<FieldActivity[]>([
    {
      id: 'act-1',
      type: 'PLANTING',
      title: 'Precision Seed Planting & In-Furrow Treatment',
      date: '14 May 2026',
      status: 'COMPLETED',
      operator: 'Jackson Miller',
      equipment: 'John Deere 8370R + 1775NT 24-Row Planter',
      rate: '74,000 seeds/ha',
      notes: 'High-speed electric meter seeding with 50 L/ha starter 10-34-0 in-furrow placed 5cm deep.'
    },
    {
      id: 'act-2',
      type: 'SPRAYING',
      title: 'Pre-Emergence Residual Herbicide Application',
      date: '16 May 2026',
      status: 'COMPLETED',
      operator: 'Marcus Vance',
      equipment: 'Case IH Patriot 4440 Sprayer',
      rate: '2.5 L/ha Dual II Magnum',
      notes: 'Applied ahead of predicted rain for activation. Wind speed: 7 km/h, temperature 19°C.'
    },
    {
      id: 'act-3',
      type: 'IRRIGATION',
      title: 'Early Emergence Center Pivot Run (25 mm)',
      date: '22 May 2026',
      status: 'COMPLETED',
      operator: 'Automated Pivot Control',
      equipment: 'Valley 8000 Center Pivot #1',
      rate: '25 mm uniform application',
      notes: 'Surface moisture maintained at 32% field capacity to assist uniform coleoptile emergence.'
    },
    {
      id: 'act-4',
      type: 'SCOUTING',
      title: 'Stand Population & Emergence Uniformity Audit',
      date: '28 May 2026',
      status: 'COMPLETED',
      operator: 'Dr. Sarah Alston (Agronomist)',
      equipment: 'Drone DJI Mavic 3 Multispectral',
      rate: 'Whole-field NDVI scan',
      notes: '97.2% emergence uniformity recorded. Minimal aphid presence along field borders.'
    },
    {
      id: 'act-5',
      type: 'FERTILIZING',
      title: 'Side-Dress Nitrogen UAN 32% Injection',
      date: '15 Jun 2026',
      status: 'SCHEDULED',
      operator: 'Jackson Miller',
      equipment: 'Fast 9518 18-Row Applicator',
      rate: '140 kg N / ha',
      notes: 'Coulter injection between rows at V6 vegetative growth surge stage.'
    }
  ]);

  // ================= FIELD INPUTS (SECTION E INTEGRATION) =================
  fieldInputs = signal<FieldInputRecord[]>([
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

  // ================= SCOUTING OBSERVATIONS =================
  scoutingLogs = signal<ScoutingObservation[]>([
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

  // ================= FINANCIAL TRANSACTIONS =================
  transactions = signal<FieldTransaction[]>([
    {
      id: 'tx-1',
      type: 'EXPENSE',
      category: 'Seed & Inoculants',
      description: 'Pioneer P1197 AQUAmax Seed Order #429',
      amount: 11970,
      date: '12 May 2026',
      referenceNo: 'INV-2026-081'
    },
    {
      id: 'tx-2',
      type: 'EXPENSE',
      category: 'Fertilizers',
      description: 'Starter 10-34-0 & Zn-EDTA In-Furrow Blend',
      amount: 4512.50,
      date: '13 May 2026',
      referenceNo: 'INV-2026-092'
    },
    {
      id: 'tx-3',
      type: 'EXPENSE',
      category: 'Chemicals',
      description: 'Pre-Emergence Dual II Magnum Herbicide',
      amount: 2760,
      date: '15 May 2026',
      referenceNo: 'INV-2026-105'
    },
    {
      id: 'tx-4',
      type: 'INCOME',
      category: 'Grain Contract Pre-Sale',
      description: 'Forward Hedge Contract #GM-26 (200 tonnes @ $270/t)',
      amount: 54000,
      date: '02 Jun 2026',
      referenceNo: 'HEDGE-2026-11'
    }
  ]);

  // ================= MODAL STATES & MODELS =================
  showAddActualsModal = signal(false);
  isSubmittingActuals = signal(false);
  selectedPlannedCycle: PlantingCycleListResponse | null = null;
  actualPlantingDate = '';
  actualSeedsPlanted: number | null = null;

  showActivityModal = signal(false);
  newActivityType: FieldActivity['type'] = 'SPRAYING';
  newActivityTitle = '';
  newActivityDate = new Date().toISOString().split('T')[0];
  newActivityStatus: FieldActivity['status'] = 'SCHEDULED';
  newActivityOperator = '';
  newActivityEquipment = '';
  newActivityRate = '';
  newActivityNotes = '';

  showInputModal = signal(false);
  newInputCategory = signal<FieldInputRecord['category']>('FERTILIZER');
  newInputName = '';
  newInputUnit = 'Liters';
  newInputQuantity = 50;
  newInputUnitCost = 1.25;
  newInputFuelLiters = 0;
  newInputOperatingHours = 0;
  newInputLabourHours = 0;
  newInputLabourCrewSize = 1;

  showScoutingModal = signal(false);
  newScoutingCategory: ScoutingObservation['issueCategory'] = 'PEST';
  newScoutingSeverity: ScoutingObservation['severity'] = 'LOW';
  newScoutingDesc = '';
  newScoutingRemedy = '';
  newScoutingLocation = 'Central pivot sector';
  newScoutingAreaPct = 3;

  showTransactionModal = signal(false);
  newTxType: 'EXPENSE' | 'INCOME' = 'EXPENSE';
  newTxCategory = 'Fertilizer';
  newTxDesc = '';
  newTxAmount = 500;
  newTxRef = 'INV-' + Math.floor(1000 + Math.random() * 9000);

  showDossierModal = signal(false);
  isSyncingSensors = signal(false);

  // ================= LIFECYCLE & HANDLERS =================
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fieldId.set(id);
        const elements = this.fieldMapService.elements();
        const found = elements.find(e => e.id === id);
        if (found) {
          this.field.set(found);
          this.loadPlantingCycles();
        } else {
          // If not in memory, query farm fields
          this.fieldMapService.loadFieldsForFarm('farm-1').subscribe(els => {
            const match = els.find(e => e.id === id);
            if (match) {
              this.field.set(match);
              this.loadPlantingCycles();
            } else if (els.length > 0) {
              this.field.set(els[0]);
              this.loadPlantingCycles();
            }
          });
        }
      }
    });
  }

  loadPlantingCycles() {
    const id = this.fieldId();
    if (id) {
      this.cropService.getPlantingCyclesForManagementUnit(id).subscribe({
        next: (cycles) => {
          if (cycles && cycles.length > 0) {
            this.plantingCycles.set(cycles);
            this.loadStagesForCurrentActiveCycle();
          } else {
            this.cropService.getActivePlantingCycles().subscribe(activeList => {
              if (Array.isArray(activeList) && activeList.length > 0) {
                const mapped: PlantingCycleListResponse[] = activeList.map((item, idx) => ({
                  id: item.cycleId || `pc-active-${idx + 1}`,
                  sid: `PC-2026-0${idx + 1}`,
                  crop: item.cropName || 'Maize (Corn)',
                  varietyName: item.varietyName || 'SC 506',
                  plantedDate: item.plantedDate || '2026-09-01',
                  expectedHarvestDate: item.expectedHarvestDate || '2027-01-15',
                  actualHarvestDate: null,
                  areaHa: 25,
                  allocationPercentage: 60,
                  plantingPattern: item.fieldName || 'Field Sector',
                  currentStage: item.currentStage || 'R1 - Silking & Pollination',
                  cycleProgressPercentage: item.cycleProgressPercentage ? Math.round(item.cycleProgressPercentage) : 52,
                  daysAfterPlanting: 71,
                  targetYield: '11.4 t/ha'
                }));
                this.plantingCycles.set(mapped);
              }
              this.loadStagesForCurrentActiveCycle();
            });
          }
        },
        error: () => {
          this.plantingCycles.set([
            {
              id: 'pc-active-1',
              sid: 'PC-2026-04A',
              crop: 'Grain Maize (Pioneer P1197)',
              varietyName: 'Pioneer P1197 Optimum AQUAmax',
              plantedDate: '2026-05-14',
              expectedHarvestDate: '2026-09-30',
              actualHarvestDate: null,
              areaHa: 28.0,
              allocationPercentage: 62,
              plantingPattern: 'Split Parcel (North Sector)',
              currentStage: 'V6 Stem Elongation',
              cycleProgressPercentage: 48,
              daysAfterPlanting: 52,
              targetYield: '11.4 t/ha'
            },
            {
              id: 'pc-active-2',
              sid: 'PC-2026-04B',
              crop: 'Soybeans (Enlist E3 Intercrop)',
              varietyName: 'Enlist E3 High Protein 2.4RM',
              plantedDate: '2026-05-28',
              expectedHarvestDate: '2026-10-15',
              actualHarvestDate: null,
              areaHa: 17.2,
              allocationPercentage: 38,
              plantingPattern: 'Intercrop Companion (South Sector)',
              currentStage: 'V3 Early Bloom',
              cycleProgressPercentage: 36,
              daysAfterPlanting: 38,
              targetYield: '3.8 t/ha'
            }
          ]);
          this.loadStagesForCurrentActiveCycle();
        }
      });
    }
  }

  selectCycle(cycle: PlantingCycleListResponse) {
    this.cropService.getStagesByPlantingCycle(cycle.id).subscribe(stages => {
      if (Array.isArray(stages) && stages.length > 0) {
        this.selectedPlantingStages.set([...stages].sort((a, b) => (a.stageOrder ?? 0) - (b.stageOrder ?? 0)));
      } else {
        this.selectedPlantingStages.set(this.activeCycleStages());
      }
    });
    this.cropService.getPlantingCycle(cycle.id).subscribe({
      next: (detail) => this.selectedPlanting.set(detail),
      error: () => {
        this.selectedPlanting.set({
          id: cycle.id,
          sid: cycle.sid || 'PC-2026-01',
          growthProgram: { id: 'gp-1', name: 'Optimum AQUAmax High Yield Protocol' },
          variety: { id: 'var-1', commonName: cycle.varietyName || 'SC 506' },
          plantedDate: cycle.plantedDate,
          expectedHarvestDate: cycle.expectedHarvestDate,
          actualHarvestDate: cycle.actualHarvestDate,
          seedsPlanted: 74000,
          crop: { id: 'cr-1', name: cycle.crop }
        });
      }
    });
  }

  // --- Actuals Modal Handlers ---
  openAddActualsModal(cycle: PlantingCycleListResponse) {
    this.selectedPlannedCycle = cycle;
    this.actualPlantingDate = new Date().toISOString().split('T')[0];
    this.actualSeedsPlanted = 74000;
    this.showAddActualsModal.set(true);
  }

  closeAddActualsModal() {
    this.showAddActualsModal.set(false);
    this.selectedPlannedCycle = null;
  }

  submitActuals() {
    if (!this.selectedPlannedCycle || !this.actualPlantingDate) return;
    this.isSubmittingActuals.set(true);

    const payload = {
      plantedDate: this.actualPlantingDate,
      seedsPlanted: this.actualSeedsPlanted
    };

    this.cropService.updatePlantingCycleActuals(this.selectedPlannedCycle.id, payload).subscribe({
      next: () => {
        this.isSubmittingActuals.set(false);
        this.closeAddActualsModal();
        this.loadPlantingCycles();
      },
      error: () => {
        // Optimistic local update
        const updated = this.plantingCycles().map(c => {
          if (c.id === this.selectedPlannedCycle?.id) {
            return { ...c, plantedDate: this.actualPlantingDate };
          }
          return c;
        });
        this.plantingCycles.set(updated);
        this.isSubmittingActuals.set(false);
        this.closeAddActualsModal();
      }
    });
  }

  // --- Activity Modal Handlers ---
  openActivityModal() {
    this.newActivityTitle = '';
    this.newActivityOperator = 'Jackson Miller';
    this.newActivityEquipment = 'John Deere 8370R';
    this.newActivityRate = '';
    this.newActivityNotes = '';
    this.newActivityDate = new Date().toISOString().split('T')[0];
    this.showActivityModal.set(true);
  }

  closeActivityModal() {
    this.showActivityModal.set(false);
  }

  saveActivity() {
    const act: FieldActivity = {
      id: 'act-' + Date.now(),
      type: this.newActivityType,
      title: this.newActivityTitle || `&#36;{this.newActivityType} Pass`,
      date: this.newActivityDate,
      status: this.newActivityStatus,
      operator: this.newActivityOperator || 'Jackson Miller',
      equipment: this.newActivityEquipment,
      rate: this.newActivityRate,
      notes: this.newActivityNotes || 'Recorded from field view console.'
    };
    this.activities.update(list => [act, ...list]);
    this.closeActivityModal();
  }

  // --- Input Modal Handlers ---
  openInputModal(category: FieldInputRecord['category'] = 'FERTILIZER') {
    this.newInputCategory.set(category);
    if (category === 'MACHINERY') {
      this.newInputName = 'John Deere 8370R Tractor';
      this.newInputUnit = 'Hours';
      this.newInputQuantity = 10;
      this.newInputUnitCost = 85.00;
      this.newInputFuelLiters = 140;
      this.newInputOperatingHours = 10;
    } else if (category === 'LABOUR') {
      this.newInputName = 'Field Application Labor';
      this.newInputUnit = 'Hours';
      this.newInputQuantity = 16;
      this.newInputUnitCost = 28.00;
      this.newInputLabourHours = 16;
      this.newInputLabourCrewSize = 2;
    } else if (category === 'CHEMISTRY') {
      this.newInputName = 'Dual II Magnum Residual Herbicide';
      this.newInputUnit = 'Liters';
      this.newInputQuantity = 45;
      this.newInputUnitCost = 24.00;
    } else {
      this.newInputName = 'UAN 32% Liquid Nitrogen Solution';
      this.newInputUnit = 'Liters';
      this.newInputQuantity = 1200;
      this.newInputUnitCost = 0.95;
    }
    this.showInputModal.set(true);
  }

  closeInputModal() {
    this.showInputModal.set(false);
  }

  recalcTotalInputCost() {
    // Computed dynamically in template
  }

  saveInput() {
    const total = (this.newInputQuantity || 0) * (this.newInputUnitCost || 0);
    const item: FieldInputRecord = {
      id: 'inp-' + Date.now(),
      category: this.newInputCategory(),
      name: this.newInputName || 'Field Input',
      measurementUnit: this.newInputUnit || 'Units',
      quantity: this.newInputQuantity || 1,
      unitCost: this.newInputUnitCost || 0,
      totalCost: total,
      machineryModel: this.newInputCategory() === 'MACHINERY' ? this.newInputName : undefined,
      fuelUsedLiters: this.newInputCategory() === 'MACHINERY' ? this.newInputFuelLiters : undefined,
      operatingHours: this.newInputCategory() === 'MACHINERY' ? this.newInputOperatingHours : undefined,
      labourHours: this.newInputCategory() === 'LABOUR' ? this.newInputLabourHours : undefined,
      labourCrewSize: this.newInputCategory() === 'LABOUR' ? this.newInputLabourCrewSize : undefined,
      date: new Date().toISOString().split('T')[0]
    };
    this.fieldInputs.update(list => [item, ...list]);
    this.closeInputModal();
  }

  removeInput(id: string) {
    this.fieldInputs.update(list => list.filter(i => i.id !== id));
  }

  // --- Scouting Modal Handlers ---
  openScoutingModal() {
    this.newScoutingDesc = '';
    this.newScoutingRemedy = '';
    this.newScoutingLocation = 'Row 14-22 West Paddock';
    this.newScoutingAreaPct = 4;
    this.showScoutingModal.set(true);
  }

  closeScoutingModal() {
    this.showScoutingModal.set(false);
  }

  saveScoutingLog() {
    const log: ScoutingObservation = {
      id: 'sc-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      scoutName: 'Marcus Vance',
      issueCategory: this.newScoutingCategory,
      severity: this.newScoutingSeverity,
      cropStage: 'Vegetative V6',
      affectedAreaPct: this.newScoutingAreaPct || 3,
      locationDetails: this.newScoutingLocation || 'Field perimeter',
      description: this.newScoutingDesc || 'Field inspection observation.',
      remedyAction: this.newScoutingRemedy || 'Monitor and evaluate at next scouting interval.',
      status: 'INVESTIGATING'
    };
    this.scoutingLogs.update(list => [log, ...list]);
    this.closeScoutingModal();
  }

  // --- Transaction Modal Handlers ---
  openTransactionModal() {
    this.newTxDesc = '';
    this.newTxAmount = 750;
    this.newTxRef = 'INV-' + Math.floor(1000 + Math.random() * 9000);
    this.showTransactionModal.set(true);
  }

  closeTransactionModal() {
    this.showTransactionModal.set(false);
  }

  saveTransaction() {
    const tx: FieldTransaction = {
      id: 'tx-' + Date.now(),
      type: this.newTxType,
      category: this.newTxCategory || 'General',
      description: this.newTxDesc || 'Field expense',
      amount: this.newTxAmount || 0,
      date: new Date().toISOString().split('T')[0],
      referenceNo: this.newTxRef
    };
    this.transactions.update(list => [tx, ...list]);
    this.closeTransactionModal();
  }

  // --- Dossier & Sensor Helpers ---
  openDossierModal() {
    this.showDossierModal.set(true);
  }

  printDossier() {
    window.print();
  }

  exportPlantingHistory() {
    const rows = this.historyCycles().map(c => `"&#36;{c.crop}","&#36;{c.plantedDate}","&#36;{c.expectedHarvestDate}","&#36;{c.actualHarvestDate || 'Active'}"`).join('\n');
    const blob = new Blob([`Crop,Planted,ExpectedHarvest,ActualHarvest\n&#36;{rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planting-history-&#36;{this.field()?.name || 'field'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  syncSensors() {
    this.isSyncingSensors.set(true);
    setTimeout(() => {
      this.isSyncingSensors.set(false);
    }, 1200);
  }

  todayString(): string {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getActivityIcon(type: FieldActivity['type']): string {
    switch (type) {
      case 'PLANTING': return 'sprout';
      case 'SPRAYING': return 'flask-conical';
      case 'IRRIGATION': return 'droplets';
      case 'FERTILIZING': return 'activity';
      case 'SCOUTING': return 'eye';
      case 'TILLAGE': return 'tractor';
      case 'HARVEST': return 'wheat';
      default: return 'activity';
    }
  }

  getActivityBadgeClass(type: FieldActivity['type']): string {
    switch (type) {
      case 'PLANTING': return 'bg-emerald-100 text-emerald-700';
      case 'SPRAYING': return 'bg-purple-100 text-purple-700';
      case 'IRRIGATION': return 'bg-blue-100 text-blue-700';
      case 'FERTILIZING': return 'bg-teal-100 text-teal-700';
      case 'SCOUTING': return 'bg-amber-100 text-amber-700';
      case 'TILLAGE': return 'bg-stone-100 text-stone-700';
      case 'HARVEST': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getInputCategoryBadgeClass(category: FieldInputRecord['category']): string {
    switch (category) {
      case 'SEED': return 'bg-teal-100 text-teal-800';
      case 'FERTILIZER': return 'bg-emerald-100 text-emerald-800';
      case 'CHEMISTRY': return 'bg-purple-100 text-purple-800';
      case 'MACHINERY': return 'bg-amber-100 text-amber-800';
      case 'LABOUR': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  // --- Harvest Modal Actions ---
  openHarvestModal(cycle: PlantingCycleListResponse) {
    this.harvestTargetCycle.set(cycle);
    this.harvestDate = new Date().toISOString().split('T')[0];
    this.harvestYield = (cycle.crop || '').includes('Maize') ? 11.2 : 3.8;
    this.harvestMoisture = 14.8;
    this.harvestSilo = 'Silo Bin #04';
    this.harvestGrade = 'Grade 1 Certified Food Crop';
    this.harvestNotes = 'Harvest completed under optimal grain moisture conditions.';
    this.showHarvestModal.set(true);
  }

  closeHarvestModal() {
    this.showHarvestModal.set(false);
    this.harvestTargetCycle.set(null);
  }

  submitHarvest() {
    const target = this.harvestTargetCycle();
    if (!target) return;
    const completionDate = this.harvestDate || new Date().toISOString().split('T')[0];
    const updated = this.plantingCycles().map(c => {
      if (c.id === target.id) {
        return {
          ...c,
          actualHarvestDate: completionDate,
          targetYield: `${this.harvestYield} t/ha (Actual Recorded)`,
          currentStage: 'Harvest Completed',
          cycleProgressPercentage: 100
        };
      }
      return c;
    });
    this.plantingCycles.set(updated);
    if (this.selectedActiveCycleIndex() >= this.activeCycles().length) {
      this.selectedActiveCycleIndex.set(0);
    }
    this.closeHarvestModal();
  }

  // --- Add Active Cycle Modal Actions ---
  openAddCycleModal() {
    this.newCycleCrop = 'Soybeans (Enlist E3 Intercrop)';
    this.newCycleVariety = 'Enlist E3 High Protein 2.4RM';
    this.newCycleArea = 17.2;
    this.newCyclePattern = 'Intercrop Companion (South Sector)';
    this.newCyclePlantedDate = new Date().toISOString().split('T')[0];
    const exp = new Date();
    exp.setDate(exp.getDate() + 115);
    this.newCycleExpectedHarvest = exp.toISOString().split('T')[0];
    this.newCycleTargetYield = '3.8 t/ha';
    this.showAddCycleModal.set(true);
  }

  closeAddCycleModal() {
    this.showAddCycleModal.set(false);
  }

  onNewCycleCropChange(crop: string) {
    if (crop.includes('Cowpeas')) {
      this.newCycleVariety = 'Red Ripper Certified Biological';
      this.newCycleTargetYield = 'Soil Nitrogen Biomass (140 kg N/ha)';
    } else if (crop.includes('Sorghum')) {
      this.newCycleVariety = 'Phofu Dual Purpose Silage';
      this.newCycleTargetYield = '18.5 t/ha (Silage Wet Weight)';
    } else if (crop.includes('Alfalfa')) {
      this.newCycleVariety = 'WL 358LH High Protein Alfalfa';
      this.newCycleTargetYield = '8.2 t/ha';
    } else {
      this.newCycleVariety = 'Enlist E3 High Protein 2.4RM';
      this.newCycleTargetYield = '3.8 t/ha';
    }
  }

  submitNewActiveCycle() {
    const area = this.newCycleArea || 15.0;
    const totalFieldSize = this.field()?.size || 45.2;
    const newCycle: PlantingCycleListResponse = {
      id: 'pc-' + Date.now(),
      sid: `PC-2026-0${this.activeCycles().length + 1}`,
      crop: this.newCycleCrop,
      varietyName: this.newCycleVariety,
      plantedDate: this.newCyclePlantedDate || new Date().toISOString().split('T')[0],
      expectedHarvestDate: this.newCycleExpectedHarvest || '2026-10-25',
      actualHarvestDate: null,
      areaHa: area,
      allocationPercentage: Math.min(100, Math.round((area / totalFieldSize) * 100)),
      plantingPattern: this.newCyclePattern,
      currentStage: 'Emergence (VE)',
      cycleProgressPercentage: 12,
      daysAfterPlanting: 1,
      targetYield: this.newCycleTargetYield
    };
    this.plantingCycles.update(list => [newCycle, ...list]);
    this.selectedActiveCycleIndex.set(0);
    this.closeAddCycleModal();
  }
}
