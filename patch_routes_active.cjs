const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');

const targetRoute = `{ path: 'crops/planting', component: PlantingComponent },`;
const newRoutes = `{ path: 'crops/planting', component: PlantingComponent },
      { path: 'crops/planting/active', loadComponent: () => import('./pages/crops/planting/active-plantings.component').then(m => m.ActivePlantingsComponent) },`;

code = code.replace(targetRoute, newRoutes);
fs.writeFileSync('src/app/app.routes.ts', code);
console.log('Patched routes');
