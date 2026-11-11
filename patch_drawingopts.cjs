const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /drawingControlOptions: \{[\s\S]*?\},/;
code = code.replace(regex, '');
code = code.replace(/drawingControl: true,/g, 'drawingControl: false,');

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
