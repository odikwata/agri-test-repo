const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });`;

const replacement = `    if (!process.env['GEMINI_API_KEY']) {
      res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      return;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Fixed server.ts');
} else {
    console.log('Target not found in server.ts');
}
