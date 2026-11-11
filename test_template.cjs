const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

code = code.replace(/<google-map[\s\S]*?<\/google-map>/, '<div class="p-8 text-center bg-slate-100 rounded-2xl border border-slate-200">Map Area</div>');

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
