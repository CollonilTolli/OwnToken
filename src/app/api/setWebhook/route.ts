// app/api/setWebhook/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const WEBHOOK_URL = 'https://own-token.vercel.app/api/webhook';

export async function GET() {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
      url: WEBHOOK_URL,
    });
    console.log('Webhook set response:', response.data);
    return NextResponse.json({ message: 'Webhook set successfully' });
  } catch (error: any) {
    console.error('Failed to set webhook:', error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Failed to set webhook' }, { status: 500 });
  }
}