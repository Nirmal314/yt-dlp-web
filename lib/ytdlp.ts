import { YtDlp } from "ytdlp-nodejs";

const ytdlp = new YtDlp();

const check = async () => {
  const isInstalled = await ytdlp.checkInstallationAsync({ ffmpeg: true });

  if (!isInstalled) {
    // TODO: install
    const res = await ytdlp.downloadFFmpeg();
  }
};
export { check };
export default ytdlp;
