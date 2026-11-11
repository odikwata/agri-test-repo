const fs = require('fs');
const file = 'src/app/pages/crops/view-field/view-field.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `<a [routerLink]="['/crops/planting-cycle', selectedPlanting()?.id]" class="px-4 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">`;
const replacement = `<a [routerLink]="['/crops/planting-cycle', selectedPlanting()?.id]" [queryParams]="{ fieldId: fieldId() }" class="px-4 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Fixed link in view-field');
} else {
    console.log('Target not found in view-field');
}
