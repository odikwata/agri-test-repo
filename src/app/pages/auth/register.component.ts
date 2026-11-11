import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService, NewOrganisationWithUserRequest } from '../../services/auth.service';
import { LogoComponent } from '../../components/logo.component';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, ReactiveFormsModule, LogoComponent],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
      <div class="w-full max-w-5xl flex flex-col gap-8">
        <!-- Logo -->
        <div class="flex items-center justify-center gap-3 text-primary mb-4">
          <div class="w-12 h-12">
            <app-logo></app-logo>
          </div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Slingshot</h1>
        </div>
        
        <!-- Progress Header -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Step {{ step }} of 4</span>
              <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ stepTitles[step-1] }}</h1>
            </div>
            <span class="text-sm font-black text-slate-900">{{ (step / 4) * 100 | number:'1.0-0' }}%</span>
          </div>
          <div class="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
            <div [style.width.%]="(step / 4) * 100" class="h-full bg-[#00FF22] transition-all duration-500"></div>
          </div>
          <p class="text-slate-500 text-sm font-medium">{{ stepSubtitles[step-1] }}</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-8">
          <div *ngIf="errorMessage" class="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <lucide-icon name="alert-circle" class="w-5 h-5"></lucide-icon>
            {{ errorMessage }}
          </div>

          <!-- Step 1: Farm & Admin Setup -->
          <div *ngIf="step === 1" class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <!-- Farm Details -->
            <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6">
              <div class="flex items-center gap-3 text-emerald-500">
                <lucide-icon name="sprout" class="w-5 h-5"></lucide-icon>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">Farm Details</h3>
              </div>
              
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Farm Name</label>
                <input type="text" formControlName="farmName" placeholder="e.g. Green Valley Estates" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Registration Number</label>
                <div class="relative">
                  <lucide-icon name="hash" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                  <input type="text" formControlName="registrationNumber" placeholder="e.g. REG-123456" class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Location</label>
                <div class="relative">
                  <lucide-icon name="map-pin" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                  <input type="text" formControlName="location" placeholder="City, Region or GPS Coordinates" class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Acreage</label>
                <div class="relative">
                  <input type="number" formControlName="acreage" placeholder="0.00" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Acres</span>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Primary Focus</label>
                <div class="grid grid-cols-3 gap-3">
                  <button type="button" (click)="setFocus('crops')" [class.border-emerald-500]="registerForm.get('primaryFocus')?.value === 'crops'" [class.bg-emerald-50]="registerForm.get('primaryFocus')?.value === 'crops'" class="flex flex-col items-center gap-2 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all">
                    <lucide-icon name="leaf" class="w-5 h-5 text-emerald-500"></lucide-icon>
                    <span class="text-[10px] font-black uppercase tracking-widest">Crops</span>
                  </button>
                  <button type="button" (click)="setFocus('livestock')" [class.border-emerald-500]="registerForm.get('primaryFocus')?.value === 'livestock'" [class.bg-emerald-50]="registerForm.get('primaryFocus')?.value === 'livestock'" class="flex flex-col items-center gap-2 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all">
                    <lucide-icon name="paw-print" class="w-5 h-5 text-emerald-500"></lucide-icon>
                    <span class="text-[10px] font-black uppercase tracking-widest">Livestock</span>
                  </button>
                  <button type="button" (click)="setFocus('both')" [class.border-emerald-500]="registerForm.get('primaryFocus')?.value === 'both'" [class.bg-emerald-50]="registerForm.get('primaryFocus')?.value === 'both'" class="flex flex-col items-center gap-2 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all">
                    <lucide-icon name="infinity" class="w-5 h-5 text-emerald-500"></lucide-icon>
                    <span class="text-[10px] font-black uppercase tracking-widest">Both</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Administrator Account -->
            <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6">
              <div class="flex items-center gap-3 text-emerald-500">
                <lucide-icon name="user-plus" class="w-5 h-5"></lucide-icon>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">Administrator Account</h3>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input type="text" formControlName="fullName" placeholder="Enter your full name" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <div class="relative">
                  <lucide-icon name="mail" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                  <input type="email" formControlName="email" placeholder="admin@farm.com" class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <div class="relative">
                  <lucide-icon name="lock" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                  <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••" class="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                  <button type="button" (click)="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <lucide-icon [name]="showPassword ? 'eye-off' : 'eye'" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Confirm Password</label>
                <div class="relative">
                  <lucide-icon name="lock" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                  <input [type]="showPassword ? 'text' : 'password'" formControlName="confirmPassword" placeholder="••••••••" class="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                  <div *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched" class="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">Passwords do not match</div>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                <div class="relative">
                  <lucide-icon name="phone" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                  <input type="tel" formControlName="phone" placeholder="+1 (555) 000-0000" class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Email Verification -->
          <div *ngIf="step === 2" class="flex flex-col items-center justify-center gap-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
              <lucide-icon name="mail" class="w-10 h-10"></lucide-icon>
            </div>
            <div class="text-center flex flex-col gap-2 max-w-md">
              <h2 class="text-2xl font-black text-slate-900 tracking-tight">Check your email</h2>
              <p class="text-slate-500 text-sm font-medium">We've sent a 6-digit verification code to <span class="text-slate-900 font-bold">{{ registerForm.get('email')?.value }}</span>. Please enter it below.</p>
            </div>
            <div class="flex gap-3">
              <input *ngFor="let i of [0,1,2,3,4,5]" type="text" maxlength="1" class="w-12 h-14 bg-white border border-slate-200 rounded-xl text-center text-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
            </div>
            <div class="flex flex-col items-center gap-4">
              <button type="button" (click)="nextStep()" class="px-12 py-4 bg-[#00FF22] hover:bg-[#00E61F] text-slate-900 text-sm font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all uppercase tracking-widest">Verify Email</button>
              <button type="button" class="text-xs font-bold text-emerald-500 hover:underline">Didn't receive the code? Resend</button>
            </div>
          </div>

          <!-- Step 3: Choose your plan -->
          <div *ngIf="step === 3" class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Basic -->
              <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-black text-slate-900">$0</span>
                    <span class="text-sm font-bold text-slate-400">/mo</span>
                  </div>
                  <span class="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mt-2">Free for small farms</span>
                </div>
                <button type="button" (click)="selectPlan('basic')" class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-black rounded-xl transition-all">Get Started</button>
                <div class="flex flex-col gap-4">
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Task management
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Animal tracking (up to 5)
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Basic daily reporting
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <lucide-icon name="x-circle" class="w-4 h-4"></lucide-icon>
                    Advanced analytics
                  </div>
                </div>
              </div>

              <!-- Professional -->
              <div class="bg-white rounded-3xl border-2 border-emerald-500 p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden scale-105 z-10">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-b-xl">Most Popular</div>
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-black text-slate-900">$49</span>
                    <span class="text-sm font-bold text-slate-400">/mo</span>
                  </div>
                  <span class="text-xs font-bold text-slate-500 mt-2">For growing operations</span>
                </div>
                <button type="button" (click)="selectPlan('pro')" class="w-full py-3 bg-[#00FF22] hover:bg-[#00E61F] text-slate-900 text-sm font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all">Select Professional</button>
                <div class="flex flex-col gap-4">
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-900">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Unlimited task management
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-900">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Advanced animal tracking
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-900">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Financial reporting suite
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-900">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Priority 24/7 support
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-900">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Custom integrations
                  </div>
                </div>
              </div>

              <!-- Enterprise -->
              <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-black text-slate-900">Custom</span>
                  </div>
                  <span class="text-xs font-bold text-slate-500 mt-2">For multi-farm networks</span>
                </div>
                <button type="button" class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-black rounded-xl transition-all">Contact Sales</button>
                <div class="flex flex-col gap-4">
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Multi-farm dashboard
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Custom API access
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    Dedicated account manager
                  </div>
                  <div class="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <lucide-icon name="check-circle" class="w-4 h-4 text-emerald-500"></lucide-icon>
                    On-site team training
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-emerald-50 rounded-3xl p-8 flex items-center justify-between border border-emerald-100">
              <div class="flex flex-col gap-2 max-w-xl">
                <h4 class="text-lg font-black text-slate-900">Comprehensive Farm Intelligence</h4>
                <p class="text-sm text-slate-600 font-medium leading-relaxed">Slingshot helps you visualize everything from soil health to financial yields in one intuitive dashboard.</p>
              </div>
              <div class="flex gap-8">
                <div class="flex flex-col items-center gap-2">
                  <div class="p-3 bg-white rounded-xl shadow-sm">
                    <lucide-icon name="bar-chart-3" class="w-6 h-6 text-emerald-500"></lucide-icon>
                  </div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analytics</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <div class="p-3 bg-white rounded-xl shadow-sm">
                    <lucide-icon name="paw-print" class="w-6 h-6 text-emerald-500"></lucide-icon>
                  </div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Livestock</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <div class="p-3 bg-white rounded-xl shadow-sm">
                    <lucide-icon name="dollar-sign" class="w-6 h-6 text-emerald-500"></lucide-icon>
                  </div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finance</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Payment -->
          <div *ngIf="step === 4" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="lg:col-span-2 flex flex-col gap-8">
              <div class="flex flex-col gap-2">
                <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Finalizing Registration</span>
                <h2 class="text-3xl font-black text-slate-900 tracking-tight">Secure Checkout</h2>
                <p class="text-slate-500 text-sm font-medium">Complete your registration for the Professional package</p>
              </div>

              <div class="flex flex-col gap-6">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Payment Method</label>
                <div class="grid grid-cols-2 gap-4">
                  <button type="button" (click)="setPayment('card')" [class.border-emerald-500]="paymentMethod === 'card'" [class.bg-emerald-50]="paymentMethod === 'card'" class="flex flex-col items-center gap-3 p-6 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
                    <lucide-icon name="credit-card" class="w-6 h-6 text-emerald-500"></lucide-icon>
                    <span class="text-sm font-black text-slate-900">Credit Card</span>
                  </button>
                  <button type="button" (click)="setPayment('paypal')" [class.border-emerald-500]="paymentMethod === 'paypal'" [class.bg-emerald-50]="paymentMethod === 'paypal'" class="flex flex-col items-center gap-3 p-6 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all opacity-50">
                    <lucide-icon name="wallet" class="w-6 h-6 text-slate-400"></lucide-icon>
                    <span class="text-sm font-black text-slate-400">PayPal</span>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col md:col-span-2 gap-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Cardholder Name</label>
                  <input type="text" formControlName="cardName" placeholder="John Doe" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                </div>
                <div class="flex flex-col md:col-span-2 gap-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Card Number</label>
                  <div class="relative">
                    <input type="text" formControlName="cardNumber" placeholder="0000 0000 0000 0000" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                    <lucide-icon name="credit-card" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry Date</label>
                  <input type="text" formControlName="expiry" placeholder="MM/YY" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">CVV</label>
                  <input type="text" formControlName="cvv" placeholder="123" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                </div>
              </div>

              <button type="submit" [disabled]="isLoading" class="w-full py-4 bg-[#00FF22] hover:bg-[#00E61F] disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 text-sm font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3">
                <lucide-icon *ngIf="isLoading" name="refresh-cw" class="w-5 h-5 animate-spin"></lucide-icon>
                <lucide-icon *ngIf="!isLoading" name="shield-check" class="w-5 h-5"></lucide-icon>
                {{ isLoading ? 'Processing...' : 'Complete Payment' }}
              </button>

              <p class="text-center text-[10px] text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
                Your payment information is encrypted and securely processed. By completing this purchase, you agree to Slingshot's Terms of Service and Privacy Policy.
              </p>
            </div>

            <!-- Order Summary -->
            <div class="flex flex-col gap-6">
              <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-8">
                <div class="flex items-center gap-3 text-slate-900">
                  <lucide-icon name="shopping-basket" class="w-5 h-5"></lucide-icon>
                  <h3 class="text-lg font-black tracking-tight">Order Summary</h3>
                </div>

                <div class="flex flex-col gap-4">
                  <div class="flex justify-between items-start">
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-black text-slate-900">Professional Plan</span>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly billing cycle</span>
                    </div>
                    <span class="text-sm font-black text-slate-900">$29.00</span>
                  </div>
                  <div class="flex flex-col gap-2 pt-2">
                    <div class="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      <lucide-icon name="check" class="w-3 h-3"></lucide-icon>
                      Unlimited projects
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      <lucide-icon name="check" class="w-3 h-3"></lucide-icon>
                      Team collaboration (10 users)
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      <lucide-icon name="check" class="w-3 h-3"></lucide-icon>
                      Priority support
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-3 pt-6 border-t border-slate-100">
                  <div class="flex justify-between text-xs font-bold text-slate-400">
                    <span>Subtotal</span>
                    <span>$29.00</span>
                  </div>
                  <div class="flex justify-between text-xs font-bold text-slate-400">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span class="text-lg font-black text-slate-900">Total</span>
                    <span class="text-2xl font-black text-[#00FF22]">$29.00</span>
                  </div>
                </div>

                <div class="bg-emerald-50 rounded-2xl p-4 flex gap-3 border border-emerald-100">
                  <lucide-icon name="info" class="w-4 h-4 text-emerald-500 shrink-0"></lucide-icon>
                  <p class="text-[10px] font-bold text-emerald-700 leading-relaxed">
                    Your subscription will renew automatically every month. You can cancel anytime from your settings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="flex justify-between items-center pt-8 border-t border-slate-200">
            <button type="button" (click)="prevStep()" *ngIf="step > 1" class="flex items-center gap-2 px-6 py-3 text-sm font-black text-slate-400 hover:text-slate-900 transition-all">
              <lucide-icon name="arrow-left" class="w-4 h-4"></lucide-icon>
              Back
            </button>
            <button type="button" (click)="step = 1" *ngIf="step === 1" class="px-8 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-black text-slate-400 transition-all">
              Cancel
            </button>
            
            <button type="button" (click)="nextStep()" *ngIf="step < 4" class="flex items-center gap-2 px-8 py-3 bg-[#00FF22] hover:bg-[#00E61F] text-slate-900 text-sm font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
              Next Step
              <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </form>

        <p class="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Step 1: Core details. Step 2: Verification. Step 3: Resource mapping. Step 4: Billing and preferences.
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  step = 1;
  stepTitles = ['Farm & Admin Setup', 'Email Verification', 'Choose your plan', 'Payment'];
  stepSubtitles = [
    'Welcome! Let\'s start by getting some basic information about your operations and the account manager.',
    'We\'ve sent a verification code to your email. Please enter it below to continue.',
    'Select the best package for your farming needs. All plans include our core data security protocols.',
    'Complete your registration for the Professional package'
  ];
  
  registerForm: FormGroup;
  showPassword = false;
  paymentMethod = 'card';
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      // Step 1
      farmName: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      location: ['', Validators.required],
      acreage: ['', Validators.required],
      primaryFocus: ['both', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required],
      // Step 3
      selectedPlan: ['pro'],
      // Step 4
      cardName: [''],
      cardNumber: [''],
      expiry: [''],
      cvv: ['']
    }, { validators: passwordMatchValidator });
  }

  setFocus(focus: string) {
    this.registerForm.patchValue({ primaryFocus: focus });
  }

  setPayment(method: string) {
    this.paymentMethod = method;
  }

  selectPlan(plan: string) {
    this.registerForm.patchValue({ selectedPlan: plan });
    this.nextStep();
  }

  nextStep() {
    if (this.step < 4) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const fullName = this.registerForm.value.fullName.trim();
      const nameParts = fullName.split(' ');
      const firstname = nameParts[0] || '';
      const lastname = nameParts.slice(1).join(' ') || '';

      const registrationData: NewOrganisationWithUserRequest = {
        id: Math.random().toString(36).substring(2, 15),
        name: this.registerForm.value.farmName,
        registrationNumber: this.registerForm.value.registrationNumber,
        person: {
          firstname,
          lastname,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password
        }
      };

      this.authService.register(registrationData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registration successful:', response);
          // Use the ID from the request or response
          const userId = registrationData.id;
          this.router.navigate(['/auth/verify-email'], { queryParams: { id: userId } });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    } else if (this.step < 4) {
      this.nextStep();
    }
  }
}
