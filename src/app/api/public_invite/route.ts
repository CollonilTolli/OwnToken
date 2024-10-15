import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  if (!params.get('public_key')) {
    return NextResponse.json({ message: "Missing public_key" }, { status: 400 });
  }

  if (params.get('public_key') === process.env.NEXT_PUBLIC_PUBLIC_KEY) {
    const inviteLink = await getInviteLink(req);
    if (inviteLink) {
      return NextResponse.json({ inviteLink }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Error fetching invite link" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

async function getInviteLink(req: NextRequest) {
  const secretKey = process.env.SECRET_KEY;
  const apiEndpoint = '/admin/invite';
  const baseURL = new URL(req.url).origin; // Obtain base URL

  try {
    const response = await fetch(`${baseURL}${apiEndpoint}?secretKey=${secretKey}`); // Construct full URL
    if (!response.ok) {
      throw Error(`Error fetching invite link: ${response.status}`);
    }
    const data = await response.json();
    return data.inviteLink;
  } catch (error) {
    console.error('Error fetching invite link:', error);
    return null;
  }
}
