const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /\(this\.drawingManager as any\)\.setOptions\(\{/g;
const rep = `if (this.map && this.map.googleMap) {
          this.map.googleMap.setOptions({ draggableCursor: 'crosshair' });
        }
        (this.drawingManager as any).setOptions({`;

code = code.replace(regex, rep);

const regex2 = /\(this\.drawingManager as any\)\.setDrawingMode\(null\);/g;
const rep2 = `if (this.map && this.map.googleMap) {
          this.map.googleMap.setOptions({ draggableCursor: null });
        }
        (this.drawingManager as any).setDrawingMode(null);`;

code = code.replace(regex2, rep2);

fs.writeFileSync(file, code);
