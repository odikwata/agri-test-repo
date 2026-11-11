const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `<label class="block text-sm font-medium text-slate-700 mb-1">Size (Hectares)</label>
                  <div class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-medium">
                    {{ selectedElement.size || 0 }} ha
                  </div>`;

const replacement = `<label class="block text-sm font-medium text-slate-700 mb-1">Size (Hectares)</label>
                  <input type="number" step="0.01" [(ngModel)]="selectedElement.size" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Fixed Size property');
} else {
    console.log('Target not found');
}
