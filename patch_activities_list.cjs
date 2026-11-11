const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const targetLogic = `         const isOngoing = status === 'IN_PROGRESS' || (start <= now && end >= now && status !== 'COMPLETED' && status !== 'OVERDUE');
         const isPlanned = status === 'PLANNED' || status === 'PENDING' || (start > now && status !== 'COMPLETED' && status !== 'IN_PROGRESS' && status !== 'OVERDUE');
         const isCompleted = status === 'COMPLETED';
         const isExpired = status === 'OVERDUE' || (end < now && status !== 'COMPLETED');`;

const newLogic = `         const isOngoing = ['IN_PROGRESS', 'PENDING_VERIFICATION', 'DUE'].includes(status) || (start <= now && end >= now && !['COMPLETED', 'OVERDUE', 'CANCELLED', 'SKIPPED', 'NOT_DONE'].includes(status));
         const isPlanned = ['DRAFT', 'SCHEDULED', 'ASSIGNED', 'PARKED'].includes(status) || (start > now && !['COMPLETED', 'IN_PROGRESS', 'OVERDUE', 'CANCELLED', 'SKIPPED', 'NOT_DONE'].includes(status));
         const isCompleted = status === 'COMPLETED';
         const isExpired = ['OVERDUE', 'NOT_DONE'].includes(status) || (end < now && !['COMPLETED', 'CANCELLED', 'SKIPPED'].includes(status));`;

if(code.includes(targetLogic)) {
    code = code.replace(targetLogic, newLogic);
    fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
    console.log('Patched activities filter logic');
} else {
    console.log('Target activities logic not found');
}
