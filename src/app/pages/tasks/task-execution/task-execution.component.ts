import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface VerificationItem {
  id: string;
  label: string;
  description: string;
  subtext?: string;
  status: 'Done' | 'Pending';
  note?: string;
}

@Component({
  selector: 'app-task-execution',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 space-y-8">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <span class="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">{{ taskCategory() }}</span>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">{{ taskTitle() }}</h1>
          <div class="flex items-center gap-2 text-slate-500 font-bold text-sm">
            <span>Task ID: {{ taskId() }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end gap-4">
          <span class="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            In Progress
          </span>
          <button [routerLink]="['/tasks']" class="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
            <lucide-icon name="arrow-left" class="w-4 h-4"></lucide-icon>
            Back to Overview
          </button>
        </div>
      </div>

      <!-- Quick Info -->
      <div class="grid grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Priority</span>
          <div class="flex items-center gap-2 text-red-600 font-black">
            <span class="w-2 h-2 rounded-full bg-red-600"></span>
            High Priority
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Due Date</span>
          <div class="flex items-center gap-2 text-slate-900 font-black">
            Oct 24, 2023
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Target Location</span>
          <div class="flex items-center gap-2 text-green-600 font-black">
            <lucide-icon name="map-pin" class="w-4 h-4"></lucide-icon>
            {{ targetLocation() }}
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-green-50/50 border border-green-100 rounded-3xl p-8 space-y-6">
        <div class="flex items-center gap-3 text-green-600">
          <lucide-icon name="info" class="w-6 h-6"></lucide-icon>
          <h3 class="text-lg font-black tracking-tight">Instructions & Notes</h3>
        </div>
        <div class="space-y-4">
          <p class="text-slate-700 leading-relaxed font-medium">
            {{ instructions() }}
          </p>
          <div *ngIf="specialNote()" class="pl-4 border-l-4 border-green-500 italic text-slate-600 font-medium">
            "{{ specialNote() }}"
          </div>
        </div>
      </div>

      <!-- Verification List -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <lucide-icon name="clipboard-list" class="w-6 h-6 text-green-600"></lucide-icon>
            <h3 class="text-lg font-black tracking-tight">Verification Checklist</h3>
          </div>
          <span class="text-xs font-bold text-slate-500">{{ completedCount() }} / {{ items().length }} Complete</span>
        </div>
        <div class="divide-y divide-slate-100">
          <div *ngFor="let item of items()" class="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all">
            <div class="flex items-center gap-6">
              <button 
                (click)="toggleItem(item)"
                [class]="item.status === 'Done' ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-transparent'"
                class="w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all">
                <lucide-icon name="check" class="w-5 h-5"></lucide-icon>
              </button>
              <div>
                <div class="font-black text-slate-900">{{ item.label }}</div>
                <div class="text-xs text-slate-500 font-bold">{{ item.description }} <span *ngIf="item.subtext">• {{ item.subtext }}</span></div>
                <div *ngIf="item.note" class="text-[10px] text-red-500 font-black italic mt-1">{{ item.note }}</div>
              </div>
            </div>
            <span [class]="item.status === 'Done' ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'" class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Observation Note -->
      <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Field Observation Note</label>
        <textarea rows="4" placeholder="Any issues encountered? Batch numbers? Soil conditions?" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-medium resize-none"></textarea>
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <button class="flex-[2] py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3">
          <lucide-icon name="check-circle" class="w-6 h-6"></lucide-icon>
          Mark as Complete
        </button>
        <button class="flex-1 py-5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3">
          <lucide-icon name="save" class="w-6 h-6"></lucide-icon>
          Save Draft
        </button>
        <button class="px-6 py-5 bg-white border border-red-100 hover:bg-red-50 text-red-600 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3">
          <lucide-icon name="alert-circle" class="w-6 h-6"></lucide-icon>
          Flag Issue
        </button>
      </div>

      <!-- Footer Map -->
      <div class="relative h-64 rounded-3xl overflow-hidden group shadow-lg">
        <img src="https://picsum.photos/seed/map/1200/600" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div class="absolute bottom-8 left-8 text-white">
          <div class="flex items-center gap-2 mb-1">
            <lucide-icon name="map" class="w-5 h-5 text-green-400"></lucide-icon>
            <span class="font-black text-lg tracking-tight">Location Map View</span>
          </div>
          <p class="text-xs font-bold text-slate-300">Section North-West • Sector B</p>
        </div>
      </div>
    </div>
  `
})
export class TaskExecutionComponent {
  taskCategory = signal('Crop Management');
  taskTitle = signal('Sowing Soybeans - Field 4');
  taskId = signal('#6601-CM');
  targetLocation = signal('Field 4 (North)');
  instructions = signal('Prepare the soil using the disc harrow. Ensure the seed drill is calibrated for 60kg/ha. Monitor soil moisture levels before starting.');
  specialNote = signal('The irrigation system in the eastern corner of Field 4 was reported as leaking. Avoid that area if possible.');

  items = signal<VerificationItem[]>([
    { id: '1', label: 'Soil Preparation', description: 'Disc harrowing complete', status: 'Done' },
    { id: '2', label: 'Seed Calibration', description: 'Drill set to 60kg/ha', status: 'Done' },
    { id: '3', label: 'Moisture Check', description: 'Optimal range (18-22%)', status: 'Pending' },
    { id: '4', label: 'Sowing - Row 1-20', description: 'Main section', status: 'Pending' },
    { id: '5', label: 'Sowing - Row 21-40', description: 'Eastern section', status: 'Pending', note: 'Watch for leaks' },
  ]);

  constructor(private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === '2') {
      this.taskCategory.set('Health Check');
      this.taskTitle.set('Vaccinate Cattle');
      this.taskId.set('#4402-LH');
      this.targetLocation.set('Kraal B-14');
      this.instructions.set('Apply Bovine Rhinotracheitis (IBR) vaccine to all cattle in the B-14 group. Ensure each animal is properly restrained before injection.');
      this.specialNote.set('The young bull (Tag #982) was showing signs of lethargy yesterday. Please monitor closely.');
      this.items.set([
        { id: '1', label: 'Tag #1042', description: 'Angus Heifer', subtext: '24mo', status: 'Done' },
        { id: '2', label: 'Tag #1043', description: 'Angus Heifer', subtext: '24mo', status: 'Done' },
        { id: '3', label: 'Tag #1045', description: 'Angus Heifer', subtext: '22mo', status: 'Pending' },
        { id: '4', label: 'Tag #0982 (Bull)', description: 'Requires Close Monitoring', status: 'Pending', note: 'Requires Close Monitoring' },
        { id: '5', label: 'Tag #1047', description: 'Angus Heifer', subtext: '23mo', status: 'Pending' },
      ]);
    }
  }

  completedCount() {
    return this.items().filter(i => i.status === 'Done').length;
  }

  toggleItem(item: VerificationItem) {
    this.items.update(prev => prev.map(i => 
      i.id === item.id ? { ...i, status: i.status === 'Done' ? 'Pending' : 'Done' } : i
    ));
  }
}
