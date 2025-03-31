import { NextResponse } from "next/server";
import { singleDownload } from "@/actions/ytdlp";
import { VideoProgress } from "ytdlp-nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const optionsStr = searchParams.get("options");

  if (!url || !optionsStr) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  const options = JSON.parse(optionsStr);

  return new NextResponse(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          const fileId = await singleDownload(
            url,
            options,
            (data: VideoProgress) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
              );
            }
          );

          // finally enqueue fileId
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ status: "finished", fileId })}\n\n`
            )
          );
        } catch (err: any) {
          console.log("Error at /api/download", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                status: "error",
                error: err.message,
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    }),
    { headers: { "Content-Type": "text/event-stream" } }
  );
}
