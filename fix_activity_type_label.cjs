const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `<p class="font-bold text-slate-800">{{ activity.activityType }}</p>`;
const replacement = `<p class="font-bold text-slate-800">{{ getStatusLabel(activity.activityType) }}</p>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Fixed activity type label');
} else {
    console.log('Target not found');
}
