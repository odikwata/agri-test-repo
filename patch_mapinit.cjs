const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /onMapInitialized\(map: any\) \{[\s\S]*?\}/;
const rep = `onMapInitialized(map: any) {
    this.initDrawingManager(map);
  }`;

code = code.replace(regex, rep);

// Remove the timeout logic from ngAfterViewInit
const afterViewRegex = /const checkMap = \(\) => \{[\s\S]*?checkMap\(\);/g;
code = code.replace(afterViewRegex, '');

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
