const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const target = `(this.drawingManager as any).setDrawingMode(google.maps.drawing.OverlayType.POLYGON);`;
const rep = `try {
          (this.drawingManager as any).setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
          console.log('setDrawingMode success');
        } catch(e) {
          console.error('setDrawingMode error', e);
        }`;

code = code.replace(target, rep);
fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
