const fs = require('fs');
let code = fs.readFileSync('src/app/app.config.ts', 'utf8');

const target1 = `import { ApplicationConfig, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';`;
const rep1 = `import { ApplicationConfig, provideZonelessChangeDetection, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';`;

const target2 = `  providers: [
    provideZonelessChangeDetection(),`;
const rep2 = `  providers: [
    provideZonelessChangeDetection(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return () => new Promise<void>((resolve) => {
          // Quick fetch of GMP key
          fetch('/api/gmp-key')
            .then(res => res.json())
            .then(data => {
              const key = data.key;
              if (key) {
                const script = document.createElement('script');
                script.src = \`https://maps.googleapis.com/maps/api/js?key=\${key}&libraries=drawing,geometry,places\`;
                script.async = true;
                script.defer = true;
                script.onload = () => resolve();
                document.head.appendChild(script);
              } else {
                resolve();
              }
            })
            .catch(() => resolve());
        });
      },
      multi: true
    },`;

code = code.replace(target1, rep1).replace(target2, rep2);
fs.writeFileSync('src/app/app.config.ts', code);
