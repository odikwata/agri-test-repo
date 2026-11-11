import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { FarmService, ApiFarmResponse } from '../../services/farm.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto flex flex-col gap-8 pb-12">
      <!-- Header -->
      <section class="flex flex-col gap-2">
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">User Profile</h1>
        <p class="text-slate-500 text-base font-normal">Manage your personal information and farm settings</p>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar (Left) -->
        <div class="flex flex-col gap-8">
          <!-- Profile Card -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 flex flex-col items-center gap-6">
            <div class="relative group">
              <div class="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden">
                <img src="https://picsum.photos/seed/farmer/200/200" alt="Profile" class="w-full h-full object-cover">
              </div>
              <button class="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                <lucide-icon name="camera" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
            <div class="flex flex-col items-center gap-1 text-center">
              <h2 class="text-xl font-black text-slate-900 tracking-tight">John Doe</h2>
              <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Farm Manager</p>
            </div>
            <div class="w-full flex flex-col gap-2 pt-4 border-t border-slate-100">
              <div class="flex items-center gap-3 text-slate-600">
                <lucide-icon name="mail" class="w-4 h-4"></lucide-icon>
                <span class="text-sm font-medium">john.doe@greenvalley.com</span>
              </div>
              <div class="flex items-center gap-3 text-slate-600">
                <lucide-icon name="phone" class="w-4 h-4"></lucide-icon>
                <span class="text-sm font-medium">+1 (555) 012-3456</span>
              </div>
              <div class="flex items-center gap-3 text-slate-600">
                <lucide-icon name="map-pin" class="w-4 h-4"></lucide-icon>
                <span class="text-sm font-medium">Green Valley, CA</span>
              </div>
            </div>
          </div>

          <!-- Active Farm Selector -->
          <div class="bg-white rounded-3xl border border-primary/20 shadow-sm overflow-hidden p-6 bg-primary/5">
            <h3 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <lucide-icon name="map" class="w-4 h-4 text-primary"></lucide-icon>
              Active Farm Context
            </h3>
            
            @if (loadingFarms) {
              <div class="flex justify-center p-4">
                <lucide-icon name="loader-2" class="w-6 h-6 animate-spin text-primary"></lucide-icon>
              </div>
            } @else {
              <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Select Farm</label>
                <div class="relative">
                  <select 
                    [ngModel]="sessionService.selectedFarmId()" 
                    (ngModelChange)="onFarmChange($event)"
                    class="w-full appearance-none bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-10">
                    <option [ngValue]="null" disabled>Select a farm...</option>
                    @for (farm of farms; track farm.id) {
                      <option [value]="farm.id">{{ farm.name }}</option>
                    }
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <lucide-icon name="chevron-down" class="w-4 h-4"></lucide-icon>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Navigation -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4">
            <nav class="flex flex-col gap-1">
              <button class="flex items-center gap-3 p-3 bg-primary/5 text-primary rounded-xl font-bold text-sm transition-all">
                <lucide-icon name="user" class="w-4 h-4"></lucide-icon>
                Personal Info
              </button>
              <button class="flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm transition-all">
                <lucide-icon name="shield" class="w-4 h-4"></lucide-icon>
                Security
              </button>
              <button class="flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm transition-all">
                <lucide-icon name="bell" class="w-4 h-4"></lucide-icon>
                Notifications
              </button>
              <button class="flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm transition-all">
                <lucide-icon name="credit-card" class="w-4 h-4"></lucide-icon>
                Billing
              </button>
            </nav>
          </div>
        </div>

        <!-- Main Content (Right) -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          <!-- Personal Info Card -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 class="text-xl font-black text-slate-900 tracking-tight">Personal Information</h3>
              <button class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Edit Details</button>
            </div>
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</span>
                <p class="text-sm font-bold text-slate-900">John</p>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</span>
                <p class="text-sm font-bold text-slate-900">Doe</p>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</span>
                <p class="text-sm font-bold text-slate-900">john.doe@greenvalley.com</p>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</span>
                <p class="text-sm font-bold text-slate-900">+1 (555) 012-3456</p>
              </div>
              <div class="flex flex-col md:col-span-2 gap-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bio</span>
                <p class="text-sm text-slate-600 leading-relaxed">Experienced farm manager with over 15 years in sustainable agriculture and livestock management. Passionate about integrating technology into traditional farming practices.</p>
              </div>
            </div>
          </div>

          <!-- Farm Details Card -->
          @if (activeFarmDetails) {
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 class="text-xl font-black text-slate-900 tracking-tight">Active Farm Details</h3>
              </div>
              <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Farm Name</span>
                  <p class="text-sm font-bold text-slate-900">{{ activeFarmDetails.name }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</span>
                  <p class="text-sm font-bold text-slate-900">{{ activeFarmDetails.location || 'Not specified' }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coordinates</span>
                  <p class="text-sm font-bold text-slate-900">{{ activeFarmDetails.latitude || 'N/A' }}, {{ activeFarmDetails.longitude || 'N/A' }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Species count</span>
                  <p class="text-sm font-bold text-slate-900">{{ activeFarmDetails.species.length || 0 }}</p>
                </div>
              </div>
            </div>
          } @else {
            <div class="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-3">
              <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                <lucide-icon name="map" class="w-8 h-8"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold text-slate-900">No Farm Selected</h3>
              <p class="text-sm text-slate-500 max-w-sm">Please select a farm from the context menu on the left to view and manage its details.</p>
            </div>
          }

        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  farmService = inject(FarmService);
  sessionService = inject(SessionService);

  farms: ApiFarmResponse[] = [];
  loadingFarms = true;

  get activeFarmDetails(): ApiFarmResponse | undefined {
    const selectedId = this.sessionService.selectedFarmId();
    return this.farms.find(f => f.id === selectedId);
  }

  ngOnInit() {
    this.loadFarms();
  }

  loadFarms() {
    this.loadingFarms = true;
    this.farmService.getAllFarms().subscribe({
      next: (data) => {
        this.farms = data;
        this.loadingFarms = false;
        
        // Auto-select first farm if none selected
        if (!this.sessionService.selectedFarmId() && data.length > 0) {
          this.sessionService.setFarm(data[0].id);
        }
      },
      error: (err) => {
        console.error('Failed to load farms', err);
        this.loadingFarms = false;
      }
    });
  }

  onFarmChange(farmId: string) {
    this.sessionService.setFarm(farmId);
  }
}
