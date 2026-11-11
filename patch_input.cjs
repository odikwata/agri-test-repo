const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /<label class="block text-sm font-medium text-slate-700 mb-1">Size \(Hectares\)<\/label>\s*<input type="number" \[\(ngModel\)\]="selectedElement\.size" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">/;

const rep = `<label class="block text-sm font-medium text-slate-700 mb-1">Size (Hectares)</label>
                  <input type="number" [(ngModel)]="selectedElement.size" readonly class="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg focus:outline-none">
                  <p class="text-[10px] text-slate-400 mt-1">Calculated from drawn area.</p>`;

code = code.replace(regex, rep);

fs.writeFileSync(file, code);
