import dotenv from 'dotenv';
import path from 'path';

// Force load to verify
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export async function GET() {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const isLoaded = !!deepseekKey;
  
  return Response.json({
    status: 'ok',
    isLoaded: isLoaded,
    maskedKey: deepseekKey ? `${deepseekKey.substring(0, 4)}...${deepseekKey.substring(deepseekKey.length - 4)}` : null,
    cwd: process.cwd(),
    envVarsFound: Object.keys(process.env).filter(k => k.includes('DEEPSEEK'))
  });
}
