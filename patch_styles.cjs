const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if (!code.includes('google-map')) {
  code += `\ngoogle-map { display: block; height: 100%; width: 100%; }\ngoogle-map > div { height: 100%; width: 100%; }\n`;
  fs.writeFileSync('src/index.css', code);
}
