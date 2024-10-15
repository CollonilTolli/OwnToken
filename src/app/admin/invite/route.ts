import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.ADMIN_BOT_TOKEN ? process.env.ADMIN_BOT_TOKEN : "", { polling: false });

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
  }

  const params = req.nextUrl.searchParams;
  const secretKey = params.get('secretKey');
  if (secretKey !== process.env.SECRET_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const chatId = process.env.SECRET_CHANNEL_ID;

  if (!chatId) {
    return NextResponse.json({ message: "Invalid chat ID" }, { status: 400 });
  }

  try {
    const inviteLink = await bot.createChatInviteLink(chatId);
    return NextResponse.json({ inviteLink: inviteLink.invite_link }, { status: 200 });
  } catch (error) {
    console.error('Error creating invite link:', error);
    return NextResponse.json({ message: "Error creating invite link" }, { status: 500 });
  }
}
