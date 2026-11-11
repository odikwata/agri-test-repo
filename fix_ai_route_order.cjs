const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `// Handle unknown API routes with 404`;
const replacement = `app.post('/api/ai/sensor-analysis', async (req, res) => {
  try {
    const { crop, growthStage, sensorData } = req.body;
    
    if (!process.env['GEMINI_API_KEY']) {
      res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      return;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });
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

// Handle unknown API routes with 404`;

// Remove the old route at the bottom
const removeTarget = `app.post('/api/ai/sensor-analysis', async (req, res) => {
  try {
    const { crop, growthStage, sensorData } = req.body;
    
    if (!process.env['GEMINI_API_KEY']) {
      res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      return;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });
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
});`;

if (code.includes(target) && code.includes(removeTarget)) {
    // We only want to replace the FIRST occurrence (the one near the bottom)
    // Wait, the bottom one is EXACTLY removeTarget. Let's do this safely:
    code = code.replace(removeTarget, '');
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Fixed route order');
} else {
    console.log('Target not found');
}
