const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("const port = process.env.PORT || 3000;", "const port = process.env['PORT'] ? parseInt(process.env['PORT']) : 3000;");
code = code.replace("const qs = new URLSearchParams(req.query).toString();", "const qs = new URLSearchParams(req.query as any).toString();");
code = code.replace("const costDomain = req.query.costDomain;", "const costDomain = (req.query as any).costDomain;");

fs.writeFileSync('server.ts', code);
console.log('Fixed server.ts');
