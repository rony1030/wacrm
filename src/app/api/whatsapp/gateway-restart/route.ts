import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deployHookUrl = process.env.RENDER_DEPLOY_HOOK_URL;
    if (!deployHookUrl) {
      return NextResponse.json(
        { error: 'Deploy Hook URL is not configured on the server. Please add RENDER_DEPLOY_HOOK_URL in .env.local' },
        { status: 400 }
      );
    }

    // Make a POST request to Render's Deploy Hook URL
    const response = await fetch(deployHookUrl, {
      method: 'POST',
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Render responded with status ${response.status}: ${errText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: 'Restart triggered successfully.' });
  } catch (error) {
    console.error('Error triggering Render restart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
