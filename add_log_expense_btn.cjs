const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `<div class="flex gap-2">
                    <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
                      Export Report
                    </button>
                  </div>`;
const replacement = `<div class="flex gap-2">
                    <button (click)="showLogActivityModal.set(true)" class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                      Log Expense
                    </button>
                    <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <lucide-icon name="download" class="w-4 h-4"></lucide-icon>
                      Export Report
                    </button>
                  </div>`;
if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Added log expense button');
} else {
    console.log('Target not found');
}
