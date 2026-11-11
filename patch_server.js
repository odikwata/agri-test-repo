const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `const data = await fetchRes.json();
    res.json(data);`;
const replacement = `const data = await fetchRes.json();
    if (Array.isArray(data)) {
      // Mock pagination if the backend returns a flat array
      res.json({
        content: data,
        currentPage: 0,
        total: data.length,
        pages: 1
      });
    } else {
      res.json(data);
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
