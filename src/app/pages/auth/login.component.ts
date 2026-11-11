import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogoComponent } from '../../components/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, ReactiveFormsModule, LogoComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4 md:p-8">
      <div class="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <!-- Left Side: Image & Branding -->
        <div class="relative w-full md:w-1/2 min-h-[300px] md:min-h-full overflow-hidden">
          <img 
            src="https://picsum.photos/seed/cornfield/800/1200" 
            alt="Cornfield" 
            class="absolute inset-0 w-full h-full object-cover"
            referrerpolicy="no-referrer"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-12">
            <div class="flex flex-col gap-2">
              <h2 class="text-4xl font-black text-white tracking-tight leading-tight">Empower Your Harvest</h2>
              <p class="text-emerald-400 text-lg font-bold">Precision tools for the modern agriculturist.</p>
            </div>
          </div>
        </div>

        <!-- Right Side: Login Form -->
        <div class="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center gap-10 bg-white">
          <div class="flex items-center gap-3 text-primary mb-[-1rem]">
            <div class="w-10 h-10">
              <app-logo></app-logo>
            </div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">Slingshot</h1>
          </div>
          <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p class="text-slate-500 text-sm font-medium">Log in to your dashboard to continue</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
            <div *ngIf="errorMessage" class="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <lucide-icon name="alert-circle" class="w-5 h-5"></lucide-icon>
              {{ errorMessage }}
            </div>

            <div *ngIf="successMessage" class="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <lucide-icon name="check-circle" class="w-5 h-5"></lucide-icon>
              {{ successMessage }}
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Username or Email</label>
              <div class="relative">
                <lucide-icon name="user" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                <input 
                  type="email" 
                  formControlName="email" 
                  placeholder="name@farm.com" 
                  class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div class="relative">
                <lucide-icon name="lock" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  formControlName="password" 
                  placeholder="Enter your password" 
                  class="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                <button 
                  type="button" 
                  (click)="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <lucide-icon [name]="showPassword ? 'eye-off' : 'eye'" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <input type="checkbox" id="remember" class="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500">
                <label for="remember" class="text-xs font-bold text-slate-500">Remember me</label>
              </div>
              <a href="#" class="text-xs font-bold text-emerald-500 hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading" 
              class="w-full py-4 bg-[#00FF22] hover:bg-[#00E61F] disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 text-sm font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <lucide-icon *ngIf="isLoading" name="refresh-cw" class="w-4 h-4 animate-spin"></lucide-icon>
              {{ isLoading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>

          <div class="flex flex-col gap-6 pt-4 border-t border-slate-100">
            <p class="text-center text-sm text-slate-500 font-bold">
              Don't have an account yet? 
              <a routerLink="/auth/register" class="text-emerald-500 font-black hover:underline">Create an Account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  returnUrl = '/dashboard';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    if (this.route.snapshot.queryParams['registered']) {
      this.successMessage = 'Registration successful! Please log in to continue.';
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const loginData = {
        username: this.loginForm.value.email,
        password: this.loginForm.value.password,
        created: new Date()
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful:', response);
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid credentials. Please try again.';
          console.error('Login error:', error);
        }
      });
    }
  }
}
