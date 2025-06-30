import YTDlpWrap from "yt-dlp-wrap";
import os from "os";

export const PLATFORM_MAPPINGS: Record<string, Record<string, string>> = {
  win32: {
    x64: "yt-dlp.exe",
    ia32: "yt-dlp_x86.exe",
  },
  linux: {
    x64: "yt-dlp",
    armv7l: "yt-dlp_linux_armv7l",
    aarch64: "yt-dlp_linux_aarch64",
  },
  darwin: {
    x64: "dlp_macos",
    arm64: "dlp_macos",
  },
};

const platform = os.platform();
const arch = process.arch;
const fileName = PLATFORM_MAPPINGS[platform][arch];
const filePath = `public/binaries/${fileName}`;

//Get the data from the github releases API. In this case get page 1 with a maximum of 5 items.
await YTDlpWrap.getGithubReleases(1, 5);
//Download the yt-dlp binary for the given version and platform to the provided path.
//By default the latest version will be downloaded to "./yt-dlp" and platform = os.platform().

await YTDlpWrap.downloadFromGithub(filePath);

//Init an instance with a given binary path.
//If none is provided "yt-dlp" will be used as command.
export const ytDlpWrap = new YTDlpWrap(filePath);
