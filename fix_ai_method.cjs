const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `    const currentStage = this.growthProgram()?.growthStageList?.find(s => s.status === 'current')?.name || 'Unknown Stage';`;
const replacement = `    const currentStage = this.stagesWithDates().find(s => s.status === 'current')?.stageName || 'Unknown Stage';`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Fixed currentStage in analyzeSensorData');
} else {
    console.log('Target not found');
}
