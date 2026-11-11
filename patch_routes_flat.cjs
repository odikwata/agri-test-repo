const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');

const oldRoutes = `    // Planting routes grouped cleanly:
    {
      path: 'planting',
      children: [
        { path: '', component: PlantingComponent, pathMatch: 'full' },
        { path: 'active', loadComponent: () => import('./pages/crops/planting/active-plantings.component').then(m => m.ActivePlantingsComponent) },
        { path: 'map', loadComponent: () => import('./pages/crops/planting/planting-map.component').then(m => m.PlantingMapComponent) },
        { path: 'calendar', loadComponent: () => import('./pages/crops/planting/planting-calendar.component').then(m => m.PlantingCalendarComponent) },
      ]
    },`;

const newRoutes = `    // Planting routes flat:
    { path: 'planting', component: PlantingComponent },
    { path: 'planting/active', loadComponent: () => import('./pages/crops/planting/active-plantings.component').then(m => m.ActivePlantingsComponent) },
    { path: 'planting/map', loadComponent: () => import('./pages/crops/planting/planting-map.component').then(m => m.PlantingMapComponent) },
    { path: 'planting/calendar', loadComponent: () => import('./pages/crops/planting/planting-calendar.component').then(m => m.PlantingCalendarComponent) },`;

code = code.replace(oldRoutes, newRoutes);
fs.writeFileSync('src/app/app.routes.ts', code);
console.log('Routes flattened');
