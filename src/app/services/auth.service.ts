import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models/iam.model';

export interface Person {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface NewOrganisationWithUserRequest {
  id: string;
  name: string;
  registrationNumber: string;
  person: Person;
}

export interface LoginRequest {
  username: string;
  created: Date;
  password: string;
}

export interface OtpValidateRequest {
  id: string;
  otp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal());

  private get serverDomain(): string {
    return typeof SERVER_DOMAIN !== 'undefined' ? SERVER_DOMAIN : 'http://localhost/';
  }

  private apiUrl = `${this.serverDomain}api/auth/v1`;

  private getUserFromStorage(): User | null {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const userJson = localStorage.getItem('slingshot_user');
        return userJson ? JSON.parse(userJson) : null;
      }
    } catch {
      return null;
    }
    return null;
  }

  register(data: NewOrganisationWithUserRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/organisation/user`, data).pipe(
      tap((response: any) => {
        // Assuming the response contains user info or we need to log in after
        // For now, let's just let the component handle redirect if needed
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        this.setSession(response.user);
      })
    );
  }

  verifyOtp(data: OtpValidateRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify/user/otp`, data);
  }

  logout() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('slingshot_user');
      }
    } catch {}
    this.currentUserSignal.set(null);
  }

  private setSession(user: User) {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('slingshot_user', JSON.stringify(user));
      }
    } catch {}
    this.currentUserSignal.set(user);
  }
}
