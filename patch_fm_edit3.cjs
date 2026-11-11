const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

code = code.replace(`drawingControl: false,`, `drawingControl: true,`);
code = code.replace(`(this.drawingManager as any).setDrawingMode('polygon');`, `(this.drawingManager as any).setDrawingMode(google.maps.drawing.OverlayType.POLYGON);`);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
