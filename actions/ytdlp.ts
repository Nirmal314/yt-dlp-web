"use server";

import path from "path";
import os from "os";
import fs from "fs";
import ytdlp from "ytdlp-nodejs";
import {
  AudioFormat,
  DownloadOptionsUnion,
  Filter,
  MergeFormat,
  VideoFormat,
} from "@/types";
import { ProgressType } from "ytdlp-nodejs/lib/types/utils/types";

export async function singleDownload(
  url: string,
  options: DownloadOptionsUnion,
  onProgress: (data: ProgressType) => void
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const downloadsDir = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const extendedOptions = {
      ...options,
      output: downloadsDir,
    };

    ytdlp
      .download(url, extendedOptions)
      .on("progress", (data) => {
        onProgress(data);
      })
      .on("error", (err) => {
        console.log("err", err);
        reject(err);
      })
      .on("finished", () => {
        console.log("Finished");

        const downloadedFiles = fs.readdirSync(downloadsDir);

        const downloadedFile = downloadedFiles.find((file) => {
          const splitedFile = file.split(".");
          const fileExtension = splitedFile[splitedFile.length - 1]
            .trim()
            .toUpperCase();

          switch (options.filter) {
            case Filter.VideoOnly:
              return fileExtension in VideoFormat;
            case Filter.AudioOnly:
              return fileExtension in AudioFormat;
            case Filter.AudioAndVideo:
              return fileExtension in VideoFormat;
            case Filter.MergeVideo:
              return fileExtension in MergeFormat;
          }
        });

        if (!downloadedFile) {
          return reject(new Error("File not found after download"));
        }

        resolve(downloadedFile);
      });
  });
}
