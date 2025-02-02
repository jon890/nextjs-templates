import { useState } from "react";
import { type UploadImage, UploadImageErrorType } from "./upload-image.types";
import UploadImageConfig from "./config";
import { sleep } from "../utils/sleep";

type Props = {
  makeImageKey: (filename: string, fileExtension: string) => string;
};

/**
 * 이미지 업로드를 도와주는 hooks
 * 이 hooks 의 handleImageChange를 input onChange에 연결하여 사용한다
 * 해당 이미지 파일이 선택될 경우, 비동기로 서버에 업로드를 시작한다
 * 업로드가 되었다면 isUploaded 여부로 확인할 수 있다
 */
export const useUploadImage = ({ makeImageKey }: Props) => {
  const [uploadImages, setUploadImages] = useState<UploadImage[]>([]);
  const [error, setError] = useState<UploadImageErrorType[]>([]);

  function handleImageChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(evt.target.files ?? []);

    if (uploadImages.length + files.length > UploadImageConfig.MAX_FILE_COUNT) {
      setError((prev) => [
        ...prev,
        {
          type: "EXCEED_MAX_FILE_COUNT",
          extra: { maxFileCount: UploadImageConfig.MAX_FILE_COUNT },
        },
      ]);
      return;
    }

    if (files.find((it) => it.size > UploadImageConfig.MAX_FILE_SIZE)) {
      setError((prev) => [
        ...prev,
        {
          type: "EXCEED_MAX_FILE_SIZE",
          extra: { maxFileSize: UploadImageConfig.MAX_FILE_SIZE },
        },
      ]);
      return;
    }

    const reader = new FileReader();

    function readFileInternal(index: number) {
      if (index >= files.length) return;

      const currentFile = files[index];

      reader.onload = (e) => {
        const dataUrl = e.target?.result?.toString();

        if (!dataUrl) {
          setError((prev) => [
            ...prev,
            {
              type: "FAILED_TO_READ_FILE",
              extra: { fileKey: currentFile.name },
            },
          ]);
          return;
        }

        const lastDot = currentFile.name.lastIndexOf(".");
        const extension = currentFile.name.substring(lastDot);
        const imageKey = makeImageKey(currentFile.name, extension);

        setUploadImages((prev) => [
          ...prev,
          {
            dataUrl,
            fileKey: imageKey,
            isUploaded: false,
            file: currentFile,
            imageUrl: null,
          },
        ]);
        uploadImageToServer(imageKey, currentFile);

        readFileInternal(index + 1);
      };

      reader.readAsDataURL(currentFile);
    }

    readFileInternal(0);
  }

  function deleteImage(fileKey: string) {
    setUploadImages((prev) => prev.filter((it) => it.fileKey !== fileKey));
  }

  // todo 이미지 업로드 실패시 처리 방안 => retry 가능하도록?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function uploadImageToServer(fileKey: string, file: File) {
    // 서버 업로드 구현 부
    await sleep(1500);
    setUploadImages((prev) =>
      prev.map((it) =>
        it.fileKey === fileKey
          ? // 서버 업로드 후 imageUrl 을 업데이트 하여 사용
            { ...it, isUploaded: true, imageUrl: it.dataUrl }
          : it
      )
    );
  }

  function resetError() {
    setError([]);
  }

  function uploadCompleted() {
    return uploadImages.every((it) => it.isUploaded);
  }

  return {
    uploadImages,
    handleImageChange,
    deleteImage,
    error,
    resetError,
    uploadCompleted,
  };
};
