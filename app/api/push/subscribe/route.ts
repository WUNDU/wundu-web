import { removeSubscription, saveSubscription, touchActivity } from "@/services/web-push.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, subscription } = await req.json();
    if (!userId || !subscription) {
      return NextResponse.json({ error: "Missing userId or subscription" }, { status: 400 });
    }
    saveSubscription(userId, subscription);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    removeSubscription(userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (userId) touchActivity(userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
