const fs = require('fs');
let code = fs.readFileSync('src/app/services/crop.service.ts', 'utf8');

code = code.replace(/'\/api\/external\/planting-schedule\//g, "'/api/external/crop/planting-schedule/");
code = code.replace(/`\/api\/external\/planting-schedule\//g, "`/api/external/crop/planting-schedule/");

fs.writeFileSync('src/app/services/crop.service.ts', code);
console.log('Patched service paths');
