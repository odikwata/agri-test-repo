const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const importRegex = /import\s*\{\s*CropService.*?\s*\}\s*from\s*'..\/..\/..\/services\/crop.service';/s;
code = code.replace(importRegex, match => {
  if (!match.includes('PlantingCycleActivityDetailDTO')) {
     return match.replace('}', ', PlantingCycleActivityDetailDTO }');
  }
  return match;
});

const accountingTarget = `                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                       {{ activity.actualCost ? 'ACTUAL' : 'ESTIMATED' }}
                                    </p>
                                 </div>
                               </div>`;
                               
const accountingReplacement = `                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                       {{ activity.actualCost ? 'ACTUAL' : 'ESTIMATED' }}
                                    </p>
                                    <button (click)="viewActivityDetails(activity.id)" class="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 justify-end w-full">
                                      Details <lucide-icon name="arrow-right" class="w-3 h-3"></lucide-icon>
                                    </button>
                                 </div>
                               </div>`;

if(code.includes(accountingTarget)) {
    code = code.replace(accountingTarget, accountingReplacement);
} else {
    console.log('Failed to patch accounting loop');
}

fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
console.log('Accounting patched');
