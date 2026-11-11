const fs = require('fs');
let code = fs.readFileSync('src/app/app.config.ts', 'utf8');

const target = `    {
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

const rep = `    {
      provide: APP_INITIALIZER,
      useFactory: (platformId: Object) => {
        return () => new Promise<void>((resolve) => {
          if (!isPlatformBrowser(platformId)) {
            resolve();
            return;
          }
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
      deps: [PLATFORM_ID],
      multi: true
    },`;

code = code.replace(target, rep);
fs.writeFileSync('src/app/app.config.ts', code);
