import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard, guestGuard } from './auth.guard';
import { LivestockComponent } from './pages/livestock/livestock.component';
import { FieldMapComponent } from './pages/crops/field-map/field-map.component';
import { PlantingComponent } from './pages/crops/planting/planting.component';
import { HarvestingComponent } from './pages/crops/harvesting/harvesting.component';
import { SoilRatingComponent } from './pages/crops/soil-rating/soil-rating.component';
import { CropAccountingComponent } from './pages/crops/accounting/crop-accounting.component';
import { HealthComponent } from './pages/livestock/health/health.component';
import { HealthStatusComponent } from './pages/livestock/health/health-status/health-status.component';
import { BreedingComponent } from './pages/livestock/breeding/breeding.component';
import { FeedComponent } from './pages/livestock/feed/feed.component';
import { PastureComponent } from './pages/livestock/pasture/pasture.component';
import { AddAnimalComponent } from './pages/livestock/add-animal/add-animal.component';
import { ViewAnimalComponent } from './pages/livestock/view-animal/view-animal.component';
import { GroupsComponent } from './pages/livestock/groups/groups.component';
import { LogFeedingEventComponent } from './pages/livestock/log-feeding/log-feeding.component';
import { NewBreedingRecordComponent } from './pages/livestock/new-breeding/new-breeding.component';
import { LogTransactionComponent } from './pages/livestock/log-transaction/log-transaction.component';
import { BulkBreedingComponent } from './pages/livestock/bulk-breeding/bulk-breeding.component';
import { BulkHealthComponent } from './pages/livestock/bulk-health/bulk-health.component';
import { BulkAccountingComponent } from './pages/livestock/bulk-accounting/bulk-accounting.component';
import { InventoryComponent } from './pages/equipment/inventory/inventory.component';
import { MaintenanceComponent } from './pages/equipment/maintenance/maintenance.component';
import { FuelComponent } from './pages/equipment/fuel/fuel.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      { path: 'login', loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent) },
      { path: 'verify-email', loadComponent: () => import('./pages/auth/verify-email.component').then(m => m.VerifyEmailComponent) },
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'livestock', pathMatch: 'full' },
      { path: 'livestock', component: LivestockComponent },
      { 
        path: 'livestock/health', 
        component: HealthComponent,
        children: [
          { path: '', redirectTo: 'status', pathMatch: 'full' },
          { path: 'status', component: HealthStatusComponent },
          { path: 'status/bulk', component: BulkHealthComponent },
          { path: 'programmes', loadComponent: () => import('./pages/livestock/health/programmes/programmes.component').then(m => m.ProgrammesComponent) },
          { path: 'programmes/create', loadComponent: () => import('./pages/livestock/health/programmes/create-programme/create-programme.component').then(m => m.CreateProgrammeComponent) },
          { path: 'programmes/assign', loadComponent: () => import('./pages/livestock/health/programmes/assign-programme/assign-programme.component').then(m => m.AssignProgrammeComponent) },
          { path: 'vaccination', loadComponent: () => import('./pages/livestock/health/vaccination-schedule/vaccination-schedule.component').then(m => m.VaccinationScheduleComponent) },
          { path: 'lab', loadComponent: () => import('./pages/livestock/health/lab-results/lab-results.component').then(m => m.LabResultsComponent) },
        ]
      },
      { path: 'livestock/breeding', component: BreedingComponent },
      { 
        path: 'livestock/feed', 
        component: FeedComponent,
        children: [
          { path: '', redirectTo: 'inventory', pathMatch: 'full' },
          { path: 'inventory', loadComponent: () => import('./pages/livestock/feed/feed-inventory/feed-inventory.component').then(m => m.FeedInventoryComponent) },
          { path: 'schedules', loadComponent: () => import('./pages/livestock/feed/feed-schedules/feed-schedules.component').then(m => m.FeedSchedulesComponent) },
          { path: 'nutrition', loadComponent: () => import('./pages/livestock/feed/feed-nutrition/feed-nutrition.component').then(m => m.FeedNutritionComponent) },
          { path: 'programmes', loadComponent: () => import('./pages/livestock/feed/programmes/feeding-programmes.component').then(m => m.FeedingProgrammesComponent) },
          { path: 'programmes/create', loadComponent: () => import('./pages/livestock/feed/programmes/create-feeding-programme/create-feeding-programme.component').then(m => m.CreateFeedingProgrammeComponent) },
          { path: 'programmes/assign', loadComponent: () => import('./pages/livestock/feed/programmes/assign-feeding-programme/assign-feeding-programme.component').then(m => m.AssignFeedingProgrammeComponent) },
        ]
      },
      { path: 'livestock/pasture', component: PastureComponent },
      { path: 'livestock/add', component: AddAnimalComponent },
      { path: 'livestock/view/:id', component: ViewAnimalComponent },
      { path: 'livestock/dossier', loadComponent: () => import('./pages/livestock/animal-dossier/animal-dossier.component').then(m => m.AnimalDossierComponent) },
      { path: 'livestock/dossier/:id', loadComponent: () => import('./pages/livestock/animal-dossier/animal-dossier.component').then(m => m.AnimalDossierComponent) },
      { path: 'livestock/groups', component: GroupsComponent },
      { path: 'livestock/log-feeding', component: LogFeedingEventComponent },
      { path: 'livestock/new-breeding', component: NewBreedingRecordComponent },
      { path: 'livestock/log-transaction', component: LogTransactionComponent },
      { path: 'livestock/bulk-breeding', component: BulkBreedingComponent },
      { path: 'livestock/bulk-health', component: BulkHealthComponent },
      { path: 'livestock/bulk-accounting', component: BulkAccountingComponent },
      
      { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks.component').then(m => m.TasksComponent) },
      { path: 'tasks/create', loadComponent: () => import('./pages/tasks/create-task/create-task.component').then(m => m.CreateTaskComponent) },
      { path: 'tasks/execute/:id', loadComponent: () => import('./pages/tasks/task-execution/task-execution.component').then(m => m.TaskExecutionComponent) },

      { path: 'farms', loadComponent: () => import('./pages/farms/farms.component').then(m => m.FarmsComponent) },
      { path: 'species', loadComponent: () => import('./pages/species/species-list/species-list.component').then(m => m.SpeciesListComponent) },
      { path: 'species/create', loadComponent: () => import('./pages/species/species-create/species-create.component').then(m => m.SpeciesCreateComponent) },
      { path: 'species/view/:id', loadComponent: () => import('./pages/species/species-view.component').then(m => m.SpeciesViewComponent) },
      { path: 'species/edit/:id', loadComponent: () => import('./pages/species/species-edit.component').then(m => m.SpeciesEditComponent) },
      { 
        path: 'farms/:id', 
        loadComponent: () => import('./pages/farms/farm-view/farm-view.component').then(m => m.FarmViewComponent),
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', loadComponent: () => import('./pages/farms/farm-view/farm-overview/farm-overview.component').then(m => m.FarmOverviewComponent) },
          { path: 'locations', loadComponent: () => import('./pages/farms/farm-view/farm-locations/farm-locations.component').then(m => m.FarmLocationsComponent) },
          { path: 'species', loadComponent: () => import('./pages/farms/farm-view/farm-species/farm-species.component').then(m => m.FarmSpeciesComponent) }
        ]
      },
      { path: 'planting-cycle/:id', loadComponent: () => import('./pages/crops/planting-cycle-management/planting-cycle-management.component').then(m => m.PlantingCycleManagementComponent) },
      {
  path: 'crops',
  children: [
    { path: '', component: FieldMapComponent, pathMatch: 'full' },
    { path: 'edit', loadComponent: () => import('./pages/crops/field-map-edit/field-map-edit.component').then(m => m.FieldMapEditComponent) },
    { path: 'view/:id', loadComponent: () => import('./pages/crops/view-field/view-field.component').then(m => m.ViewFieldComponent) },
    { path: 'new-planting', loadComponent: () => import('./pages/crops/new-planting/new-planting.component').then(m => m.NewPlantingComponent) },
    { path: 'planting-cycle/:id', loadComponent: () => import('./pages/crops/planting-cycle-management/planting-cycle-management.component').then(m => m.PlantingCycleManagementComponent) },
    
    // Planting routes flat:
    { path: 'planting', component: PlantingComponent },
    { path: 'planting/active', loadComponent: () => import('./pages/crops/planting/active-plantings.component').then(m => m.ActivePlantingsComponent) },
    { path: 'planting/map', loadComponent: () => import('./pages/crops/planting/planting-map.component').then(m => m.PlantingMapComponent) },
    { path: 'planting/calendar', loadComponent: () => import('./pages/crops/planting/planting-calendar.component').then(m => m.PlantingCalendarComponent) },

    { path: 'harvest', component: HarvestingComponent },
    { path: 'soil-rating', component: SoilRatingComponent },
    { path: 'accounting', component: CropAccountingComponent },
  ]
},
      
      { path: 'equipment', redirectTo: 'equipment/inventory', pathMatch: 'full' },
      { 
        path: 'equipment/inventory', 
        component: InventoryComponent,
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', loadComponent: () => import('./pages/equipment/inventory/inventory-list.component').then(m => m.InventoryListComponent) },
          { path: 'locations', loadComponent: () => import('./pages/equipment/inventory/locations.component').then(m => m.LocationsComponent) },
          { path: 'locations/create', loadComponent: () => import('./pages/equipment/inventory/location-create.component').then(m => m.LocationCreateComponent) },
        ]
      },
      { path: 'equipment/inventory/create', loadComponent: () => import('./pages/equipment/inventory/inventory-create.component').then(m => m.InventoryCreateComponent) },
      { path: 'equipment/inventory/view/:id', loadComponent: () => import('./pages/equipment/inventory/inventory-detail.component').then(m => m.InventoryDetailComponent) },
      { path: 'equipment/maintenance', component: MaintenanceComponent },
      { path: 'equipment/fuel', component: FuelComponent },
      
      { path: 'dashboard', component: LivestockComponent },
      { path: 'dashboard/analytics', component: LivestockComponent },
      { path: 'dashboard/reports', component: LivestockComponent },
      
      { path: 'settings/profile', loadComponent: () => import('./pages/settings/profile.component').then(m => m.ProfileComponent) },
      { path: 'settings', component: LivestockComponent },
      { path: 'settings/farm', component: LivestockComponent },
      { path: 'settings/notifications', component: LivestockComponent },
      
      {
        path: 'hr',
        children: [
          { path: '', redirectTo: 'employee', pathMatch: 'full' },
          {
            path: 'employee',
            loadComponent: () => import('./pages/hr/employee.component').then(m => m.EmployeeComponent),
            children: [
              { path: '', redirectTo: 'overview', pathMatch: 'full' },
              { path: 'overview', loadComponent: () => import('./pages/hr/hr-overview.component').then(m => m.HrOverviewComponent) },
              { path: 'list', loadComponent: () => import('./pages/hr/employee-list.component').then(m => m.EmployeeListComponent) },
            ]
          },
          {
            path: 'payroll',
            loadComponent: () => import('./pages/hr/payroll.component').then(m => m.PayrollComponent),
            children: [
              { path: '', loadComponent: () => import('./pages/hr/payroll/payroll-cycles.component').then(m => m.PayrollCyclesComponent) },
              { path: 'run', loadComponent: () => import('./pages/hr/payroll/run-payroll.component').then(m => m.RunPayrollComponent) },
              { path: 'view/:id', loadComponent: () => import('./pages/hr/payroll/pay-cycle-detail.component').then(m => m.PayCycleDetailComponent) },
            ]
          },
          { path: 'leave', loadComponent: () => import('./pages/hr/leave-management.component').then(m => m.LeaveManagementComponent) },
          { path: 'performance', loadComponent: () => import('./pages/hr/performance.component').then(m => m.PerformanceComponent) },
        ]
      }
    ]
  }
];
