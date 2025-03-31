import { fileCache } from "@/lib/file-cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("file");

  if (!id) {
    return new NextResponse("Missing file id", { status: 400 });
  }

  const file = fileCache.get(id);

  if (!file) {
    return new NextResponse("File not found or expired", { status: 404 });
  }

  fileCache.delete(id);

  const fileBuffer = await file.arrayBuffer();

  const headers = new Headers({
    "Content-Disposition": `attachment; filename="${file.name}"`,
    "Content-Type": file.type,
  });
  return new NextResponse(fileBuffer, { headers });
}
