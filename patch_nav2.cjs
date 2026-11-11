const fs = require('fs');
let code = fs.readFileSync('src/app/services/nav.service.ts', 'utf8');

const targetNav = `{ label: 'Soil Rating', icon: 'flask-conical', route: '/crops/soil-rating' }`;
const newNav = `{ label: 'Soil Rating', icon: 'flask-conical', route: '/crops/soil-rating' },
      { label: 'Accounting', icon: 'calculator', route: '/crops/accounting' }`;

if(code.includes(targetNav)) {
    code = code.replace(targetNav, newNav);
    fs.writeFileSync('src/app/services/nav.service.ts', code);
    console.log('Patched nav');
} else {
    console.log('Target nav not found');
}
