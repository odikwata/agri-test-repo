const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `<div class="bg-emerald-500 h-1 rounded-full" style="width: 85%"></div>
                    </div>
                  </div>
                </div>
              </div>`;

const replacement = `<div class="bg-emerald-500 h-1 rounded-full" style="width: 85%"></div>
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
              </div>`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('AI Analysis added');
} else {
    console.log('Target not found');
}
