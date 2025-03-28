"use server";

import { utapi } from "@/lib/uploadthing";

export async function uploadFile(file: File) {
  const response = await utapi.uploadFiles(file);

  if (response.error) return { error: response.error };

  return response.data;
}

export async function uploadFiles(files: File[]) {
  const response = await utapi.uploadFiles(files);

  response.forEach((res) => {
    if (res.error) return { error: res.error };
  });

  return response.map((res) => res.data);
}
