import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';
import { existsSync } from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const modelPort = Number(process.env.LOCAL_MODEL_PORT) || 8765;
const modelUrl = `http://127.0.0.1:${modelPort}`;
const modelName = 'HAM10000 research checkpoint';
let modelProcess: ChildProcess | undefined;

app.use(express.json({ limit: '30mb' }));

function startLocalModelService(): void {
  const venvPython = path.join(
    __dirname,
    '.venv-localmodel',
    process.platform === 'win32' ? 'Scripts' : 'bin',
    process.platform === 'win32' ? 'python.exe' : 'python',
  );
  const usesVenv = !process.env.LOCAL_MODEL_PYTHON && existsSync(venvPython);
  const python = process.env.LOCAL_MODEL_PYTHON ||
    (usesVenv ? venvPython : process.platform === 'win32' ? 'py' : 'python3');
  const args = usesVenv || process.env.LOCAL_MODEL_PYTHON
    ? [path.join(__dirname, 'model_service.py')]
    : process.platform === 'win32'
      ? ['-3.13', path.join(__dirname, 'model_service.py')]
      : [path.join(__dirname, 'model_service.py')];

  modelProcess = spawn(python, args, {
    env: { ...process.env, LOCAL_MODEL_PORT: String(modelPort) },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  modelProcess.stdout?.on('data', (chunk: Buffer) => {
    process.stdout.write(`[local-model] ${chunk.toString()}`);
  });
  modelProcess.stderr?.on('data', (chunk: Buffer) => {
    process.stderr.write(`[local-model] ${chunk.toString()}`);
  });
  modelProcess.on('error', (error) => {
    console.error(`Could not start the local model service with "${python}":`, error.message);
  });
  modelProcess.on('exit', (code, signal) => {
    if (code !== 0 && code !== null) {
      console.error(`Local model service exited with code ${code}${signal ? ` (${signal})` : ''}.`);
    }
  });
}

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const modelResponse = await fetch(`${modelUrl}/health`, { signal: AbortSignal.timeout(1500) });
    const modelHealth = await modelResponse.json() as { ready?: boolean; status?: string; error?: string };
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      model: modelName,
      localModelReady: modelHealth.ready === true,
      localModelStatus: modelHealth.status || 'unavailable',
      ...(modelHealth.error ? { localModelError: modelHealth.error } : {}),
    });
  } catch {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      model: modelName,
      localModelReady: false,
      localModelStatus: modelProcess ? 'starting' : 'not-started',
      setupInstructions: 'Install requirements-local.txt, then restart the app.',
    });
  }
});

app.post('/api/analyze-lesion', async (req: Request, res: Response): Promise<void> => {
  const { image, mimeType = 'image/jpeg' } = req.body ?? {};
  if (typeof image !== 'string' || image.length === 0) {
    res.status(400).json({ error: 'Image data is required for skin analysis.' });
    return;
  }

  let base64Data = image;
  let detectedMimeType = mimeType;
  if (image.startsWith('data:')) {
    const matches = image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!matches) {
      res.status(400).json({ error: 'Please upload a JPEG, PNG, or WebP image.' });
      return;
    }
    detectedMimeType = matches[1];
    base64Data = matches[2];
  } else if (!['image/jpeg', 'image/png', 'image/webp'].includes(detectedMimeType)) {
    res.status(400).json({ error: 'Please upload a JPEG, PNG, or WebP image.' });
    return;
  }

  if (base64Data.length > 16 * 1024 * 1024) {
    res.status(413).json({ error: 'Image is too large. Please upload an image under 12 MB.' });
    return;
  }

  try {
    const modelResponse = await fetch(`${modelUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data, mimeType: detectedMimeType }),
      signal: AbortSignal.timeout(120_000),
    });
    const result = await modelResponse.json();
    res.status(modelResponse.status).json(result);
  } catch (error) {
    console.error('Local skin model request failed:', error);
    res.status(503).json({
      error: 'The local HAM10000 model is still loading or unavailable. Check the server output and try again.',
    });
  }
});

async function startServer(): Promise<void> {
  startLocalModelService();

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
