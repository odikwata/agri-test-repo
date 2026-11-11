import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>OAKRIDGE CADASTRE / FLEET WORKSHOP & ENGINE TELEMETRY</span>
          </div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Equipment Maintenance & Workshop Log</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              CAN-BUS SYNCED
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a routerLink="/equipment/inventory" class="px-3.5 py-2 text-xs font-mono font-medium rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all flex items-center gap-2 shadow-xs">
            <lucide-icon name="package" class="w-3.5 h-3.5 text-stone-500"></lucide-icon>
            <span>PARTS INVENTORY</span>
          </a>
          <button (click)="openRecordModal()" class="px-4 py-2 bg-[#012d1d] hover:bg-[#023f29] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
            <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
            <span>RECORD SERVICE</span>
          </button>
        </div>
      </div>

      <!-- Bento KPI Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Overdue Service -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Overdue Service</span>
            <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-700">
              <lucide-icon name="alert-circle" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">1 Machine</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-red-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>John Deere 5075E (Oil Change)</span>
          </div>
        </div>

        <!-- Upcoming (7 Days) -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Upcoming in 7 Days</span>
            <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <lucide-icon name="clock" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">3 Machines</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-amber-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Combine, Baler, Irrigation Pump</span>
          </div>
        </div>

        <!-- Completed (30 Days) -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Completed (30D)</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">12 Work Orders</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-700">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Total Maintenance Spend: $3,450</span>
          </div>
        </div>

        <!-- Fleet Health -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">Fleet Telemetry Uptime</span>
            <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <lucide-icon name="tractor" class="w-4 h-4"></lucide-icon>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">96.8%</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-xs font-mono text-stone-600">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>18 of 19 Fleet Units Operational</span>
          </div>
        </div>
      </div>

      <!-- Maintenance Schedule Table -->
      <div class="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-stone-800">Fleet Maintenance Cadastre & Service Cycles</span>
            <span class="px-2 py-0.5 text-[11px] font-mono rounded-full bg-stone-200/70 text-stone-700">{{ schedule.length }} Units</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">Equipment / Machine</th>
                <th class="px-6 py-3.5">Service Type</th>
                <th class="px-6 py-3.5">Last Service</th>
                <th class="px-6 py-3.5">Next Due</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              @for (item of schedule; track item.id) {
                <tr class="hover:bg-stone-50/70 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <span class="font-bold text-stone-900">{{ item.equipment }}</span>
                      <span class="text-xs font-mono text-stone-400">ID: {{ item.id }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-xs font-mono text-stone-700">{{ item.serviceType }}</td>
                  <td class="px-6 py-4 text-xs font-mono text-stone-500">{{ item.lastService }}</td>
                  <td class="px-6 py-4 text-xs font-mono font-bold text-stone-900">{{ item.nextDue }}</td>
                  <td class="px-6 py-4">
                    <span [class]="getStatusClass(item.status)" class="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border uppercase">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="recordMaintenance(item)" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer">
                      RECORD
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Record Maintenance Modal -->
      @if (showRecordModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div class="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-stone-200 shadow-xl">
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                <h3 class="text-lg font-bold text-stone-900">Record Workshop Event</h3>
              </div>
              <button (click)="showRecordModal.set(false)" class="text-stone-400 hover:text-stone-600 cursor-pointer">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <form [formGroup]="maintenanceForm" (ngSubmit)="onRecordSubmit()" class="space-y-4 text-xs font-mono">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block font-bold text-stone-700 mb-1">EQUIPMENT</label>
                  <select formControlName="equipmentId" class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                    <option value="">Select Equipment</option>
                    @for (eq of schedule; track eq.id) {
                      <option [value]="eq.id">{{ eq.equipment }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-stone-700 mb-1">SERVICE TYPE</label>
                  <input type="text" formControlName="serviceType" class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                </div>
              </div>

              <div>
                <label class="block font-bold text-stone-700 mb-1">PARTS CONSUMED FROM INVENTORY</label>
                <div class="space-y-2" formArrayName="parts">
                  @for (part of parts.controls; track $index; let i = $index) {
                    <div [formGroupName]="i" class="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <select formControlName="id" class="flex-1 px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs bg-white">
                        <option value="">Select Part</option>
                        @for (inv of inventory; track inv.id) {
                          <option [value]="inv.id">{{ inv.name }} ({{ inv.stock }} available)</option>
                        }
                      </select>
                      <input type="number" formControlName="quantity" placeholder="Qty" class="w-16 px-2 py-1.5 border border-stone-200 rounded-lg text-xs">
                      <span class="font-bold text-stone-900 w-20 text-right">{{ calculatePartTotal(i) | currency }}</span>
                      <button type="button" (click)="removePart(i)" class="text-red-500 hover:text-red-700 cursor-pointer">
                        <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                      </button>
                    </div>
                  }
                  <button type="button" (click)="addPart()" class="text-xs font-mono font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer">
                    <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                    ADD PART RECORD
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-bold text-stone-700 mb-1">LABOR COST ($)</label>
                  <input type="number" formControlName="laborCost" class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white">
                </div>
                <div>
                  <label class="block font-bold text-stone-700 mb-1">TOTAL WORK ORDER COST</label>
                  <div class="px-3 py-2 bg-stone-100 rounded-xl font-bold text-stone-900 text-sm">
                    {{ calculateTotalCost() | currency }}
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button type="button" (click)="showRecordModal.set(false)" class="px-4 py-2 border border-stone-200 text-stone-600 font-mono text-xs rounded-xl hover:bg-stone-50 cursor-pointer">
                  CANCEL
                </button>
                <button type="submit" [disabled]="maintenanceForm.invalid"
                        class="px-5 py-2 bg-[#012d1d] hover:bg-[#023f29] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer">
                  RECORD SERVICE
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class MaintenanceComponent {
  showRecordModal = signal(false);
  maintenanceForm: FormGroup;

  schedule = [
    { id: 'EQ-10293', equipment: 'John Deere 5075E Utility Tractor', serviceType: 'Engine Oil & Filter Change', lastService: 'Apr 12, 2026', nextDue: 'Oct 12, 2026', status: 'Overdue' },
    { id: 'EQ-10294', equipment: 'John Deere S780 Combine Harvester', serviceType: 'Hydraulic System & Header Check', lastService: 'May 20, 2026', nextDue: 'Oct 15, 2026', status: 'Upcoming' },
    { id: 'EQ-10295', equipment: 'Massey Ferguson Large Square Baler', serviceType: 'Knotter & Belt Calibration', lastService: 'Jun 15, 2026', nextDue: 'Dec 15, 2026', status: 'Healthy' },
    { id: 'EQ-10296', equipment: 'Cadastre Center Pivot 01 Pump', serviceType: 'VFD Inspection & Impeller Flush', lastService: 'Sep 30, 2026', nextDue: 'Oct 30, 2026', status: 'Upcoming' },
  ];

  inventory = [
    { id: 'p1', name: '15W-40 Heavy Duty Diesel Oil (5 Gal)', cost: 65, stock: 14 },
    { id: 'p2', name: 'Hydraulic Fluid ISO 46 (5 Gal)', cost: 85, stock: 8 },
    { id: 'p3', name: 'Oil Filter Fleetguard LF16015', cost: 22, stock: 24 },
    { id: 'p4', name: 'Heavy Duty Baler Twine Spool', cost: 45, stock: 50 },
    { id: 'p5', name: 'Fuel Filter Water Separator', cost: 35, stock: 12 }
  ];

  constructor(private fb: FormBuilder) {
    this.maintenanceForm = this.fb.group({
      equipmentId: ['', Validators.required],
      serviceType: ['', Validators.required],
      laborCost: [0, [Validators.min(0)]],
      parts: this.fb.array([])
    });
  }

  get parts(): FormArray {
    return this.maintenanceForm.get('parts') as FormArray;
  }

  addPart() {
    this.parts.push(this.fb.group({
      id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removePart(index: number) {
    this.parts.removeAt(index);
  }

  calculatePartTotal(index: number): number {
    const partCtrl = this.parts.at(index);
    if (!partCtrl) return 0;
    const partId = partCtrl.get('id')?.value;
    const qty = partCtrl.get('quantity')?.value || 0;
    const invItem = this.inventory.find(i => i.id === partId);
    return (invItem?.cost || 0) * qty;
  }

  calculateTotalCost(): number {
    let total = Number(this.maintenanceForm.get('laborCost')?.value || 0);
    for (let i = 0; i < this.parts.length; i++) {
      total += this.calculatePartTotal(i);
    }
    return total;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Overdue': return 'bg-red-50 text-red-800 border-red-200';
      case 'Upcoming': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Healthy': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  }

  openRecordModal() {
    this.maintenanceForm.reset({ laborCost: 0 });
    this.parts.clear();
    this.showRecordModal.set(true);
  }

  recordMaintenance(item: any) {
    this.maintenanceForm.reset({
      equipmentId: item.id,
      serviceType: item.serviceType,
      laborCost: 0
    });
    this.parts.clear();
    this.showRecordModal.set(true);
  }

  onRecordSubmit() {
    if (this.maintenanceForm.valid) {
      const eqId = this.maintenanceForm.get('equipmentId')?.value;
      const target = this.schedule.find(s => s.id === eqId);
      if (target) {
        target.status = 'Healthy';
        target.lastService = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        target.nextDue = 'In 6 Months';
      }
      this.showRecordModal.set(false);
    }
  }
}
