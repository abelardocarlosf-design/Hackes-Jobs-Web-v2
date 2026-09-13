import OpenAI from "openai";

export const maxDuration = 60;

// Las llaves salen solo de las variables de entorno.
//
// Antes esta ruta leía `.env.local` y `.env.local.txt` del disco con un parser
// propio y devolvía en la respuesta los primeros 100 caracteres del archivo.
// Eso era la misma clase de fuga que `/api/test-env` (hallazgo H-02 de la
// auditoría, ya eliminado): un endpoint sin sesión que publica el contenido del
// entorno. Además nunca funcionó en Vercel, donde el bundle no lleva archivos
// `.env` y el disco es de solo lectura salvo `/tmp`.
function getEnvKeys(): { deepseek: string | null; openrouter: string | null } {
  return {
    deepseek: process.env.DEEPSEEK_API_KEY || null,
    openrouter: process.env.OPENROUTER_API_KEY || null,
  };
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
    const { deepseek: dsKey, openrouter: orKey } = getEnvKeys();

    if (!dsKey) {
      console.error("[DISC] Falta DEEPSEEK_API_KEY en las variables de entorno.");
      return Response.json({
        error: "El análisis con IA no está configurado en este entorno.",
      }, { status: 503 });
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
                // OpenRouter atribuye el consumo a este dominio. Fijarlo a
                // localhost hacía que en producción todo el gasto se
                // reportara como tráfico de desarrollo.
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://www.hackesjobs.com.mx",
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
