import fs from 'fs';
import path from 'path';
import OpenAI from "openai";

export const maxDuration = 60;

// Función para lectura manual y tolerante de archivos .env que extrae ambas claves
function getManualEnvKeys(): { deepseek: string | null; openrouter: string | null; logs: any } {
  const logs: any = {
    envSysCheck: !!process.env.DEEPSEEK_API_KEY,
    filesChecked: [],
    keysFound: { deepseek: false, openrouter: false },
    source: null
  };

  let dsKey = process.env.DEEPSEEK_API_KEY || null;
  let orKey = process.env.OPENROUTER_API_KEY || null;

  if (dsKey) logs.keysFound.deepseek = true;
  if (orKey) logs.keysFound.openrouter = true;

  if (dsKey && orKey) {
    logs.source = 'process.env';
    return { deepseek: dsKey, openrouter: orKey, logs };
  }

  const pathsToCheck = ['.env.local', '.env.local.txt'];

  for (const fileName of pathsToCheck) {
    const envPath = path.resolve(process.cwd(), fileName);
    const fileLog: any = { path: envPath, exists: false };

    try {
      if (fs.existsSync(envPath)) {
        fileLog.exists = true;
        const content = fs.readFileSync(envPath, 'utf8');
        
        // Sanitizar contenido para logs
        fileLog.contentPreview = content.substring(0, 100).replace(/sk-[a-zA-Z0-9]+/g, 'sk-XXXXX...');

        const lines = content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;

          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          
          if (key.trim() === 'DEEPSEEK_API_KEY' && value) {
            dsKey = value;
            logs.keysFound.deepseek = true;
          }
          if (key.trim() === 'OPENROUTER_API_KEY' && value) {
            orKey = value;
            logs.keysFound.openrouter = true;
          }
        }
        
        if (dsKey || orKey) {
           logs.source = fileName;
           fileLog.keysFoundInThisFile = true;
        } else {
           fileLog.keysFoundInThisFile = false;
        }
      }
    } catch (err: any) {
      fileLog.error = err.message;
    }
    
    logs.filesChecked.push(fileLog);
  }

  return { deepseek: dsKey, openrouter: orKey, logs };
}

async function fetchWithRetry(apiCall: () => Promise<any>, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error: any) {
      // Solo hacer backoff en caso de Rate Limit (429)
      if (error.status === 429 && i < retries - 1) {
        console.warn(`[DeepSeek] Límite de velocidad (429). Reintentando en ${delay}ms... (Intento ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; 
      } else {
        throw error;
      }
    }
  }
}

export async function POST(req: Request) {
  try {
    const { logs, deepseek: dsKey, openrouter: orKey } = getManualEnvKeys();

    console.log("=== EXTRACCIÓN DE LLAVES DE ENTORNO ===");
    console.log(JSON.stringify(logs, null, 2));
    console.log("=======================================");

    if (!dsKey) {
      return Response.json({ 
        error: "No se encontró DEEPSEEK_API_KEY. Asegúrate de tener un archivo .env.local o .env.local.txt en la raíz con el formato DEEPSEEK_API_KEY=sk-...",
        details: logs
      }, { status: 500 });
    }

    const openaiDeepSeek = new OpenAI({
      apiKey: dsKey,
      baseURL: "https://api.deepseek.com/v1",
    });

    const { D, I, S, C } = await req.json();

    const prompt = `
Eres un psicólogo organizacional experto en DISC. 
Con base en los siguientes valores: D=${D}, I=${I}, S=${S}, C=${C}, 
genera un análisis profesional en español de entre 300 y 400 palabras. 
Debes detallar el perfil dominante, sus fortalezas clave, áreas de mejora y recomendaciones de roles laborales ideales.
No uses markdown, responde solo con el texto plano del análisis.
`;

    try {
      // 1. Intento principal con DeepSeek
      const completion = await fetchWithRetry(() => 
        openaiDeepSeek.chat.completions.create({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "Eres un analista experto en recursos humanos y psicometría DISC." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      );

      const text = completion.choices[0].message.content || "";
      return Response.json({ success: true, analysis: text.trim() });

    } catch (error: any) {
      // 2. Manejo específico del error 402 Insufficient Balance
      if (error.status === 402) {
        console.error("[DeepSeek 402 Error]: Saldo insuficiente en la cuenta DeepSeek.");
        
        // 3. Fallback a OpenRouter si existe una llave de respaldo
        if (orKey) {
          console.log("[Fallback Info]: Iniciando intento de rescate con OpenRouter usando el modelo gratuito...");
          try {
            const openaiOpenRouter = new OpenAI({
              apiKey: orKey,
              baseURL: "https://openrouter.ai/api/v1",
              defaultHeaders: {
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Hackes Jobs",
              },
            });
            const fallbackCompletion = await openaiOpenRouter.chat.completions.create({
              model: "google/gemini-2.0-flash-lite-preview-02-05", 
              messages: [
                { role: "system", content: "Eres un analista experto en recursos humanos y psicometría DISC." },
                { role: "user", content: prompt }
              ],
              temperature: 0.7
            });
            const fallbackText = fallbackCompletion.choices[0].message.content || "";
            return Response.json({ success: true, analysis: fallbackText.trim(), fallback_used: true });
          } catch (fallbackError: any) {
            console.error("[Fallback Error]: OpenRouter también falló.", fallbackError?.message);
            // Si el fallback falla, seguimos lanzando el 402 original para avisar del saldo
          }
        }

        // Si no hay llave de OpenRouter o falló, devolvemos el error amigable de saldo
        return Response.json({ 
          error: "La clave de DeepSeek no tiene saldo suficiente. Por favor, recarga crédito en https://platform.deepseek.com/billing o usa una nueva clave con saldo.",
          status: 402 
        }, { status: 402 });
      }

      // Si es otro tipo de error de DeepSeek (ej. 401, 500)
      console.error("[DeepSeek Critical Error]:", error?.message || error);
      return Response.json({ 
        error: "Fallo en el servicio de análisis de IA de DeepSeek." 
      }, { status: error?.status || 500 });
    }

  } catch (criticalError: any) {
    console.error("[Endpoint Critical Error]:", criticalError?.message);
    return Response.json({ error: "Fallo fatal en el servidor." }, { status: 500 });
  }
}

// Endpoint de diagnóstico
export async function GET(req: Request) {
  const { logs, deepseek, openrouter } = getManualEnvKeys();
  
  return Response.json({
    status: 'ok',
    isNextJsEnvLoaded: !!process.env.DEEPSEEK_API_KEY,
    isDeepSeekKeyLoaded: !!deepseek,
    isOpenRouterKeyLoaded: !!openrouter,
    logs: logs
  });
}
