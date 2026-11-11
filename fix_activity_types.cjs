const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `<select formControlName="activityType" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="">Select Type</option>
                            <option value="LAND_PREPARATION">Land Preparation</option>
                            <option value="PLANTING">Planting</option>
                            <option value="IRRIGATION">Irrigation</option>
                            <option value="FERTILIZATION">Fertilization</option>
                            <option value="WEEDING">Weeding</option>
                            <option value="PEST_CONTROL">Pest Control</option>
                            <option value="DISEASE_CONTROL">Disease Control</option>
                            <option value="HARVESTING">Harvesting</option>
                            <option value="SCOUTING">Scouting</option>
                            <option value="OTHER">Other</option>
                        </select>`;

const replacement = `<select formControlName="activityType" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="">Select Type</option>
                            <option value="CROP_HEALTH">Crop Health</option>
                            <option value="CROP_NUTRITION">Crop Nutrition</option>
                            <option value="ANIMAL_HEALTH">Animal Health</option>
                            <option value="ANIMAL_NUTRITION">Animal Nutrition</option>
                            <option value="MAINTENANCE">Maintenance</option>
                            <option value="GENERAL">General</option>
                            <option value="NUTRITION">Nutrition</option>
                            <option value="HEALTH">Health</option>
                            <option value="PROTECTION">Protection</option>
                            <option value="FERTILIZATION">Fertilization</option>
                            <option value="PEST_CONTROL">Pest Control</option>
                        </select>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Activity types updated successfully');
} else {
    console.log('Target block not found');
}
