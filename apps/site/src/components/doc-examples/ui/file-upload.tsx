import { useRef, useState } from "react";
import { FileUpload, Stack } from "@puzzle-ui/ui";

export const FileUploadSelectionExample = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Stack>
      <FileUpload multiple onChange={setFiles} />
      <span role="status">
        {files.length
          ? `Selected: ${files.map((file) => file.name).join(", ")}`
          : "No files selected"}
      </span>
    </Stack>
  );
};

export const FileUploadProgressExample = () => {
  const attemptedFiles = useRef(new WeakSet<File>());

  return (
    <FileUpload
      multiple
      description="Local simulation: each file fails once. Retry to complete it. No files are sent."
      onUpload={async (file, { signal, onProgress }) => {
        const firstAttempt = !attemptedFiles.current.has(file);
        attemptedFiles.current.add(file);

        for (const progress of [25, 50, 75, 100]) {
          await new Promise<void>((resolve) => setTimeout(resolve, 250));
          signal.throwIfAborted();
          onProgress(progress);

          if (firstAttempt && progress === 50) {
            throw new Error("Simulated failure. Retry this upload.");
          }
        }
      }}
    />
  );
};
