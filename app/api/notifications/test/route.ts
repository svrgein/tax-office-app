import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, message } = await request.json();

    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #3b82f6;">Tax Office Notification</h2>
        <p>Hello ${user.user_metadata?.full_name || 'User'},</p>
        <p>You have a new notification:</p>
        <div style="padding: 12px; background-color: #f3f4f6; border-radius: 8px; margin: 16px 0;">
          <strong>${type}:</strong> ${message}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This is an automated message from your Tax Office management system.</p>
      </div>
    `;

    const emailResult = await sendEmail({
      to: user.email!,
      subject: `New Notification: ${type}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, emailResult });
  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
