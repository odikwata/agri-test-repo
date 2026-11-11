import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="p-8 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button [routerLink]="['/tasks']" class="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
              <lucide-icon name="arrow-left" class="w-6 h-6"></lucide-icon>
            </button>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">Create New Task</h1>
          </div>
          <span class="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">New Draft</span>
        </div>

        <div class="p-8 space-y-8">
          <!-- Task Type -->
          <div class="space-y-4">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Type</label>
            <div class="flex p-1 bg-slate-100 rounded-2xl">
              <button 
                (click)="taskType.set('single')"
                [class]="taskType() === 'single' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'"
                class="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
                <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
                Single Task
              </button>
              <button 
                (click)="taskType.set('recurring')"
                [class]="taskType() === 'recurring' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'"
                class="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
                <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon>
                Scheduled/Recurring
              </button>
            </div>
          </div>

          <!-- Task Title -->
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Title</label>
            <input type="text" placeholder="e.g. Morning Feeding - North Kraal" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-medium">
          </div>

          <!-- Category & Target -->
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
              <div class="relative">
                <select class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-slate-700">
                  <optgroup label="Livestock">
                    <option>Feeding</option>
                    <option>Health</option>
                    <option>Breeding</option>
                  </optgroup>
                  <optgroup label="Crops">
                    <option>Irrigation</option>
                    <option>Fertilization</option>
                    <option>Weeding & Preparation</option>
                    <option>Sowing</option>
                    <option>Harvesting</option>
                  </optgroup>
                  <optgroup label="General">
                    <option>Maintenance</option>
                    <option>Security</option>
                    <option>Other</option>
                  </optgroup>
                </select>
                <lucide-icon name="chevron-down" class="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></lucide-icon>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</label>
              <div class="relative">
                <select class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-slate-700">
                  <optgroup label="Animals">
                    <option>Individual Tag #402</option>
                    <option>North Kraal</option>
                    <option>South Pasture</option>
                  </optgroup>
                  <optgroup label="Fields">
                    <option>Field 1 (Corn)</option>
                    <option>Field 2 (Wheat)</option>
                    <option>Field 3 (Soybeans)</option>
                    <option>Greenhouse A</option>
                  </optgroup>
                </select>
                <lucide-icon name="chevron-down" class="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></lucide-icon>
              </div>
            </div>
          </div>

          <!-- Frequency (if recurring) -->
          <div *ngIf="taskType() === 'recurring'" class="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
            <div class="flex items-center gap-2 text-green-600">
              <lucide-icon name="calendar" class="w-5 h-5"></lucide-icon>
              <span class="font-bold text-sm">Frequency Settings</span>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <button 
                *ngFor="let freq of ['Daily', 'Weekly', 'Monthly']"
                (click)="frequency.set(freq)"
                [class]="frequency() === freq ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
                class="py-3 rounded-xl font-bold text-xs transition-all">
                {{ freq }}
              </button>
            </div>
          </div>

          <!-- Priority & Assignee -->
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
              <div class="flex p-1 bg-slate-100 rounded-2xl">
                <button 
                  *ngFor="let p of ['Low', 'Medium', 'High']"
                  (click)="priority.set(p)"
                  [class]="priority() === p ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'"
                  class="flex-1 py-2 rounded-xl font-bold text-xs transition-all">
                  {{ p }}
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignee</label>
              <div class="relative">
                <select class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-slate-700">
                  <option>John Smith (Manager)</option>
                  <option>Sarah Wilson (Vet)</option>
                  <option>Mike Ross (Staff)</option>
                </select>
                <lucide-icon name="chevron-down" class="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></lucide-icon>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Additional Notes</label>
            <textarea rows="4" placeholder="Any specific instructions or details..." class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-medium resize-none"></textarea>
          </div>

          <!-- Location Preview -->
          <div class="relative h-48 rounded-3xl overflow-hidden group">
            <img src="https://picsum.photos/seed/farm/800/400" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-6 left-6 flex items-center gap-2 text-white">
              <lucide-icon name="map-pin" class="w-5 h-5 text-green-400"></lucide-icon>
              <span class="font-bold">Location: North Sector Paddock</span>
            </div>
          </div>

          <!-- Submit -->
          <div class="pt-4">
            <button class="w-full py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-500/20 active:scale-[0.98]">
              Create Task
            </button>
            <p class="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">A notification will be sent to the assigned team member immediately.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CreateTaskComponent {
  taskType = signal('single');
  priority = signal('Medium');
  frequency = signal('Daily');
}
