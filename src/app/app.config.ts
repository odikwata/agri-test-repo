import { ApplicationConfig, provideZonelessChangeDetection, importProvidersFrom, APP_INITIALIZER, ErrorHandler, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { LucideAngularModule, icons } from 'lucide-angular';
import { config as rxjsConfig } from 'rxjs';

// Suppress unhandled RxJS exceptions from crashing with uncaught [object Object]
rxjsConfig.onUnhandledError = (err: any) => {
  console.warn('Unhandled RxJS error caught globally:', err?.message || err);
};

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global application error caught:', error?.message || error);
  }
}

const safeIcons: Record<string, any> = new Proxy(icons as Record<string, any>, {
  has(target, prop) {
    if (typeof prop === 'symbol') {
      return prop in target;
    }
    return true;
  },
  get(target, prop: string | symbol) {
    if (typeof prop === 'symbol') {
      return (target as any)[prop];
    }
    if (prop === 'then' || prop === 'constructor' || prop === 'prototype') {
      return (target as any)[prop];
    }
    if (typeof prop === 'string' && prop in target) {
      return target[prop];
    }
    const aliases: Record<string, any> = {
      CheckCircle: target['CircleCheckBig'] || target['CircleCheck'],
      CheckCircle2: target['CircleCheck'],
      AlertTriangle: target['TriangleAlert'],
      AlertCircle: target['CircleAlert'],
      XCircle: target['CircleX'],
      PlusCircle: target['CirclePlus'],
      HelpCircle: target['CircleHelp'] || target['BadgeHelp'],
      Edit: target['Pencil'] || target['SquarePen'],
      Loader2: target['LoaderCircle'] || target['Loader'],
      Filter: target['ListFilter'] || target['Funnel'],
      BarChart3: target['ChartBarBig'] || target['ChartBar'] || target['ChartColumn'],
      BarChart: target['ChartBar'] || target['ChartColumn'],
      LineChart: target['ChartLine'],
      PieChart: target['ChartPie'],
      RefreshCw: target['RotateCw'] || target['RefreshCw'],
      MoreVertical: target['EllipsisVertical'],
      MoreHorizontal: target['Ellipsis'],
      CalendarOff: target['CalendarX'] || target['CalendarDays'],
      ListTodo: target['ListCheck'] || target['List'],
      Sparkles: target['Sparkle'] || target['Sparkles']
    };
    if (typeof prop === 'string' && aliases[prop]) {
      return aliases[prop];
    }
    return target['Activity'] || target['Circle'] || (target as any)['Sprout'] || [];
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    {
      provide: APP_INITIALIZER,
      useFactory: (platformId: Object) => {
        return () => {
          if (isPlatformBrowser(platformId)) {
            // Asynchronously pre-fetch and load Google Maps in the background without blocking Angular bootstrap
            fetch('/api/gmp-key')
              .then(res => (res.ok ? res.json() : null))
              .then(data => {
                const key = data?.key;
                if (key && typeof window !== 'undefined' && !(window as any).google?.maps) {
                  const existing = document.querySelector('script[src*="maps.googleapis.com"]');
                  if (!existing) {
                    const script = document.createElement('script');
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=drawing,geometry,places&v=3.64`;
                    script.async = true;
                    script.defer = true;
                    document.head.appendChild(script);
                  }
                }
              })
              .catch(err => {
                console.warn('Google Maps async load non-critical warning:', err?.message || err);
              });
          }
          return Promise.resolve();
        };
      },
      deps: [PLATFORM_ID],
      multi: true
    },
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    importProvidersFrom(
      LucideAngularModule.pick(safeIcons)
    )
  ]
};
