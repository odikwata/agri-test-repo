const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const target = `                  @if (detail.resourcesUsed && detail.resourcesUsed.length > 0) {`;

const replacement = `                  @if (detail.stageHistory && detail.stageHistory.length > 0) {
                     <div>
                        <h4 class="font-bold text-slate-800 text-sm mb-3">Stage History</h4>
                        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
                           <table class="w-full text-left text-sm">
                              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                                 <tr>
                                    <th class="px-4 py-2">Date</th>
                                    <th class="px-4 py-2">Status</th>
                                    <th class="px-4 py-2">Updated By</th>
                                    <th class="px-4 py-2">Remarks</th>
                                 </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100">
                                 @for (stage of detail.stageHistory; track stage.id) {
                                    <tr>
                                       <td class="px-4 py-3 whitespace-nowrap text-slate-500">{{ stage.enteredOn | date:'mediumDate' }}</td>
                                       <td class="px-4 py-3 whitespace-nowrap">
                                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" [ngClass]="getStatusClass(stage.status)">
                                             {{ getStatusLabel(stage.status) }}
                                          </span>
                                       </td>
                                       <td class="px-4 py-3 whitespace-nowrap text-slate-800">{{ stage.updatedBy || 'System' }}</td>
                                       <td class="px-4 py-3 text-slate-600 min-w-[200px]">{{ stage.remarks || '-' }}</td>
                                    </tr>
                                 }
                              </tbody>
                           </table>
                        </div>
                     </div>
                  }

                  @if (detail.resourcesUsed && detail.resourcesUsed.length > 0) {`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
    console.log('Successfully patched stage history');
} else {
    console.log('Target not found');
}
