const fs = require('fs');
let code = fs.readFileSync('src/app/services/nav.service.ts', 'utf8');

const target = `    'Crops': [
      { label: 'Field Map', icon: 'map', route: '/crops' },
      { label: 'Planting Schedule', icon: 'calendar', route: '/crops/planting' },
      { label: 'Harvesting', icon: 'wheat', route: '/crops/harvest' },
      { label: 'Soil Rating', icon: 'flask-conical', route: '/crops/soil-rating' },
      { label: 'Soil Rating', icon: 'flask-conical', route: '/crops/soil-rating' }
    ],
      { label: 'Inventory', icon: 'package', route: '/equipment/inventory' },
      { label: 'Maintenance', icon: 'settings', route: '/equipment/maintenance' },
      { label: 'Fuel Tracking', icon: 'fuel', route: '/equipment/fuel' }
    ],`;

const fixed = `    'Crops': [
      { label: 'Field Map', icon: 'map', route: '/crops' },
      { label: 'Planting Schedule', icon: 'calendar', route: '/crops/planting' },
      { label: 'Harvesting', icon: 'wheat', route: '/crops/harvest' },
      { label: 'Soil Rating', icon: 'flask-conical', route: '/crops/soil-rating' }
    ],
    'Equipment': [
      { label: 'Inventory', icon: 'package', route: '/equipment/inventory' },
      { label: 'Maintenance', icon: 'settings', route: '/equipment/maintenance' },
      { label: 'Fuel Tracking', icon: 'fuel', route: '/equipment/fuel' }
    ],`;

if(code.includes(target)) {
    code = code.replace(target, fixed);
    fs.writeFileSync('src/app/services/nav.service.ts', code);
    console.log('Fixed nav');
} else {
    console.log('Target block not found');
}
