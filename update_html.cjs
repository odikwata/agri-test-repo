const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const oldHtml = `@for (stage of program.growthStageList; track stage.id) {
                      <div class="relative pl-6">
                        <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                        <div class="mb-2">
                          <h4 class="font-bold text-slate-800 flex items-center gap-2">
                            {{ stage.stageName }}
                          </h4>
                          <p class="text-sm text-slate-500">Duration: {{ stage.durationInDays }} days</p>
                        </div>
                        @if (stage.growthActivityStageActivities?.length) {
                          <div class="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
                            @for (activity of stage.growthActivityStageActivities; track activity.id) {
                              <label class="flex items-center gap-3 cursor-not-allowed">
                                <input type="checkbox" disabled class="w-4 h-4 text-slate-400 rounded border-slate-300">
                                <span class="text-sm font-medium text-slate-700">{{ activity.name }}</span>
                              </label>
                            }
                          </div>
                        }
                      </div>
                    }`;

const newHtml = `@for (stage of stagesWithDates(); track stage.id) {
                      <div class="relative pl-6">
                        <!-- Dot Indicator -->
                        @if (stage.status === 'completed') {
                          <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white"></div>
                        } @else if (stage.status === 'current') {
                          <div class="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        } @else {
                          <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                        }

                        <div class="mb-2">
                          <h4 class="font-bold flex items-center gap-2"
                              [ngClass]="stage.status === 'upcoming' ? 'text-slate-500' : 'text-slate-800'">
                            {{ stage.stageName }}
                            @if (stage.status === 'completed') {
                              <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Completed</span>
                            } @else if (stage.status === 'current') {
                              <span class="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Current</span>
                            }
                          </h4>
                          <p class="text-sm text-slate-500">
                            {{ stage.startDate | date:'mediumDate' }} - {{ stage.endDate | date:'mediumDate' }} &bull; {{ stage.durationInDays }} days
                          </p>
                        </div>

                        @if (stage.growthActivityStageActivities?.length) {
                          <div class="rounded-xl border p-4 space-y-3"
                               [ngClass]="{
                                 'bg-slate-50 border-slate-100': stage.status === 'completed',
                                 'bg-white border-2 border-blue-100 shadow-sm': stage.status === 'current',
                                 'bg-slate-50/50 border-slate-100 opacity-70': stage.status === 'upcoming'
                               }">
                            @for (activity of stage.growthActivityStageActivities; track activity.id) {
                              <label class="flex items-center gap-3"
                                     [ngClass]="stage.status === 'upcoming' ? 'cursor-not-allowed' : 'cursor-pointer group'">
                                <input type="checkbox"
                                       [disabled]="stage.status === 'upcoming' || stage.status === 'completed'"
                                       [checked]="stage.status === 'completed'"
                                       class="w-4 h-4 rounded border-slate-300"
                                       [ngClass]="{
                                         'text-emerald-600 focus:ring-emerald-500': stage.status !== 'upcoming',
                                         'text-slate-300': stage.status === 'upcoming'
                                       }">
                                <span class="text-sm font-medium"
                                      [ngClass]="{
                                        'text-slate-600 line-through': stage.status === 'completed',
                                        'text-slate-700 group-hover:text-slate-900 font-bold': stage.status === 'current',
                                        'text-slate-500': stage.status === 'upcoming'
                                      }">
                                  {{ activity.name }}
                                </span>
                              </label>
                            }
                          </div>
                        }
                      </div>
                    }`;

if (code.includes(oldHtml)) {
  code = code.replace(oldHtml, newHtml);
  fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
  console.log("Successfully replaced the HTML.");
} else {
  console.log("Could not find the HTML to replace.");
}
