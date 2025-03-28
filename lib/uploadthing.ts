// import { FRouter } from "@/app/api/uploadthing/core";
// import { generateUploadButton } from "@uploadthing/react";
import { UTApi } from "uploadthing/server";

// export const UploadButton = generateUploadButton<FRouter>();
export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});
