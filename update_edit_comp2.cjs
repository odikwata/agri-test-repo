const fs = require('fs');

let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">[\s\S]*?(?=<\/div>\s*<\/div>\s*<!-- Canvas Area -->)/;

const newPropertiesPanel = `<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Properties</h3>
                <button (click)="deleteSelected()" class="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors">
                  <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                </button>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" [(ngModel)]="selectedElement.name" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select [(ngModel)]="selectedElement.type" (ngModelChange)="onTypeChange($event)" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="CROP_FIELD">Crop Field</option>
                    <option value="PADDOCK">Paddock</option>
                    <option value="GREENHOUSE">Greenhouse</option>
                    <option value="ORCHARD">Orchard</option>
                    <option value="FEEDLOT">Feedlot</option>
                  </select>
                </div>

                @if (isLoadingAttributes) {
                  <div class="text-sm text-slate-500 py-2">Loading attributes...</div>
                }

                @for (attr of currentAttributes; track attr.name) {
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">{{ attr.name }}</label>
                    
                    @if (attr.valueSelection) {
                      <select [ngModel]="selectedElement.attributes?.[attr.name]" (ngModelChange)="setAttribute(attr.name, $event)" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option [value]="undefined">Select {{ attr.name }}</option>
                        @for (opt of getAttributeOptions(attr); track opt.key) {
                          <option [value]="opt.key">{{ opt.value }}</option>
                        }
                      </select>
                    } @else {
                      <input type="text" [ngModel]="selectedElement.attributes?.[attr.name]" (ngModelChange)="setAttribute(attr.name, $event)" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    }
                  </div>
                }

              </div>
            </div>`;

code = code.replace(regex, newPropertiesPanel);

// Ensure the mode change code uses proper types
code = code.replace(/type: this\.mode === 'draw-field' \? 'field' : 'block',/g, "type: this.mode === 'draw-field' ? 'CROP_FIELD' : 'PADDOCK', attributes: {},");

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
