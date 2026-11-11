import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hr-overview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p class="text-slate-500 text-sm font-medium">Welcome back, here's what's happening today in Slingshot HR.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <lucide-icon name="users" class="w-5 h-5"></lucide-icon>
            </div>
            <span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Employees</p>
            <p class="text-3xl font-black text-slate-900">1,248</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <lucide-icon name="calendar" class="w-5 h-5"></lucide-icon>
            </div>
            <span class="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-full">-5%</span>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Leave Requests</p>
            <p class="text-3xl font-black text-slate-900">14</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <lucide-icon name="calendar" class="w-5 h-5"></lucide-icon>
            </div>
            <span class="text-[10px] font-black text-slate-600 bg-slate-50 px-2 py-1 rounded-full">5 Days</span>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming Payroll</p>
            <p class="text-3xl font-black text-slate-900">Oct 30, 2023</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <lucide-icon name="shield-check" class="w-5 h-5"></lucide-icon>
            </div>
            <span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">98%</span>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Retention Rate</p>
            <p class="text-3xl font-black text-slate-900">Annual High</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Notifications -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-slate-900 tracking-tight">HR Notifications</h2>
            <button class="text-xs font-bold text-emerald-500 hover:underline">Mark all as read</button>
          </div>

          <div class="flex flex-col gap-4">
            <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-start gap-4 relative group">
              <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <lucide-icon name="user-plus" class="w-6 h-6"></lucide-icon>
              </div>
              <div class="flex-1 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-black text-slate-900">New Hire Onboarding</h3>
                  <span class="text-[10px] font-bold text-slate-400">2h ago</span>
                </div>
                <p class="text-xs text-slate-500 font-medium leading-relaxed">Sarah Jenkins starts as Senior Product Designer on Monday. Document verification pending.</p>
                <div class="flex items-center gap-2 mt-2">
                  <button class="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg hover:bg-emerald-100 transition-colors">Review Docs</button>
                  <button class="px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg hover:bg-slate-100 transition-colors">Dismiss</button>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-start gap-4 relative group">
              <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <lucide-icon name="alert-triangle" class="w-6 h-6"></lucide-icon>
              </div>
              <div class="flex-1 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-black text-slate-900">Urgent Leave Request</h3>
                  <span class="text-[10px] font-bold text-slate-400">5h ago</span>
                </div>
                <p class="text-xs text-slate-500 font-medium leading-relaxed">Michael Ross requested 3 days of bereavement leave starting immediately.</p>
                <div class="flex items-center gap-2 mt-2">
                  <button class="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">Approve</button>
                  <button class="px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg hover:bg-slate-100 transition-colors">View Context</button>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-start gap-4 relative group">
              <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                <lucide-icon name="file-text" class="w-6 h-6"></lucide-icon>
              </div>
              <div class="flex-1 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-black text-slate-900">Policy Update Acknowledged</h3>
                  <span class="text-[10px] font-bold text-slate-400">Yesterday</span>
                </div>
                <p class="text-xs text-slate-500 font-medium leading-relaxed">85% of employees have signed the updated Remote Work Policy. Follow-up needed for 15%.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-6">
            <h2 class="text-xl font-black text-slate-900 tracking-tight">Team Celebrations</h2>
            <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 p-0.5">
                  <img src="https://i.pravatar.cc/150?u=scott" alt="Scott" class="w-full h-full rounded-full object-cover">
                </div>
                <div class="flex-1">
                  <p class="text-sm font-black text-slate-900">Scott Wilson</p>
                  <p class="text-[10px] font-bold text-slate-400">Birthday • Today</p>
                </div>
                <lucide-icon name="party-popper" class="w-5 h-5 text-emerald-500"></lucide-icon>
              </div>

              <div class="flex items-center gap-4 opacity-60">
                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 p-0.5">
                  <img src="https://i.pravatar.cc/150?u=emma" alt="Emma" class="w-full h-full rounded-full object-cover">
                </div>
                <div class="flex-1">
                  <p class="text-sm font-black text-slate-900">Emma Stone</p>
                  <p class="text-[10px] font-bold text-slate-400">3yr Anniversary • Oct 28</p>
                </div>
                <lucide-icon name="award" class="w-5 h-5 text-slate-300"></lucide-icon>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Links</h3>
            <div class="grid grid-cols-2 gap-3">
              <button class="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 transition-all group">
                <lucide-icon name="download" class="w-5 h-5 text-slate-400 group-hover:text-slate-600"></lucide-icon>
                <span class="text-[10px] font-black text-slate-600">Tax Forms</span>
              </button>
              <button class="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 transition-all group">
                <lucide-icon name="help-circle" class="w-5 h-5 text-slate-400 group-hover:text-slate-600"></lucide-icon>
                <span class="text-[10px] font-black text-slate-600">HR Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HrOverviewComponent {}
