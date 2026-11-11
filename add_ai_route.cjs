const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

const importTarget = `import dotenv from 'dotenv';`;
const importReplacement = `import dotenv from 'dotenv';\nimport { GoogleGenAI } from '@google/genai';`;

if(code.includes(importTarget)) {
    code = code.replace(importTarget, importReplacement);
}

const routeTarget = `app.listen(port`;
const routeReplacement = `
app.post('/api/ai/sensor-analysis', async (req, res) => {
  try {
    const { crop, growthStage, sensorData } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = \`As an agricultural AI assistant, briefly analyze this live sensor data for \${crop} during its \${growthStage} stage.
Sensor Data: \${JSON.stringify(sensorData)}
Compare this to the expected conditions for this crop and stage. Keep the response concise, under 3 sentences. Focus on actionable insights.\`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash',
      contents: prompt,
    });
    
    res.json({ analysis: response.text });
  } catch (err) {
    console.error('AI Analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze sensor data' });
  }
});

app.listen(port`;

if (code.includes(routeTarget)) {
    code = code.replace(routeTarget, routeReplacement);
    fs.writeFileSync(file, code);
    console.log('Added AI route');
} else {
    console.log('Route target not found');
}
