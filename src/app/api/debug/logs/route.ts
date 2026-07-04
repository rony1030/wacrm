import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const errorLog = await request.json();
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...errorLog
    };

    // 1. Save to local log file in workspace
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFilePath = path.join(logDir, 'error_report.jsonl');
    fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n', 'utf8');

    // 2. Forward to local AI orchestrator ("Cerebro") if URL is configured
    const cerebroUrl = process.env.CEREBRO_WEBHOOK_URL;
    if (cerebroUrl) {
      try {
        await fetch(cerebroUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logEntry),
          signal: AbortSignal.timeout(3000) // Don't block requests if local server is down
        });
      } catch (err) {
        console.error('Failed to forward error to Cerebro:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Log registered' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
