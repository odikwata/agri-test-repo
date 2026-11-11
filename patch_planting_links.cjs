const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting/planting.component.ts', 'utf8');

code = code.replace(
  '<button class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">',
  '<button routerLink="/crops/planting/map" class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">'
);

code = code.replace(
  '<button class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">',
  '<button routerLink="/crops/planting/calendar" class="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">'
);

fs.writeFileSync('src/app/pages/crops/planting/planting.component.ts', code);
console.log('Patched routerLinks');
