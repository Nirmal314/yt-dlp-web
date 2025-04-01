"use server";

import { v4 as uuidv4 } from "uuid";
import ytdlp, { check } from "@/lib/ytdlp";
import { DownloadOptionsUnion } from "@/types";
import { VideoProgress, YtDlp } from "ytdlp-nodejs";
import { fileCache } from "@/lib/file-cache";

export async function singleDownload(
  url: string,
  options: DownloadOptionsUnion,
  onProgress: (data: any) => void
) {
  const { filter, format, quality, embedThumbnail, embedSubs } = options;

  // get the file object
  const file = await ytdlp.getFileAsync(url, {
    onProgress: (progress: VideoProgress) => {
      console.log(`${progress.downloaded_str} / ${progress.total_str} %`);
      onProgress(progress);
    },
    format: {
      filter,
      type: format,
      quality,
    },
    embedThumbnail,
    embedSubs,
  });

  // set file cache
  const id = uuidv4();
  fileCache.set(id, file);

  return id;
}
