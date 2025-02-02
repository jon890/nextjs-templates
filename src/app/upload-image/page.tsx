"use client";

import { useUploadImage } from "./use-upload-image";
import { v4 as uuidv4 } from "uuid";
export default function UploadImage() {
  const { handleImageChange } = useUploadImage({
    makeImageKey: (_filename, fileExtension) => `${uuidv4()}${fileExtension}`,
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Upload Image</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple
      />
    </div>
  );
}
