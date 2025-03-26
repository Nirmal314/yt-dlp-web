'use client'

'use client'

import React, { useState } from 'react';
import { Download, PlaySquare, AlertCircle, Youtube } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type DownloadOptions = {
  filter: 'video' | 'audio' | 'both' | 'merge';
  videoQuality?: string;
  audioQuality?: string;
  format: string;
  embedSubtitles?: boolean;
  embedThumbnail?: boolean;
  audioSlider?: number;
  thumbnailQuality: string;
  thumbnailType: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<DownloadOptions>({
    filter: 'video',
    videoQuality: '1080p',
    format: 'mp4',
    thumbnailQuality: 'max',
    thumbnailType: 'jpg',
  });

  const videoResolutions = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p', 'highest', 'lowest'];
  const videoFormats = ['mp4', 'webm'];
  const mergeFormats = ['mkv', 'mp4', 'ogg', 'webm', 'flv'];
  const audioFormats = ['aac', 'flac', 'mp3', 'm4a', 'opus', 'vorbis', 'wav', 'alac'];
  const thumbnailQualities = ['max', 'hq', 'mq', 'sd', 'default'];
  const thumbnailTypes = ['jpg', 'webp'];

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
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent/20 text-foreground">
      <Card className="w-full max-w-5xl border-none shadow-2xl hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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

            <Card className="border border-accent/20">
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
                      onValueChange={(value) => setOptions({ ...options, filter: value as DownloadOptions['filter'] })}
                    >
                      <SelectTrigger className="bg-accent/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Only</SelectItem>
                        <SelectItem value="audio">Audio Only</SelectItem>
                        <SelectItem value="both">Audio and Video</SelectItem>
                        <SelectItem value="merge">Merge Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Format</Label>
                    <Select
                      value={options.format}
                      onValueChange={(value) => setOptions({ ...options, format: value })}
                    >
                      <SelectTrigger className="bg-accent/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {options.filter === 'video' && videoFormats.map(format => (
                          <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                        ))}
                        {options.filter === 'audio' && audioFormats.map(format => (
                          <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                        ))}
                        {options.filter === 'merge' && mergeFormats.map(format => (
                          <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(options.filter === 'video' || options.filter === 'merge') && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Video Quality</Label>
                      <Select
                        value={options.videoQuality}
                        onValueChange={(value) => setOptions({ ...options, videoQuality: value })}
                      >
                        <SelectTrigger className="bg-accent/5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {videoResolutions.map(resolution => (
                            <SelectItem key={resolution} value={resolution}>{resolution}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {options.filter === 'audio' && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Audio Quality (0-10)</Label>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[options.audioSlider || 5]}
                        onValueChange={([value]) => setOptions({ ...options, audioSlider: value })}
                        className="py-4"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        Quality: {options.audioSlider || 5}
                      </div>
                    </div>
                  )}

                  {options.filter === 'merge' && (
                    <Card className="border border-accent/20">
                      <CardContent className="pt-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="subtitles"
                              checked={options.embedSubtitles}
                              onCheckedChange={(checked) =>
                                setOptions({ ...options, embedSubtitles: checked as boolean })
                              }
                            />
                            <Label htmlFor="subtitles">Embed Subtitles</Label>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="thumbnail"
                              checked={options.embedThumbnail}
                              onCheckedChange={(checked) =>
                                setOptions({ ...options, embedThumbnail: checked as boolean })
                              }
                            />
                            <Label htmlFor="thumbnail">Embed Thumbnail</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Thumbnail Quality</Label>
                    <Select
                      value={options.thumbnailQuality}
                      onValueChange={(value) => setOptions({ ...options, thumbnailQuality: value })}
                    >
                      <SelectTrigger className="bg-accent/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {thumbnailQualities.map(quality => (
                          <SelectItem key={quality} value={quality}>{quality.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Thumbnail Type</Label>
                    <Select
                      value={options.thumbnailType}
                      onValueChange={(value) => setOptions({ ...options, thumbnailType: value })}
                    >
                      <SelectTrigger className="bg-accent/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {thumbnailTypes.map(type => (
                          <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                <span
                  className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
                ></span>
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

              {/* <Button
                variant="ghost"
                asChild
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <a href="/playlist">
                  <PlaySquare className="mr-2" size={20} />
                  Download Playlist
                </a>
              </Button> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;