const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

// Add completedActivities signal
if (!code.includes('completedActivities = signal')) {
    code = code.replace("cycleId = signal<string | null>(null);", "cycleId = signal<string | null>(null);\n  completedActivities = signal<Set<string>>(new Set());\n\n  toggleActivity(activityId: string) {\n    const current = this.completedActivities();\n    const next = new Set(current);\n    if (next.has(activityId)) {\n      next.delete(activityId);\n    } else {\n      next.add(activityId);\n    }\n    this.completedActivities.set(next);\n  }");
}

// Update the checkbox and span HTML
const searchHtml = `<input type="checkbox"
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
                                      }">`;

const replaceHtml = `<input type="checkbox"
                                       [disabled]="stage.status === 'upcoming' || stage.status === 'completed'"
                                       [checked]="stage.status === 'completed' || completedActivities().has(activity.id)"
                                       (change)="toggleActivity(activity.id)"
                                       class="w-4 h-4 rounded border-slate-300"
                                       [ngClass]="{
                                         'text-emerald-600 focus:ring-emerald-500': stage.status !== 'upcoming',
                                         'text-slate-300': stage.status === 'upcoming'
                                       }">
                                <span class="text-sm font-medium"
                                      [ngClass]="{
                                        'text-slate-600 line-through': stage.status === 'completed' || completedActivities().has(activity.id),
                                        'text-slate-700 group-hover:text-slate-900 font-bold': stage.status === 'current' && !completedActivities().has(activity.id),
                                        'text-slate-500': stage.status === 'upcoming'
                                      }">`;

if (code.includes(searchHtml)) {
    code = code.replace(searchHtml, replaceHtml);
    fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
    console.log('Fixed activities HTML and state');
} else {
    console.log('Search HTML not found');
}
