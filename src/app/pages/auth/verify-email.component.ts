import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogoComponent } from '../../components/logo.component';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, ReactiveFormsModule, LogoComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4 md:p-8">
      <div class="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 md:p-12 flex flex-col gap-8">
        <div class="flex items-center justify-center gap-3 text-primary mb-[-1rem]">
          <div class="w-10 h-10">
            <app-logo></app-logo>
          </div>
          <h1 class="text-xl font-bold text-slate-900 tracking-tight">Slingshot</h1>
        </div>
        <div class="flex flex-col items-center text-center gap-4">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <lucide-icon name="mail" class="w-8 h-8"></lucide-icon>
          </div>
          <div class="flex flex-col gap-2">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">Verify Your Email</h1>
            <p class="text-slate-500 text-sm font-medium">We've sent a 6-digit code to your email. Please enter it below to verify your account.</p>
          </div>
        </div>

        <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
          <div *ngIf="errorMessage" class="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <lucide-icon name="alert-circle" class="w-5 h-5"></lucide-icon>
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <lucide-icon name="check-circle" class="w-5 h-5"></lucide-icon>
            {{ successMessage }}
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Verification Code</label>
            <input 
              type="text" 
              formControlName="otp" 
              placeholder="000000" 
              maxlength="6"
              class="w-full text-center text-3xl font-black tracking-[0.5em] py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
          </div>

          <button 
            type="submit" 
            [disabled]="verifyForm.invalid || isLoading" 
            class="w-full py-4 bg-[#00FF22] hover:bg-[#00E61F] disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 text-sm font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <lucide-icon *ngIf="isLoading" name="refresh-cw" class="w-4 h-4 animate-spin"></lucide-icon>
            {{ isLoading ? 'Verifying...' : 'Verify Account' }}
          </button>
        </form>

        <div class="flex flex-col gap-4 text-center">
          <p class="text-sm text-slate-500 font-bold">
            Didn't receive the code? 
            <button class="text-emerald-500 font-black hover:underline ml-1">Resend Code</button>
          </p>
          <a routerLink="/auth/login" class="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Back to Login</a>
        </div>
      </div>
    </div>
  `
})
export class VerifyEmailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  verifyForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  userId = '';

  constructor() {
    this.verifyForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.queryParams['id'];
    if (!this.userId) {
      this.errorMessage = 'Invalid verification link. Please try registering again.';
    }
  }

  onSubmit() {
    if (this.verifyForm.valid && this.userId) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const verifyData = {
        id: this.userId,
        otp: this.verifyForm.value.otp
      };

      this.authService.verifyOtp(verifyData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Email verified successfully! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/auth/login'], { queryParams: { registered: true } });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid or expired code. Please try again.';
          console.error('Verification error:', error);
        }
      });
    }
  }
}
