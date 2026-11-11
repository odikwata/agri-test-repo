const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');

const targetRoute = `{ path: 'crops/planting', component: PlantingComponent },`;
const newRoutes = `{ path: 'crops/planting', component: PlantingComponent },
      { path: 'crops/planting/map', loadComponent: () => import('./pages/crops/planting/planting-map.component').then(m => m.PlantingMapComponent) },
      { path: 'crops/planting/calendar', loadComponent: () => import('./pages/crops/planting/planting-calendar.component').then(m => m.PlantingCalendarComponent) },`;

code = code.replace(targetRoute, newRoutes);
fs.writeFileSync('src/app/app.routes.ts', code);
console.log('Patched routes');
