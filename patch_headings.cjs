const fs = require('fs');

function patch(filePath, icon, title, desc, button) {
    let code = fs.readFileSync(filePath, 'utf8');
    const target = `<div class="p-6 max-w-8xl mx-auto space-y-8">\n      \n      <!-- Top Stats Row -->`;
    const replacement = `<div class="p-6 max-w-8xl mx-auto space-y-8">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <lucide-icon name="${icon}" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">${title}</h1>
            <p class="text-sm text-slate-500">${desc}</p>
          </div>
        </div>
        <button class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
          ${button}
        </button>
      </div>

      <!-- Top Stats Row -->`;
      
    if (code.includes(target)) {
        code = code.replace(target, replacement);
        fs.writeFileSync(filePath, code);
        console.log('Patched ' + title);
    } else {
        console.log('Target not found in ' + title);
    }
}

patch('src/app/pages/crops/soil-rating/soil-rating.component.ts', 'flask-conical', 'Soil Rating', 'Monitor soil health, pH levels, and sensor data across fields.', 'Add Sensor');
patch('src/app/pages/crops/planting/planting.component.ts', 'calendar', 'Planting Schedule', 'Manage crop varieties, planting dates, and estimated yields.', 'New Planting');
patch('src/app/pages/crops/harvesting/harvesting.component.ts', 'wheat', 'Harvesting', 'Track harvest progress, yields, and crop storage.', 'Log Harvest');
