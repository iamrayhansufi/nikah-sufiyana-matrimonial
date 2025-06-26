import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { z } from "zod";

const deletePhotoSchema = z.object({
  photoUrl: z.string(),
});

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userKey = `user:${session.user.id}`;
    const user = await redis.hgetall(userKey);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const body = await request.json();
    const result = deletePhotoSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    const { photoUrl } = result.data;
    let profilePhotos: string[] = [];
    if (user.profilePhotos) {
      if (typeof user.profilePhotos === 'string') {
        try {
          profilePhotos = JSON.parse(user.profilePhotos);
        } catch {
          profilePhotos = [];
        }
      } else if (Array.isArray(user.profilePhotos)) {
        profilePhotos = user.profilePhotos;
      }
    }
    if (!profilePhotos.includes(photoUrl)) {
      return NextResponse.json({ error: "Photo not found in gallery" }, { status: 404 });
    }
    const updatedPhotos = profilePhotos.filter(p => p !== photoUrl);
    const updateData: { [key: string]: string } = {
      profilePhotos: JSON.stringify(updatedPhotos)
    };
    if (user.profilePhoto === photoUrl) {
      updateData.profilePhoto = updatedPhotos.length > 0 ? updatedPhotos[0] : "";
    }
    await redis.hset(userKey, updateData);
    return NextResponse.json({
      success: true,
      updatedPhotos
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
