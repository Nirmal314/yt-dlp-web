## Getting Started

To start the development server, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## yt-dlp Configuration

Below are some common configuration options for `yt-dlp`:

- **Embed Options**:

  - `embedThumbnail`: `true` | `false` | `undefined`
  - `embedSubs`: `true` | `false` | `undefined`

- **Filters and Formats**:
  - `filter: 'videoonly'`
    - `format`: `mp4` | `webm`
    - `quality`: `highest` | `lowest` | `144p` | `240p` | `360p` | `480p` | `720p` | `1080p` | `1440p` | `2160p`
  - `filter: 'audioonly'`
    - `format`: `aac` | `flac` | `mp3` | `m4a` | `opus` | `vorbis` | `wav` | `alac`
    - `quality`: `1` to `10`
  - `filter: 'audioandvideo'`
    - `format`: `mp4` | `webm`
    - `quality`: `highest` | `lowest`
  - `filter: 'mergevideo'`
    - `format`: `mkv` | `mp4` | `ogg` | `webm` | `flv`
    - `quality`: `highest` | `lowest` | `144p` | `240p` | `360p` | `480p` | `720p` | `1080p` | `1440p` | `2160p`
