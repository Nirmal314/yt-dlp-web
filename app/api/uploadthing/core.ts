import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  upload: f({
    video: {
      maxFileSize: "128MB",
      maxFileCount: 1,
      acl: "private",
    },
    audio: {
      maxFileSize: "64MB",
      maxFileCount: 1,
      acl: "private",
    },
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
      acl: "private",
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type FRouter = typeof fileRouter;
