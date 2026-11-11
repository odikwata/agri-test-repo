const fs = require('fs');

let lines = fs.readFileSync('src/app/pages/crops/view-field/view-field.component.ts', 'utf8').split('\n');

// Find start of Quick Stats
const startIdx = lines.findIndex(l => l.includes('<!-- Quick Stats -->'));
// Find end - the <div class="bg-white rounded-3xl... right after Quick stats
const endIdx = lines.findIndex((l, idx) => idx > startIdx && l.includes('<div class="bg-white rounded-3xl border border-slate-200'));

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <lucide-icon name="maximize" class="w-5 h-5"></lucide-icon>
              </div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</p>
            </div>
            <h3 class="text-2xl font-black text-slate-900">{{ field()?.size || 'N/A' }} <span class="text-sm font-normal text-slate-500" *ngIf="field()?.size">Hectares</span></h3>
          </div>

          @if (field()?.attributes) {
            @for (attr of objectKeys(field()!.attributes!); track attr) {
              <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                    <lucide-icon name="info" class="w-5 h-5"></lucide-icon>
                  </div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ attr }}</p>
                </div>
                <h3 class="text-2xl font-black text-slate-900 capitalize">{{ field()!.attributes![attr] || 'N/A' }}</h3>
              </div>
            }
          }
        </div>`;
        
  lines.splice(startIdx, endIdx - startIdx, replacement);
  fs.writeFileSync('src/app/pages/crops/view-field/view-field.component.ts', lines.join('\n'));
} else {
  console.log("Could not find boundaries", startIdx, endIdx);
}
