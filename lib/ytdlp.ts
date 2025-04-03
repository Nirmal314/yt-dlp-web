import { YtDlp } from "ytdlp-nodejs";

const isDev = process.env.NODE_ENV === "development";

let ytdlp;

if (isDev) {
  ytdlp = new YtDlp();
} else {
  ytdlp = new YtDlp({
    binaryPath: "node_modules/ytdlp-nodejs/bin/yt-dlp",
  });
}

const check = async () => {
  const isInstalled = await ytdlp.checkInstallationAsync({ ffmpeg: true });

  if (!isInstalled) {
    // TODO: install
    const res = await ytdlp.downloadFFmpeg();
  }
};
export { check };
export default ytdlp;
