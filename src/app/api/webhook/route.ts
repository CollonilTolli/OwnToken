import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  console.log(TELEGRAM_BOT_TOKEN)
  if (message && message.text === '/start') {
    const chatId = message.chat.id;
    const responseText = 'Приветствуем нового владельца WOT, для того чтобы попасть в наше сообщество Вам необходимо подтвердить наличие WOT token на вашем кошелке! Нажмите Connect Wallet и подтвердите транзакцию (она абсолютно бесплатная).';
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: 'connect wallet',
            url: 'https://t.me/own_test_stand_bot/WOT_test',
          },
        ],
      ],
    };

    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: responseText,
      reply_markup: JSON.stringify(keyboard),
    });
  }

  return NextResponse.json({ message: 'OK' });
}