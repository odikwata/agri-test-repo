import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FarmTask {
  id: string;
  title: string;
  category: string;
  location: string;
  status: 'In Progress' | 'Pending' | 'Completed';
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  assignee: {
    name: string;
    role: string;
  };
  dueDate: string;
  icon: string;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col w-full -mt-2 space-y-6">
      <!-- Sub-header Breadcrumb and Quick Telemetry Action Strip -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
            <span>OAKRIDGE CADASTRE</span>
            <span>/</span>
            <span class="text-emerald-700 font-bold">OPERATIONS &amp; WORK ORDERS</span>
          </div>
          <div class="flex items-baseline gap-3 mt-1">
            <h1 class="font-headline text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Daily Farm Operations &amp; Work Orders</h1>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              FIELD CREWS DISPATCHED
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Chute weighing schedules, paddock rotation fences, vaccine dispensations, and precision machinery servicing.</p>
        </div>

        <!-- Rapid Actions -->
        <div class="flex items-center gap-2">
          <a [routerLink]="['/tasks/create']" 
             class="inline-flex items-center gap-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">add_task</span>
            <span>Create Work Order</span>
          </a>
          <a [routerLink]="['/livestock']" 
             class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[18px] text-slate-600">arrow_back</span>
            <span>Herd Registry</span>
          </a>
        </div>
      </div>

      <!-- Operations Bento KPI Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Task Completion Rate -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Operational Completion</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">74%</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Today</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">task_alt</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-emerald-700 font-bold">18 of 24 Closed</span>
            <span class="text-slate-400">Target 90%</span>
          </div>
        </div>

        <!-- Critical / Urgent Work Orders -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Urgent Priority Orders</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">3</span>
                <span class="font-mono text-xs text-red-600 font-semibold">Immediate</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-red-50 text-red-800">
              <span class="material-symbols-outlined text-2xl">priority_high</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span class="text-red-700 font-bold">Vaccine &amp; Perimeter Fence</span>
            <span class="text-slate-400">Crew Assigned</span>
          </div>
        </div>

        <!-- Active Staff Crew -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Field Operators On Duty</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">12</span>
                <span class="font-mono text-xs text-emerald-700 font-semibold">Technicians</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">badge</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>4 Herdsmen &bull; 2 Vets &bull; 6 Ops</span>
            <span class="text-emerald-700 font-bold">Radio Synced</span>
          </div>
        </div>

        <!-- Facilities Covered -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Facilities Addressed</span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="font-headline text-3xl font-bold text-slate-900">8</span>
                <span class="font-mono text-xs text-slate-500 font-medium">Zones</span>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 text-[#012d1d]">
              <span class="material-symbols-outlined text-2xl">fence</span>
            </div>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <span>Kraals 01-08 &bull; Paddocks 04-12</span>
            <span class="text-emerald-700 font-bold">100% Inspected</span>
          </div>
        </div>
      </section>

      <!-- Filter Tabs Styled like Livestock Register -->
      <div class="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200/80 flex items-center gap-1 overflow-x-auto">
        @for (tab of tabs; track tab) {
          <button type="button" 
                  (click)="activeTab.set(tab)"
                  [class]="activeTab() === tab ? 'bg-[#012d1d] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                  class="px-4 py-2 text-xs rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
            <span>{{ tab }}</span>
          </button>
        }
      </div>

      <!-- Task Table Card -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-heading text-base font-bold text-slate-900">Active Work Orders</h3>
            <p class="text-xs text-slate-500">Live operational dispatch across Oakridge Cadastre</p>
          </div>
          <span class="font-mono text-[11px] text-slate-500 font-bold">Showing {{ filteredTasks().length }} Tasks</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/75 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <th class="py-3 px-4">Task Details &amp; Spatial Facility</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Priority</th>
                <th class="py-3 px-4">Assignee</th>
                <th class="py-3 px-4">Due Schedule</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              @for (task of filteredTasks(); track task.id) {
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                        <span class="material-symbols-outlined text-base">{{ task.icon }}</span>
                      </div>
                      <div>
                        <div class="font-bold text-slate-900">{{ task.title }}</div>
                        <span class="font-mono text-[11px] text-emerald-800 font-bold">{{ task.location }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    {{ task.category }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span [class]="task.status === 'Completed' 
                             ? 'bg-emerald-100 text-emerald-900' 
                             : (task.status === 'In Progress' 
                                 ? 'bg-blue-100 text-blue-900' 
                                 : 'bg-amber-100 text-amber-900')"
                          class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold inline-flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full" 
                            [class]="task.status === 'Completed' ? 'bg-emerald-600' : (task.status === 'In Progress' ? 'bg-blue-600' : 'bg-amber-600')"></span>
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-[11px]">
                    <span [class]="task.priority === 'Urgent' 
                             ? 'bg-red-100 text-red-900 font-bold' 
                             : (task.priority === 'High' 
                                 ? 'bg-amber-100 text-amber-900 font-bold' 
                                 : 'bg-slate-100 text-slate-700')"
                          class="px-2 py-0.5 rounded">
                      {{ task.priority }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-bold text-slate-900">{{ task.assignee.name }}</div>
                    <span class="font-mono text-[10px] text-slate-400">{{ task.assignee.role }}</span>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    {{ task.dueDate }}
                  </td>
                  <td class="py-3.5 px-4 text-right">
                    <a [routerLink]="['/tasks/execute', task.id]" class="text-xs font-bold text-emerald-800 hover:text-[#012d1d] hover:underline cursor-pointer">
                      Execute &rarr;
                    </a>
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
export class TasksComponent {
  tabs = ['All Tasks', 'Feeding', 'Health', 'Crops', 'Maintenance', 'Harvesting'];
  activeTab = signal('All Tasks');

  tasks = signal<FarmTask[]>([
    {
      id: '1',
      title: 'TMR Rations Dispensation',
      category: 'Feeding & Nutrition',
      location: 'Kraal 04 &bull; Heifer Pen 12',
      status: 'In Progress',
      priority: 'High',
      assignee: { name: 'Thabo Ndlovu', role: 'Feed Operations Lead' },
      dueDate: 'Today, 08:30 AM',
      icon: 'restaurant'
    },
    {
      id: '2',
      title: '7-Way Clostridial Booster Vaccination',
      category: 'Health & Biosecurity',
      location: 'Kraal 08 &bull; Chute Bay 01',
      status: 'Pending',
      priority: 'Urgent',
      assignee: { name: 'Dr. V. Mthembu', role: 'Staff Veterinarian' },
      dueDate: 'Today, 11:00 AM',
      icon: 'vaccines'
    },
    {
      id: '3',
      title: 'North Perimeter Paddock Fence Inspection',
      category: 'Maintenance & Facility',
      location: 'Paddock 08 &bull; Cell Boundary',
      status: 'Completed',
      priority: 'Medium',
      assignee: { name: 'Lucas Meyer', role: 'Infrastructure Supervisor' },
      dueDate: 'Yesterday, 04:00 PM',
      icon: 'fence'
    },
    {
      id: '4',
      title: 'Corn Silage Moisture Sensor Calibration',
      category: 'Crops & Agronomy',
      location: 'West Valley Cadastre Block 4',
      status: 'Pending',
      priority: 'Low',
      assignee: { name: 'Sarah Jenkins', role: 'Agronomy Tech' },
      dueDate: 'Oct 06, 2026',
      icon: 'sensors'
    },
    {
      id: '5',
      title: 'Automated Broiler Climate Hub Sanitization',
      category: 'Maintenance & Facility',
      location: 'Valley Aviary &bull; Shed 03',
      status: 'In Progress',
      priority: 'Urgent',
      assignee: { name: 'David Mokoena', role: 'Poultry Operations' },
      dueDate: 'Today, 02:00 PM',
      icon: 'sanitizer'
    }
  ]);

  filteredTasks() {
    if (this.activeTab() === 'All Tasks') return this.tasks();
    const tab = this.activeTab().toLowerCase();
    return this.tasks().filter(t => 
      t.category.toLowerCase().includes(tab) || 
      t.title.toLowerCase().includes(tab)
    );
  }
}
