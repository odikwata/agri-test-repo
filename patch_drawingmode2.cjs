const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\(this\.drawingManager as any\)\.setOptions\(\{/g, "(this.drawingManager as any).setDrawingMode(newMode === 'select' ? null : (window as any).google.maps.drawing.OverlayType.POLYGON);\n        (this.drawingManager as any).setOptions({");

// Actually let's just do it directly.
code = code.replace(/drawingMode: \(window as any\)\.google\.maps\.drawing\.OverlayType\.POLYGON,/g, '');

fs.writeFileSync(file, code);
