export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'admin' | 'manager' | 'worker';
  organizationId: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  registrationNumber: string;
  ownerId: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
  organization: Organization;
}
