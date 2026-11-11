import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-health-status',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Herd Health KPI Bento Grid (Matches Livestock Registry Bento) -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Herd Health Index -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Herd Health Index</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">98.4%</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Optimal</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">vital_signs</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> 1,477 Certified Sound
            </span>
            <span class="text-slate-400">3 Under Care</span>
          </div>
        </div>

        <!-- Biosecurity Quarantine -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Quarantine Isolation</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">3</span>
                <span class="font-mono text-xs text-amber-700 font-semibold">Head</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-amber-50 text-amber-900">
              <span class="material-symbols-outlined text-2xl">emergency</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Kraal 08 Isolation Bay</span>
            <span class="text-amber-700 font-bold">14-Day Clear Gate</span>
          </div>
        </div>

        <!-- Vaccination Protocol Compliance -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Vaccine Protocol</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">96.8%</span>
                <span class="font-mono text-xs text-slate-500 font-medium">Compliance</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <span class="material-symbols-outlined text-2xl">vaccines</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">7-Way Clostridial Active</span>
            <span class="text-slate-400">24 Doses Due</span>
          </div>
        </div>

        <!-- Rumination & Vitals Telemetry -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Rumen Bolus Telemetry</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">39.1°C</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Mean Temp</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">sensors</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Rumination: 482 min/d</span>
            <span class="text-emerald-700 font-bold">Gateways Online</span>
          </div>
        </div>
      </section>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- LEFT 8 COLS: Clinical Case Studies & Mandatory Vaccination Rail -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Active Veterinary Cases -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-800 text-xl">medical_services</span>
                <div>
                  <h3 class="font-heading text-base font-bold text-slate-900">Active Herd Health Interventions</h3>
                  <p class="text-xs text-slate-500">Live surveillance across Kraals, Pens, and Pasture Sectors</p>
                </div>
              </div>
              <span class="bg-amber-100 text-amber-900 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                3 Interventions Open
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Case 1: Stud Bull Titan -->
              <div class="bg-slate-50 rounded-xl border border-slate-200/80 p-4 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                        <span class="material-symbols-outlined text-base">pets</span>
                      </div>
                      <div>
                        <h4 class="font-bold text-slate-900 text-sm">Oakridge Black Titan #881</h4>
                        <span class="font-mono text-[11px] text-slate-500">RFID: 982 000109283711</span>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                      Kraal 01 &bull; Pen 02
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 mt-2">Routine pre-breeding soundness exam &amp; hoof trim protocol. Scheduled for semen motility evaluation.</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span class="text-emerald-800 font-bold flex items-center gap-1 font-mono text-[11px]">
                    <span class="material-symbols-outlined text-sm">check_circle</span>
                    Exam Complete (Sound)
                  </span>
                  <span class="text-slate-400 font-mono text-[11px]">Dr. V. Mthembu</span>
                </div>
              </div>

              <!-- Case 2: Sovereign Belle Heifer -->
              <div class="bg-slate-50 rounded-xl border border-slate-200/80 p-4 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                        <span class="material-symbols-outlined text-base">badge</span>
                      </div>
                      <div>
                        <h4 class="font-bold text-slate-900 text-sm">Oakridge Belle V (TAG-9042)</h4>
                        <span class="font-mono text-[11px] text-slate-500">Purebred Angus Heifer</span>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                      Kraal 04 &bull; Pen 12
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 mt-2">Chute intake completed (412.5 kg). Administered 7-way clostridial booster and BVD-PI negative ear notch verified.</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span class="text-emerald-800 font-bold flex items-center gap-1 font-mono text-[11px]">
                    <span class="material-symbols-outlined text-sm">verified</span>
                    Health Passport Active
                  </span>
                  <span class="text-slate-400 font-mono text-[11px]">Intake Logged</span>
                </div>
              </div>

              <!-- Case 3: Broiler Shed 3 Batch -->
              <div class="bg-slate-50 rounded-xl border border-slate-200/80 p-4 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                        <span class="material-symbols-outlined text-base">layers</span>
                      </div>
                      <div>
                        <h4 class="font-bold text-slate-900 text-sm">Broiler Flock 094 (5,000 Birds)</h4>
                        <span class="font-mono text-[11px] text-slate-500">Cobb 500 Fast-Feathering</span>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                      Shed 03 &bull; Bay A
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 mt-2">Day 14 environmental check: water line chlorination 2.5 ppm, ammonia 11 ppm, water/feed conversion ratio on-target (1.48).</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span class="text-emerald-800 font-bold flex items-center gap-1 font-mono text-[11px]">
                    <span class="material-symbols-outlined text-sm">done_all</span>
                    Biosecure Cleanroom OK
                  </span>
                  <span class="text-slate-400 font-mono text-[11px]">Automated Hub</span>
                </div>
              </div>

              <!-- Case 4: Isolation Kraal 08 Observation -->
              <div class="bg-amber-50/60 rounded-xl border border-amber-200/80 p-4 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
                        <span class="material-symbols-outlined text-base">coronavirus</span>
                      </div>
                      <div>
                        <h4 class="font-bold text-slate-900 text-sm">Quarantine Steer TAG-819</h4>
                        <span class="font-mono text-[11px] text-slate-500">External Purchase Inbound</span>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-md font-mono">
                      Kraal 08 &bull; Pen Q-1
                    </span>
                  </div>
                  <p class="text-xs text-slate-700 mt-2">Respiratory watch: Day 6 of 14 quarantine isolation protocol. Temperature normal (38.8°C), appetite robust.</p>
                </div>
                <div class="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between text-xs">
                  <span class="text-amber-800 font-bold flex items-center gap-1 font-mono text-[11px]">
                    <span class="material-symbols-outlined text-sm">hourglass_top</span>
                    8 Days Remaining in Gate
                  </span>
                  <span class="text-slate-500 font-mono text-[11px]">Vet Review Day 10</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Log New Veterinary Protocol -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#012d1d] text-xl">post_add</span>
                <h3 class="font-heading text-base font-bold text-slate-900">Log Clinical Health Event &amp; Dispensation</h3>
              </div>
              <span class="text-xs text-slate-500 font-mono">Cadastre Regulatory Form #VET-042</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Target Bio-Asset / Group *</label>
                <select class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none">
                  <option>Oakridge Belle V (TAG-9042) [Kraal 04 / Pen 12]</option>
                  <option>Oakridge Black Titan #881 [Kraal 01 / Pen 02]</option>
                  <option>Broiler Flock 094 [Broiler Shed 03]</option>
                  <option>Apiary Compound Alpha [Row 02]</option>
                  <option>Merino Ewe Mob 06 [Sheep Kraal Delta]</option>
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-700">Intervention Category *</label>
                <select class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none">
                  <option>Vaccination / Immunization</option>
                  <option>Biosecurity Quarantine Check</option>
                  <option>Parasiticide Deworming Drench</option>
                  <option>Hoof Trimming / Podiatry</option>
                  <option>Blood Serum Diagnostic / TSU</option>
                </select>
              </div>

              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-xs font-bold text-slate-700">Clinical Observations &amp; Medication Dispensation</label>
                <textarea rows="3" placeholder="Document dosages, batch lot serial numbers, withdrawal periods, and follow-up timeline..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600"></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                Discard
              </button>
              <button type="button" class="px-5 py-2 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">verified</span>
                <span>Commit Clinical Record</span>
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT 4 COLS: Scheduled Prophylaxis & Biosecurity Protocol Rails -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Mandatory Prophylaxis Schedule -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 class="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-800 text-lg">calendar_month</span>
                Prophylaxis Schedule
              </h3>
              <span class="font-mono text-[10px] text-slate-400 font-bold">NEXT 14 DAYS</span>
            </div>

            <div class="space-y-3">
              <div class="p-3 bg-red-50/70 border border-red-200 rounded-xl flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-red-900 text-xs">Clostridial 7-Way Booster</span>
                  <span class="font-mono text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">DUE IN 2D</span>
                </div>
                <span class="text-[11px] text-slate-600">Cohort: Replacement Heifer Alpha (Kraal 04)</span>
                <span class="text-[10px] font-mono text-red-700 font-bold">14 Head to chute</span>
              </div>

              <div class="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900 text-xs">Internal Parasiticide Pour-on</span>
                  <span class="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">IN 5D</span>
                </div>
                <span class="text-[11px] text-slate-600">Cohort: Merino Ewe Mob (Sheep Kraal Delta)</span>
                <span class="text-[10px] font-mono text-slate-500 font-bold">45 Head</span>
              </div>

              <div class="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900 text-xs">Broiler Gumboro IBD Vaccination</span>
                  <span class="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">IN 8D</span>
                </div>
                <span class="text-[11px] text-slate-600">Cohort: Shed 03 Broiler Batch 2025-A</span>
                <span class="text-[10px] font-mono text-emerald-700 font-bold">Via Water Line Dispenser</span>
              </div>
            </div>
          </div>

          <!-- Quarantine Gate Rules -->
          <div class="bg-gradient-to-br from-[#012d1d] to-[#1b4332] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-emerald-400">shield_with_heart</span>
                <span class="font-heading text-sm font-bold uppercase tracking-wider">Biosecurity Gate Policy</span>
              </div>
              <p class="text-xs text-emerald-100 leading-relaxed mb-4">
                All livestock arriving from external sales rings must complete mandatory 14-day observation in Isolation Kraal 08 with verified BVD-PI and Brucellosis clearance.
              </p>
              <div class="flex items-center justify-between pt-3 border-t border-emerald-800 text-xs font-mono">
                <span class="text-emerald-300">ISO 22000 Certified</span>
                <span class="text-white font-bold">ZERO CONTAMINATION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HealthStatusComponent {}
