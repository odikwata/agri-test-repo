const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');

const targetImport = `import { SoilRatingComponent } from './pages/crops/soil-rating/soil-rating.component';`;
const newImport = `import { SoilRatingComponent } from './pages/crops/soil-rating/soil-rating.component';
import { CropAccountingComponent } from './pages/crops/accounting/crop-accounting.component';`;

const targetRoute = `{ path: 'crops/soil-rating', component: SoilRatingComponent },`;
const newRoute = `{ path: 'crops/soil-rating', component: SoilRatingComponent },
      { path: 'crops/accounting', component: CropAccountingComponent },`;

if(code.includes(targetImport) && code.includes(targetRoute)) {
    code = code.replace(targetImport, newImport);
    code = code.replace(targetRoute, newRoute);
    fs.writeFileSync('src/app/app.routes.ts', code);
    console.log('Patched routes');
} else {
    console.log('Targets not found');
}
