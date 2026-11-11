const fs = require('fs');

// Fix server.ts
let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(/res\.json\(\{\n        content: data/g, "return res.json({\n        content: data");
fs.writeFileSync('server.ts', serverCode);

// Fix field-map-edit.component.ts
let tsCode = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

tsCode = "import { FarmService } from '../../../services/farm.service';\nimport { SessionService } from '../../../services/session.service';\n" + tsCode;

// Fix TS2571: Object is of type 'unknown'.
// In setMode:
tsCode = tsCode.replace(/if \(this\.drawingManager\) \{/g, "if (this.drawingManager) {");
tsCode = tsCode.replace(/this\.drawingManager\.setDrawingMode/g, "(this.drawingManager as any).setDrawingMode");
tsCode = tsCode.replace(/this\.drawingManager\.setOptions/g, "(this.drawingManager as any).setOptions");
tsCode = tsCode.replace(/this\.drawingManager\.setMap/g, "(this.drawingManager as any).setMap");

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', tsCode);
