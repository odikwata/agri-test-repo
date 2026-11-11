const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const modalReplacement = `<!-- Activity Detail Modal -->
      @if (showActivityDetailModal()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            @if (isLoadingActivityDetail()) {
              <div class="p-12 flex flex-col items-center justify-center text-slate-500">
                <lucide-icon name="loader-2" class="w-8 h-8 animate-spin mb-4 text-emerald-600"></lucide-icon>
                <p class="font-bold">Loading details...</p>
              </div>
            } @else { @if (selectedActivityDetail(); as detail) {
              <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm" [ngClass]="getActivityColorClass(detail.activityType)">
                    <lucide-icon [name]="getActivityIcon(detail.activityType)" class="w-5 h-5"></lucide-icon>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-slate-800">{{ getStatusLabel(detail.activityType) }}</h2>
                    <p class="text-sm text-slate-500">ID: {{ detail.id }}</p>
                  </div>
                </div>
                <button (click)="closeActivityDetailModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                  <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
                </button>
              </div>
              <div class="p-6 overflow-y-auto">
                <div class="space-y-6">
                  
                  <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                     <p class="text-sm font-medium text-slate-700">{{ detail.description }}</p>
                     <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                           <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                           <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" [ngClass]="getStatusClass(detail.currentStage.status || 'PENDING')">
                              {{ getStatusLabel(detail.currentStage.status || 'PENDING') }}
                           </span>
                        </div>
                        <div>
                           <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
                           <span class="text-sm font-bold text-slate-700">{{ detail.priority }}</span>
                        </div>
                        <div>
                           <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assignee</p>
                           <span class="text-sm font-bold text-slate-700">{{ detail.assignee || 'Unassigned' }}</span>
                        </div>
                        <div>
                           <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Area</p>
                           <span class="text-sm font-bold text-slate-700">{{ detail.targetAreaHa ? detail.targetAreaHa + ' Ha' : 'N/A' }}</span>
                        </div>
                     </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div class="border border-slate-200 rounded-xl p-4">
                        <h4 class="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                           <lucide-icon name="calendar" class="w-4 h-4 text-emerald-600"></lucide-icon>
                           Schedule
                        </h4>
                        <div class="space-y-2 text-sm">
                           <div class="flex justify-between">
                              <span class="text-slate-500">Planned Start:</span>
                              <span class="font-medium text-slate-800">{{ detail.plannedStartDate | date:'mediumDate' }}</span>
                           </div>
                           <div class="flex justify-between">
                              <span class="text-slate-500">Planned End:</span>
                              <span class="font-medium text-slate-800">{{ detail.plannedEndDate | date:'mediumDate' }}</span>
                           </div>
                           @if (detail.actualStartDate) {
                             <div class="flex justify-between">
                                <span class="text-slate-500">Actual Start:</span>
                                <span class="font-medium text-emerald-600">{{ detail.actualStartDate | date:'mediumDate' }}</span>
                             </div>
                           }
                           @if (detail.actualEndDate) {
                             <div class="flex justify-between">
                                <span class="text-slate-500">Actual End:</span>
                                <span class="font-medium text-emerald-600">{{ detail.actualEndDate | date:'mediumDate' }}</span>
                             </div>
                           }
                        </div>
                     </div>

                     <div class="border border-slate-200 rounded-xl p-4">
                        <h4 class="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                           <lucide-icon name="dollar-sign" class="w-4 h-4 text-emerald-600"></lucide-icon>
                           Financials
                        </h4>
                        <div class="space-y-2 text-sm">
                           <div class="flex justify-between items-center">
                              <span class="text-slate-500">Estimated Cost:</span>
                              <span class="font-medium text-slate-800">{{ detail.estimatedCost | currency }}</span>
                           </div>
                           <div class="flex justify-between items-center pt-2 border-t border-slate-100">
                              <span class="text-slate-500 font-bold">Actual Cost:</span>
                              <span class="font-black text-emerald-600 text-lg">{{ detail.actualCost | currency }}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  @if (detail.resourcesUsed && detail.resourcesUsed.length > 0) {
                     <div>
                        <h4 class="font-bold text-slate-800 text-sm mb-3">Resources Used</h4>
                        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
                           <table class="w-full text-left text-sm">
                              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                                 <tr>
                                    <th class="px-4 py-2">Resource</th>
                                    <th class="px-4 py-2 text-right">Quantity</th>
                                    <th class="px-4 py-2 text-right">Total Cost</th>
                                 </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100">
                                 @for (res of detail.resourcesUsed; track res.id) {
                                    <tr>
                                       <td class="px-4 py-2 font-medium text-slate-800">{{ res.resourceName }}</td>
                                       <td class="px-4 py-2 text-right text-slate-600">{{ res.quantityUsed }} {{ res.unitOfMeasure }}</td>
                                       <td class="px-4 py-2 text-right text-slate-800 font-bold">{{ res.totalCost | currency }}</td>
                                    </tr>
                                 }
                              </tbody>
                           </table>
                        </div>
                     </div>
                  }

                </div>
              </div>
            } @else {
              <div class="p-12 flex flex-col items-center justify-center text-slate-500">
                <p class="font-bold">Failed to load activity details.</p>
              </div>
            } }
          </div>
        </div>
      }`;

if (code.includes('<!-- Modal disabled for testing -->')) {
  code = code.replace('<!-- Modal disabled for testing -->', modalReplacement);
  fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
  console.log('Restored modal');
} else {
  console.log('Could not find placeholder to restore modal');
}
