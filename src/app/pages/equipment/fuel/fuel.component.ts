import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface FuelTank {
  id: string;
  name: string;
  fuelType: string;
  currentGallons: number;
  capacityGallons: number;
  temperatureF: number;
  waterBottomInches: number;
  sensorStatus: string;
}

interface FuelLog {
  id: string;
  date: string;
  machineName: string;
  operator: string;
  fuelType: string;
  gallons: number;
  unitPrice: number;
  totalCost: number;
  pumpId: string;
}

@Component({
  selector: 'app-fuel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>OAKRIDGE CADASTRE / FUEL RESERVES & FLOW SENSORS</span>
          </div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Fleet Fuel Tracking & Storage Silo Telemetry</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              FLOW METERS CALIBRATED
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button (click)="openDispenseModal()" class="px-4 py-2 bg-[#012d1d] hover:bg-[#023f29] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
            <lucide-icon name="fuel" class="w-3.5 h-3.5"></lucide-icon>
            <span>LOG FUEL DISPENSE</span>
          </button>
        </div>
      </div>

      <!-- Bento KPI Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Fuel in Silos -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Bulk Diesel Reserves</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <lucide-icon name="fuel" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">16,420 Gal</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>74.6% Combined Tank Capacity</span>
          </div>
        </div>

        <!-- 7-Day Consumption -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">7-Day Fleet Burn</span>
            <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <lucide-icon name="activity" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">2,180 Gal</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-stone-600">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Active Tillage & Harvest Load</span>
          </div>
        </div>

        <!-- Average Fuel Cost -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Avg Fuel Cost</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <lucide-icon name="dollar-sign" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">$3.42 / Gal</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Bulk Contract Rate #OIL-49</span>
          </div>
        </div>

        <!-- Reserve Runway -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Fuel Autonomy Runway</span>
            <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <lucide-icon name="clock" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">52 Days</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-stone-600">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Refill scheduled for Nov 15</span>
          </div>
        </div>
      </div>

      <!-- Storage Tanks Telemetry Cards -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-stone-800">Bulk Silo & Storage Tanks Telemetry</span>
          <span class="text-xs font-mono text-stone-500">3 Calibrated Smart Tanks</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (tank of tanks(); track tank.id) {
            <div class="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">{{ tank.id }}</span>
                  <h4 class="text-base font-bold text-stone-900 mt-0.5">{{ tank.name }}</h4>
                  <p class="text-xs font-mono text-stone-500">{{ tank.fuelType }}</p>
                </div>
                <span class="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200 uppercase">
                  {{ tank.sensorStatus }}
                </span>
              </div>

              <!-- Fuel Level Bar -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-mono text-stone-600">
                  <span class="font-bold text-stone-900">{{ tank.currentGallons | number }} Gal</span>
                  <span>Cap: {{ tank.capacityGallons | number }} Gal</span>
                </div>
                <div class="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-600 rounded-full"
                       [style.width.%]="(tank.currentGallons / tank.capacityGallons) * 100"></div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-center font-mono text-xs">
                <div class="bg-stone-50 p-2 rounded-xl border border-stone-100">
                  <span class="text-stone-400 block text-[10px]">TEMP</span>
                  <span class="font-bold text-stone-800">{{ tank.temperatureF }}°F</span>
                </div>
                <div class="bg-stone-50 p-2 rounded-xl border border-stone-100">
                  <span class="text-stone-400 block text-[10px]">WATER LEVEL</span>
                  <span class="font-bold text-stone-800">{{ tank.waterBottomInches }}" (Clear)</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Fuel Dispensing Log Table -->
      <div class="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-stone-800">Recent Fuel Dispense Log</span>
            <span class="px-2 py-0.5 text-[11px] font-mono rounded-full bg-stone-200/70 text-stone-700">{{ logs().length }} Records</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">Date / Time</th>
                <th class="px-6 py-3.5">Machine / Fleet Unit</th>
                <th class="px-6 py-3.5">Operator</th>
                <th class="px-6 py-3.5">Fuel Type</th>
                <th class="px-6 py-3.5">Volume (Gal)</th>
                <th class="px-6 py-3.5 text-right">Cost ($ USD)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              @for (log of logs(); track log.id) {
                <tr class="hover:bg-stone-50/70 transition-colors">
                  <td class="px-6 py-4 font-mono text-xs text-stone-600">{{ log.date }}</td>
                  <td class="px-6 py-4 font-bold text-stone-900">{{ log.machineName }}</td>
                  <td class="px-6 py-4 text-xs font-mono text-stone-700">{{ log.operator }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border bg-stone-100 text-stone-800 border-stone-200 uppercase">
                      {{ log.fuelType }}
                    </span>
                  </td>
                  <td class="px-6 py-4 font-mono font-bold text-stone-900">{{ log.gallons }} Gal</td>
                  <td class="px-6 py-4 text-right font-mono font-bold text-emerald-800">
                    {{ log.totalCost | currency }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Log Dispense Modal -->
      @if (showDispenseModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-xl">
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                <h3 class="text-lg font-bold text-stone-900">Record Fuel Dispensation</h3>
              </div>
              <button (click)="showDispenseModal.set(false)" class="text-stone-400 hover:text-stone-600 cursor-pointer">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <div class="space-y-4 text-xs font-mono">
              <div>
                <label class="block font-bold text-stone-700 mb-1">TARGET FLEET MACHINE</label>
                <select [(ngModel)]="dispenseForm.machineName"
                        class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                  <option value="John Deere 5075E Utility Tractor">John Deere 5075E Utility Tractor</option>
                  <option value="John Deere S780 Combine Harvester">John Deere S780 Combine Harvester</option>
                  <option value="Case IH Magnum 340 Tractor">Case IH Magnum 340 Tractor</option>
                  <option value="Freightliner Cascadia Grain Hauler">Freightliner Cascadia Grain Hauler</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-stone-700 mb-1">OPERATOR</label>
                  <input type="text" [(ngModel)]="dispenseForm.operator"
                         class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-stone-700 mb-1">STORAGE TANK</label>
                  <select [(ngModel)]="dispenseForm.pumpId"
                          class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                    <option value="TANK-01">Tank 01 (Off-Road Diesel #2)</option>
                    <option value="TANK-02">Tank 02 (ULSD Road Diesel)</option>
                    <option value="TANK-03">Tank 03 (Bio-Diesel B20)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block font-bold text-stone-700 mb-1">GALLONS DISPENSED</label>
                <input type="number" [(ngModel)]="dispenseForm.gallons" placeholder="0"
                       class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button (click)="showDispenseModal.set(false)" class="px-4 py-2 border border-stone-200 text-stone-600 font-mono text-xs rounded-xl hover:bg-stone-50 cursor-pointer">
                CANCEL
              </button>
              <button (click)="submitDispense()" [disabled]="!dispenseForm.gallons"
                      class="px-5 py-2 bg-[#012d1d] hover:bg-[#023f29] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer">
                RECORD DISPENSE
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class FuelComponent {
  showDispenseModal = signal(false);

  tanks = signal<FuelTank[]>([
    {
      id: 'TANK-01',
      name: 'Main Machinery Yard Tank',
      fuelType: 'Off-Road Red Dye Diesel #2',
      currentGallons: 8420,
      capacityGallons: 10000,
      temperatureF: 62.4,
      waterBottomInches: 0.1,
      sensorStatus: 'ONLINE'
    },
    {
      id: 'TANK-02',
      name: 'Highway Logistics Depot',
      fuelType: 'Ultra-Low Sulfur Diesel (ULSD)',
      currentGallons: 5200,
      capacityGallons: 8000,
      temperatureF: 61.8,
      waterBottomInches: 0.05,
      sensorStatus: 'ONLINE'
    },
    {
      id: 'TANK-03',
      name: 'Green Energy Reserve',
      fuelType: 'B20 Bio-Diesel Renewable Blend',
      currentGallons: 2800,
      capacityGallons: 4000,
      temperatureF: 64.0,
      waterBottomInches: 0.0,
      sensorStatus: 'ONLINE'
    }
  ]);

  logs = signal<FuelLog[]>([
    {
      id: 'FL-902',
      date: 'Today, 08:30 AM',
      machineName: 'John Deere S780 Combine Harvester',
      operator: 'Marcus Vance',
      fuelType: 'Off-Road Diesel #2',
      gallons: 220,
      unitPrice: 3.42,
      totalCost: 752.40,
      pumpId: 'TANK-01'
    },
    {
      id: 'FL-901',
      date: 'Yesterday, 04:15 PM',
      machineName: 'John Deere 5075E Utility Tractor',
      operator: 'Dave Sterling',
      fuelType: 'Off-Road Diesel #2',
      gallons: 45,
      unitPrice: 3.42,
      totalCost: 153.90,
      pumpId: 'TANK-01'
    },
    {
      id: 'FL-900',
      date: 'Oct 02, 11:20 AM',
      machineName: 'Freightliner Cascadia Grain Hauler',
      operator: 'Tom Bradley',
      fuelType: 'ULSD Road Diesel',
      gallons: 140,
      unitPrice: 3.78,
      totalCost: 529.20,
      pumpId: 'TANK-02'
    }
  ]);

  dispenseForm = {
    machineName: 'John Deere S780 Combine Harvester',
    operator: 'Marcus Vance',
    pumpId: 'TANK-01',
    gallons: 100
  };

  openDispenseModal() {
    this.dispenseForm = {
      machineName: 'John Deere S780 Combine Harvester',
      operator: 'Marcus Vance',
      pumpId: 'TANK-01',
      gallons: 100
    };
    this.showDispenseModal.set(true);
  }

  submitDispense() {
    if (!this.dispenseForm.gallons) return;
    const price = this.dispenseForm.pumpId === 'TANK-02' ? 3.78 : 3.42;
    const newLog: FuelLog = {
      id: 'FL-' + Math.floor(Math.random() * 900 + 100),
      date: 'Just now',
      machineName: this.dispenseForm.machineName,
      operator: this.dispenseForm.operator,
      fuelType: this.dispenseForm.pumpId === 'TANK-02' ? 'ULSD Road Diesel' : 'Off-Road Diesel #2',
      gallons: Number(this.dispenseForm.gallons),
      unitPrice: price,
      totalCost: Number(this.dispenseForm.gallons) * price,
      pumpId: this.dispenseForm.pumpId
    };
    this.logs.update(current => [newLog, ...current]);
    
    // Decrement tank
    this.tanks.update(tanks => tanks.map(t => {
      if (t.id === this.dispenseForm.pumpId) {
        return { ...t, currentGallons: Math.max(0, t.currentGallons - Number(this.dispenseForm.gallons)) };
      }
      return t;
    }));

    this.showDispenseModal.set(false);
  }
}
