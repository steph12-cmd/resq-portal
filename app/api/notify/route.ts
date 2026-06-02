import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { tokens, title, body, data } = await request.json();

    const messages = tokens.map((token: string) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: data || {},
      priority: 'high',
      channelId: 'emergency',
      ttl: 300,
      badge: 1,
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('Notification result:', result);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log('Notification error:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}