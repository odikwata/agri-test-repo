const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const targetModalEnd = `<!-- Log Activity Modal -->`;

const updateModalHtml = `<!-- Update Status Modal -->
      @if (showUpdateStatusModal()) {
        <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[60] p-4">
          <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <lucide-icon name="edit" class="w-5 h-5 text-emerald-600"></lucide-icon>
                Update Activity Status
              </h2>
              <button (click)="closeUpdateStatusModal()" class="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <div class="p-6 overflow-y-auto">
              <form [formGroup]="updateStatusForm" (ngSubmit)="submitUpdateStatus()" class="space-y-6">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">New Status *</label>
                        <select formControlName="status" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="">Select Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="PLANNED">Planned</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="SKIPPED">Skipped</option>
                            <option value="OVERDUE">Overdue</option>
                        </select>
                        @if (updateStatusForm.get('status')?.touched && updateStatusForm.get('status')?.invalid) {
                          <p class="text-xs text-red-500 mt-1">Status is required.</p>
                        }
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Updated By</label>
                        <input type="text" formControlName="updatedBy" placeholder="e.g. John Doe" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Remarks</label>
                    <textarea formControlName="remarks" rows="2" placeholder="Add any notes about this status change..." class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                </div>

                <div class="border-t border-slate-200 pt-6">
                    <div class="flex items-center justify-between mb-4">
                       <h3 class="font-bold text-slate-800 flex items-center gap-2">
                          <lucide-icon name="box" class="w-4 h-4 text-slate-500"></lucide-icon>
                          Resources Used (Optional)
                       </h3>
                       <button type="button" (click)="addResourceUsage()" class="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon> Add Resource
                       </button>
                    </div>

                    <div formArrayName="resourcesUsed" class="space-y-4">
                       @for (resourceCtrl of resourcesUsedControls.controls; track $index) {
                          <div [formGroupName]="$index" class="p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                             <button type="button" (click)="removeResourceUsage($index)" class="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                             </button>
                             
                             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                   <label class="block text-xs font-bold text-slate-700 mb-1">Resource Type *</label>
                                   <select formControlName="resourceType" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                      <option value="INVENTORY_ITEM">Inventory Item</option>
                                      <option value="LABOR">Labor</option>
                                      <option value="MACHINERY">Machinery</option>
                                      <option value="OTHER">Other</option>
                                   </select>
                                </div>
                                <div>
                                   <label class="block text-xs font-bold text-slate-700 mb-1">Resource Name</label>
                                   <input type="text" formControlName="resourceName" placeholder="e.g. NPK Fertilizer" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                </div>
                                <div>
                                   <label class="block text-xs font-bold text-slate-700 mb-1">Quantity Used *</label>
                                   <input type="number" step="0.01" formControlName="quantityUsed" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                </div>
                                <div>
                                   <label class="block text-xs font-bold text-slate-700 mb-1">Unit of Measure *</label>
                                   <select formControlName="unitOfMeasure" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                      <option value="KILOGRAM">Kilogram (kg)</option>
                                      <option value="LITRE">Litre (L)</option>
                                      <option value="MILLILITRE">Millilitre (ml)</option>
                                      <option value="PIECE">Piece</option>
                                      <option value="HOUR">Hour</option>
                                   </select>
                                </div>
                             </div>
                          </div>
                       }
                       @if (resourcesUsedControls.controls.length === 0) {
                          <div class="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
                             <p class="text-sm text-slate-500">No resources logged for this update.</p>
                          </div>
                       }
                    </div>
                </div>
              </form>
            </div>
            <div class="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50 rounded-b-2xl">
              <button (click)="closeUpdateStatusModal()" type="button" class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button (click)="submitUpdateStatus()" [disabled]="isSubmittingUpdateStatus() || updateStatusForm.invalid" class="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                @if (isSubmittingUpdateStatus()) {
                  <lucide-icon name="loader-2" class="w-4 h-4 animate-spin"></lucide-icon>
                  Saving...
                } @else {
                  Save Status
                }
              </button>
            </div>
          </div>
        </div>
      }
<!-- Log Activity Modal -->`;

if(code.includes(targetModalEnd)) {
    code = code.replace(targetModalEnd, updateModalHtml);
    fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
    console.log('Patched modal html');
} else {
    console.log('Target end modal not found');
}
