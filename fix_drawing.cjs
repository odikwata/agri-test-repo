const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /\(this\.drawingManager as any\)\.setDrawingMode\(newMode === 'select' \? null : \(window as any\)\.google\.maps\.drawing\.OverlayType\.POLYGON\);/;
code = code.replace(regex, "(this.drawingManager as any).setDrawingMode('polygon');");

// Let's also check if the drawingManager is created with the right map.
code = code.replace(/\(this\.drawingManager as any\)\.setMap\(map\);/g, "(this.drawingManager as any).setMap(map);\n    console.log('DrawingManager attached to map', map);");

fs.writeFileSync(file, code);
