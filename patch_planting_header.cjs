const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting/planting.component.ts', 'utf8');

const target = `<button class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
          New Planting
        </button>`;
        
const replacement = `<div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">
            <lucide-icon name="map" class="w-4 h-4"></lucide-icon>
            View Map
          </button>
          <button class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">
            <lucide-icon name="calendar-days" class="w-4 h-4"></lucide-icon>
            View Calendar
          </button>
          <button class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            New Planting
          </button>
        </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/app/pages/crops/planting/planting.component.ts', code);
console.log('Patched');
