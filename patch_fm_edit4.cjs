const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

code = code.replace(/mapId="DEMO_MAP_ID"/g, '');
code = code.replace(/<map-advanced-marker/g, '<map-marker');
code = code.replace(/<\/map-advanced-marker>/g, '</map-marker>');

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
