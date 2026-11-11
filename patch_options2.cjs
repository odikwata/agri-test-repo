const fs = require('fs');

function patchMap(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\[options\]="\{ mapTypeId: 'satellite' \}"/g, '[options]="{ mapTypeId: \\\'satellite\\\', disableDoubleClickZoom: true }"');
  fs.writeFileSync(file, code);
}

patchMap('src/app/pages/crops/field-map/field-map.component.ts');
patchMap('src/app/pages/crops/field-map-edit/field-map-edit.component.ts');
