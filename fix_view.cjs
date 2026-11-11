const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/view-field/view-field.component.ts', 'utf8');

code = code.replace(/@for \(attr of objectKeys\(field\(\)!\.attributes!\); track attr\) \{[\s\S]*?<\/div>\s*\}/, 
`@for (attr of field()!.attributes!; track attr.name) {
              <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                    <lucide-icon name="info" class="w-5 h-5"></lucide-icon>
                  </div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ attr.name }}</p>
                </div>
                <h3 class="text-2xl font-black text-slate-900 capitalize">{{ attr.value || 'N/A' }}</h3>
              </div>
            }`);

fs.writeFileSync('src/app/pages/crops/view-field/view-field.component.ts', code);
