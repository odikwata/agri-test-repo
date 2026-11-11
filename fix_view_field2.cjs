const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/view-field/view-field.component.ts', 'utf8');

const regex = /<!-- Quick Stats -->[\s\S]*?<div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row min-h-\[500px\]">/;

const replacement = `<!-- Quick Stats -->
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
        </div>
        
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[500px]">`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/app/pages/crops/view-field/view-field.component.ts', code);
