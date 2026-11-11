const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex1 = /this\.drawingManager = new \(google\.maps\.drawing\.DrawingManager as any\)\(\{/g;
const rep1 = `console.log('Initializing drawing manager...');
    this.drawingManager = new (google.maps.drawing.DrawingManager as any)({`;

code = code.replace(regex1, rep1);

const regex2 = /this\.mode = newMode;/g;
const rep2 = `this.mode = newMode;
    console.log('Setting mode to:', newMode, 'Drawing manager exists?', !!this.drawingManager);`;

code = code.replace(regex2, rep2);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
