const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/initDrawingManager\(map: google\.maps\.Map\) \{/g, 'initDrawingManager() {');
code = code.replace(/setTimeout\(\(\) => this\.initDrawingManager\(map\), 500\);/g, 'setTimeout(() => this.initDrawingManager(), 500);');

code = code.replace(/\(this\.drawingManager as any\)\.setMap\(map\);/g, `
    if (this.map && this.map.googleMap) {
      (this.drawingManager as any).setMap(this.map.googleMap);
      console.log('DrawingManager attached to map', this.map.googleMap);
    } else {
      setTimeout(() => this.initDrawingManager(), 500);
      return;
    }
`);

code = code.replace(/onMapInitialized\(map: any\) \{\s*this\.initDrawingManager\(map\);\s*\}/, `onMapInitialized(map: any) {
    this.initDrawingManager();
  }`);

fs.writeFileSync(file, code);
