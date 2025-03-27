"use server";

import { DownloadOptionsUnion } from "@/types";
import ytdlp from "ytdlp-nodejs";
import { DownloadOptions } from "ytdlp-nodejs/lib/types/utils/types";

export async function singleDownload(
  url: string,
  options: DownloadOptionsUnion,
  onProgress: (data: any) => void
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ytdlp
      .download(url, options as DownloadOptions<typeof options.filter>)
      .on("progress", (data) => {
        console.log(data);
        onProgress(data);
      })
      .on("error", (err) => {
        console.log("err", err);
        reject(err);
      })
      .on("finished", () => {
        console.log("Finished");
        resolve();
      });
  });
}
