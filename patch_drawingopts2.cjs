const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

code = code.replace(/drawingControl: false,/g, "drawingControl: true, drawingControlOptions: { position: 2, drawingModes: ['polygon'] },");

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
