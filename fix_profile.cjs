const fs = require('fs');
let code = fs.readFileSync('src/app/pages/settings/profile.component.ts', 'utf8');

code = code.replace(/activeFarmDetails\.species\?\.length/g, 'activeFarmDetails.species.length');

fs.writeFileSync('src/app/pages/settings/profile.component.ts', code);
