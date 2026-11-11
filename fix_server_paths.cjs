const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("app.use(express.static(path.join(__dirname, 'dist/browser')));", "app.use(express.static(path.join(__dirname, 'dist')));");
code = code.replace("res.sendFile(path.join(__dirname, 'dist/browser/index.html'));", "res.sendFile(path.join(__dirname, 'dist/index.html'));");

fs.writeFileSync('server.ts', code);
console.log('Fixed paths');
