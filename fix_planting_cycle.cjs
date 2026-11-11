const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

// 1. Add imports (HttpClient)
const importTarget = `import { RouterModule, ActivatedRoute } from '@angular/router';`;
const importReplacement = `import { RouterModule, ActivatedRoute } from '@angular/router';\nimport { HttpClient } from '@angular/common/http';`;
code = code.replace(importTarget, importReplacement);

// 2. Add Dates under Cycle ID
const cycleTarget = `<p class="text-slate-500 mt-1">Cycle ID: PC-2026-{{ cycleId() }} </p>`;
const cycleReplacement = `<p class="text-slate-500 mt-1">Cycle ID: PC-2026-{{ cycleId() }} </p>
          <div class="flex gap-4 mt-2 text-sm text-slate-600">
            <div><span class="font-medium text-slate-400">Planted:</span> {{ cycle()?.plantedDate | date:'mediumDate' }}</div>
            <div><span class="font-medium text-slate-400">Expected Harvest:</span> {{ cycle()?.expectedHarvestDate | date:'mediumDate' }}</div>
          </div>`;
code = code.replace(cycleTarget, cycleReplacement);

// 3. Update Live Sensor Data header to include History button
const sensorHeaderTarget = `<h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <lucide-icon name="satellite" class="w-5 h-5 text-emerald-600"></lucide-icon>
              Live Sensor Data
            </h3>`;
const sensorHeaderReplacement = `<div class="flex items-center justify-between mb-6">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                <lucide-icon name="satellite" class="w-5 h-5 text-emerald-600"></lucide-icon>
                Live Sensor Data
              </h3>
              <button (click)="showSensorHistory.set(true)" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <lucide-icon name="history" class="w-4 h-4"></lucide-icon> History
              </button>
            </div>`;
code = code.replace(sensorHeaderTarget, sensorHeaderReplacement);

// 4. Add AI Analysis section under NPK Levels
const npkTarget = `<div class="bg-blue-500 h-1 rounded-full" style="width: 35%"></div>
                    </div>
                  </div>
                </div>
              </div>`;
const npkReplacement = `<div class="bg-blue-500 h-1 rounded-full" style="width: 35%"></div>
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
                  <button (click)="analyzeSensorData()" [disabled]="analyzing()" class="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded hover:bg-amber-100 disabled:opacity-50">
                    {{ analyzing() ? 'Analyzing...' : 'Analyze' }}
                  </button>
                </div>
                @if (aiAnalysis()) {
                  <div class="p-3 bg-amber-50 rounded-lg text-sm text-slate-700 border border-amber-100">
                    {{ aiAnalysis() }}
                  </div>
                } @else {
                  <p class="text-xs text-slate-500 italic">Click analyze to compare live readings with expected stage conditions.</p>
                }
              </div>`;
if(code.includes(npkTarget)) {
    code = code.replace(npkTarget, npkReplacement);
} else {
    console.log("Could not find NPK target");
}

// 5. Add Modal for History at the very bottom of the template
const templateEndTarget = `</div>
  \`
})`;
const templateEndReplacement = `</div>

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
  \`
})`;
code = code.replace(templateEndTarget, templateEndReplacement);

// 6. Add component properties and methods
const classStartTarget = `export class PlantingCycleManagementComponent implements OnInit {`;
const classStartReplacement = `export class PlantingCycleManagementComponent implements OnInit {
  http = inject(HttpClient);
  showSensorHistory = signal(false);
  aiAnalysis = signal<string | null>(null);
  analyzing = signal(false);
  
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
    const currentStage = this.growthProgram()?.growthStageList?.find(s => s.status === 'current')?.name || 'Unknown Stage';
    
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
`;
code = code.replace(classStartTarget, classStartReplacement);

fs.writeFileSync(file, code);
console.log('Component updated');
