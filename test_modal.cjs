const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const start = code.indexOf('<!-- Activity Detail Modal -->');
const end = code.indexOf('<!-- Log Activity Modal -->');

if (start !== -1 && end !== -1) {
  const modalHTML = code.substring(start, end);
  code = code.replace(modalHTML, '<!-- Modal disabled for testing -->\n');
  fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
  console.log('Disabled modal');
} else {
  console.log('Could not find modal bounds');
}
