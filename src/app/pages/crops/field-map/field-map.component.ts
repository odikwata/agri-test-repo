import { Component, inject, OnInit, ViewChild, signal } from '@angular/core';
import { FarmService, ApiFarmResponse } from '../../../services/farm.service';
import { SessionService } from '../../../services/session.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FieldMapService, MapElement } from '../../../services/field-map.service';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-field-map',
  standalone: true,
  imports: [CommonModule, RouterModule, GoogleMapsModule],
  template: `
    <div class="flex flex-col w-full -mt-2 space-y-5 h-[calc(100vh-5.5rem)]">
      <!-- Sub-header Breadcrumb and Quick Telemetry Action Strip -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
            <span>OAKRIDGE CADASTRE</span>
            <span>/</span>
            <span class="text-emerald-700 font-bold">GEOSPATIAL GIS &amp; FIELD BOUNDARIES</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Field Geospatial Map &amp; Crop Cadastre</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              SATELLITE NDVI SYNCED
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            {{ farmName() }} &bull; {{ farmLocation() }} &bull; High-resolution GIS boundaries, NDVI vegetation index, and management units.
          </p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          @if (farmBoundaryPaths().length > 0) {
            <button (click)="fitToFarmBoundary()" 
                    class="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-xs cursor-pointer"
                    title="Zoom and center field map to farm boundary">
              <span class="material-symbols-outlined text-[17px] text-emerald-700">fit_screen</span>
              <span>Fit Farm Boundary</span>
            </button>
          }
          <a routerLink="/crops/new-planting" 
             class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">sprout</span>
            <span>New Planting Cycle</span>
          </a>
          <a routerLink="/crops/edit"
             class="inline-flex items-center gap-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">edit_road</span>
            <span>Edit Boundaries</span>
          </a>
        </div>
      </div>

      <!-- Quick GIS Filter & Layer Strip -->
      <div class="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs shrink-0 font-mono text-xs">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-slate-400 uppercase font-bold text-[10px]">Layers:</span>
          @if (farmBoundaryPaths().length > 0) {
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-950 border border-emerald-200/60 rounded-lg font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-600"></span> Farm Perimeter (Active)
            </span>
          }
          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg font-bold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span> Management Units ({{ elements().length }})
          </span>
          <span class="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-bold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-amber-600"></span> Crop Plots
          </span>
          <span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-slate-400"></span> Grazing Buffers
          </span>
        </div>
        <div class="text-[11px] text-slate-500 font-bold hidden sm:block">
          Resolution: Sentinel-2 &bull; 10m Ground Sample
        </div>
      </div>

      <!-- Map Display Container -->
      <div class="flex-1 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col relative min-h-[420px]">
        @if (elements().length === 0 && farmBoundaryPaths().length === 0) {
          <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-white/90 backdrop-blur-xs p-6 text-center">
            <span class="material-symbols-outlined text-5xl text-emerald-800 mb-2">map</span>
            <p class="text-base font-bold text-slate-800">No cadastral fields or blocks mapped yet.</p>
            <p class="text-xs text-slate-500 mt-1 max-w-sm">Use the GIS polygon boundary editor to draw farm paddocks, arable crop plots, and irrigation pivots.</p>
            <a routerLink="/crops/edit" class="mt-4 px-4 py-2 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold transition-all shadow-sm">
              Launch Boundary Editor
            </a>
          </div>
        }

        <!-- Floating Notice when Farm Boundary is present but sub-plots are empty -->
        @if (farmBoundaryPaths().length > 0 && elements().length === 0) {
          <div class="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg rounded-2xl p-4 max-w-sm">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-emerald-700 text-xl mt-0.5">verified</span>
              <div>
                <h4 class="text-xs font-bold font-mono text-slate-900 uppercase">Farm Perimeter Synced</h4>
                <p class="text-[11px] text-slate-500 mt-0.5">Map centered on boundaryGeoJson. No internal field subdivisions partitioned yet.</p>
                <a routerLink="/crops/edit" class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 mt-2 font-mono">
                  <span>Partition Sub-Fields</span>
                  <span class="material-symbols-outlined text-[13px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        }

        <div class="absolute inset-0">
          <google-map 
            height="100%" 
            width="100%" 
            [center]="center" 
            [zoom]="zoom" 
            (mapInitialized)="onMapInitialized($event)"
            [options]="mapOptions">
            
            <!-- Farm Boundary Polygon (Outer Cadastre Envelope) -->
            @if (farmBoundaryPaths().length > 0) {
              <map-polygon 
                [paths]="farmBoundaryPaths()" 
                [options]="farmBoundaryOptions">
              </map-polygon>
              <map-marker 
                [position]="farmCenter()" 
                [title]="farmName()" 
                [options]="farmMarkerOptions">
              </map-marker>
            }

            <!-- Individual Management Unit / Field Polygons -->
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
  `
})
export class FieldMapComponent implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  
  private fieldMapService = inject(FieldMapService);
  private farmService = inject(FarmService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  private googleMapInstance: google.maps.Map | null = null;
  private cachedBounds: google.maps.LatLngBounds | null = null;

  elements = this.fieldMapService.elements;
  center: google.maps.LatLngLiteral = { lat: -23.9867, lng: 24.5681 };
  zoom = 15;

  farmName = signal<string>('D Oasis Commercial Farm');
  farmLocation = signal<string>('Maboane / Gabane');
  farmBoundaryPaths = signal<google.maps.LatLngLiteral[]>([]);
  farmCenter = signal<google.maps.LatLngLiteral>({ lat: -23.9867, lng: 24.5681 });

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'satellite',
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true
  };

  farmBoundaryOptions: google.maps.PolygonOptions = {
    fillColor: '#10b981',
    fillOpacity: 0.05,
    strokeColor: '#059669',
    strokeWeight: 2.5,
    strokeOpacity: 0.9,
    clickable: false,
    zIndex: 1
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

  ngOnInit() {
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
          console.error('Failed to load farms', err);
        }
      });
    }
  }

  onMapInitialized(mapInstance: google.maps.Map) {
    this.googleMapInstance = mapInstance;
    if (this.cachedBounds) {
      this.applyBounds(this.cachedBounds);
    } else if (this.farmBoundaryPaths().length > 0) {
      this.fitToFarmBoundary();
    }
  }

  loadFarmAndFields(farmId: string) {
    this.farmService.getFarmById(farmId).subscribe({
      next: (farm: ApiFarmResponse) => {
        if (farm.name) this.farmName.set(farm.name);
        if (farm.location) this.farmLocation.set(farm.location);

        if (farm.boundaryGeoJson) {
          const points = this.extractLatLngsFromGeoJson(farm.boundaryGeoJson);
          if (points.length > 0) {
            this.farmBoundaryPaths.set(points);
            this.zoomToPoints(points);
          } else if (farm.latitude && farm.longitude) {
            this.setCenterCoords(Number(farm.latitude), Number(farm.longitude));
          }
        } else if (farm.latitude && farm.longitude) {
          this.setCenterCoords(Number(farm.latitude), Number(farm.longitude));
        }
      },
      error: (err) => {
        console.error('Failed to fetch farm by id', err);
      }
    });

    this.fieldMapService.loadFieldsForFarm(farmId).subscribe({
      next: (elements) => {
        this.fieldMapService.setElements(elements);
        // If no farm boundary, fit to fields
        if (this.farmBoundaryPaths().length === 0 && elements.length > 0) {
          const allFieldPoints: google.maps.LatLngLiteral[] = [];
          elements.forEach(el => allFieldPoints.push(...el.paths));
          if (allFieldPoints.length > 0) {
            this.zoomToPoints(allFieldPoints);
          }
        }
      },
      error: (err) => {
        console.error('Failed to load fields', err);
      }
    });
  }

  /**
   * Parses arbitrary GeoJSON (Polygon, MultiPolygon, Feature, FeatureCollection)
   * into a flat array of LatLngLiteral coordinates for Google Maps.
   */
  extractLatLngsFromGeoJson(geoJsonRaw: any): google.maps.LatLngLiteral[] {
    const points: google.maps.LatLngLiteral[] = [];
    if (!geoJsonRaw) return points;

    let parsed: any = geoJsonRaw;
    if (typeof geoJsonRaw === 'string') {
      try {
        parsed = JSON.parse(geoJsonRaw);
      } catch (e) {
        console.error('Failed to parse boundaryGeoJson string:', e);
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
      // outer ring is coordinates[0]
      const outerRing = parsed.coordinates[0];
      if (Array.isArray(outerRing)) {
        for (const coord of outerRing) {
          if (Array.isArray(coord) && coord.length >= 2) {
            // GeoJSON coordinates are [longitude, latitude]
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
      const centerLiteral: google.maps.LatLngLiteral = { lat: centerLatLng.lat(), lng: centerLatLng.lng() };
      this.center = centerLiteral;
      this.farmCenter.set(centerLiteral);

      this.applyBounds(bounds);
    } else {
      // Fallback calculation
      const avgLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
      const avgLng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
      this.setCenterCoords(avgLat, avgLng);
    }
  }

  applyBounds(bounds: google.maps.LatLngBounds) {
    const targetMap = this.googleMapInstance || this.map?.googleMap;
    if (targetMap) {
      targetMap.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      });
    }
  }

  fitToFarmBoundary() {
    const points = this.farmBoundaryPaths();
    if (points.length > 0) {
      this.zoomToPoints(points);
    }
  }

  setCenterCoords(lat: number, lng: number) {
    this.center = { lat, lng };
    this.farmCenter.set({ lat, lng });
    const targetMap = this.googleMapInstance || this.map?.googleMap;
    if (targetMap) {
      targetMap.setCenter(this.center);
    }
  }

  getPolygonOptions(el: MapElement): google.maps.PolygonOptions {
    const isField = el.type === 'field' || el.type === 'CROP_FIELD';
    return {
      fillColor: isField ? '#10b981' : '#f59e0b',
      fillOpacity: 0.35,
      strokeColor: isField ? '#047857' : '#b45309',
      strokeWeight: 2,
      clickable: true,
      zIndex: 2
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
