const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');

code = code.replace(
  "{ path: '', component: FieldMapComponent },",
  "{ path: '', component: FieldMapComponent, pathMatch: 'full' },"
);

code = code.replace(
  "{ path: '', component: PlantingComponent },",
  "{ path: '', component: PlantingComponent, pathMatch: 'full' },"
);

fs.writeFileSync('src/app/app.routes.ts', code);
console.log('Patched');
