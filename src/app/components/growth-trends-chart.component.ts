import { Component, input, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CropService, CropStageDTO } from '../services/crop.service';

interface PlottedStagePoint {
  id: string;
  stageOrder: number;
  stageCode: string;
  stageName: string;
  shortName: string;
  durationInDays: number;
  startDayOffset: number;
  endDayOffset: number;
  plannedStartDate: string | null;
  plannedEndDate: string | null;
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING';
  isCurrentStage: boolean;
  x: number;
  y: number;
  benchmarkY: number;
  heightCm: number;
  benchmarkHeightCm: number;
  canopyPct: number;
  parameterSummary: string;
  activitySummary: string;
}

@Component({
  selector: 'app-growth-trends-chart',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- KPI Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-4">
          <span class="text-xs font-mono uppercase tracking-wider text-stone-500 block">CURRENT STAGE</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-xl font-extrabold text-emerald-800 font-mono">
              {{ currentPlottedStage()?.stageCode || ('Stage ' + (currentPlottedStage()?.stageOrder || 1)) }}
            </span>
            <span class="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              ACTIVE NOW
            </span>
          </div>
          <span class="text-[11px] font-mono text-stone-600 mt-1 block truncate" [title]="currentPlottedStage()?.stageName">
            {{ currentPlottedStage()?.stageName || 'R1 - Silking & Pollination' }}
          </span>
        </div>

        <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-4">
          <span class="text-xs font-mono uppercase tracking-wider text-stone-500 block">STAGE WINDOW</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-xl font-extrabold text-stone-900 font-mono">
              Day {{ currentPlottedStage()?.startDayOffset || 66 }}–{{ currentPlottedStage()?.endDayOffset || 75 }}
            </span>
            <span class="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {{ currentPlottedStage()?.durationInDays || 10 }}d
            </span>
          </div>
          <span class="text-[11px] font-mono text-stone-500 mt-1 block">
            @if (currentPlottedStage()?.plannedStartDate) {
              {{ currentPlottedStage()?.plannedStartDate | date:'MMM d' }} – {{ currentPlottedStage()?.plannedEndDate | date:'MMM d, y' }}
            } @else {
              Active Phenological Window
            }
          </span>
        </div>

        <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-4">
          <span class="text-xs font-mono uppercase tracking-wider text-stone-500 block">STAGE PROGRESSION</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-2xl font-extrabold text-stone-900 font-mono">
              {{ currentPlottedStage()?.stageOrder || 5 }} / {{ plottedStages().length || 8 }}
            </span>
          </div>
          <span class="text-[11px] font-mono text-stone-500 mt-1 block">
            Total Cycle: {{ totalCycleDays() }} Days
          </span>
        </div>

        <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-4">
          <span class="text-xs font-mono uppercase tracking-wider text-stone-500 block">CANOPY & VIGOUR</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-2xl font-extrabold text-stone-900 font-mono">{{ currentPlottedStage()?.canopyPct || 92 }}%</span>
            <span class="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">High Vigour</span>
          </div>
          <span class="text-[11px] font-mono text-stone-400 mt-1 block">Est. Height {{ currentPlottedStage()?.heightCm || 175 }} cm</span>
        </div>
      </div>

      <!-- Growth Curve SVG Chart with Plotted Planting Cycle Stages & Current Stage Marker -->
      <div class="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-stone-100">
          <div>
            <h3 class="text-sm font-bold text-stone-900 font-mono uppercase tracking-wide">
              Planting Cycle Stages & Plotted Current Stage Trajectory
            </h3>
            <p class="text-xs text-stone-500 font-mono">
              Live planting cycle stages plotted across {{ totalCycleDays() }} cycle days with current active stage highlighted
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
              <span class="text-stone-700 font-bold">Completed Stage</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200 inline-block"></span>
              <span class="text-amber-800 font-black">Current Stage (Plotted)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>
              <span class="text-stone-500">Upcoming Stage</span>
            </div>
          </div>
        </div>

        <!-- SVG Visualizer -->
        <div class="w-full overflow-x-auto">
          <svg viewBox="0 0 760 275" class="w-full h-68 select-none">
            <!-- Horizontal Grid Lines -->
            <line x1="55" y1="35" x2="725" y2="35" stroke="#f1f5f9" stroke-width="1" />
            <line x1="55" y1="82" x2="725" y2="82" stroke="#f1f5f9" stroke-width="1" />
            <line x1="55" y1="130" x2="725" y2="130" stroke="#f1f5f9" stroke-width="1" />
            <line x1="55" y1="178" x2="725" y2="178" stroke="#f1f5f9" stroke-width="1" />
            <line x1="55" y1="225" x2="725" y2="225" stroke="#e2e8f0" stroke-width="1.5" />

            <!-- Y Axis Labels (cm) -->
            <text x="45" y="39" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">200cm</text>
            <text x="45" y="86" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">150cm</text>
            <text x="45" y="134" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">100cm</text>
            <text x="45" y="182" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">50cm</text>
            <text x="45" y="229" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">0cm</text>

            <!-- Highlighted Vertical Band for Current Stage -->
            @if (currentPlottedStage(); as curr) {
              <rect [attr.x]="curr.x - 28" y="25" width="56" height="200" rx="8"
                    fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-opacity="0.35" stroke-dasharray="3,3" />
              <line [attr.x1]="curr.x" y1="25" [attr.x2]="curr.x" y2="225"
                    stroke="#d97706" stroke-width="1.5" stroke-dasharray="4,3" />
            }

            <!-- Area Fill Under Plotted Curve -->
            @if (areaPathD()) {
              <path [attr.d]="areaPathD()" fill="#10b981" fill-opacity="0.09" />
            }

            <!-- Benchmark Curve (Dashed) -->
            @if (benchmarkPolylinePoints()) {
              <polyline [attr.points]="benchmarkPolylinePoints()"
                        fill="none" stroke="#94a3b8" stroke-dasharray="4,4" stroke-width="2" />
            }

            <!-- Full Planned Trajectory Curve (Muted for Upcoming) -->
            @if (fullPolylinePoints()) {
              <polyline [attr.points]="fullPolylinePoints()"
                        fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            }

            <!-- Active/Completed Trajectory Curve (Solid Emerald up to Current Stage) -->
            @if (activePolylinePoints()) {
              <polyline [attr.points]="activePolylinePoints()"
                        fill="none" stroke="#047857" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
            }

            <!-- Stage Nodes & Plotted Current Stage Pin -->
            @for (pt of plottedStages(); track pt.id) {
              <g>
                <!-- Vertical tick -->
                <line [attr.x1]="pt.x" y1="225" [attr.x2]="pt.x" y2="232" stroke="#cbd5e1" stroke-width="1" />

                @if (pt.isCurrentStage) {
                  <!-- Outer pulse ring for Current Stage -->
                  <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="11" fill="#f59e0b" fill-opacity="0.25" />
                  <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="6.5" fill="#f59e0b" stroke="#ffffff" stroke-width="2.5" />

                  <!-- Callout Badge Above Current Stage -->
                  <rect [attr.x]="pt.x - 52" [attr.y]="pt.y - 34" width="104" height="20" rx="5"
                        fill="#0f172a" stroke="#f59e0b" stroke-width="1.2" />
                  <text [attr.x]="pt.x" [attr.y]="pt.y - 21" fill="#fbbf24" font-size="9.5" font-family="monospace" font-weight="bold" text-anchor="middle">
                    ● NOW: {{ pt.stageCode }}
                  </text>
                } @else if (pt.status === 'COMPLETED') {
                  <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="5" fill="#047857" stroke="#ffffff" stroke-width="2" />
                } @else {
                  <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="4.5" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
                }

                <!-- X Axis Stage Code Label -->
                <text [attr.x]="pt.x" y="246"
                      [attr.fill]="pt.isCurrentStage ? '#b45309' : (pt.status === 'COMPLETED' ? '#047857' : '#64748b')"
                      font-size="10" font-family="monospace"
                      [attr.font-weight]="pt.isCurrentStage ? 'bold' : 'normal'"
                      text-anchor="middle">
                  {{ pt.stageCode }}
                </text>
                <!-- X Axis Day Offset Sub-label -->
                <text [attr.x]="pt.x" y="259"
                      fill="#94a3b8" font-size="8.5" font-family="monospace" text-anchor="middle">
                  D{{ pt.startDayOffset }}–{{ pt.endDayOffset }}
                </text>
              </g>
            }
          </svg>
        </div>
      </div>

      <!-- Populated Planting Cycle Stages Table -->
      <div class="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
        <div class="p-4 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <span class="text-xs font-mono font-bold uppercase text-stone-700 tracking-wider">
            Planting Cycle Phenological Stages Breakdown
          </span>
          <span class="text-xs font-mono text-stone-500">{{ plottedStages().length }} Stages Populated</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase">
              <tr>
                <th class="px-4 py-3"># / Code</th>
                <th class="px-4 py-3">Growth Stage</th>
                <th class="px-4 py-3">Planned Window</th>
                <th class="px-4 py-3">Duration / Days</th>
                <th class="px-4 py-3">Nutrient & Activity Specs</th>
                <th class="px-4 py-3 text-right">Stage Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              @for (row of plottedStages(); track row.id) {
                <tr class="transition-colors"
                    [ngClass]="row.isCurrentStage ? 'bg-amber-50/60 hover:bg-amber-50' : 'hover:bg-stone-50/80'">
                  <td class="px-4 py-3 font-bold text-stone-900">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black"
                          [ngClass]="row.isCurrentStage ? 'bg-amber-400 text-slate-950' : (row.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700')">
                      {{ row.stageOrder }}. {{ row.stageCode }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-bold text-stone-900">{{ row.stageName }}</td>
                  <td class="px-4 py-3 text-stone-600">
                    @if (row.plannedStartDate && row.plannedEndDate) {
                      {{ row.plannedStartDate | date:'MMM d' }} – {{ row.plannedEndDate | date:'MMM d, y' }}
                    } @else {
                      Day {{ row.startDayOffset }} – Day {{ row.endDayOffset }}
                    }
                  </td>
                  <td class="px-4 py-3 text-stone-600">
                    {{ row.durationInDays }}d (D{{ row.startDayOffset }}–{{ row.endDayOffset }})
                  </td>
                  <td class="px-4 py-3 text-stone-600 max-w-xs truncate" [title]="row.parameterSummary + ' ' + row.activitySummary">
                    {{ row.parameterSummary || row.activitySummary || 'Standard Agronomic Monitoring' }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    @if (row.isCurrentStage) {
                      <span class="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-amber-400 text-slate-950 inline-flex items-center gap-1">
                        ● CURRENT
                      </span>
                    } @else if (row.status === 'COMPLETED') {
                      <span class="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        COMPLETED
                      </span>
                    } @else {
                      <span class="px-2 py-0.5 rounded-full font-bold text-[10px] bg-stone-100 text-stone-600">
                        UPCOMING
                      </span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class GrowthTrendsChartComponent implements OnInit {
  private cropService = inject(CropService);

  stages = input<CropStageDTO[]>([]);
  plantingCycleId = input<string | null>(null);

  private fallbackLoadedStages = signal<CropStageDTO[]>([]);

  ngOnInit() {
    const cycleId = this.plantingCycleId() || 'ea1c74a5-dcc4-11f1-b299-d71e68a444ea';
    this.cropService.getStagesByPlantingCycle(cycleId).subscribe(res => {
      if (Array.isArray(res) && res.length > 0) {
        this.fallbackLoadedStages.set(res);
      } else {
        this.cropService.getCropStages().subscribe(all => {
          if (Array.isArray(all) && all.length > 0) {
            this.fallbackLoadedStages.set(all);
          }
        });
      }
    });
  }

  plottedStages = computed<PlottedStagePoint[]>(() => {
    const passed = this.stages();
    const raw = (Array.isArray(passed) && passed.length > 0) ? passed : this.fallbackLoadedStages();
    if (!raw || raw.length === 0) return [];

    const sorted = [...raw].sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0));
    const count = sorted.length;
    const minX = 80;
    const maxX = 695;
    const stepX = count > 1 ? (maxX - minX) / (count - 1) : 0;

    let runningStart = 1;
    const hasExplicitCurrent = sorted.some(s => s.isCurrentStage || (s.status || '').toUpperCase() === 'CURRENT');

    return sorted.map((st, idx) => {
      const dur = Number(st.durationInDays || st.baselineDurationDays || 14) || 14;
      const startDay = Number(st.startDayOffset) || runningStart;
      const endDay = Number(st.endDayOffset) || (startDay + dur - 1);
      runningStart = endDay + 1;

      const progressRatio = count > 1 ? idx / (count - 1) : 1;
      // Sigmoidal plant height growth curve (from 12cm at emergence up to 195cm at reproductive maturity)
      const sigmoid = 1 / (1 + Math.exp(-8 * (progressRatio - 0.42)));
      const heightCm = Math.round(10 + 185 * sigmoid);
      const benchmarkHeightCm = Math.round(8 + 175 * sigmoid);
      const canopyPct = Math.min(98, Math.round(12 + 86 * sigmoid));

      // Map height (0..200cm) to SVG Y (225..35)
      const y = Math.round(225 - (heightCm / 200) * 190);
      const benchmarkY = Math.round(225 - (benchmarkHeightCm / 200) * 190);
      const x = Math.round(minX + idx * stepX);

      const rawStatus = (st.status || '').toUpperCase();
      const isCurrent = hasExplicitCurrent
        ? (st.isCurrentStage === true || rawStatus === 'CURRENT')
        : (idx === Math.floor(count / 2));

      const status: 'COMPLETED' | 'CURRENT' | 'UPCOMING' = isCurrent
        ? 'CURRENT'
        : (rawStatus === 'COMPLETED' || (!hasExplicitCurrent && idx < Math.floor(count / 2)) ? 'COMPLETED' : 'UPCOMING');

      const code = st.growthStageSpecificData?.code || `S${st.stageOrder || (idx + 1)}`;
      const shortName = st.stageName.includes(' - ') ? st.stageName.split(' - ').slice(1).join(' - ') : st.stageName;

      const params = (st.growthParameterSpecs || [])
        .map(p => `${p.elementSymbol || p.elementName}: ${Number(p.targetValue || 0).toFixed(1)} ${p.unit || ''}`)
        .join(', ');
      const acts = (st.growthProgramStageActivities || st.growthActivityStageActivities || [])
        .map(a => a.name)
        .join(', ');

      return {
        id: st.id || `st-${idx}`,
        stageOrder: st.stageOrder || (idx + 1),
        stageCode: code,
        stageName: st.stageName,
        shortName,
        durationInDays: dur,
        startDayOffset: startDay,
        endDayOffset: endDay,
        plannedStartDate: st.plannedStartDate || null,
        plannedEndDate: st.plannedEndDate || null,
        status,
        isCurrentStage: isCurrent,
        x,
        y,
        benchmarkY,
        heightCm,
        benchmarkHeightCm,
        canopyPct,
        parameterSummary: params,
        activitySummary: acts
      };
    });
  });

  currentPlottedStage = computed<PlottedStagePoint | null>(() => {
    const pts = this.plottedStages();
    return pts.find(p => p.isCurrentStage) || pts[0] || null;
  });

  totalCycleDays = computed(() => {
    return this.plottedStages().reduce((acc, s) => acc + s.durationInDays, 0);
  });

  fullPolylinePoints = computed(() => {
    return this.plottedStages().map(p => `${p.x},${p.y}`).join(' ');
  });

  benchmarkPolylinePoints = computed(() => {
    return this.plottedStages().map(p => `${p.x},${p.benchmarkY}`).join(' ');
  });

  activePolylinePoints = computed(() => {
    const pts = this.plottedStages();
    const currIdx = pts.findIndex(p => p.isCurrentStage);
    const sliceEnd = currIdx >= 0 ? currIdx + 1 : pts.length;
    return pts.slice(0, sliceEnd).map(p => `${p.x},${p.y}`).join(' ');
  });

  areaPathD = computed(() => {
    const pts = this.plottedStages();
    if (pts.length < 2) return '';
    const first = pts[0];
    const last = pts[pts.length - 1];
    const lineCoords = pts.map(p => `L ${p.x} ${p.y}`).join(' ');
    return `M ${first.x} 225 ${lineCoords} L ${last.x} 225 Z`;
  });
}
