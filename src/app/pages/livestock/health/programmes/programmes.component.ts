import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-programmes',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="mt-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Vaccination Programmes</h1>
          <p class="text-sm text-slate-500">Manage and monitor predefined vaccination protocols for your livestock.</p>
        </div>
        <button [routerLink]="['create']" class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20">
          <lucide-icon name="plus" class="w-5 h-5"></lucide-icon>
          Create New Programme
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-8 border-b border-slate-200 mb-8">
        <button 
          (click)="activeTab.set('all')"
          [ngClass]="activeTab() === 'all' ? 'text-green-600 border-b-2 border-green-600' : 'text-slate-500 hover:text-slate-700'"
          class="pb-4 text-sm font-bold transition-all">
          All Programmes (8)
        </button>
        <button 
          (click)="activeTab.set('active')"
          [ngClass]="activeTab() === 'active' ? 'text-green-600 border-b-2 border-green-600' : 'text-slate-500 hover:text-slate-700'"
          class="pb-4 text-sm font-bold transition-all">
          Active (5)
        </button>
        <button 
          (click)="activeTab.set('drafts')"
          [ngClass]="activeTab() === 'drafts' ? 'text-green-600 border-b-2 border-green-600' : 'text-slate-500 hover:text-slate-700'"
          class="pb-4 text-sm font-bold transition-all">
          Drafts (3)
        </button>
      </div>

      <!-- Programme Cards -->
      <div class="space-y-6">
        @for (prog of programmes; track prog.id) {
          <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <!-- Banner Image -->
            <div class="h-32 w-full overflow-hidden relative">
              <img [src]="prog.image" class="w-full h-full object-cover" referrerpolicy="no-referrer">
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            <div class="p-6">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest rounded-full">Protocol</span>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {{ prog.id }}</span>
              </div>
              
              <h3 class="text-xl font-black text-slate-900 mb-2">{{ prog.name }}</h3>
              <p class="text-sm text-slate-500 mb-6 max-w-2xl">{{ prog.description }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex gap-8">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                      <lucide-icon name="syringe" class="w-4 h-4"></lucide-icon>
                    </div>
                    <div>
                      <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vaccines</p>
                      <p class="text-xs font-bold text-slate-700">{{ prog.vaccineCount }} Vaccines Included</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                      <lucide-icon name="users" class="w-4 h-4"></lucide-icon>
                    </div>
                    <div>
                      <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target Group</p>
                      <p class="text-xs font-bold text-slate-700">{{ prog.targetGroup }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="flex gap-3">
                  <button class="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all">Edit</button>
                  <button [routerLink]="['assign']" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm transition-all">View Details</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex items-center justify-between text-sm">
        <p class="text-slate-500">Showing <span class="font-bold text-slate-900">3</span> of <span class="font-bold text-slate-900">8</span> programmes</p>
        <div class="flex gap-2">
          <button class="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-bold cursor-not-allowed">Previous</button>
          <button class="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-all">Next</button>
        </div>
      </div>
    </div>
  `
})
export class ProgrammesComponent {
  activeTab = signal('all');

  programmes = [
    {
      id: 'VAX-2024-001',
      name: 'Calf Starter Pack',
      description: 'A comprehensive 5-vaccine protocol to establish early immunity against common respiratory and clostridial diseases.',
      image: 'https://picsum.photos/seed/calves/800/200',
      vaccineCount: 5,
      targetGroup: 'Calves (0-6 months)'
    },
    {
      id: 'VAX-2024-002',
      name: 'Annual Herd Booster',
      description: 'Routine annual health maintenance for adult breeding stock to ensure long-term herd productivity and disease prevention.',
      image: 'https://picsum.photos/seed/cattle/800/200',
      vaccineCount: 3,
      targetGroup: 'Adult Stock (2+ years)'
    },
    {
      id: 'VAX-2024-003',
      name: 'Pre-Lambing Health Pack',
      description: 'Targeted health intervention for pregnant ewes 4-6 weeks before lambing to boost colostrum quality and maternal health.',
      image: 'https://picsum.photos/seed/sheep/800/200',
      vaccineCount: 2,
      targetGroup: 'Pregnant Ewes'
    }
  ];
}
