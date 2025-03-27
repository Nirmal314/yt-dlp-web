'use client'

import React, { useState, useEffect } from 'react';
import { Download, PlaySquare, Video, Youtube } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AudioFormat,
  AVQuality,
  DownloadOptionsUnion,
  Filter,
  MergeFormat,
  VideoFormat,
  VideoResolution,
  AudioQuality as AudioQualityEnum
} from '@/types';

export default function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<DownloadOptionsUnion>({
    filter: Filter.VideoOnly,
    format: VideoFormat.MP4,
    embedSubs: false,
    embedThumbnail: false,
    quality: VideoResolution.R480P,
  });

  const videoResolutions: VideoResolution[] = [
    VideoResolution.R2160P,
    VideoResolution.R1440P,
    VideoResolution.R1080P,
    VideoResolution.R720P,
    VideoResolution.R480P,
    VideoResolution.R360P,
    VideoResolution.R240P,
    VideoResolution.R144P,
    VideoResolution.Highest,
    VideoResolution.Lowest,
  ];
  const basicVideoFormats: VideoFormat[] = [VideoFormat.MP4, VideoFormat.WEBM];
  const mergeFormats: MergeFormat[] = [MergeFormat.MKV, MergeFormat.MP4, MergeFormat.OGG, MergeFormat.WEBM, MergeFormat.FLV];
  const audioFormats: AudioFormat[] = [
    AudioFormat.AAC,
    AudioFormat.FLAC,
    AudioFormat.MP3,
    AudioFormat.M4A,
    AudioFormat.OPUS,
    AudioFormat.VORBIS,
    AudioFormat.WAV,
    AudioFormat.ALAC,
  ];
  const avQualityOptions: AVQuality[] = [AVQuality.Highest, AVQuality.Lowest];

  useEffect(() => {
    if (options.filter === Filter.AudioOnly) {
      setOptions({
        filter: Filter.AudioOnly,
        format: AudioFormat.MP3,
        embedSubs: options.embedSubs,
        embedThumbnail: options.embedThumbnail,
        quality: AudioQualityEnum.Q5,
      });
    } else if (options.filter === Filter.AudioAndVideo) {
      setOptions({
        filter: Filter.AudioAndVideo,
        format: VideoFormat.MP4,
        embedSubs: options.embedSubs,
        embedThumbnail: options.embedThumbnail,
        quality: AVQuality.Highest,
      });
    } else if (options.filter === Filter.MergeVideo) {
      setOptions({
        filter: Filter.MergeVideo,
        format: MergeFormat.MP4,
        embedSubs: options.embedSubs,
        embedThumbnail: options.embedThumbnail,
        quality: VideoResolution.R1080P,
      });
    } else {
      setOptions({
        filter: Filter.VideoOnly,
        format: VideoFormat.MP4,
        embedSubs: options.embedSubs,
        embedThumbnail: options.embedThumbnail,
        quality: VideoResolution.R1080P,
      });
    }
  }, [options.filter]);

  const validateUrl = (url: string) => {
    if (!url) return false;
    if (url.startsWith('http')) {
      url = url.split('://')[1];
    }
    const regex = /^(www\.)?(youtube\.com|youtu\.be|music\.youtube\.com)\/.+$/;
    return regex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      toast.error('Invalid URL. Please enter a valid YouTube or YouTube Music URL.');
      return;
    }
    setIsLoading(true);

    console.log({ url, options })
    setTimeout(() => setIsLoading(false), 2000);
  };

  const renderFormatOptions = () => {
    if (options.filter === Filter.VideoOnly || options.filter === Filter.AudioAndVideo) {
      return basicVideoFormats.map((fmt) => (
        <SelectItem key={fmt} value={fmt}>
          {fmt.toUpperCase()}
        </SelectItem>
      ));
    }
    if (options.filter === Filter.AudioOnly) {
      return audioFormats.map((fmt) => (
        <SelectItem key={fmt} value={fmt}>
          {fmt.toUpperCase()}
        </SelectItem>
      ));
    }
    if (options.filter === Filter.MergeVideo) {
      return mergeFormats.map((fmt) => (
        <SelectItem key={fmt} value={fmt}>
          {fmt.toUpperCase()}
        </SelectItem>
      ));
    }
  };

  const renderQualitySelector = () => {
    if (options.filter === Filter.AudioOnly) {
      return (
        <div className="space-y-4">
          <Label className="text-sm font-medium">Audio Quality (1-10)</Label>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[typeof options.quality === 'number' ? options.quality : AudioQualityEnum.Q5]}
            onValueChange={([val]) => setOptions({ ...options, quality: val } as DownloadOptionsUnion)}
            className="py-6"
          />
          <div className="text-center text-sm text-muted-foreground">
            Quality: {options.quality}
          </div>
        </div>
      );
    }
    if (options.filter === Filter.AudioAndVideo) {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quality</Label>
          <Select
            value={String(options.quality)}
            onValueChange={(value) => setOptions({ ...options, quality: value } as DownloadOptionsUnion)}
          >
            <SelectTrigger className="bg-accent/5 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {avQualityOptions.map((q) => (
                <SelectItem key={q} value={q}>
                  {q.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    if (options.filter === Filter.VideoOnly || options.filter === Filter.MergeVideo) {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Video Quality</Label>
          <Select
            value={String(options.quality)}
            onValueChange={(value) => setOptions({ ...options, quality: value } as DownloadOptionsUnion)}
          >
            <SelectTrigger className="bg-accent/5 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {videoResolutions.map((res) => (
                <SelectItem key={res} value={res}>
                  {res}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent/20 text-foreground">
      <Card className="w-full max-w-5xl border-none shadow-2xl hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-xl">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Youtube className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            YouTube Media Downloader
          </CardTitle>
          <CardDescription className="text-lg">
            Download Videos, Music & Playlists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube or YouTube Music URL"
                className="w-full px-4 py-6 rounded-xl bg-accent/5 transition-colors"
              />
            </div>
            <Card className="border border-accent/20 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl">Download Options</CardTitle>
                <CardDescription>Customize your download preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Download Filter</Label>
                    <Select
                      value={options.filter}
                      onValueChange={(value) =>
                        setOptions({ ...options, filter: value as Filter } as DownloadOptionsUnion)
                      }
                    >
                      <SelectTrigger className="bg-accent/5 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Filter.VideoOnly}>Video Only</SelectItem>
                        <SelectItem value={Filter.AudioOnly}>Audio Only</SelectItem>
                        <SelectItem value={Filter.AudioAndVideo}>Audio and Video</SelectItem>
                        <SelectItem value={Filter.MergeVideo}>Merge Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Format</Label>
                    <Select
                      value={options.format}
                      onValueChange={(value) =>
                        setOptions({ ...options, format: value } as DownloadOptionsUnion)
                      }
                    >
                      <SelectTrigger className="bg-accent/5 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {renderFormatOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                  {renderQualitySelector()}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="embedThumbnail"
                        checked={options.embedThumbnail}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, embedThumbnail: checked === true } as DownloadOptionsUnion)
                        }
                      />
                      <Label htmlFor="embedThumbnail">Embed Thumbnail</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="embedSubs"
                        checked={options.embedSubs}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, embedSubs: checked === true } as DownloadOptionsUnion)
                        }
                      />
                      <Label htmlFor="embedSubs">Embed Subtitles</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col items-center gap-6 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "relative overflow-hidden",
                  "flex items-center justify-center gap-2",
                  "w-full max-w-md h-14 rounded-xl",
                  "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                  "text-white text-lg font-medium",
                  "shadow hover:shadow-md",
                  "transition-all duration-300 ease-out",
                  "group",
                  isLoading && "cursor-not-allowed opacity-50"
                )}
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2" size={20} />
                    Download
                  </>
                )}
              </Button>
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-colors">
                <a href="/playlist">
                  <PlaySquare className="mr-2" size={20} />
                  Download Playlist
                </a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
