const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');
code = code.replace("status: currentDetail.currentStage?.status || 'SCHEDULED',", "status: currentDetail.currentStage?.status && currentDetail.currentStage.status !== 'SCHEDULED' ? currentDetail.currentStage.status : 'PENDING',");
fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
console.log('Patched init');
