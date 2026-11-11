const fs = require('fs');

let code = `import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FarmService } from '../../../services/farm.service';
import { SessionService } from '../../../services/session.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, Router } from '@angular/router';
import { FieldMapService, MapElement } from '../../../services/field-map.service';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-field-map',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, GoogleMapsModule],
  template: \`
    <div class="p-6 h-[calc(100vh-2rem)] flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <lucide-icon name="map" class="w-8 h-8 text-primary"></lucide-icon>
          <h1 class="text-3xl font-bold">Field Map</h1>
        </div>
        <div>
          <a routerLink="/crops/edit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
            <lucide-icon name="edit" class="w-4 h-4"></lucide-icon>
            Edit Map
          </a>
        </div>
      </div>

      <div class="flex-1 flex gap-4 overflow-hidden">
        <div class="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col relative">
          @if (elements().length === 0) {
            <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-white bg-opacity-90">
              <lucide-icon name="map" class="w-16 h-16 mb-4 opacity-20"></lucide-icon>
              <p class="text-lg font-medium">No fields or blocks mapped yet.</p>
              <p class="text-sm">Click "Edit Map" to start drawing.</p>
            </div>
          }
          <div class="absolute inset-0">
            <google-map height="100%" width="100%" [center]="center" [zoom]="15"  [options]="{ mapTypeId: 'satellite' }">
              @for (el of elements(); track el.id) {
              <map-polygon 
                [paths]="el.paths" 
                [options]="getPolygonOptions(el)"
                (polygonClick)="onPolygonClick(el.id)">
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
export class FieldMapComponent implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  
  private fieldMapService = inject(FieldMapService);
  private farmService = inject(FarmService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  elements = this.fieldMapService.elements;
  center: google.maps.LatLngLiteral = { lat: 41.876, lng: -87.641 };

  ngOnInit() {
    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      // Fetch farm details for centering
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

      // Fetch fields from API
      this.fieldMapService.loadFieldsForFarm(farmId).subscribe({
        next: (elements) => {
          this.fieldMapService.setElements(elements);
        },
        error: (err) => {
          console.error('Failed to load fields', err);
        }
      });
    }
  }

  getPolygonOptions(el: MapElement): google.maps.PolygonOptions {
    const isField = el.type === 'field';
    return {
      fillColor: isField ? '#10b981' : '#f59e0b',
      fillOpacity: 0.2,
      strokeColor: isField ? '#059669' : '#d97706',
      strokeWeight: 2,
      clickable: true
    };
  }

  onPolygonClick(id: string) {
    this.router.navigate(['/crops/view', id]);
  }

  getCenterOfPolygon(paths: { lat: number; lng: number }[]): google.maps.LatLngLiteral {
    if (!paths || paths.length === 0) return this.center;
    const lat = paths.reduce((sum, p) => sum + p.lat, 0) / paths.length;
    const lng = paths.reduce((sum, p) => sum + p.lng, 0) / paths.length;
    return { lat, lng };
  }
}
`;

fs.writeFileSync('src/app/pages/crops/field-map/field-map.component.ts', code);
