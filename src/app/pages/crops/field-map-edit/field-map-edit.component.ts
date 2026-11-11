import { FarmService } from '../../../services/farm.service';
import { SessionService } from '../../../services/session.service';
import { Component, ViewChild, ViewChildren, QueryList, OnInit, AfterViewInit, OnDestroy, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, Router } from '@angular/router';
import { FieldMapService, MapElement, CreateManagementUnitRequest } from '../../../services/field-map.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule, GoogleMap, MapPolygon } from '@angular/google-maps';

@Component({
  selector: 'app-field-map-edit',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule, GoogleMapsModule],
  template: `
    <div class="p-6 h-[calc(100vh-2rem)] flex flex-col space-y-4 relative">
      <!-- Header Toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div class="flex items-center gap-3">
          <a routerLink="/crops" class="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" title="Return to Field Map">
            <lucide-icon name="arrow-left" class="w-5 h-5 text-slate-600"></lucide-icon>
          </a>
          <div class="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <lucide-icon name="map" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Cadastre Map Editor</h1>
              @if (farmBoundaryPaths.length > 0) {
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono text-[10px] font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  PERIMETER ENFORCED
                </span>
              }
            </div>
            <p class="text-slate-500 font-mono text-xs">
              {{ farmName() }} &bull; {{ farmLocation() }} &bull; Partition and manage field boundaries strictly within the farm
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          @if (farmBoundaryPaths.length > 0) {
            <button 
              type="button"
              (click)="fitToFarmBoundary()" 
              class="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Reset view and zoom to farm boundary">
              <lucide-icon name="maximize" class="w-3.5 h-3.5 text-emerald-700"></lucide-icon>
              <span>Fit Farm Boundary</span>
            </button>
          }
          <button 
            type="button"
            (click)="promptClearMap()" 
            [disabled]="elements.length === 0"
            class="px-3.5 py-2 text-red-600 hover:bg-red-50 border border-red-200/60 font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            Clear All ({{ elements.length }})
          </button>
          <button 
            type="button"
            (click)="saveMap()" 
            class="px-4 py-2 bg-[#012d1d] hover:bg-[#023f29] text-white font-mono text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
            <lucide-icon name="save" class="w-4 h-4"></lucide-icon>
            <span>Save Cadastre</span>
          </button>
        </div>
      </div>

      <!-- Main Workspace -->
      <div class="flex gap-6 flex-1 min-h-0">
        <!-- Tools & Properties Panel Sidebar -->
        <div class="w-80 flex flex-col gap-5 overflow-y-auto pr-1 shrink-0">
          
          <!-- Drawing Tools Card -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Partitioning Tools</h3>
            <div class="space-y-2">
              <button 
                type="button"
                (click)="setMode('select')" 
                [class.bg-slate-100]="mode === 'select'" 
                [class.border-slate-300]="mode === 'select'" 
                class="w-full flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-50 transition-colors text-left cursor-pointer">
                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <lucide-icon name="mouse-pointer" class="w-4 h-4 text-slate-600"></lucide-icon>
                </div>
                <div>
                  <div class="font-bold text-sm text-slate-900">Select &amp; Edit</div>
                  <div class="text-xs text-slate-500">Inspect &amp; modify existing units</div>
                </div>
              </button>

              <button 
                type="button"
                (click)="setMode('draw-field')" 
                [class.bg-emerald-50]="mode === 'draw-field'" 
                [class.border-emerald-300]="mode === 'draw-field'" 
                class="w-full flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-emerald-50/60 transition-colors text-left cursor-pointer group">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <lucide-icon name="square" class="w-4 h-4 text-emerald-700"></lucide-icon>
                </div>
                <div>
                  <div class="font-bold text-sm text-slate-900">Draw Field</div>
                  <div class="text-xs text-slate-500">Partition new arable crop field</div>
                </div>
              </button>

              <button 
                type="button"
                (click)="setMode('draw-block')" 
                [class.bg-amber-50]="mode === 'draw-block'" 
                [class.border-amber-300]="mode === 'draw-block'" 
                class="w-full flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-amber-50/60 transition-colors text-left cursor-pointer group">
                <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <lucide-icon name="layout-grid" class="w-4 h-4 text-amber-700"></lucide-icon>
                </div>
                <div>
                  <div class="font-bold text-sm text-slate-900">Draw Block / Paddock</div>
                  <div class="text-xs text-slate-500">Partition grazing or nursery block</div>
                </div>
              </button>
            </div>

            <!-- Farm Perimeter Constraint Notice -->
            <div class="mt-4 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-[11px] font-mono text-emerald-950 flex items-start gap-2.5">
              <lucide-icon name="info" class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"></lucide-icon>
              <div>
                <span class="font-bold block uppercase tracking-wide text-emerald-900">Farm Boundary Enforced</span>
                All fields and blocks must be drawn entirely inside the green perimeter envelope. Shapes extending outside will be rejected.
              </div>
            </div>
          </div>

          <!-- Mapped Units List (Direct Selection & Quick Delete) -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Mapped Units ({{ elements.length }})
              </h3>
              @if (elements.length > 0) {
                <span class="text-[10px] font-mono text-slate-400">Click to select &bull; Delete</span>
              }
            </div>

            @if (elements.length === 0) {
              <div class="py-4 text-center border border-dashed border-slate-200 rounded-xl">
                <p class="text-xs font-mono text-slate-400">No fields or blocks mapped yet.</p>
                <p class="text-[11px] font-mono text-slate-400 mt-0.5">Use "Draw Field" or "Draw Block" above.</p>
              </div>
            } @else {
              <div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                @for (el of elements; track el.id) {
                  <div 
                    (click)="selectElementFromList(el.id)"
                    [class.border-emerald-500]="selectedShapeId === el.id"
                    [class.bg-emerald-50/40]="selectedShapeId === el.id"
                    [class.border-slate-200]="selectedShapeId !== el.id"
                    class="group p-2.5 rounded-xl border hover:border-slate-300 hover:bg-slate-50/80 transition-all flex items-center justify-between gap-2 cursor-pointer">
                    <div class="flex items-center gap-2 min-w-0">
                      <span 
                        [class.bg-emerald-500]="el.type === 'CROP_FIELD' || el.type === 'field'"
                        [class.bg-amber-500]="el.type !== 'CROP_FIELD' && el.type !== 'field'"
                        class="w-2.5 h-2.5 rounded-full shrink-0"></span>
                      <div class="min-w-0">
                        <div class="text-xs font-bold font-mono text-slate-900 truncate">{{ el.name }}</div>
                        <div class="text-[10px] font-mono text-slate-400">{{ el.size || 0 }} ha &bull; {{ el.type === 'CROP_FIELD' ? 'Field' : 'Block' }}</div>
                      </div>
                    </div>
                    
                    <!-- Direct Delete Button on List Row -->
                    <button 
                      type="button"
                      (click)="$event.stopPropagation(); promptDelete(el.id)"
                      class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Delete {{ el.name }}">
                      <lucide-icon name="trash-2" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Properties Panel (Shows when a shape is selected) -->
          @if (selectedElement) {
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 class="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">Unit Attributes</h3>
                  <span class="text-[10px] font-mono text-slate-400">Selected: {{ selectedElement.name }}</span>
                </div>
                <button 
                  type="button"
                  (click)="promptDelete(selectedElement.id)" 
                  class="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                  title="Delete {{ selectedElement.name }}">
                  <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                </button>
              </div>

              <div class="space-y-3.5">
                <div>
                  <label class="block text-xs font-mono font-bold text-slate-600 uppercase mb-1">Unit Name</label>
                  <input type="text" [(ngModel)]="selectedElement.name" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono text-xs font-bold text-slate-800">
                </div>
                
                <div>
                  <label class="block text-xs font-mono font-bold text-slate-600 uppercase mb-1">Calculated Area (Hectares)</label>
                  <input type="number" step="0.01" [(ngModel)]="selectedElement.size" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono text-xs font-bold text-slate-800">
                </div>
                
                <div>
                  <label class="block text-xs font-mono font-bold text-slate-600 uppercase mb-1">Land Unit Classification</label>
                  <select [(ngModel)]="selectedElement.type" (ngModelChange)="onTypeChange($event)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono text-xs font-bold text-slate-800">
                    <option value="CROP_FIELD">Arable Crop Field</option>
                    <option value="PADDOCK">Pasture / Paddock</option>
                    <option value="GREENHOUSE">Protected Greenhouse</option>
                    <option value="ORCHARD">Orchard / Vine Sector</option>
                    <option value="FEEDLOT">Intensive Feedlot</option>
                  </select>
                </div>

                @if (isLoadingAttributes) {
                  <div class="text-xs font-mono text-slate-400 py-1 flex items-center gap-1.5">
                    <lucide-icon name="loader-2" class="w-3.5 h-3.5 animate-spin"></lucide-icon>
                    <span>Loading agronomic attributes...</span>
                  </div>
                }

                @for (attr of currentAttributes; track attr.name) {
                  <div>
                    <label class="block text-xs font-mono font-bold text-slate-600 uppercase mb-1">{{ attr.name }}</label>
                    
                    @if (attr.valueSelection) {
                      <select [ngModel]="getAttributeValue(attr)" (ngModelChange)="setAttribute(attr, $event)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono text-xs font-bold text-slate-800">
                        <option [value]="attr.id">Select {{ attr.name }}</option>
                        @for (opt of getAttributeOptions(attr); track opt.key) {
                          <option [value]="opt.key">{{ opt.value }}</option>
                        }
                      </select>
                    } @else {
                      <input type="text" [ngModel]="getAttributeValue(attr)" (ngModelChange)="setAttribute(attr, $event)" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono text-xs font-bold text-slate-800">
                    }
                  </div>
                }

                <!-- Prominent Delete Action Button in Panel -->
                <button 
                  type="button"
                  (click)="promptDelete(selectedElement.id)" 
                  class="w-full mt-3 py-2.5 px-3 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 hover:border-red-300 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                  <lucide-icon name="trash-2" class="w-3.5 h-3.5"></lucide-icon>
                  <span>Delete {{ selectedElement.type === 'CROP_FIELD' ? 'Field' : 'Block' }}</span>
                </button>
              </div>
            </div>
          }
        </div>

        <!-- GIS Canvas Area -->
        <div class="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative flex flex-col">
          <!-- Boundary Violation Alert Banner -->
          @if (boundaryError()) {
            <div class="absolute top-4 left-4 right-4 z-20 flex items-start justify-between gap-3 p-4 bg-red-600/95 backdrop-blur-md text-white rounded-2xl shadow-xl border border-red-500 animate-in fade-in slide-in-from-top-2 duration-200">
              <div class="flex items-start gap-3">
                <div class="p-1.5 bg-red-700/70 rounded-lg shrink-0 mt-0.5">
                  <lucide-icon name="alert-triangle" class="w-5 h-5 text-white"></lucide-icon>
                </div>
                <div>
                  <h4 class="text-xs font-mono font-bold uppercase tracking-wider">Perimeter Constraint Enforced</h4>
                  <p class="text-xs font-mono text-red-100 mt-0.5">{{ boundaryError() }}</p>
                </div>
              </div>
              <button 
                type="button"
                (click)="boundaryError.set(null)" 
                class="p-1.5 hover:bg-red-700/80 rounded-lg transition-colors cursor-pointer text-white shrink-0">
                <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          }

          <!-- Success Notification Banner -->
          @if (successNotification()) {
            <div class="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 p-3.5 bg-emerald-800/95 backdrop-blur-md text-white rounded-2xl shadow-xl border border-emerald-700 animate-in fade-in slide-in-from-top-2 duration-200 font-mono text-xs">
              <div class="flex items-center gap-2.5">
                <lucide-icon name="check-circle" class="w-5 h-5 text-emerald-300 shrink-0"></lucide-icon>
                <span>{{ successNotification() }}</span>
              </div>
              <button 
                type="button"
                (click)="successNotification.set(null)" 
                class="p-1 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer text-white">
                <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          }

          <!-- Map Container -->
          <div class="absolute inset-0">
            <google-map 
              height="100%" 
              width="100%" 
              [center]="center" 
              [zoom]="15" 
              (mapInitialized)="onMapInitialized($event)" 
              [options]="mapOptions">
              
              <!-- Farm Boundary Envelope (Fixed Cadastre Perimeter) -->
              @if (farmBoundaryPaths.length > 0) {
                <map-polygon 
                  [paths]="farmBoundaryPaths" 
                  [options]="farmBoundaryOptions">
                </map-polygon>
                <map-marker 
                  [position]="farmCenter()" 
                  [title]="farmName() + ' Boundary'" 
                  [options]="farmMarkerOptions">
                </map-marker>
              }

              <!-- Subdivided Fields & Blocks -->
              @for (el of elements; track el.id) {
                <map-polygon 
                  [paths]="el.paths" 
                  [options]="getPolygonOptions(el.id, el.type)"
                  (polygonClick)="onPolygonClick(el.id)"
                  (polygonDragend)="onPolygonChange($event, el.id)"
                  (polygonComplete)="onPolygonChange($event, el.id)">
                </map-polygon>
                <map-marker [position]="getCenterOfPolygon(el.paths)" [title]="el.name" [label]="el.name"></map-marker>
              }
            </google-map>
          </div>
        </div>
      </div>

      <!-- In-App Delete Confirmation Modal (Replaces browser confirm) -->
      @if (unitToDelete(); as unit) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <lucide-icon name="trash-2" class="w-5 h-5"></lucide-icon>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">
                  Delete {{ unit.type === 'CROP_FIELD' ? 'Field' : 'Block' }}?
                </h3>
                <p class="text-xs font-mono text-slate-500 mt-1">
                  Are you sure you want to remove <span class="font-bold text-slate-900 font-mono">"{{ unit.name }}"</span>? Its boundary polygon will be permanently removed from this farm cadastre.
                </p>
                <div class="mt-2 text-[11px] font-mono text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  Size: {{ unit.size || 0 }} ha &bull; Classification: {{ unit.type }}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button 
                type="button"
                (click)="cancelDelete()" 
                class="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-mono text-xs font-bold text-slate-700 transition-colors cursor-pointer">
                Cancel
              </button>
              <button 
                type="button"
                (click)="confirmDelete()" 
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
                <lucide-icon name="trash-2" class="w-3.5 h-3.5"></lucide-icon>
                <span>Delete Area</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- In-App Clear All Confirmation Modal -->
      @if (showClearModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <lucide-icon name="alert-triangle" class="w-5 h-5"></lucide-icon>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Clear All Mapped Areas?</h3>
                <p class="text-xs font-mono text-slate-500 mt-1">
                  This will remove all <span class="font-bold text-slate-900">{{ elements.length }} mapped fields and blocks</span> from the editor. The outer farm boundary will remain intact.
                </p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button 
                type="button"
                (click)="showClearModal.set(false)" 
                class="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-mono text-xs font-bold text-slate-700 transition-colors cursor-pointer">
                Cancel
              </button>
              <button 
                type="button"
                (click)="confirmClearMap()" 
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-xs font-bold transition-colors shadow-sm cursor-pointer">
                Clear All Areas
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class FieldMapEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChildren(MapPolygon) polygons!: QueryList<MapPolygon>;
  
  drawingManager: any = null;
  
  private fieldMapService = inject(FieldMapService);
  private farmService = inject(FarmService);
  private sessionService = inject(SessionService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  elements: MapElement[] = [];
  mode: 'select' | 'draw-field' | 'draw-block' = 'select';
  selectedShapeId: string | null = null;
  
  center: google.maps.LatLngLiteral = { lat: -23.9867, lng: 24.5681 };
  farmBoundaryPaths: google.maps.LatLngLiteral[] = [];
  farmCenter = signal<google.maps.LatLngLiteral>({ lat: -23.9867, lng: 24.5681 });
  farmName = signal<string>('D Oasis Commercial Farm');
  farmLocation = signal<string>('Maboane / Gabane');
  boundaryError = signal<string | null>(null);
  successNotification = signal<string | null>(null);

  // In-app deletion dialog states
  unitToDelete = signal<MapElement | null>(null);
  showClearModal = signal<boolean>(false);
  deletedUnitIds = signal<string[]>([]);

  private cachedBounds: google.maps.LatLngBounds | null = null;
  
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'satellite',
    disableDoubleClickZoom: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true
  };

  farmBoundaryOptions: google.maps.PolygonOptions = {
    fillColor: '#10b981',
    fillOpacity: 0.05,
    strokeColor: '#059669',
    strokeWeight: 2.5,
    strokeOpacity: 0.95,
    clickable: false,
    zIndex: 0
  };

  farmMarkerOptions: google.maps.MarkerOptions = {
    icon: {
      path: google?.maps?.SymbolPath?.CIRCLE || 0,
      scale: 5,
      fillColor: '#059669',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2
    }
  };

  currentAttributes: any[] = [];
  isLoadingAttributes = false;
  attributesCache: Record<string, any[]> = {};

  onTypeChange(newType: string) {
    if (!newType) return;
    if (!this.selectedElement) return;
    if (!this.selectedElement.attributes) {
      this.selectedElement.attributes = [];
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
        
        if (this.selectedElement && (!this.selectedElement.attributes || this.selectedElement.attributes.length === 0)) {
          this.selectedElement.attributes = attrs.map(a => ({
            landAttributeId: a.id || '',
            name: a.name || '',
            value: ''
          }));
        }
      },
      error: () => {
        this.isLoadingAttributes = false;
      }
    });
  }

  getAttributeValue(attr: any): string {
    if (!this.selectedElement || !this.selectedElement.attributes) return '';
    const attrId = this.getAttributeId(attr);
    const existing = this.selectedElement.attributes.find((a: any) => (a.landAttributeId === attrId || a.id === attrId || a.name === attr.name));
    return existing ? existing.value : '';
  }

  setAttribute(attr: any, value: string) {
    if (!this.selectedElement) return;
    if (!this.selectedElement.attributes) {
      this.selectedElement.attributes = [];
    }
    const attrId = this.getAttributeId(attr);
    const existing = this.selectedElement.attributes.find((a: any) => (a.landAttributeId === attrId || a.id === attrId || a.name === attr.name));
    if (existing) {
      existing.value = value;
    } else {
      this.selectedElement.attributes.push({
        landAttributeId: attrId || '',
        name: attr.name,
        value: value
      });
    }
  }

  getAttributeOptions(attr: any): { key: string; value: string }[] {
    if (!attr || !attr.valueSelection) return [];
    try {
      if (typeof attr.valueSelection === 'string') {
        const parsed = JSON.parse(attr.valueSelection);
        if (Array.isArray(parsed)) return parsed.map((item: any) => typeof item === 'string' ? { key: item, value: item } : item);
        return Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) }));
      }
      if (Array.isArray(attr.valueSelection)) {
        return attr.valueSelection.map((item: any) => typeof item === 'string' ? { key: item, value: item } : item);
      }
    } catch (e) {
      return [];
    }
    return [];
  }

  getAttributeId(attr: any): string {
    if (!attr) return '';
    if (typeof attr === 'string') return attr;
    if (attr.attributeId) {
      if (typeof attr.attributeId === 'object') {
        return attr.attributeId.id || attr.attributeId.name || '';
      }
      return attr.attributeId;
    }
    return attr.id;
  }
  
  ngOnInit() {
    this.elements = JSON.parse(JSON.stringify(this.fieldMapService.elements()));
    
    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      this.loadFarmAndFields(farmId);
    } else {
      this.farmService.getAllFarms().subscribe({
        next: (farms) => {
          if (farms && farms.length > 0) {
            const defaultFarm = farms[0];
            this.sessionService.setFarm(defaultFarm.id);
            this.loadFarmAndFields(defaultFarm.id);
          }
        },
        error: (err) => {
          console.error('Failed to load farms in editor', err);
        }
      });
    }
  }

  loadFarmAndFields(farmId: string) {
    this.farmService.getFarmById(farmId).subscribe({
      next: (farm: any) => {
        if (farm.name) this.farmName.set(farm.name);
        if (farm.location) this.farmLocation.set(farm.location);

        if (farm.boundaryGeoJson) {
          const points = this.extractLatLngsFromGeoJson(farm.boundaryGeoJson);
          if (points.length > 0) {
            this.farmBoundaryPaths = points;
            this.zoomToPoints(points);
          } else if (farm.latitude && farm.longitude) {
            this.setCenterCoords(Number(farm.latitude), Number(farm.longitude));
          }
        } else if (farm.latitude && farm.longitude) {
          this.setCenterCoords(Number(farm.latitude), Number(farm.longitude));
        }
      },
      error: (err) => {
        console.error('Failed to load farm in editor', err);
      }
    });

    if (this.elements.length === 0) {
      this.fieldMapService.loadFieldsForFarm(farmId).subscribe({
        next: (elements) => {
          this.elements = JSON.parse(JSON.stringify(elements));
          this.fieldMapService.setElements(elements);
        },
        error: (err) => {
          console.error('Failed to load fields in editor', err);
        }
      });
    }
  }

  extractLatLngsFromGeoJson(geoJsonRaw: any): google.maps.LatLngLiteral[] {
    const points: google.maps.LatLngLiteral[] = [];
    if (!geoJsonRaw) return points;

    let parsed: any = geoJsonRaw;
    if (typeof geoJsonRaw === 'string') {
      try {
        parsed = JSON.parse(geoJsonRaw);
      } catch (e) {
        return points;
      }
    }

    if (parsed.type === 'FeatureCollection' && Array.isArray(parsed.features)) {
      for (const feat of parsed.features) {
        points.push(...this.extractLatLngsFromGeoJson(feat.geometry));
      }
      return points;
    }

    if (parsed.type === 'Feature' && parsed.geometry) {
      return this.extractLatLngsFromGeoJson(parsed.geometry);
    }

    if (parsed.type === 'Polygon' && Array.isArray(parsed.coordinates)) {
      const outerRing = parsed.coordinates[0];
      if (Array.isArray(outerRing)) {
        for (const coord of outerRing) {
          if (Array.isArray(coord) && coord.length >= 2) {
            points.push({ lng: Number(coord[0]), lat: Number(coord[1]) });
          }
        }
      }
      return points;
    }

    if (parsed.type === 'MultiPolygon' && Array.isArray(parsed.coordinates)) {
      for (const poly of parsed.coordinates) {
        if (Array.isArray(poly) && Array.isArray(poly[0])) {
          for (const coord of poly[0]) {
            if (Array.isArray(coord) && coord.length >= 2) {
              points.push({ lng: Number(coord[0]), lat: Number(coord[1]) });
            }
          }
        }
      }
      return points;
    }

    return points;
  }

  zoomToPoints(points: google.maps.LatLngLiteral[]) {
    if (!points || points.length === 0) return;

    if (typeof google !== 'undefined' && google.maps && google.maps.LatLngBounds) {
      const bounds = new google.maps.LatLngBounds();
      for (const pt of points) {
        bounds.extend(new google.maps.LatLng(pt.lat, pt.lng));
      }

      this.cachedBounds = bounds;
      const centerLatLng = bounds.getCenter();
      const centerLit = { lat: centerLatLng.lat(), lng: centerLatLng.lng() };
      this.center = centerLit;
      this.farmCenter.set(centerLit);

      if (this.map && this.map.googleMap) {
        this.map.googleMap.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
      }
    } else {
      const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
      const avgLng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
      this.setCenterCoords(avgLat, avgLng);
    }
  }

  fitToFarmBoundary() {
    if (this.farmBoundaryPaths.length > 0) {
      this.zoomToPoints(this.farmBoundaryPaths);
    }
  }

  setCenterCoords(lat: number, lng: number) {
    this.center = { lat, lng };
    this.farmCenter.set({ lat, lng });
    if (this.map && this.map.googleMap) {
      this.map.googleMap.setCenter(this.center);
    }
  }

  get cleanFarmBoundary(): google.maps.LatLngLiteral[] {
    if (!this.farmBoundaryPaths || this.farmBoundaryPaths.length === 0) return [];
    const pts = [...this.farmBoundaryPaths];
    if (pts.length > 3) {
      const first = pts[0];
      const last = pts[pts.length - 1];
      if (Math.abs(first.lat - last.lat) < 1e-6 && Math.abs(first.lng - last.lng) < 1e-6) {
        pts.pop();
      }
    }
    return pts;
  }

  /**
   * POINT-IN-POLYGON & CONTAINMENT ALGORITHMS
   */
  isPointInsideFarm(point: { lat: number; lng: number }): boolean {
    const boundary = this.cleanFarmBoundary;
    if (!boundary || boundary.length < 3) {
      return true;
    }

    // 1. Google Maps geometry poly containsLocation
    if (window.google && google.maps && (google.maps as any).geometry && (google.maps as any).geometry.poly) {
      const gPoly = new google.maps.Polygon({ paths: boundary });
      const gPt = new google.maps.LatLng(point.lat, point.lng);
      if ((google.maps as any).geometry.poly.containsLocation(gPt, gPoly)) {
        return true;
      }
    }

    // 2. Pure Ray-Casting algorithm fallback (Even-Odd rule)
    const x = point.lng;
    const y = point.lat;
    let inside = false;

    for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
      const xi = boundary[i].lng, yi = boundary[i].lat;
      const xj = boundary[j].lng, yj = boundary[j].lat;

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }

  doLineSegmentsIntersect(
    a: { lat: number; lng: number },
    b: { lat: number; lng: number },
    c: { lat: number; lng: number },
    d: { lat: number; lng: number }
  ): boolean {
    if (
      Math.max(a.lng, b.lng) < Math.min(c.lng, d.lng) ||
      Math.min(a.lng, b.lng) > Math.max(c.lng, d.lng) ||
      Math.max(a.lat, b.lat) < Math.min(c.lat, d.lat) ||
      Math.min(a.lat, b.lat) > Math.max(c.lat, d.lat)
    ) {
      return false;
    }

    const crossProduct = (
      p1: { lat: number; lng: number },
      p2: { lat: number; lng: number },
      p3: { lat: number; lng: number }
    ) => {
      return (p2.lng - p1.lng) * (p3.lat - p1.lat) - (p2.lat - p1.lat) * (p3.lng - p1.lng);
    };

    const cp1 = crossProduct(a, b, c);
    const cp2 = crossProduct(a, b, d);
    const cp3 = crossProduct(c, d, a);
    const cp4 = crossProduct(c, d, b);

    return ((cp1 > 0 && cp2 < 0) || (cp1 < 0 && cp2 > 0)) &&
           ((cp3 > 0 && cp4 < 0) || (cp3 < 0 && cp4 > 0));
  }

  isShapeInsideFarm(shapePoints: { lat: number; lng: number }[]): { valid: boolean; reason?: string } {
    const farm = this.cleanFarmBoundary;
    if (!farm || farm.length < 3) {
      return { valid: true };
    }

    if (!shapePoints || shapePoints.length === 0) {
      return { valid: false, reason: 'Shape has no vertices.' };
    }

    // Check all vertices
    for (let i = 0; i < shapePoints.length; i++) {
      const pt = shapePoints[i];
      if (!this.isPointInsideFarm(pt)) {
        return {
          valid: false,
          reason: `Vertex #${i + 1} (${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)}) is outside the farm perimeter.`
        };
      }
    }

    // Check center of shape
    const centerLat = shapePoints.reduce((s, p) => s + p.lat, 0) / shapePoints.length;
    const centerLng = shapePoints.reduce((s, p) => s + p.lng, 0) / shapePoints.length;
    if (!this.isPointInsideFarm({ lat: centerLat, lng: centerLng })) {
      return {
        valid: false,
        reason: 'Center of shape is outside the farm perimeter.'
      };
    }

    // Check boundary crossing intersections
    for (let i = 0; i < shapePoints.length; i++) {
      const nextI = (i + 1) % shapePoints.length;
      const s1 = shapePoints[i];
      const s2 = shapePoints[nextI];

      for (let j = 0; j < farm.length; j++) {
        const nextJ = (j + 1) % farm.length;
        const f1 = farm[j];
        const f2 = farm[nextJ];

        if (this.doLineSegmentsIntersect(s1, s2, f1, f2)) {
          return {
            valid: false,
            reason: 'Shape perimeter crosses the outer farm boundary line.'
          };
        }
      }
    }

    return { valid: true };
  }

  ngAfterViewInit() {
  }

  onMapInitialized(map: any) {
    this.initDrawingManager();
    if (this.cachedBounds && this.map && this.map.googleMap) {
      this.map.googleMap.fitBounds(this.cachedBounds, { top: 40, right: 40, bottom: 40, left: 40 });
    } else if (this.farmBoundaryPaths.length > 0) {
      this.zoomToPoints(this.farmBoundaryPaths);
    }
  }

  initDrawingManager() {
    if (!window.google || !(google.maps as any).drawing) {
      setTimeout(() => this.initDrawingManager(), 500);
      return;
    }
    
    this.drawingManager = new (google.maps as any).drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#10b981',
        fillOpacity: 0.25,
        strokeColor: '#059669',
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 2
      }
    });
    
    if (this.map && this.map.googleMap) {
      this.drawingManager.setMap(this.map.googleMap);
    } else {
      setTimeout(() => this.initDrawingManager(), 500);
      return;
    }

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (e: any) => {
      if (e.type === (google.maps as any).drawing.OverlayType.POLYGON || e.type === 'polygon') {
        const polygon = e.overlay;
        const path = polygon.getPath();
        const points: { lat: number; lng: number }[] = [];
        for (let i = 0; i < path.getLength(); i++) {
          const pt = path.getAt(i);
          points.push({ lat: pt.lat(), lng: pt.lng() });
        }
        
        // Enforce containment
        const check = this.isShapeInsideFarm(points);
        if (!check.valid) {
          polygon.setMap(null);
          this.boundaryError.set(
            `Unit creation rejected: All fields and blocks must be created strictly within the farm boundary. ${check.reason || ''}`
          );
          setTimeout(() => {
            if (this.boundaryError()) {
              this.boundaryError.set(null);
            }
          }, 8000);
          if (this.cdr) (this.cdr as any).detectChanges();
          return;
        }

        this.boundaryError.set(null);

        let areaHectares = 0;
        if (window.google && google.maps.geometry && google.maps.geometry.spherical) {
          const sqMeters = google.maps.geometry.spherical.computeArea(path);
          areaHectares = Number((sqMeters / 10000).toFixed(2));
        }
        
        const isField = this.mode === 'draw-field';
        const newEl: MapElement = {
          id: Date.now().toString(),
          name: isField ? `Field ${this.elements.length + 1}` : `Block ${this.elements.length + 1}`,
          type: isField ? 'CROP_FIELD' : 'PADDOCK',
          attributes: [],
          paths: points,
          size: areaHectares
        };
        
        this.elements = [...this.elements, newEl];
        this.fieldMapService.setElements(this.elements);
        
        polygon.setMap(null);
        
        this.setMode('select');
        this.selectedShapeId = newEl.id;
        this.successNotification.set(`"${newEl.name}" created (${areaHectares} ha).`);
        setTimeout(() => {
          if (this.successNotification()) this.successNotification.set(null);
        }, 4000);

        if (this.cdr) (this.cdr as any).detectChanges();
      }
    });
  }

  setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
    this.mode = newMode;
    if (this.drawingManager) {
      if (newMode === 'select') {
        if (this.map && this.map.googleMap) {
          this.map.googleMap.setOptions({ draggableCursor: null });
        }
        this.drawingManager.setDrawingMode(null);
      } else {
        const isField = newMode === 'draw-field';
        const modeStr = (window as any).google.maps.drawing.OverlayType.POLYGON;
        if (this.map && this.map.googleMap) {
          this.map.googleMap.setOptions({ draggableCursor: 'crosshair' });
        }
        this.drawingManager.setOptions({
          drawingMode: modeStr,
          drawingControl: false,
          polygonOptions: {
            fillColor: isField ? '#10b981' : '#f59e0b',
            fillOpacity: 0.25,
            strokeColor: isField ? '#059669' : '#d97706',
            strokeWeight: 2,
            clickable: true,
            editable: true,
            zIndex: 2
          }
        });
        this.selectedShapeId = null;
      }
    }
    if (this.cdr) (this.cdr as any).detectChanges();
  }
  
  pathListeners: any[] = [];

  setupEditableListeners(id: string) {
    this.pathListeners.forEach(l => google.maps.event.removeListener(l));
    this.pathListeners = [];

    setTimeout(() => {
      if (!this.polygons) return;
      const polysArray = this.polygons.toArray();
      const index = this.elements.findIndex(el => el.id === id);
      if (index === -1) return;
      
      const offset = this.farmBoundaryPaths.length > 0 ? 1 : 0;
      const polyComponent = polysArray[index + offset];
      if (polyComponent && polyComponent.polygon) {
        const path = polyComponent.polygon.getPath();
        if (path) {
          const updateFn = () => this.updatePolygonSize(id, polyComponent.polygon);
          this.pathListeners.push(google.maps.event.addListener(path, 'set_at', updateFn));
          this.pathListeners.push(google.maps.event.addListener(path, 'insert_at', updateFn));
          this.pathListeners.push(google.maps.event.addListener(path, 'remove_at', updateFn));
        }
      }
    }, 100);
  }

  updatePolygonSize(id: string, polygon: any) {
    if (!polygon) return;
    const path = polygon.getPath();
    if (!path) return;
    
    let areaHectares = 0;
    if (window.google && google.maps.geometry && google.maps.geometry.spherical) {
      const sqMeters = google.maps.geometry.spherical.computeArea(path);
      areaHectares = Number((sqMeters / 10000).toFixed(2));
    }
    
    const index = this.elements.findIndex(el => el.id === id);
    if (index !== -1) {
      this.elements[index].size = areaHectares;
      const points: { lat: number; lng: number }[] = [];
      for (let i = 0; i < path.getLength(); i++) {
        const pt = path.getAt(i);
        points.push({ lat: pt.lat(), lng: pt.lng() });
      }
      this.elements[index].paths = points;

      const check = this.isShapeInsideFarm(points);
      if (!check.valid) {
        this.boundaryError.set(
          `Boundary Warning: "${this.elements[index].name}" extends outside the farm perimeter. Adjust vertices inside the farm.`
        );
      } else if (this.boundaryError()) {
        this.boundaryError.set(null);
      }

      if (this.cdr) (this.cdr as any).detectChanges();
    }
  }

  onPolygonClick(id: string) {
    if (this.mode === 'select') {
      this.selectElementFromList(id);
    }
  }

  selectElementFromList(id: string) {
    this.setMode('select');
    this.selectedShapeId = id;
    const el = this.elements.find(e => e.id === id);
    if (el) {
      if (el.type) {
        this.loadAttributesForType(el.type);
      }
      if (el.paths && el.paths.length > 0) {
        const center = this.getCenterOfPolygon(el.paths);
        if (this.map && this.map.googleMap) {
          this.map.googleMap.panTo(center);
        }
      }
      this.setupEditableListeners(id);
    }
    if (this.cdr) (this.cdr as any).detectChanges();
  }

  onPolygonChange(event: any, id: string) {
    setTimeout(() => {
      if (!this.polygons) return;
      const polysArray = this.polygons.toArray();
      const index = this.elements.findIndex(el => el.id === id);
      if (index === -1) return;
      const offset = this.farmBoundaryPaths.length > 0 ? 1 : 0;
      const polyComponent = polysArray[index + offset];
      if (polyComponent && polyComponent.polygon) {
        this.updatePolygonSize(id, polyComponent.polygon);
      }
    }, 100);
  }

  getPolygonOptions(id: string, type: string): google.maps.PolygonOptions {
    const isField = type === 'CROP_FIELD' || type === 'field';
    const isSelected = this.selectedShapeId === id;
    return {
      fillColor: isField ? '#10b981' : '#f59e0b',
      fillOpacity: isSelected ? 0.45 : 0.25,
      strokeColor: isField ? '#047857' : '#d97706',
      strokeWeight: isSelected ? 3 : 2,
      clickable: this.mode === 'select',
      editable: isSelected && this.mode === 'select',
      zIndex: isSelected ? 10 : 2
    };
  }

  getCenterOfPolygon(paths: { lat: number; lng: number }[]): google.maps.LatLngLiteral {
    if (!paths || paths.length === 0) return this.center;
    const lat = paths.reduce((sum, p) => sum + p.lat, 0) / paths.length;
    const lng = paths.reduce((sum, p) => sum + p.lng, 0) / paths.length;
    return { lat, lng };
  }

  /**
   * DELETE WORKFLOW
   * Supports immediate deletion of selected unit or direct item from list.
   * Uses in-app confirmation modal (no window.confirm).
   */
  promptDelete(id: string) {
    const unit = this.elements.find(el => el.id === id);
    if (unit) {
      this.unitToDelete.set(unit);
    }
  }

  cancelDelete() {
    this.unitToDelete.set(null);
  }

  confirmDelete() {
    const unit = this.unitToDelete();
    if (!unit) return;

    const id = unit.id;
    const unitName = unit.name;

    // Track for deletion on backend if it was persisted
    if (unit.rawUnit && unit.rawUnit.id) {
      this.deletedUnitIds.update(ids => [...ids, unit.rawUnit.id]);
      this.fieldMapService.deleteManagementUnit(unit.rawUnit.id).subscribe();
    }

    // Remove from local elements array
    this.elements = this.elements.filter(el => el.id !== id);
    this.fieldMapService.setElements(this.elements);

    if (this.selectedShapeId === id) {
      this.selectedShapeId = null;
    }

    // Clean up editable listeners
    this.pathListeners.forEach(l => google.maps.event.removeListener(l));
    this.pathListeners = [];

    this.unitToDelete.set(null);
    this.successNotification.set(`"${unitName}" was removed from the cadastre.`);
    setTimeout(() => {
      if (this.successNotification()) this.successNotification.set(null);
    }, 4000);

    if (this.cdr) (this.cdr as any).detectChanges();
  }

  promptClearMap() {
    if (this.elements.length > 0) {
      this.showClearModal.set(true);
    }
  }

  confirmClearMap() {
    for (const el of this.elements) {
      if (el.rawUnit && el.rawUnit.id) {
        this.deletedUnitIds.update(ids => [...ids, el.rawUnit.id]);
        this.fieldMapService.deleteManagementUnit(el.rawUnit.id).subscribe();
      }
    }
    this.elements = [];
    this.selectedShapeId = null;
    this.fieldMapService.setElements([]);
    this.showClearModal.set(false);
    this.successNotification.set('All mapped fields and blocks have been cleared.');
    setTimeout(() => {
      if (this.successNotification()) this.successNotification.set(null);
    }, 4000);

    if (this.cdr) (this.cdr as any).detectChanges();
  }

  deleteSelected() {
    if (this.selectedShapeId) {
      this.promptDelete(this.selectedShapeId);
    }
  }

  saveMap() {
    if (this.polygons) {
      const polysArray = this.polygons.toArray();
      const offset = this.farmBoundaryPaths.length > 0 ? 1 : 0;
      this.elements.forEach((el, index) => {
        const polyComponent = polysArray[index + offset];
        if (polyComponent && polyComponent.polygon) {
          const path = polyComponent.polygon.getPath();
          if (path && path.getLength() >= 3) {
            const points: { lat: number; lng: number }[] = [];
            for (let i = 0; i < path.getLength(); i++) {
              const pt = path.getAt(i);
              points.push({ lat: pt.lat(), lng: pt.lng() });
            }
            el.paths = points;
            
            if (window.google && google.maps.geometry && google.maps.geometry.spherical) {
              const sqMeters = google.maps.geometry.spherical.computeArea(path);
              el.size = Number((sqMeters / 10000).toFixed(2));
            }
          }
        }
      });
    }

    // Validate all remaining elements are within farm boundary
    for (const el of this.elements) {
      const check = this.isShapeInsideFarm(el.paths);
      if (!check.valid) {
        this.boundaryError.set(
          `Cannot save cadastre: "${el.name}" is outside the farm boundary. ${check.reason || ''}`
        );
        return;
      }
    }

    const farmId = this.sessionService.selectedFarmId();
    if (!farmId) {
      this.fieldMapService.setElements(this.elements);
      this.router.navigate(['/crops']);
      return;
    }

    const newElements = this.elements.filter((el: MapElement) => !el.rawUnit);
    
    if (newElements.length === 0) {
      this.fieldMapService.setElements(this.elements);
      this.router.navigate(['/crops']);
      return;
    }

    const createObservables = newElements.map((el: MapElement) => {
      const coordinates = el.paths.map((p: any) => [p.lng, p.lat]);
      if (coordinates.length > 0) {
        coordinates.push(coordinates[0]);
      }
      
      const geoJson = {
        type: "Polygon",
        coordinates: [coordinates]
      };

      const request: CreateManagementUnitRequest = {
        name: el.name,
        farmId: farmId,
        landUnitType: el.type,
        boundaryGeoJson: JSON.stringify(geoJson),
        areaHectares: el.size || 0.01,
        managementUnitAttributes: el.attributes
      };

      return this.fieldMapService.createManagementUnit(request);
    });

    forkJoin(createObservables).subscribe({
      next: () => {
        this.fieldMapService.setElements(this.elements);
        this.router.navigate(['/crops']);
      },
      error: (err) => {
        console.error('Failed to create management units', err.error || err);
        this.fieldMapService.setElements(this.elements);
        this.router.navigate(['/crops']);
      }
    });
  }

  get selectedElement() {
    return this.elements.find(el => el.id === this.selectedShapeId);
  }

  ngOnDestroy() {
    this.pathListeners.forEach(l => google.maps.event.removeListener(l));
    this.pathListeners = [];
  }
}
