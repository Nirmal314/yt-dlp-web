export type Filter = "videoonly" | "audioonly" | "audioandvideo" | "mergevideo";
export type VideoFormat = "mp4" | "webm";
export type AudioFormat =
  | "aac"
  | "flac"
  | "mp3"
  | "m4a"
  | "opus"
  | "vorbis"
  | "wav"
  | "alac";
export type AVFormat = VideoFormat;
export type MergeFormat = "mkv" | "mp4" | "ogg" | "webm" | "flv";
export type VideoResolution =
  | "144p"
  | "240p"
  | "360p"
  | "480p"
  | "720p"
  | "1080p"
  | "1440p"
  | "2160p"
  | "highest"
  | "lowest";
export type AudioQuality = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type AVQuality = "highest" | "lowest";

type FormatType<F extends Filter> = F extends "videoonly"
  ? VideoFormat
  : F extends "audioonly"
  ? AudioFormat
  : F extends "audioandvideo"
  ? AVFormat
  : F extends "mergevideo"
  ? MergeFormat
  : never;

type QualityType<F extends Filter> = F extends "videoonly"
  ? VideoResolution
  : F extends "audioonly"
  ? AudioQuality
  : F extends "audioandvideo"
  ? AVQuality
  : F extends "mergevideo"
  ? VideoResolution
  : never;

type DownloadOptions<F extends Filter> = {
  filter: F;
  format: FormatType<F>;
  quality: QualityType<F>;
  embedThumbnail: boolean;
  embedSubs: boolean;
};

export type DownloadOptionsUnion =
  | DownloadOptions<"videoonly">
  | DownloadOptions<"audioonly">
  | DownloadOptions<"audioandvideo">
  | DownloadOptions<"mergevideo">;
