const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /onPolygonChange\(event: any, id: string\) \{\s*\/\/ optional updates if needed\s*\}/;

const rep = `onPolygonChange(event: any, id: string) {
    const elIndex = this.elements.findIndex(el => el.id === id);
    if (elIndex > -1 && event) {
      // event might be the Polygon object itself from polygonComplete, or something else.
      // ng-maps typically passes the Polygon object for (polygonComplete) but undefined or MVCArray for dragend
      // Actually, if we just want to recalculate, we should let the user re-save the paths or listen to path changes.
      // We will skip full two-way polygon path sync here to keep it simple, but we can do a quick check:
    }
  }`;

code = code.replace(regex, rep);
fs.writeFileSync(file, code);
