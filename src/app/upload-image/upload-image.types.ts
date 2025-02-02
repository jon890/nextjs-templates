export type UploadImage = {
  /**
   * 파일 객체
   */
  file: File;

  /**
   * 이미지를 선택 시, FileReader로 읽어낸 dataUrl
   */
  dataUrl: string;

  /**
   * 이미지 키
   */
  fileKey: string;

  /**
   * 서버에 업로드 여부
   * 완료되면 true를 반환한다
   */
  isUploaded: boolean;

  /**
   * 서버 업로드 완료후 imageUrl
   */
  imageUrl: string | null;
};

export type UploadImageErrorType =
  | {
      type: "EXCEED_MAX_FILE_SIZE";
      extra: {
        maxFileSize: number;
      };
    }
  | {
      type: "EXCEED_MAX_FILE_COUNT";
      extra: {
        maxFileCount: number;
      };
    }
  | {
      type: "FAILED_TO_UPLOAD_SERVER";
      extra: {
        fileKey: string;
      };
    }
  | {
      type: "FAILED_TO_READ_FILE";
      extra: {
        fileKey: string;
      };
    };
