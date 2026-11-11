const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting/planting.component.ts', 'utf8');

// Patch Active Planting Cycles View All link
code = code.replace(
  '<button class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">\n            View All <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>\n          </button>',
  '<a routerLink="/crops/planting/active" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">\n            View All <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>\n          </a>'
);

// Patch Upcoming Schedule View All link
code = code.replace(
  '<h3 class="text-lg font-bold text-slate-800 mb-4">Upcoming Schedule</h3>',
  `<div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-800">Upcoming Schedule</h3>
          <a routerLink="/crops/planting/calendar" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
            View All <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </a>
        </div>`
);

fs.writeFileSync('src/app/pages/crops/planting/planting.component.ts', code);
console.log('Patched');
