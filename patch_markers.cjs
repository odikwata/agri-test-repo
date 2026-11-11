const fs = require('fs');

function fixMarker(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/<map-marker \[position\]="getCenterOfPolygon\(el.paths\)" \[title\]="el.name">[\s\S]*?<\/map-marker>/g, '<map-marker [position]="getCenterOfPolygon(el.paths)" [title]="el.name" [label]="el.name"></map-marker>');
  fs.writeFileSync(file, code);
}

fixMarker('src/app/pages/crops/field-map-edit/field-map-edit.component.ts');
fixMarker('src/app/pages/crops/field-map/field-map.component.ts');
