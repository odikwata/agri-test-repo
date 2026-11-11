const fs = require('fs');

const code = `import { FarmService } from '../../../services/farm.service';
import { SessionService } from '../../../services/session.service';
import { Component, ViewChild, ViewChildren, QueryList, AfterViewInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, Router } from '@angular/router';
import { FieldMapService, MapElement } from '../../../services/field-map.service';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule, GoogleMap, MapPolygon } from '@angular/google-maps';

@Component({
  selector: 'app-field-map-edit',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule, GoogleMapsModule],
  template: \`
    <div class="p-6 h-[calc(100vh-2rem)] flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <a routerLink="/crops" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <lucide-icon name="arrow-left" class="w-5 h-5 text-slate-600"></lucide-icon>
          </a>
          <lucide-icon name="map" class="w-8 h-8 text-primary"></lucide-icon>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Map Editor</h1>
            <p class="text-slate-500 text-sm">Draw and configure fields and blocks</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="clearMap()" class="px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors">
            Clear Map
          </button>
          <button (click)="saveMap()" class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <lucide-icon name="save" class="w-4 h-4"></lucide-icon>
            Save Map
          </button>
        </div>
      </div>

      <div class="flex gap-6 flex-1 min-h-0">
        <!-- Tools & Properties Panel -->
        <div class="w-80 flex flex-col gap-6 overflow-y-auto pr-2">
          <!-- Drawing Tools -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 class="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Drawing Tools</h3>
            <div class="space-y-2">
              <button (click)="setMode('select')" [class.bg-slate-100]="mode === 'select'" [class.border-slate-300]="mode === 'select'" class="w-full flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-50 transition-colors text-left">
                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <lucide-icon name="mouse-pointer-2" class="w-4 h-4 text-slate-600"></lucide-icon>
                </div>
                <div>
                  <div class="font-semibold text-slate-900">Select & Edit</div>
                  <div class="text-xs text-slate-500">Modify existing shapes</div>
                </div>
              </button>

              <button (click)="setMode('draw-field')" [class.bg-emerald-50]="mode === 'draw-field'" [class.border-emerald-200]="mode === 'draw-field'" class="w-full flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-emerald-50 transition-colors text-left group">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <lucide-icon name="square" class="w-4 h-4 text-emerald-600"></lucide-icon>
                </div>
                <div>
                  <div class="font-semibold text-slate-900">Draw Field</div>
                  <div class="text-xs text-slate-500">Create a new field boundary</div>
                </div>
              </button>

              <button (click)="setMode('draw-block')" [class.bg-amber-50]="mode === 'draw-block'" [class.border-amber-200]="mode === 'draw-block'" class="w-full flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-amber-50 transition-colors text-left group">
                <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <lucide-icon name="grid" class="w-4 h-4 text-amber-600"></lucide-icon>
                </div>
                <div>
                  <div class="font-semibold text-slate-900">Draw Block</div>
                  <div class="text-xs text-slate-500">Subdivide field into blocks</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Properties Panel (Shows when a shape is selected) -->
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
                  <select [(ngModel)]="selectedElement.type" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="field">Field</option>
                    <option value="block">Block</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Soil Type</label>
                  <select [(ngModel)]="selectedElement.soilType" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="loam">Loam</option>
                    <option value="clay">Clay</option>
                    <option value="sandy">Sandy</option>
                    <option value="silt">Silt</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Irrigation System</label>
                  <select [(ngModel)]="selectedElement.irrigationSystem" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="drip">Drip Lines</option>
                    <option value="sprinkler">Sprinklers</option>
                    <option value="none">None / Dry</option>
                  </select>
                </div>

                @if (selectedElement.irrigationSystem === 'drip') {
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Number of Drip Lines</label>
                    <input type="number" [(ngModel)]="selectedElement.dripLines" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  </div>
                }
                
                @if (selectedElement.irrigationSystem === 'sprinkler') {
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Number of Sprinklers</label>
                    <input type="number" [(ngModel)]="selectedElement.sprinklersCount" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Canvas Area -->
        <div class="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
          <div class="absolute inset-0">
          <google-map height="100%" width="100%" [center]="center" [zoom]="15" (mapInitialized)="onMapInitialized($event)" [options]="{ mapTypeId: 'satellite', disableDoubleClickZoom: true }">
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
    </div>
  \`
})
export class FieldMapEditComponent implements AfterViewInit, OnDestroy {
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
  
  center: google.maps.LatLngLiteral = { lat: 41.876, lng: -87.641 };
  
  ngAfterViewInit() {
    this.elements = JSON.parse(JSON.stringify(this.fieldMapService.elements()));
    
    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      this.farmService.getFarmById(farmId).subscribe({
        next: (farm: any) => {
          if (farm.latitude && farm.longitude) {
            this.center = { lat: Number(farm.latitude), lng: Number(farm.longitude) };
            if (this.map && this.map.googleMap) {
              this.map.googleMap.setCenter(this.center);
            }
          }
        }
      });
    }
  }

  onMapInitialized(map: any) {
    this.initDrawingManager();
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
        fillOpacity: 0.2,
        strokeColor: '#059669',
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
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
        const points = [];
        for (let i = 0; i < path.getLength(); i++) {
          const pt = path.getAt(i);
          points.push({ lat: pt.lat(), lng: pt.lng() });
        }
        
        let areaHectares = 0;
        if (window.google && google.maps.geometry && google.maps.geometry.spherical) {
          const sqMeters = google.maps.geometry.spherical.computeArea(path);
          areaHectares = Number((sqMeters / 10000).toFixed(2));
        }
        
        const newEl: MapElement = {
          id: Date.now().toString(),
          name: this.mode === 'draw-field' ? 'New Field' : 'New Block',
          type: this.mode === 'draw-field' ? 'field' : 'block',
          paths: points,
          size: areaHectares
        };
        
        this.elements = [...this.elements, newEl];
        this.fieldMapService.setElements(this.elements);
        
        polygon.setMap(null);
        
        this.setMode('select');
        this.selectedShapeId = newEl.id;
        (this.cdr as any).detectChanges();
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
            fillOpacity: 0.2,
            strokeColor: isField ? '#059669' : '#d97706',
            strokeWeight: 2,
            clickable: true,
            editable: true,
            zIndex: 1
          }
        });
        this.selectedShapeId = null;
      }
    }
    (this.cdr as any).detectChanges();
  }
  
  onPolygonClick(id: string) {
    if (this.mode === 'select') {
      this.selectedShapeId = id;
      (this.cdr as any).detectChanges();
    }
  }

  onPolygonChange(event: any, id: string) {
    // optional logic
  }

  getPolygonOptions(id: string, type: 'field' | 'block'): google.maps.PolygonOptions {
    const isField = type === 'field';
    const isSelected = this.selectedShapeId === id;
    return {
      fillColor: isField ? '#10b981' : '#f59e0b',
      fillOpacity: isSelected ? 0.4 : 0.2,
      strokeColor: isField ? '#059669' : '#d97706',
      strokeWeight: isSelected ? 3 : 2,
      clickable: this.mode === 'select',
      editable: isSelected && this.mode === 'select',
      zIndex: isSelected ? 10 : 1
    };
  }

  getCenterOfPolygon(paths: { lat: number; lng: number }[]): google.maps.LatLngLiteral {
    if (!paths || paths.length === 0) return this.center;
    const lat = paths.reduce((sum, p) => sum + p.lat, 0) / paths.length;
    const lng = paths.reduce((sum, p) => sum + p.lng, 0) / paths.length;
    return { lat, lng };
  }

  saveMap() {
    if (this.polygons) {
      const polysArray = this.polygons.toArray();
      this.elements.forEach((el, index) => {
        const polyComponent = polysArray[index];
        if (polyComponent && polyComponent.polygon) {
          const path = polyComponent.polygon.getPath();
          if (path) {
            const points = [];
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
    
    this.fieldMapService.setElements(this.elements);
    this.router.navigate(['/crops/map']);
  }

  get selectedElement() {
    return this.elements.find(el => el.id === this.selectedShapeId);
  }

  clearMap() {
    if (confirm('Are you sure you want to clear all mapped areas?')) {
      this.elements = [];
      this.selectedShapeId = null;
    }
    (this.cdr as any).detectChanges();
  }

  deleteSelected() {
    if (this.selectedShapeId && confirm('Delete this area?')) {
      this.elements = this.elements.filter(el => el.id !== this.selectedShapeId);
      this.selectedShapeId = null;
    }
    (this.cdr as any).detectChanges();
  }

  ngOnDestroy() {}
}
`;
fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
