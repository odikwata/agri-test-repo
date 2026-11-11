const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const targetHeader = `                  <div>
                    <h2 class="text-lg font-bold text-slate-800">{{ getStatusLabel(detail.activityType) }}</h2>
                    <p class="text-sm text-slate-500">ID: {{ detail.id }}</p>
                  </div>
                </div>
                <button (click)="closeActivityDetailModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                  <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
                </button>
              </div>`;
              
const replacementHeader = `                  <div>
                    <h2 class="text-lg font-bold text-slate-800">{{ getStatusLabel(detail.activityType) }}</h2>
                    <p class="text-sm text-slate-500">ID: {{ detail.id }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <button (click)="openUpdateStatusModal()" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <lucide-icon name="edit" class="w-4 h-4"></lucide-icon>
                    Update Status
                  </button>
                  <button (click)="closeActivityDetailModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
                  </button>
                </div>
              </div>`;

if(code.includes(targetHeader)) {
    code = code.replace(targetHeader, replacementHeader);
    fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
    console.log('Patched header');
} else {
    console.log('Target header not found');
}
