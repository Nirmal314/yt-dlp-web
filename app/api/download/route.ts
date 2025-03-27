// app/api/download-progress/route.ts
import { NextResponse } from "next/server";
import { singleDownload } from "@/actions/ytdlp";

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
          await singleDownload(url, options, (data: any) => {
            // Write SSE event with progress data
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          });
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ status: "finished" })}\n\n`
            )
          );
        } catch (err: any) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                status: "error",
                error: err.message,
              })}\n\n`
            )
          );
        }
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/event-stream" } }
  );
}
