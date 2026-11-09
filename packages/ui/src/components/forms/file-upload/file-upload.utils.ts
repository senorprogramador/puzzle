import type {
  FileUploadRejection,
  FileUploadRejectionCode,
} from "./file-upload.types";

type FileValidationOptions = {
  accept?: readonly string[];
  maxFileSize?: number;
  maxTotalSize?: number;
  maxFiles?: number;
  multiple?: boolean;
};

type FileValidationResult = {
  accepted: File[];
  rejected: FileUploadRejection[];
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / 1024 ** index;

  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
};

const matchesMimeType = (
  fileType: string,
  acceptedTypes: readonly string[],
): boolean => {
  const normalizedType = fileType.split(";")[0]!.trim().toLowerCase();

  if (!normalizedType) return false;

  return acceptedTypes.some((acceptedType) => {
    const accepted = acceptedType.trim().toLowerCase();

    if (!accepted) return false;

    if (accepted.endsWith("/*")) {
      return normalizedType.startsWith(accepted.slice(0, -1));
    }

    return normalizedType === accepted;
  });
};

const createRejection = (
  file: File,
  code: FileUploadRejectionCode,
  message: string,
): FileUploadRejection => ({
  file,
  code,
  message,
});

const validateFile = (
  file: File,
  options: Pick<FileValidationOptions, "accept" | "maxFileSize">,
): FileUploadRejection | undefined => {
  const { accept = [], maxFileSize } = options;

  if (accept.length > 0 && !matchesMimeType(file.type, accept)) {
    return createRejection(file, "file-type", "This file type is not allowed.");
  }

  if (maxFileSize !== undefined && file.size > maxFileSize) {
    return createRejection(
      file,
      "file-too-large",
      `File exceeds the maximum size of ${formatFileSize(maxFileSize)}.`,
    );
  }

  return undefined;
};

const validateFiles = (
  incomingFiles: readonly File[],
  existingFiles: readonly File[],
  options: FileValidationOptions = {},
): FileValidationResult => {
  const { multiple = false, maxFiles, maxTotalSize } = options;

  const accepted: File[] = [];
  const rejected: FileUploadRejection[] = [];

  const currentFiles = multiple ? [...existingFiles] : [];

  let totalSize = currentFiles.reduce((total, file) => total + file.size, 0);

  let fileCount = currentFiles.length;

  incomingFiles.forEach((file) => {
    const validationError = validateFile(file, options);

    if (validationError) {
      rejected.push(validationError);
      return;
    }

    if (!multiple && accepted.length > 0) {
      rejected.push(
        createRejection(
          file,
          "too-many-files",
          "Only one file can be selected.",
        ),
      );
      return;
    }

    if (multiple && maxFiles !== undefined && fileCount >= maxFiles) {
      rejected.push(
        createRejection(
          file,
          "too-many-files",
          `You can select a maximum of ${maxFiles} files.`,
        ),
      );
      return;
    }

    if (maxTotalSize !== undefined && totalSize + file.size > maxTotalSize) {
      rejected.push(
        createRejection(
          file,
          "total-too-large",
          `The combined file size exceeds ${formatFileSize(maxTotalSize)}.`,
        ),
      );
      return;
    }

    accepted.push(file);

    totalSize += file.size;
    fileCount++;
  });

  return { accepted, rejected };
};

export {
  formatFileSize,
  matchesMimeType,
  createRejection,
  validateFile,
  validateFiles,
};

export type { FileValidationOptions, FileValidationResult };
