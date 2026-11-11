const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');
code = code.replace(
  "{ path: 'crops/planting/map', loadComponent: () => import('./pages/crops/planting/planting-map.component').then(m => m.PlantingMapComponent) },",
  "// { path: 'crops/planting/map', loadComponent: () => import('./pages/crops/planting/planting-map.component').then(m => m.PlantingMapComponent) },"
);
code = code.replace(
  "{ path: 'crops/planting/calendar', loadComponent: () => import('./pages/crops/planting/planting-calendar.component').then(m => m.PlantingCalendarComponent) },",
  "// { path: 'crops/planting/calendar', loadComponent: () => import('./pages/crops/planting/planting-calendar.component').then(m => m.PlantingCalendarComponent) },"
);
fs.writeFileSync('src/app/app.routes.ts', code);
