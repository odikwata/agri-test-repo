const fs = require('fs');
const file = '/app/applet/src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `<h1 class="text-3xl font-bold text-slate-900">{{ cycle()?.crop?.name }}</h1>`;
const replacement = `<h1 class="text-3xl font-bold text-slate-900">{{ cycle()?.crop?.name }} - Field</h1>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Fixed heading');
} else {
    console.log('Target not found');
}
