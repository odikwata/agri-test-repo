import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SoilNotificationService, SoilAlert, CropSoilThreshold } from '../services/soil-notification.service';

@Component({
  selector: 'app-soil-alert-banner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="flex flex-col gap-4">
      <!-- Main Container -->
      <div class="rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm"
           [ngClass]="soilService.criticalAlertsCount() > 0 
              ? 'bg-red-50/40 border-red-200' 
              : soilService.warningAlertsCount() > 0 
                ? 'bg-amber-50/40 border-amber-200' 
                : 'bg-emerald-50/40 border-emerald-200'">
        
        <!-- Header Bar -->
        <div class="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3"
             [ngClass]="soilService.criticalAlertsCount() > 0 
                ? 'border-red-100 bg-red-100/40' 
                : soilService.warningAlertsCount() > 0 
                  ? 'border-amber-100 bg-amber-100/40' 
                  : 'border-emerald-100 bg-emerald-100/40'">
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                 [ngClass]="soilService.criticalAlertsCount() > 0 
                    ? 'bg-red-600 text-white' 
                    : soilService.warningAlertsCount() > 0 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-emerald-600 text-white'">
              <lucide-icon [name]="soilService.criticalAlertsCount() > 0 ? 'triangle-alert' : soilService.warningAlertsCount() > 0 ? 'droplets' : 'circle-check'" 
                           class="w-5 h-5"></lucide-icon>
            </div>
            
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base font-black text-slate-900 tracking-tight">
                  Soil Moisture & pH Health Alerts
                </h2>
                @if (soilService.activeAlerts().length > 0) {
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider"
                        [ngClass]="soilService.criticalAlertsCount() > 0 ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'">
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
                          [ngClass]="soilService.criticalAlertsCount() > 0 ? 'bg-red-600' : 'bg-amber-600'"></span>
                    {{ soilService.activeAlerts().length }} Field Deviation{{ soilService.activeAlerts().length > 1 ? 's' : '' }}
                  </span>
                } @else {
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-800 uppercase tracking-wider">
                    All Optimal
                  </span>
                }
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                Automated continuous monitoring against crop-specific agronomic moisture & pH thresholds.
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2">
            <button (click)="showThresholdsModal.set(true)"
                    class="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors">
              <lucide-icon name="settings" class="w-3.5 h-3.5 text-slate-500"></lucide-icon>
              Optimal Thresholds Guide
            </button>

            <button (click)="showSimulatorModal.set(true)"
                    class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors">
              <lucide-icon name="play" class="w-3.5 h-3.5 text-emerald-400"></lucide-icon>
              Simulate Deviation
            </button>

            @if (soilService.activeAlerts().length === 0) {
              <button (click)="soilService.resetSampleAlerts()"
                      class="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors">
                <lucide-icon name="rotate-cw" class="w-3.5 h-3.5 text-slate-500"></lucide-icon>
                Reset Demo Alerts
              </button>
            }
          </div>
        </div>

        <!-- Alert Items Body -->
        <div class="p-6">
          @if (soilService.activeAlerts().length === 0) {
            <!-- All Healthy Empty State -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-xl border border-emerald-200 shadow-2xs">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <lucide-icon name="circle-check" class="w-6 h-6"></lucide-icon>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900">All Field Soils Are Within Optimal Ranges</h3>
                  <p class="text-xs text-slate-500 mt-0.5">
                    Sensor telemetry indicates soil moisture and pH across Potato, Soybeans, Corn, and Wheat fields match target crop parameters.
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button (click)="soilService.resetSampleAlerts()" 
                        class="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors">
                  Load Realistic Deviations
                </button>
                <button (click)="showSimulatorModal.set(true)"
                        class="px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors">
                  Test Alert Trigger
                </button>
              </div>
            </div>
          } @else {
            <div class="space-y-4">
              @for (alert of soilService.activeAlerts(); track alert.id) {
                <div class="p-5 bg-white rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-sm"
                     [ngClass]="alert.severity === 'critical' ? 'border-red-200 hover:border-red-300' : 'border-amber-200 hover:border-amber-300'">
                  
                  <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    <!-- Alert Details -->
                    <div class="flex-1 space-y-3">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider"
                              [ngClass]="alert.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'">
                          {{ alert.severity === 'critical' ? 'CRITICAL DEVIATION' : 'WARNING DEVIATION' }}
                        </span>

                        <span class="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                          {{ alert.fieldName }}
                        </span>

                        <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          Crop: {{ alert.cropName }}
                        </span>

                        <span class="text-[11px] text-slate-400 font-medium ml-auto sm:ml-0">
                          Detected {{ getTimeAgo(alert.timestamp) }}
                        </span>
                      </div>

                      <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                        @if (alert.parameter === 'moisture') {
                          <lucide-icon name="droplets" class="w-4 h-4 text-blue-500"></lucide-icon>
                        } @else if (alert.parameter === 'ph') {
                          <lucide-icon name="flask-conical" class="w-4 h-4 text-purple-500"></lucide-icon>
                        } @else {
                          <lucide-icon name="triangle-alert" class="w-4 h-4 text-red-500"></lucide-icon>
                        }
                        {{ alert.title }}
                      </h3>

                      <p class="text-xs text-slate-600 leading-relaxed">
                        {{ alert.message }}
                      </p>

                      <!-- Deviation Telemetry Indicators -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        @if (alert.currentMoisture !== undefined && alert.expectedMoistureRange) {
                          <div class="p-3 rounded-lg border flex flex-col justify-between"
                               [ngClass]="(alert.currentMoisture < alert.expectedMoistureRange.min || alert.currentMoisture > alert.expectedMoistureRange.max)
                                  ? 'bg-blue-50/50 border-blue-200' 
                                  : 'bg-slate-50 border-slate-200'">
                            <div class="flex items-center justify-between text-xs mb-1">
                              <span class="font-bold text-slate-700 flex items-center gap-1.5">
                                <lucide-icon name="droplets" class="w-3.5 h-3.5 text-blue-500"></lucide-icon>
                                Soil Moisture
                              </span>
                              <span class="font-black text-sm"
                                    [ngClass]="(alert.currentMoisture < alert.expectedMoistureRange.min || alert.currentMoisture > alert.expectedMoistureRange.max)
                                      ? 'text-red-600' : 'text-slate-800'">
                                {{ alert.currentMoisture }}%
                              </span>
                            </div>

                            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-1 relative">
                              <div class="h-full rounded-full"
                                   [style.width.%]="mathMin(alert.currentMoisture * 1.5, 100)"
                                   [ngClass]="alert.currentMoisture < alert.expectedMoistureRange.min ? 'bg-amber-500' : alert.currentMoisture > alert.expectedMoistureRange.max ? 'bg-blue-600' : 'bg-emerald-500'"></div>
                            </div>

                            <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1">
                              <span>Optimal for {{ alert.cropName }}: {{ alert.expectedMoistureRange.min }}% - {{ alert.expectedMoistureRange.max }}%</span>
                              @if (alert.moistureDeviationText) {
                                <span class="text-red-600 font-extrabold">{{ alert.moistureDeviationText }}</span>
                              }
                            </div>
                          </div>
                        }

                        @if (alert.currentPh !== undefined && alert.expectedPhRange) {
                          <div class="p-3 rounded-lg border flex flex-col justify-between"
                               [ngClass]="(alert.currentPh < alert.expectedPhRange.min || alert.currentPh > alert.expectedPhRange.max)
                                  ? 'bg-purple-50/50 border-purple-200' 
                                  : 'bg-slate-50 border-slate-200'">
                            <div class="flex items-center justify-between text-xs mb-1">
                              <span class="font-bold text-slate-700 flex items-center gap-1.5">
                                <lucide-icon name="flask-conical" class="w-3.5 h-3.5 text-purple-500"></lucide-icon>
                                Soil pH Level
                              </span>
                              <span class="font-black text-sm"
                                    [ngClass]="(alert.currentPh < alert.expectedPhRange.min || alert.currentPh > alert.expectedPhRange.max)
                                      ? 'text-red-600' : 'text-slate-800'">
                                pH {{ alert.currentPh }}
                              </span>
                            </div>

                            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-1 relative">
                              <div class="h-full rounded-full"
                                   [style.width.%]="mathMin((alert.currentPh / 10) * 100, 100)"
                                   [ngClass]="alert.currentPh < alert.expectedPhRange.min ? 'bg-amber-500' : alert.currentPh > alert.expectedPhRange.max ? 'bg-purple-600' : 'bg-emerald-500'"></div>
                            </div>

                            <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1">
                              <span>Optimal for {{ alert.cropName }}: {{ alert.expectedPhRange.min }} - {{ alert.expectedPhRange.max }}</span>
                              @if (alert.phDeviationText) {
                                <span class="text-red-600 font-extrabold">{{ alert.phDeviationText }}</span>
                              }
                            </div>
                          </div>
                        }
                      </div>

                      <!-- Agronomic Recommendation -->
                      <div class="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5">
                        <lucide-icon name="lightbulb" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></lucide-icon>
                        <div class="text-xs text-amber-900">
                          <span class="font-bold">Agronomic Action Plan: </span>
                          {{ alert.recommendation }}
                        </div>
                      </div>
                    </div>

                    <!-- Action Controls -->
                    <div class="flex lg:flex-col gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                      <a [routerLink]="['/crops/view', alert.fieldId]"
                         class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors">
                        <lucide-icon name="eye" class="w-3.5 h-3.5"></lucide-icon>
                        View Field & Sensors
                      </a>

                      <button (click)="soilService.resolveAlert(alert.id)"
                              class="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors">
                        <lucide-icon name="check" class="w-3.5 h-3.5 text-emerald-600"></lucide-icon>
                        Mark Resolved
                      </button>

                      <button (click)="soilService.dismissAlert(alert.id)"
                              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                        <lucide-icon name="x" class="w-3.5 h-3.5"></lucide-icon>
                        Dismiss
                      </button>
                    </div>

                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Thresholds Reference Modal -->
      @if (showThresholdsModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <lucide-icon name="settings" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-900">Crop-Specific Soil Optimal Ranges</h3>
                  <p class="text-xs text-slate-500">The notification engine evaluates field telemetry against these agronomic baselines.</p>
                </div>
              </div>
              <button (click)="showThresholdsModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (entry of getThresholdList(); track entry.cropKey) {
                  <div class="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                    <div class="flex items-center justify-between">
                      <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {{ entry.cropName }}
                      </h4>
                      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 bg-white border border-slate-200 rounded">
                        Key: {{ entry.cropKey }}
                      </span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div class="p-2 bg-white rounded-lg border border-slate-100">
                        <p class="text-[10px] font-bold uppercase text-blue-500">Optimal Moisture</p>
                        <p class="text-sm font-black text-slate-800 mt-0.5">
                          {{ entry.optimalMoisture.min }}% - {{ entry.optimalMoisture.max }}%
                        </p>
                      </div>

                      <div class="p-2 bg-white rounded-lg border border-slate-100">
                        <p class="text-[10px] font-bold uppercase text-purple-500">Optimal pH</p>
                        <p class="text-sm font-black text-slate-800 mt-0.5">
                          pH {{ entry.optimalPh.min }} - {{ entry.optimalPh.max }}
                        </p>
                      </div>
                    </div>

                    <p class="text-[11px] text-slate-600 leading-normal pt-1">
                      {{ entry.description }}
                    </p>
                  </div>
                }
              </div>
            </div>

            <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button (click)="soilService.resetThresholds()" class="text-xs font-bold text-slate-500 hover:text-slate-800">
                Reset to Standard Agricultural Norms
              </button>
              <button (click)="showThresholdsModal.set(false)" 
                      class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Simulator Modal -->
      @if (showSimulatorModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                  <lucide-icon name="play" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-900">Simulate Sensor Deviation</h3>
                  <p class="text-xs text-slate-500">Instantly test notifications for any crop and metric.</p>
                </div>
              </div>
              <button (click)="showSimulatorModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target Crop</label>
                <select [(ngModel)]="simCropKey" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white outline-none">
                  <option value="potato">Potato (Optimal: 30-45% moisture, 5.0-6.5 pH)</option>
                  <option value="soybean">Soybeans (Optimal: 22-35% moisture, 6.0-6.8 pH)</option>
                  <option value="wheat">Winter Wheat (Optimal: 25-40% moisture, 6.0-7.0 pH)</option>
                  <option value="corn">Yellow Corn (Optimal: 25-38% moisture, 5.8-7.0 pH)</option>
                  <option value="canola">Winter Canola (Optimal: 20-32% moisture, 6.0-7.5 pH)</option>
                  <option value="tomato">Tomato (Optimal: 28-42% moisture, 6.0-6.8 pH)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Field Name</label>
                <input type="text" [(ngModel)]="simFieldName" placeholder="e.g. North Valley Block 2"
                       class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white outline-none"/>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preset Deviation Scenario</label>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="runSimulation('low_moisture')"
                          class="p-3 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-xl text-left transition-all group">
                    <p class="text-xs font-bold text-slate-800 group-hover:text-amber-700 flex items-center gap-1.5">
                      <lucide-icon name="droplets" class="w-3.5 h-3.5 text-blue-500"></lucide-icon>
                      Low Moisture
                    </p>
                    <p class="text-[10px] text-slate-500 mt-1">Drops 10% below minimum threshold</p>
                  </button>

                  <button (click)="runSimulation('high_moisture')"
                          class="p-3 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-left transition-all group">
                    <p class="text-xs font-bold text-slate-800 group-hover:text-blue-700 flex items-center gap-1.5">
                      <lucide-icon name="droplets" class="w-3.5 h-3.5 text-blue-600"></lucide-icon>
                      Waterlogging
                    </p>
                    <p class="text-[10px] text-slate-500 mt-1">Exceeds upper moisture limit</p>
                  </button>

                  <button (click)="runSimulation('alkaline_ph')"
                          class="p-3 border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 rounded-xl text-left transition-all group">
                    <p class="text-xs font-bold text-slate-800 group-hover:text-purple-700 flex items-center gap-1.5">
                      <lucide-icon name="flask-conical" class="w-3.5 h-3.5 text-purple-500"></lucide-icon>
                      Alkaline pH
                    </p>
                    <p class="text-[10px] text-slate-500 mt-1">Elevated pH above crop safe limit</p>
                  </button>

                  <button (click)="runSimulation('severe_both')"
                          class="p-3 border border-red-200 hover:border-red-400 hover:bg-red-50/50 rounded-xl text-left transition-all group">
                    <p class="text-xs font-bold text-slate-800 group-hover:text-red-700 flex items-center gap-1.5">
                      <lucide-icon name="triangle-alert" class="w-3.5 h-3.5 text-red-500"></lucide-icon>
                      Compound Risk
                    </p>
                    <p class="text-[10px] text-slate-500 mt-1">Both moisture deficit & pH spike</p>
                  </button>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button (click)="showSimulatorModal.set(false)" 
                      class="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class SoilAlertBannerComponent {
  soilService = inject(SoilNotificationService);

  showThresholdsModal = signal(false);
  showSimulatorModal = signal(false);

  simCropKey = 'potato';
  simFieldName = 'Plot 4 - River Road';

  mathMin(a: number, b: number) {
    return Math.min(a, b);
  }

  getThresholdList(): CropSoilThreshold[] {
    const map = this.soilService.thresholds();
    return Object.values(map);
  }

  runSimulation(type: 'low_moisture' | 'high_moisture' | 'acidic_ph' | 'alkaline_ph' | 'severe_both') {
    this.soilService.simulateDeviation({
      cropKey: this.simCropKey,
      fieldName: this.simFieldName,
      deviationType: type
    });
    this.showSimulatorModal.set(false);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }
}
