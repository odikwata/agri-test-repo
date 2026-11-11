const fs = require('fs');

let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

// We need to rewrite the Properties panel.
const propertiesRegex = /<!-- Properties Panel \(Shows when a shape is selected\) -->[\s\S]*?(?=<\/div>\s*<\/div>\s*<!-- Canvas Area -->)/;

const newPropertiesPanel = `<!-- Properties Panel (Shows when a shape is selected) -->
          @if (selectedElement) {
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
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
            </div>
          }`;

code = code.replace(propertiesRegex, newPropertiesPanel);

// Add state variables and methods to the class body
const classBodyRegex = /center: google\.maps\.LatLngLiteral = \{ lat: 41\.876, lng: -87\.641 \};/;
const newClassMembers = `center: google.maps.LatLngLiteral = { lat: 41.876, lng: -87.641 };
  
  currentAttributes: any[] = [];
  isLoadingAttributes = false;
  attributesCache: Record<string, any[]> = {};

  onTypeChange(newType: string) {
    if (!newType) return;
    if (!this.selectedElement) return;
    if (!this.selectedElement.attributes) {
      this.selectedElement.attributes = {};
    }
    
    this.loadAttributesForType(newType);
  }

  loadAttributesForType(type: string) {
    if (this.attributesCache[type]) {
      this.currentAttributes = this.attributesCache[type];
      return;
    }
    
    this.isLoadingAttributes = true;
    this.fieldMapService.getLandAttributes(type).subscribe({
      next: (attrs) => {
        this.attributesCache[type] = attrs;
        this.currentAttributes = attrs;
        this.isLoadingAttributes = false;
        if (this.cdr) (this.cdr as any).detectChanges();
      },
      error: (err) => {
        console.error('Failed to load attributes', err);
        this.currentAttributes = [];
        this.isLoadingAttributes = false;
        if (this.cdr) (this.cdr as any).detectChanges();
      }
    });
  }

  getAttributeOptions(attr: any): {key: string, value: any}[] {
    if (!attr.valueSelection) return [];
    return Object.keys(attr.valueSelection).map(k => ({ key: k, value: attr.valueSelection[k] }));
  }

  setAttribute(name: string, value: any) {
    if (this.selectedElement) {
      if (!this.selectedElement.attributes) {
        this.selectedElement.attributes = {};
      }
      this.selectedElement.attributes[name] = value;
    }
  }
`;

code = code.replace(classBodyRegex, newClassMembers);

// In setMode, drawing a new element, default type is CROP_FIELD or something
const drawRegex = /type: this\.mode === 'draw-field' \? 'field' : 'block',/;
code = code.replace(drawRegex, "type: this.mode === 'draw-field' ? 'CROP_FIELD' : 'PADDOCK', attributes: {},");

const onPolyClickRegex = /onPolygonClick\(id: string\) \{\s*if \(this\.mode === 'select'\) \{\s*this\.selectedShapeId = id;/;
const onPolyClickReplace = `onPolygonClick(id: string) {
    if (this.mode === 'select') {
      this.selectedShapeId = id;
      if (this.selectedElement && this.selectedElement.type) {
        this.loadAttributesForType(this.selectedElement.type);
      }`;
code = code.replace(onPolyClickRegex, onPolyClickReplace);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
