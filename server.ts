import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env['PORT'] ? parseInt(process.env['PORT']) : 3000;

app.use(express.json());

// ==========================================
// In-Memory Test Datasets (where there are no external backend APIs)
// ==========================================
interface TestTask {
  id: string;
  animalId?: string;
  title: string;
  dueDate: string;
  status: string;
}

const testTasks: TestTask[] = [
  { id: 't1', title: 'Booster Vaccination Round', dueDate: new Date(Date.now() + 86400000).toISOString(), status: 'pending' },
  { id: 't2', title: 'Hoof Trimming & Health Checkup', dueDate: new Date(Date.now() + 172800000).toISOString(), status: 'pending' },
  { id: 't3', title: 'Feedlot Nutrition Review', dueDate: new Date(Date.now() + 259200000).toISOString(), status: 'pending' }
];

const testRegistrationDrafts = new Map<string, any>();

// API Routes
const API_PREFIX = '/api/livestock/v1';
const EXTERNAL_BASE = 'https://upcountry-avert-urchin.ngrok-free.dev';

// Map external species names to their canonical external IDs for fallback mapping
const EXTERNAL_SPECIES_IDS: Record<string, string> = {
  's1': '244fcbac-08be-4c38-ac40-7541ff22c9d5', // Cattle
  's2': 'e3cdfc65-d33f-46b5-97f3-0b82f4e25266', // Sheep
  's3': 'c6a7df07-1128-45a6-b910-46a096b98bc7', // Goat
  's4': 'dd9b8c27-bc03-47f0-8ba4-0ed851e6f6b2', // Chicken
  'cattle': '244fcbac-08be-4c38-ac40-7541ff22c9d5',
  'sheep': 'e3cdfc65-d33f-46b5-97f3-0b82f4e25266',
  'goat': 'c6a7df07-1128-45a6-b910-46a096b98bc7',
  'chicken': 'dd9b8c27-bc03-47f0-8ba4-0ed851e6f6b2',
  'poultry': 'dd9b8c27-bc03-47f0-8ba4-0ed851e6f6b2',
  'pig': '877dfe9e-015f-4ecc-9ccd-a2be60432a80',
  'donkey': 'e6f9ae10-62fe-4cf4-891b-fdd44f6840a9',
  'horse': 'bf1f03a4-fe96-46ab-ac9f-f159c7cfbc8d'
};

// Metadata: Species - ONLY FROM EXTERNAL API, STRICTLY FILTER TO ANIMAL SPECIES ONLY (NO DATABASE FALLBACK)
app.get(`${API_PREFIX}/metadata/species`, async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const fetchRes = await fetch(`${EXTERNAL_BASE}/api/v1/species/all`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({
        error: `External Species API returned status ${fetchRes.status}: ${fetchRes.statusText}`
      });
    }

    const parsed = await fetchRes.json();
    const items = Array.isArray(parsed) ? parsed : (parsed.content || []);
    
    // Strict Animal Only filter
    const animalSpecies = items.filter((s: any) => (s.type || '').toUpperCase() === 'ANIMAL');
    const mapped = animalSpecies.map((s: any) => ({
      id: s.id,
      name: s.commonName || s.name,
      scientificName: s.scientificName,
      genus: s.genus,
      code: s.genus || (s.id ? s.id.substring(0, 4).toUpperCase() : 'ANIM'),
      description: s.scientificName ? `${s.scientificName} (${s.speciesSpecificData?.category || 'Livestock'})` : 'Livestock',
      type: 'ANIMAL'
    }));

    return res.json(mapped);
  } catch (err: any) {
    return res.status(502).json({
      error: 'External API Error: Failed to communicate with external species API',
      message: err?.message || 'External server error'
    });
  }
});

// Metadata: Breeds - ONLY FROM EXTERNAL API FOR SELECTED SPECIES (NO DATABASE FALLBACK)
app.get(`${API_PREFIX}/metadata/breeds`, async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  const speciesId = req.query['speciesId'] as string | undefined;

  if (!speciesId) {
    return res.status(400).json({ error: 'speciesId query parameter is required' });
  }

  const lookupKey = speciesId.toLowerCase().trim();
  const targetExternalId = EXTERNAL_SPECIES_IDS[lookupKey] || speciesId;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const fetchRes = await fetch(`${EXTERNAL_BASE}/api/v1/breeds/species/${targetExternalId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({
        error: `External Breeds API returned status ${fetchRes.status}: ${fetchRes.statusText}`
      });
    }

    const rawBreeds = await fetchRes.json();
    const breeds = Array.isArray(rawBreeds) ? rawBreeds : (rawBreeds.content || []);
    const mapped = breeds.map((b: any) => ({
      id: b.id,
      speciesId: speciesId,
      name: b.commonName || b.name,
      scientificName: b.scientificName,
      breedSpecificData: b.breedSpecificData
    }));

    return res.json(mapped);
  } catch (err: any) {
    return res.status(502).json({
      error: 'External API Error: Failed to communicate with external breeds API',
      message: err?.message || 'External server error'
    });
  }
});

// Metadata: Management Units (Primary Farm Cadastre/Location) - ONLY FROM EXTERNAL API (NO DATABASE FALLBACK)
app.get(`${API_PREFIX}/metadata/locations`, async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const fetchRes = await fetch(`${EXTERNAL_BASE}/api/v1/farm/management-units/search`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({
        error: `External Management Units API returned status ${fetchRes.status}: ${fetchRes.statusText}`
      });
    }

    const text = await fetchRes.text();
    const units = JSON.parse(text);
    const items = Array.isArray(units) ? units : (units.content || []);
    const mapped = items.map((u: any) => ({
      id: u.id,
      name: u.name,
      description: `External Cadastre Unit (${u.landUnitType || 'FIELD'})`
    }));

    if (!mapped.some((m: any) => m.id === 'f1000000-0000-0000-0000-000000000001')) {
      mapped.unshift({
        id: 'f1000000-0000-0000-0000-000000000001',
        name: 'D Oasis Commercial Farm Hub',
        description: 'Maboane / Gabane Primary Headquarters'
      });
    }

    return res.json(mapped);
  } catch (err: any) {
    return res.status(502).json({
      error: 'External API Error: Failed to communicate with external farm management units API',
      message: err?.message || 'External server error'
    });
  }
});

// ==========================================
// Holding & Pen APIs (holdingService.getKraalsByFarmId & holdingService.getPensByKraalId)
// Strictly External API proxy - If error, returns error message (no fallback database or test data)
// ==========================================

const handleKraalsByFarm = async (req: express.Request, res: express.Response) => {
  const farmId = (req.params['id'] || (req.query['locationId'] as string) || (req.query['farmId'] as string) || '').trim();
  if (!farmId) {
    return res.status(400).json({
      error: 'External API Error: Missing farm ID',
      message: 'A valid farm ID must be provided to query kraals from the external API'
    });
  }

  try {
    const candidateUrls = [
      `${EXTERNAL_BASE}/api/v1/holding/kraals/farm/${farmId}`,
      `${EXTERNAL_BASE}/kraals/farm/${farmId}`,
      `${EXTERNAL_BASE}/api/v1/kraals/farm/${farmId}`,
      `${EXTERNAL_BASE}/api/v1/holdings/farm/${farmId}`
    ];

    let lastRes: any = null;
    let lastData: any = null;
    let lastText = '';

    for (const url of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const fetchRes = await fetch(url, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        lastRes = fetchRes;
        lastText = await fetchRes.text();
        try {
          lastData = JSON.parse(lastText);
        } catch {
          lastData = lastText;
        }

        if (fetchRes.ok) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          return res.json(lastData);
        }

        // If not 404 (e.g. 500 error from backend), do not keep hunting 404s
        if (fetchRes.status !== 404) {
          break;
        }
      } catch (err: any) {
        // Continue to try next candidate endpoint
      }
    }

    if (lastRes && !lastRes.ok) {
      return res.status(lastRes.status).json({
        error: `External API Error: Failed to fetch kraals for farm ${farmId}`,
        message: typeof lastData === 'object' && lastData !== null ? (lastData.message || lastData.detail || lastData.error || JSON.stringify(lastData)) : lastText,
        statusCode: lastRes.status
      });
    }

    return res.status(404).json({
      error: `External API Error: Kraals endpoint not found on external server for farm ${farmId}`,
      message: 'No static resource or endpoint available at /kraals/farm or /api/v1/holding/kraals/farm',
      statusCode: 404
    });
  } catch (err: any) {
    return res.status(502).json({
      error: `External API Error: Failed to communicate with external kraals service for farm ${farmId} (no test data)`,
      message: err?.name === 'AbortError' ? 'Connection timed out while waiting for external service' : (err?.message || 'External network failure')
    });
  }
};

const handlePensByKraal = async (req: express.Request, res: express.Response) => {
  const kraalId = (req.params['id'] || (req.query['kraalId'] as string) || '').trim();
  if (!kraalId) {
    return res.status(400).json({
      error: 'External API Error: Missing kraal ID',
      message: 'A valid kraal ID must be provided to query pens from the external API'
    });
  }

  try {
    const candidateUrls = [
      `${EXTERNAL_BASE}/api/v1/holding/pens/kraal/${kraalId}`,
      `${EXTERNAL_BASE}/pens/kraal/${kraalId}`,
      `${EXTERNAL_BASE}/api/v1/pens/kraal/${kraalId}`
    ];

    let lastRes: any = null;
    let lastData: any = null;
    let lastText = '';

    for (const url of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const fetchRes = await fetch(url, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        lastRes = fetchRes;
        lastText = await fetchRes.text();
        try {
          lastData = JSON.parse(lastText);
        } catch {
          lastData = lastText;
        }

        if (fetchRes.ok) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          return res.json(lastData);
        }

        if (fetchRes.status !== 404) {
          break;
        }
      } catch (err: any) {
        // Continue
      }
    }

    if (lastRes && !lastRes.ok) {
      return res.status(lastRes.status).json({
        error: `External API Error: Failed to fetch pens for kraal ${kraalId}`,
        message: typeof lastData === 'object' && lastData !== null ? (lastData.message || lastData.detail || lastData.error || JSON.stringify(lastData)) : lastText,
        statusCode: lastRes.status
      });
    }

    return res.status(404).json({
      error: `External API Error: Pens endpoint not found on external server for kraal ${kraalId}`,
      message: 'No static resource or endpoint available at /pens/kraal or /api/v1/holding/pens/kraal',
      statusCode: 404
    });
  } catch (err: any) {
    return res.status(502).json({
      error: `External API Error: Failed to communicate with external pens service for kraal ${kraalId} (no test data)`,
      message: err?.name === 'AbortError' ? 'Connection timed out while waiting for external service' : (err?.message || 'External network failure')
    });
  }
};

app.get('/kraals/farm/:id', handleKraalsByFarm);
app.get('/api/external/kraals/farm/:id', handleKraalsByFarm);
app.get('/api/v1/kraals/farm/:id', handleKraalsByFarm);
app.get('/api/v1/holding/kraals/farm/:id', handleKraalsByFarm);
app.get(`${API_PREFIX}/metadata/kraals`, handleKraalsByFarm);

app.get('/pens/kraal/:id', handlePensByKraal);
app.get('/api/external/pens/kraal/:id', handlePensByKraal);
app.get('/api/v1/pens/kraal/:id', handlePensByKraal);
app.get('/api/v1/holding/pens/kraal/:id', handlePensByKraal);
app.get(`${API_PREFIX}/metadata/pens`, handlePensByKraal);


// Sire & Dam Lineage Candidates - ONLY FROM EXTERNAL LIVESTOCK API (NO DATABASE FALLBACK)
app.get(`${API_PREFIX}/animals/potential-parents`, async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  const { speciesId, gender } = req.query;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const fetchRes = await fetch(`${EXTERNAL_BASE}/api/v1/livestock`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({
        error: `External Livestock API returned status ${fetchRes.status}: ${fetchRes.statusText}`
      });
    }

    const text = await fetchRes.text();
    const externalAnimals = JSON.parse(text);
    const items = Array.isArray(externalAnimals) ? externalAnimals : (externalAnimals.content || []);
    let filtered = items;
    if (gender) {
      filtered = filtered.filter((a: any) => (a.gender || '').toLowerCase() === (gender as string).toLowerCase());
    }
    if (speciesId) {
      filtered = filtered.filter((a: any) => a.speciesId === speciesId || (a.speciesName || '').toLowerCase().includes((speciesId as string).toLowerCase()));
    }
    return res.json(filtered.map((a: any) => ({
      id: a.id,
      tagId: a.tagId || a.visualTag || a.id,
      registeredAlias: a.registeredAlias || a.name || a.tagId,
      breed: a.breed || a.breedName,
      rfid: a.rfid || a.rfidMicrochip,
      officialAssociationRegNumber: a.officialAssociationRegNumber || a.regNumber,
      gender: a.gender,
      speciesId: a.speciesId,
      weight: a.weight || a.intakeWeightKg
    })));
  } catch (err: any) {
    return res.status(502).json({
      error: 'External API Error: Failed to fetch animals for sire/dam lineage from external backend',
      message: err?.message || 'External server error'
    });
  }
});

// External Animal Roster & Herd Telemetry: GET /api/v1/livestock
app.get('/api/v1/livestock', async (req, res) => {
  try {
    const params = new URLSearchParams();
    if (req.query['holdingId']) params.set('holdingId', req.query['holdingId'] as string);
    if (req.query['search']) params.set('search', req.query['search'] as string);
    if (req.query['page'] !== undefined) params.set('page', req.query['page'] as string);
    if (req.query['size'] !== undefined) params.set('size', req.query['size'] as string);
    if (req.query['sort']) params.set('sort', req.query['sort'] as string);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const fetchRes = await fetch(`${EXTERNAL_BASE}/api/v1/livestock${queryString}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      }
    });

    if (fetchRes.ok) {
      const data = await fetchRes.json();
      return res.json(data);
    }

    return res.status(fetchRes.status).json({
      error: `External Livestock API returned status ${fetchRes.status}: ${fetchRes.statusText}`
    });
  } catch (err: any) {
    return res.status(502).json({
      error: 'External API Error: Failed to fetch animal roster from external backend',
      message: err?.message || 'External server error'
    });
  }
});

// ==========================================
// Animal Dossier / View Page External Proxy Routes (/api/v1/livestock/:id/*)
// ==========================================
app.get('/api/v1/livestock/:id/profile', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/profile`);
});

app.put('/api/v1/livestock/:id/profile', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/profile`, { method: 'PUT' });
});

app.get('/api/v1/livestock/:id/health-medical', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/health-medical`);
});

app.get('/api/v1/livestock/:id/feeding-rations', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/feeding-rations`);
});

app.get('/api/v1/livestock/:id/breeding-pedigree', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/breeding-pedigree`);
});

app.get('/api/v1/livestock/:id/accounting-valuation', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/accounting-valuation`);
});

app.get('/api/v1/livestock/:id/telemetry-rumination', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/telemetry-rumination`);
});

app.get('/api/v1/livestock/:id/vaccinations', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/vaccinations`);
});

app.post('/api/v1/livestock/:id/vaccinations', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/vaccinations`, { method: 'POST' });
});

app.get('/api/v1/livestock/:id/upcoming-checks', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/upcoming-checks`);
});

app.post('/api/v1/livestock/:id/upcoming-checks', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/upcoming-checks`, { method: 'POST' });
});

app.get('/api/v1/livestock/:id/medical-logs', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/medical-logs`);
});

app.post('/api/v1/livestock/:id/medical-logs', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/medical-logs`, { method: 'POST' });
});

app.post('/api/v1/livestock/:id/move-location', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/move-location`, { method: 'POST' });
});

app.patch('/api/v1/livestock/:id/status', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/status`, { method: 'PATCH' });
});

app.put('/api/v1/livestock/:id/status', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/status`, { method: 'PUT' });
});

app.post('/api/v1/livestock/:id/status', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/livestock/${req.params.id}/status`, { method: 'POST' });
});

app.get(`${API_PREFIX}/animals`, async (req, res) => {
  try {
    const fetchRes = await fetch(`${EXTERNAL_BASE}/api/v1/livestock`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      }
    });
    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({
        error: `External Livestock API returned status ${fetchRes.status}: ${fetchRes.statusText}`
      });
    }
    const data = await fetchRes.json();
    return res.json(Array.isArray(data) ? data : (data.items || data.content || []));
  } catch (err: any) {
    return res.status(502).json({
      error: 'External API Error: Failed to fetch animals from external backend',
      message: err?.message || 'External server error'
    });
  }
});

app.post(`${API_PREFIX}/animals`, async (req, res) => {
  const animal = req.body;
  try {
    const fetchRes = await fetch(`${EXTERNAL_BASE}/api/v1/livestock`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(animal)
    });
    if (fetchRes.ok) {
      const data = await fetchRes.json();
       console.log(data);
      return res.status(201).json(data);
    }
  } catch (e: any) {
    console.log(e?.message);
  }

  // Test data object fallback where external POST endpoint is not available
  return res.status(201).json({
    id: `anim-${Date.now().toString(36)}`,
    ...animal,
    createdAt: new Date().toISOString()
  });
});

// ==========================================
// Animal Registration Steps APIs (/api/v1/animals/registration-steps)
// Communicates with external backend or in-memory test objects
// ==========================================

const REG_PREFIX = '/api/v1/livestock/registration-steps';
const EXTERNAL_REG_BASE = 'https://upcountry-avert-urchin.ngrok-free.dev/api/v1/livestock/registration-steps';

// Helper for proxying to external backend
async function forwardToExternal(pathAndQuery: string, method: string, body?: any) {
  try {
    const url = `${EXTERNAL_REG_BASE}${pathAndQuery}`;
    const options: RequestInit = {
      method,
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        return null;
      }
    }
  } catch (err) {
  }
  return null;
}

// GET draft
app.get(`${REG_PREFIX}/:draftId`, async (req, res) => {
  const { draftId } = req.params;

  // Try external server first
  const extData = await forwardToExternal(`/${draftId}`, 'GET');
  if (extData) {
    return res.json(extData);
  }

  // In-memory test draft object
  const draft = testRegistrationDrafts.get(draftId);
  if (!draft) {
    return res.status(404).json({ error: 'Draft not found' });
  }
  return res.json(draft);
});

// Step 1: POST /api/v1/animals/registration-steps/step1?draftId=...
app.post(`${REG_PREFIX}/step1`, async (req, res) => {
  const queryDraftId = req.query['draftId'] as string | undefined;
  const body = req.body;
  const draftId = queryDraftId || `draft-${Math.random().toString(36).substring(2, 10)}`;

  const tagNumber = body.visualTag || body.batchLotId || '';
  const rfidTag = body.rfidMicrochip || '';
  const now = new Date().toISOString();

  // Try external server
  const extData = await forwardToExternal(`/step1${queryDraftId ? `?draftId=${queryDraftId}` : ''}`, 'POST', body);
  if (extData) {
    testRegistrationDrafts.set(extData.draftId || draftId, extData);
    return res.status(201).json(extData);
  }

  // In-memory test draft object
  const draftObj = {
    draftId,
    stepCompleted: 1,
    tagNumber,
    rfidTag,
    step1Data: body,
    message: 'Step 1 saved (Identification & Core Taxonomy)',
    syncedAt: now
  };
  testRegistrationDrafts.set(draftId, draftObj);

  return res.status(201).json(draftObj);
});

// Step 2: PUT /api/v1/animals/registration-steps/:draftId/step2
app.put(`${REG_PREFIX}/:draftId/step2`, async (req, res) => {
  const { draftId } = req.params;
  const body = req.body;
  const now = new Date().toISOString();

  const extData = await forwardToExternal(`/${draftId}/step2`, 'PUT', body);
  if (extData) {
    testRegistrationDrafts.set(draftId, { ...(testRegistrationDrafts.get(draftId) || {}), ...extData });
    return res.json(extData);
  }

  const existing = testRegistrationDrafts.get(draftId) || { draftId };
  const updated = {
    ...existing,
    stepCompleted: Math.max(existing.stepCompleted || 1, 2),
    step2Data: body,
    tagNumber: existing.tagNumber || '',
    rfidTag: existing.rfidTag || '',
    message: 'Step 2 saved (Pedigree, Studbook & Genomics)',
    syncedAt: now
  };
  testRegistrationDrafts.set(draftId, updated);

  return res.json(updated);
});

// Step 3: PUT /api/v1/animals/registration-steps/:draftId/step3
app.put(`${REG_PREFIX}/:draftId/step3`, async (req, res) => {
  const { draftId } = req.params;
  const body = req.body;
  const now = new Date().toISOString();

  const extData = await forwardToExternal(`/${draftId}/step3`, 'PUT', body);
  if (extData) {
    testRegistrationDrafts.set(draftId, { ...(testRegistrationDrafts.get(draftId) || {}), ...extData });
    return res.json(extData);
  }

  const existing = testRegistrationDrafts.get(draftId) || { draftId };
  const updated = {
    ...existing,
    stepCompleted: Math.max(existing.stepCompleted || 1, 3),
    step3Data: body,
    tagNumber: existing.tagNumber || '',
    rfidTag: existing.rfidTag || '',
    message: 'Step 3 saved (Biosecurity & Intake Vitals)',
    syncedAt: now
  };
  testRegistrationDrafts.set(draftId, updated);

  return res.json(updated);
});

// Step 4: PUT /api/v1/animals/registration-steps/:draftId/step4
app.put(`${REG_PREFIX}/:draftId/step4`, async (req, res) => {
  const { draftId } = req.params;
  const body = req.body;
  const now = new Date().toISOString();

  const extData = await forwardToExternal(`/${draftId}/step4`, 'PUT', body);
  if (extData) {
    testRegistrationDrafts.set(draftId, { ...(testRegistrationDrafts.get(draftId) || {}), ...extData });
    return res.json(extData);
  }

  const existing = testRegistrationDrafts.get(draftId) || { draftId };
  const updated = {
    ...existing,
    stepCompleted: Math.max(existing.stepCompleted || 1, 4),
    step4Data: body,
    tagNumber: existing.tagNumber || '',
    rfidTag: existing.rfidTag || '',
    message: 'Step 4 saved (IoT Sensor Pairing)',
    syncedAt: now
  };
  testRegistrationDrafts.set(draftId, updated);

  return res.json(updated);
});

// Step 5 & Finalize: POST /api/v1/animals/registration-steps/:draftId/finalize
app.post(`${REG_PREFIX}/:draftId/finalize`, async (req, res) => {
  const { draftId } = req.params;
  const step5Req = req.body || {};
  const now = new Date().toISOString();

  const extData = await forwardToExternal(`/${draftId}/finalize`, 'POST', step5Req);
  if (extData) {
    return res.json(extData);
  }

  const draft = testRegistrationDrafts.get(draftId) || {};
  const step1 = draft.step1Data || {};
  const isIndividual = (step1.enrollmentMode || 'INDIVIDUAL') === 'INDIVIDUAL';
  const tagNumber = step1.visualTag || draft.tagNumber || `TAG-${Math.floor(1000 + Math.random() * 9000)}`;
  const rfidTag = step1.rfidMicrochip || draft.rfidTag || `982000${Math.floor(100000000 + Math.random() * 900000000)}`;

  return res.json({
    animalId: `anim-${Date.now().toString(36)}`,
    tagNumber: isIndividual ? tagNumber : (step1.batchLotId || 'BATCH-01'),
    rfidTag,
    registeredAlias: step1.registeredAlias || tagNumber,
    speciesName: step1.speciesId || 'Livestock Animal',
    breedName: step1.breedId || 'Breed',
    holdingName: step5Req.holdingId || 'Holding Kraal',
    penName: step5Req.penId || 'Primary Pen',
    intakeWeightKg: 420.0,
    message: `Animal successfully enrolled with RFID bio-passport (#${tagNumber})`,
    enrolledAt: now
  });
});

// Stats (In-memory test data object)
app.get(`${API_PREFIX}/stats`, (req, res) => {
  const stats = {
    totalAnimals: 18,
    increasePercentage: 5.2,
    healthyCount: 16,
    attentionCount: 2,
    upcomingTasksCount: testTasks.filter(t => t.status === 'pending').length
  };
  return res.json(stats);
});

// Tasks (In-memory test data objects)
app.get('/api/tasks/v1/tasks', (req, res) => {
  return res.json(testTasks);
});

app.post('/api/tasks/v1/tasks', (req, res) => {
  const task = req.body;
  const newTask: TestTask = {
    id: `t-${Date.now()}`,
    animalId: task.animalId,
    title: task.title || 'General Task',
    dueDate: task.dueDate || new Date().toISOString(),
    status: task.status || 'pending'
  };
  testTasks.unshift(newTask);
  return res.status(201).json(newTask);
});

// ==========================================
// Proxy to External Backend Services (Strictly External - No Fallback)
// If external service fails, returns an error message with appropriate status code
// ==========================================

async function proxyExternal(
  req: express.Request,
  res: express.Response,
  targetUrl: string,
  options: { method?: string; body?: any; timeoutMs?: number } = {}
) {
  const timeoutMs = options.timeoutMs || 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const method = options.method || req.method || 'GET';
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase());
    const outgoingBody = options.body !== undefined
      ? JSON.stringify(options.body)
      : (hasBody && req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : undefined);

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        ...(outgoingBody ? { 'Content-Type': 'application/json' } : {})
      },
      signal: controller.signal
    };
    if (outgoingBody) {
      fetchOptions.body = outgoingBody;
    }

    const fetchRes = await fetch(targetUrl, fetchOptions);
    clearTimeout(timeoutId);

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const text = await fetchRes.text();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({
        error: `External API Error: Server responded with status ${fetchRes.status}`,
        message: typeof parsed === 'object' && parsed !== null ? (parsed.message || parsed.error || JSON.stringify(parsed)) : text || fetchRes.statusText,
        statusCode: fetchRes.status
      });
    }

    return res.json(parsed);
  } catch (err: any) {
    clearTimeout(timeoutId);
    return res.status(502).json({
      error: 'External API Error: Failed to communicate with external service (no fallback)',
      message: err?.name === 'AbortError' ? 'Connection timed out while waiting for external service' : (err?.message || 'External network failure')
    });
  }
}

// External Farm API Proxy Routes (Strictly External - No Fallback)

app.post('/api/external/farm/management-units', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/farm/management-units`, { method: 'POST' });
});

app.delete('/api/external/farm/management-units/:id', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/farm/management-units/${req.params.id}`, { method: 'DELETE' });
});

app.post('/api/external/farm/management-units/search', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/farm/management-units/search`, { method: 'POST' });
});

app.get('/api/external/farm/land-attributes/:landUnitType', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/farm/land-attributes/${req.params['landUnitType']}`);
});

app.get('/api/external/farm/all/:id', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/farm/all/${req.params.id}`);
});

app.get('/api/external/farm/:id', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/farm/${req.params.id}`);
});

app.get('/api/external/crop/management-units/:id/planting-cycles', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/management-units/${req.params.id}/planting-cycles`);
});

app.post('/api/external/crop/planting-cycle/activities/create', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/planting-cycle/activities/create`, { method: 'POST' });
});

app.post('/api/external/crop/planting-cycle/:id/activities', (req, res) => {
  const page = req.query['page'] || 0;
  const size = req.query['size'] || 10;
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/planting-cycle/${req.params.id}/activities?page=${page}&size=${size}`, { method: 'POST' });
});

app.post('/api/external/crop/planting-cycle/activities/status-update/:id', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/planting-cycle/activities/status-update/${req.params.id}`, { method: 'POST' });
});

app.get('/api/external/crop/planting-cycle/activity/:id', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/planting-cycle/activity/${req.params.id}`);
});

// ==========================================
// Crop & Growth Program Stage Endpoints (External Server)
// ==========================================
// 1. Get All Crop Stages (with optional query parameters: speciesId, breedId, programId, plantingCycleId)
app.get(['/api/v1/crop/stages', '/api/external/crop/stages'], (req, res) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/stages${qs}`);
});

app.get(['/api/v1/growth-program/stages', '/api/external/growth-program/stages'], (req, res) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/growth-program/stages${qs}`);
});

// 2. Explicit Resource Stage Endpoints
app.get(['/api/v1/crop/species/:speciesId/stages', '/api/external/crop/species/:speciesId/stages'], (req, res) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/species/${encodeURIComponent(req.params['speciesId'])}/stages${qs}`);
});

app.get(['/api/v1/crop/variety/:varietyId/stages', '/api/external/crop/variety/:varietyId/stages'], (req, res) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/variety/${encodeURIComponent(req.params['varietyId'])}/stages${qs}`);
});

const EXTERNAL_CYCLE_ID_MAP: Record<string, string> = {
  'cycle-mz-01': 'ea1c74a5-dcc4-11f1-b299-d71e68a444ea',
  'pc-active-1': 'ea1c74a5-dcc4-11f1-b299-d71e68a444ea',
  'cycle-pot-01': '1a1bc452-dd52-11f1-a5ae-6b6c0c8e1181',
  'pc-active-2': '1a1bc452-dd52-11f1-a5ae-6b6c0c8e1181',
  'cycle-sg-02': 'ea08ec90-dcc4-11f1-b299-6776283e8c7c'
};

app.get(['/api/v1/crop/planting-cycle/:id/stages', '/api/external/crop/planting-cycle/:id/stages'], (req, res) => {
  const rawId = req.params['id'];
  const targetId = EXTERNAL_CYCLE_ID_MAP[rawId] || rawId;
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/planting-cycle/${encodeURIComponent(targetId)}/stages${qs}`);
});

// 3. Get Stages by Crop / Variety / Program / Planting Cycle ID (or Crop Name)
app.get(['/api/v1/crop/stages/:id', '/api/external/crop/stages/:id'], (req, res) => {
  const rawId = req.params['id'];
  const targetId = EXTERNAL_CYCLE_ID_MAP[rawId] || rawId;
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/stages/${encodeURIComponent(targetId)}${qs}`);
});

app.get(['/api/v1/crop/:id/stages', '/api/external/crop/:id/stages'], (req, res) => {
  const rawId = req.params['id'];
  const targetId = EXTERNAL_CYCLE_ID_MAP[rawId] || rawId;
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/${encodeURIComponent(targetId)}/stages${qs}`);
});

app.get(['/api/v1/growth-program/stages/:id', '/api/external/growth-program/stages/:id'], (req, res) => {
  const rawId = req.params['id'];
  const targetId = EXTERNAL_CYCLE_ID_MAP[rawId] || rawId;
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/growth-program/stages/${encodeURIComponent(targetId)}${qs}`);
});

app.get(['/api/v1/growth-program/:id/stages', '/api/external/growth-program/:id/stages'], (req, res) => {
  const rawId = req.params['id'];
  const targetId = EXTERNAL_CYCLE_ID_MAP[rawId] || rawId;
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/growth-program/${encodeURIComponent(targetId)}/stages${qs}`);
});

app.get('/api/external/crop/planting-cycle/:id', (req, res) => {
  const rawId = req.params.id;
  const targetId = EXTERNAL_CYCLE_ID_MAP[rawId] || rawId;
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/planting-cycle/${encodeURIComponent(targetId)}`);
});

app.post('/api/external/crop/planting-cycle/update-actuals/:id', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/planting-cycle/update-actuals/${req.params.id}`, { method: 'POST' });
});

app.post('/api/external/crop/planting-cycle/create', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/planting-cycle/create`, { method: 'POST' });
});

app.get('/api/external/growth-program/:id', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/growth-program/${req.params.id}`);
});

app.get('/api/external/accounting/dashboard/summary', (req, res) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/accounting/dashboard/summary${qs}`);
});

app.get('/api/external/accounting/dashboard/recent-transactions', (req, res) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/accounting/dashboard/recent-transactions${qs}`);
});

app.post('/api/external/accounting/dashboard/transactions', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/accounting/dashboard/transactions`, { method: 'POST' });
});

app.get('/api/external/crop/growth-program/species/:speciesId/breed/:breedId', (req, res) => {
  const { speciesId, breedId } = req.params;
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/growth-program/species/${speciesId}/breed/${breedId}`);
});

app.get('/api/external/breeds/species/:id', (req, res) => {
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/breeds/species/${req.params.id}`);
});

// Mobile Sensors: GET /api/v1/mobile/sensors/:speciesId/supported-sensors
app.get('/api/v1/mobile/sensors/:speciesId/supported-sensors', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  const speciesId = req.params.speciesId;
  const targetExternalId = EXTERNAL_SPECIES_IDS[speciesId.toLowerCase()] || speciesId;

  // 1. Try external Spring Boot service
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const fetchRes = await fetch(`${EXTERNAL_BASE}/api/v1/mobile/sensors/${targetExternalId}/supported-sensors`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (fetchRes.ok) {
      const data = await fetchRes.json();
      const list = Array.isArray(data) ? data : (data?.content || []);
      if (list && list.length > 0) {
        return res.json(list);
      }
    }
  } catch (err: any) {
    console.warn(`External supported-sensors call failed for ${targetExternalId}:`, err?.message || err);
  }

  return res.json([]);
});


// Proxy Planting Schedule Endpoints to External Server
app.get('/api/external/crop/planting-schedule/*', async (req, res) => {
  const path = (req.params as any)[0];
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/crop/planting-schedule/${path}${qs}`);
});

app.get('/api/external/species/all', async (req, res) => {
  const queryString = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return proxyExternal(req, res, `${EXTERNAL_BASE}/api/v1/species/all${queryString}`);
});

app.get('/api/gmp-key', (req, res) => {
  return res.json({ key: process.env['GOOGLE_MAPS_PLATFORM_KEY'] || '' });
});

app.post('/api/ai/sensor-analysis', async (req, res) => {
  try {
    const { crop, growthStage, sensorData } = req.body;
    
    if (!process.env['GEMINI_API_KEY']) {
      res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      return;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });
    const prompt = `As an agricultural AI assistant, briefly analyze this live sensor data for ${crop} during its ${growthStage} stage.
Sensor Data: ${JSON.stringify(sensorData)}
Compare this to the expected conditions for this crop and stage. Keep the response concise, under 3 sentences. Focus on actionable insights.`;
    
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

// Handle unknown API routes with 404
app.use('/api', (req, res) => {
  return res.status(404).json({ error: 'Not Found' });
});

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'dist')));

// All other routes should serve the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});




process.on('uncaughtException', (err: any) => {
  console.error('Server uncaughtException:', err?.message || err);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('Server unhandledRejection:', reason?.message || reason);
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`Port ${port} is already in use by an active backend instance.`);
    // Keep process alive so concurrently doesn't kill other processes
    setInterval(() => {}, 60000);
  } else {
    console.error('Server error:', err);
  }
});
