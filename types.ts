export enum Filter {
  VideoOnly = "videoonly",
  AudioOnly = "audioonly",
  AudioAndVideo = "audioandvideo",
  MergeVideo = "mergevideo",
}

export enum VideoFormat {
  MP4 = "mp4",
  WEBM = "webm",
}

export enum AudioFormat {
  AAC = "aac",
  FLAC = "flac",
  MP3 = "mp3",
  M4A = "m4a",
  OPUS = "opus",
  VORBIS = "vorbis",
  WAV = "wav",
  ALAC = "alac",
}

export enum MergeFormat {
  MKV = "mkv",
  MP4 = "mp4",
  OGG = "ogg",
  WEBM = "webm",
  FLV = "flv",
}

export enum VideoResolution {
  R144P = "144p",
  R240P = "240p",
  R360P = "360p",
  R480P = "480p",
  R720P = "720p",
  R1080P = "1080p",
  R1440P = "1440p",
  R2160P = "2160p",
  Highest = "highest",
  Lowest = "lowest",
}

export enum AudioQuality {
  Q1 = 1,
  Q2 = 2,
  Q3 = 3,
  Q4 = 4,
  Q5 = 5,
  Q6 = 6,
  Q7 = 7,
  Q8 = 8,
  Q9 = 9,
  Q10 = 10,
}

export enum AVQuality {
  Highest = "highest",
  Lowest = "lowest",
}

type FormatType<F extends Filter> = F extends Filter.VideoOnly
  ? VideoFormat
  : F extends Filter.AudioOnly
  ? AudioFormat
  : F extends Filter.AudioAndVideo
  ? VideoFormat
  : F extends Filter.MergeVideo
  ? MergeFormat
  : never;

type QualityType<F extends Filter> = F extends Filter.VideoOnly
  ? VideoResolution
  : F extends Filter.AudioOnly
  ? AudioQuality
  : F extends Filter.AudioAndVideo
  ? AVQuality
  : F extends Filter.MergeVideo
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
  | DownloadOptions<Filter.VideoOnly>
  | DownloadOptions<Filter.AudioOnly>
  | DownloadOptions<Filter.AudioAndVideo>
  | DownloadOptions<Filter.MergeVideo>;
