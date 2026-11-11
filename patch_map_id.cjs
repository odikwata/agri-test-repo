const fs = require('fs');

function addMapId(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace('<google-map height="100%" width="100%" [center]="center" [zoom]="15">', '<google-map height="100%" width="100%" [center]="center" [zoom]="15" mapId="DEMO_MAP_ID">');
  code = code.replace('<google-map height="100%" width="100%" [center]="center" [zoom]="15" (mapClick)="onMapClick()">', '<google-map height="100%" width="100%" [center]="center" [zoom]="15" (mapClick)="onMapClick()" mapId="DEMO_MAP_ID">');
  fs.writeFileSync(file, code);
}

addMapId('src/app/pages/crops/field-map/field-map.component.ts');
addMapId('src/app/pages/crops/field-map-edit/field-map-edit.component.ts');

