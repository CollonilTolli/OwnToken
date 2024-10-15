import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const userId = Number(params.get('userId'))
  const publicKey = params.get('publicKey')

  if (!publicKey) {
    return NextResponse.json({ message: "Missing public_key" }, { status: 400 });
  }

  if (publicKey === process.env.NEXT_PUBLIC_PUBLIC_KEY) {
    try {
      const isSubscriber = await checkSubscriber(userId);
      if (isSubscriber) {
        await removeUserFromChannel(process.env.SECRET_CHANNEL_ID ?? '', userId);
        return NextResponse.json({ message: "User is kicked" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "User is not Subscribe" }, { status: 200 });
      }
    } catch (error) {
      console.error('Error Check Subscribe:', error);
      return NextResponse.json({ message: "Error Check Subscribe" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

const bot = new TelegramBot(process.env.ADMIN_BOT_TOKEN ? process.env.ADMIN_BOT_TOKEN : "", { polling: false });

const checkSubscriber = async (userId: number) => {
  try {
    const chatMember = await bot.getChatMember(process.env.SECRET_CHANNEL_ID ?? '', userId);
    return chatMember.status === 'member' || chatMember.status === 'administrator';
  } catch (error) {
    console.error('Error checking subscriber:', error);
    return false;
  }
};

async function removeUserFromChannel(chatId: string, userId: number) {
  try {
    await bot.banChatMember(chatId, userId)
    await bot.unbanChatMember(chatId, userId)
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
  }
}
