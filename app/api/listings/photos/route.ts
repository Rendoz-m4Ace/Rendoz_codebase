import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabase } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import { LISTING_PHOTO_BUCKET } from "@/lib/listings";

const MAX_BYTES = 5 * 1024 * 1024;

/** Detects the image type from the file's first bytes rather than trusting the browser. */
function sniffImage(bytes: Uint8Array): { ext: string; mime: string } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { ext: "png", mime: "image/png" };
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") return { ext: "webp", mime: "image/webp" };
  return null;
}

async function upload(path: string, body: Uint8Array, contentType: string) {
  return getSupabase().storage.from(LISTING_PHOTO_BUCKET).upload(path, body, { contentType, upsert: false });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });
    if (!session.user.role.includes("owner")) {
      return NextResponse.json({ error: "Only owners can upload listing photos." }, { status: 403 });
    }

    let file: FormDataEntryValue | null = null;
    try {
      file = (await req.formData()).get("photo");
    } catch {
      return NextResponse.json({ error: "Send the photo as multipart form data." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No photo was attached." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Photos must be 5 MB or smaller." }, { status: 413 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const image = sniffImage(bytes);
    if (!image) {
      return NextResponse.json({ error: "Please upload a JPG, PNG or WebP image." }, { status: 415 });
    }

    // Each owner's photos live in their own folder; the create-listing route checks this prefix
    const path = `${session.user.id}/${randomUUID()}.${image.ext}`;
    let { error } = await upload(path, bytes, image.mime);

    if (error && /bucket not found/i.test(error.message)) {
      // First upload on a fresh project: create the public bucket, then retry once
      const { error: createError } = await getSupabase().storage.createBucket(LISTING_PHOTO_BUCKET, {
        public: true,
        fileSizeLimit: MAX_BYTES,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      });
      if (createError && !/already exists/i.test(createError.message)) {
        console.error("[listings/photos] Bucket create error:", createError);
        return NextResponse.json({ error: "Photo storage isn't available. Please try again." }, { status: 500 });
      }
      ({ error } = await upload(path, bytes, image.mime));
    }

    if (error) {
      console.error("[listings/photos] Upload error:", error);
      return NextResponse.json({ error: "Couldn't save the photo. Please try again." }, { status: 500 });
    }

    const { data } = getSupabase().storage.from(LISTING_PHOTO_BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl }, { status: 201 });
  } catch (err) {
    console.error("[listings/photos] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
