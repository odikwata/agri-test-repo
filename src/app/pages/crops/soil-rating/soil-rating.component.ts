import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { SoilNotificationService } from '../../../services/soil-notification.service';

@Component({
  selector: 'app-soil-rating',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>OAKRIDGE CADASTRE / EDAPHIC SENSORS & AGRONOMY</span>
          </div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Soil Pedology & IoT Telemetry Cadastre</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              24 SENSORS ONLINE
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button (click)="syncSensors()" class="px-3.5 py-2 text-xs font-mono font-medium rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all flex items-center gap-2 shadow-xs cursor-pointer">
            <lucide-icon name="refresh-cw" class="w-3.5 h-3.5 text-stone-500"></lucide-icon>
            <span>POLL SENSORS</span>
          </button>
          <button class="px-4 py-2 bg-[#012d1d] hover:bg-[#023f29] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
            <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
            <span>PROVISION PROBE</span>
          </button>
        </div>
      </div>

      <!-- Bento KPI Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Average Health Grade -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Mean Soil Health Index</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <lucide-icon name="activity" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Grade A-</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Optimal Soil Microbiome & Humus</span>
          </div>
        </div>

        <!-- Active Sensors -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Active LoRaWAN Probes</span>
            <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <lucide-icon name="wifi" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">24 Probes</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-stone-600">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>100% Heartbeat Packet Reach</span>
          </div>
        </div>

        <!-- Mean pH -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Average Cadastre pH</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <lucide-icon name="flask-conical" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">6.85 pH</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Neutral / Slightly Acidic (Ideal)</span>
          </div>
        </div>

        <!-- Attention Alerts -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Fertigation Advisory</span>
            <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <lucide-icon name="alert-triangle" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">1 Field Notice</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-amber-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>South Pivot: Low Moisture</span>
          </div>
        </div>
      </div>

      <!-- Field Soil Health Cards -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-stone-800">Telemetry By Cadastre Management Unit</span>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          @for (field of fields(); track field.id) {
            <div class="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-stone-900 text-base">{{ field.name }}</h4>
                    <span class="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-mono font-bold rounded-md uppercase border border-stone-200">
                      {{ field.crop }}
                    </span>
                  </div>
                  <p class="text-xs font-mono text-stone-400 mt-1 flex items-center gap-1">
                    <lucide-icon name="clock" class="w-3 h-3 text-stone-400"></lucide-icon>
                    <span>Pinged: {{ field.lastUpdated }}</span>
                  </p>
                </div>
                
                <div class="flex flex-col items-center justify-center w-11 h-11 rounded-xl font-mono font-extrabold text-base border"
                     [class]="getRatingBgClass(field.rating)">
                  <span>{{ field.rating }}</span>
                </div>
              </div>

              <!-- Main Sensor Metrics -->
              <div class="grid grid-cols-3 gap-2.5">
                <div class="p-3 bg-stone-50 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-center">
                  <lucide-icon name="droplets" class="w-4 h-4 text-blue-600 mb-1"></lucide-icon>
                  <p class="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Moisture</p>
                  <p class="text-sm font-mono font-bold text-stone-900">{{ field.metrics.moisture }}%</p>
                </div>
                <div class="p-3 bg-stone-50 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-center">
                  <lucide-icon name="thermometer" class="w-4 h-4 text-orange-600 mb-1"></lucide-icon>
                  <p class="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Soil Temp</p>
                  <p class="text-sm font-mono font-bold text-stone-900">{{ field.metrics.temp }}°C</p>
                </div>
                <div class="p-3 bg-stone-50 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-center">
                  <lucide-icon name="flask-conical" class="w-4 h-4 text-purple-600 mb-1"></lucide-icon>
                  <p class="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">pH Index</p>
                  <p class="text-sm font-mono font-bold text-stone-900">{{ field.metrics.ph }}</p>
                </div>
              </div>

              <!-- NPK Levels Progress Bars -->
              <div class="space-y-2.5 pt-2 border-t border-stone-100">
                <span class="text-[11px] font-mono font-bold text-stone-600 uppercase tracking-wider block">NPK Macro-Nutrients (mg/kg)</span>
                
                <div>
                  <div class="flex justify-between items-center text-xs font-mono mb-1 text-stone-600">
                    <span>Nitrogen (N)</span>
                    <span class="font-bold text-stone-800">{{ field.metrics.nitrogen }} mg/kg</span>
                  </div>
                  <div class="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" [class]="getMetricColorClass('N', field.metrics.nitrogen)" [style.width.%]="(field.metrics.nitrogen / 80) * 100"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center text-xs font-mono mb-1 text-stone-600">
                    <span>Phosphorus (P)</span>
                    <span class="font-bold text-stone-800">{{ field.metrics.phosphorus }} mg/kg</span>
                  </div>
                  <div class="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" [class]="getMetricColorClass('P', field.metrics.phosphorus)" [style.width.%]="(field.metrics.phosphorus / 60) * 100"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center text-xs font-mono mb-1 text-stone-600">
                    <span>Potassium (K)</span>
                    <span class="font-bold text-stone-800">{{ field.metrics.potassium }} mg/kg</span>
                  </div>
                  <div class="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" [class]="getMetricColorClass('K', field.metrics.potassium)" [style.width.%]="(field.metrics.potassium / 120) * 100"></div>
                  </div>
                </div>
              </div>

              @if (field.alerts.length > 0) {
                <div class="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex gap-2 items-start">
                  <lucide-icon name="alert-triangle" class="w-4 h-4 text-amber-700 mt-0.5 shrink-0"></lucide-icon>
                  <div class="space-y-0.5">
                    @for (alert of field.alerts; track alert) {
                      <p class="text-xs font-mono font-medium text-amber-900">{{ alert }}</p>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SoilRatingComponent {
  soilService = inject(SoilNotificationService);
  
  fields = signal([
    {
      id: 'f1',
      name: 'North Pivot Field A',
      crop: 'Pioneer P1197 Yellow Corn',
      lastUpdated: '5 mins ago',
      rating: 'A',
      metrics: { moisture: 34, temp: 19.2, ph: 6.8, nitrogen: 65, phosphorus: 45, potassium: 90 },
      alerts: []
    },
    {
      id: 'f2',
      name: 'East Terrace Paddock 03',
      crop: 'Phofu Drought Sorghum',
      lastUpdated: '12 mins ago',
      rating: 'A-',
      metrics: { moisture: 28, temp: 22.0, ph: 6.6, nitrogen: 58, phosphorus: 40, potassium: 78 },
      alerts: []
    },
    {
      id: 'f3',
      name: 'West River Alluvial Plot',
      crop: 'Yukon Gold Seed Potatoes',
      lastUpdated: '1 min ago',
      rating: 'B+',
      metrics: { moisture: 31, temp: 18.0, ph: 6.3, nitrogen: 52, phosphorus: 48, potassium: 95 },
      alerts: []
    },
    {
      id: 'f4',
      name: 'South Slope Paddock 07',
      crop: 'Cover Cowpeas & Alfalfa',
      lastUpdated: 'Just now',
      rating: 'C+',
      metrics: { moisture: 16, temp: 24.2, ph: 7.1, nitrogen: 32, phosphorus: 26, potassium: 48 },
      alerts: ['Low volumetric water content (16%) — Pivot run advised', 'Nitrogen below cover target']
    }
  ]);

  syncSensors() {
    for (const f of this.fields()) {
      this.soilService.evaluateFieldSoil({
        fieldId: f.id,
        fieldName: f.name,
        cropName: f.crop,
        moisture: f.metrics.moisture,
        ph: f.metrics.ph,
        nitrogen: f.metrics.nitrogen,
        phosphorus: f.metrics.phosphorus,
        potassium: f.metrics.potassium
      });
    }
  }

  getRatingBgClass(rating: string): string {
    if (rating.startsWith('A')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (rating.startsWith('B')) return 'bg-blue-50 text-blue-800 border-blue-200';
    if (rating.startsWith('C')) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-red-50 text-red-800 border-red-200';
  }

  getMetricColorClass(metric: string, value: number): string {
    if (metric === 'N') return value >= 40 ? 'bg-emerald-600' : 'bg-amber-500';
    if (metric === 'P') return value >= 30 ? 'bg-emerald-600' : 'bg-amber-500';
    if (metric === 'K') return value >= 60 ? 'bg-emerald-600' : 'bg-amber-500';
    return 'bg-stone-400';
  }
}
