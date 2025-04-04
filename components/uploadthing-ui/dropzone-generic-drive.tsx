"use client";

// Global Imports
import { createId } from "@paralleldrive/cuid2";
import { useDropzone } from "@uploadthing/react";
import {
  FileSize,
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
  UploadThingError,
} from "@uploadthing/shared";
import { Check, FileUpIcon, Info, Loader2, Trash, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// Local Imports
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUploadThing } from "@/lib/uploadthing";
import {
  UTUIFileStatus,
  UTUIFunctionsProps,
  UTUIUploadFile,
} from "@/lib/uploadthing-ui-types";
import { checkFileObjectKey, formatBytes } from "@/lib/uploadthing-ui-utils";
import { useDropzoneGenericDriveStore } from "@/store/dropzone-generic-drive-store";

// Body
export default function UTUIDropzoneGenericDrive({
  UTUIFunctionsProps,
}: {
  UTUIFunctionsProps: UTUIFunctionsProps;
}) {
  // [1] State and Refs
  const { historicFiles, setFiles, abortAllFiles, resetFiles } =
    useDropzoneGenericDriveStore();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((fileObj) => ({
          id: createId(),
          file: fileObj,
          status: "pending" as UTUIFileStatus,
          createdAt: new Date(),
        })),
      );
    },
    [setFiles],
  );

  // [2] Uploadthing
  const { routeConfig } = useUploadThing(UTUIFunctionsProps.fileRoute);
  const acceptedFileTypes = generatePermittedFileTypes(routeConfig)
    .fileTypes.map((fileType) => {
      if (fileType.includes("/")) {
        return fileType;
      } else {
        return `${fileType}/*`;
      }
    })
    .join(",");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  // [3] Derived State
  const fileRouteOptions = checkFileObjectKey({
    str: generatePermittedFileTypes(routeConfig).fileTypes[0],
    obj: routeConfig,
  });

  const allFilesUploaded = historicFiles.every(
    (file) => file.status === "complete" || file.status === "error",
  );

  // [4] Conditionals checks
  // If the file route options are not found, display an error message
  if (!fileRouteOptions)
    return (
      <div className="flex flex-col gap-4 text-sm">
        <Loader2 className="animate-spin stroke-1" />
      </div>
    );

  const maxFileCount = fileRouteOptions.maxFileCount;
  const minFileCount = fileRouteOptions.minFileCount;
  const maxFileSize = fileRouteOptions.maxFileSize;

  // [5] JSX
  return (
    <div className="flex w-full flex-col gap-4 text-sm">
      <Title />
      <input {...getInputProps()} />
      {/* Limit the file dropzone area */}
      <div
        className="flex w-full cursor-pointer flex-wrap items-center justify-center gap-4 rounded-md border px-4 py-2 text-xs"
        {...getRootProps()}
      >
        <Upload className="w-4 stroke-1" />
        <div className="text-center text-muted-foreground">
          <span className="font-semibold">Drop</span> your files here
        </div>
      </div>

      <Information
        fileTypes={acceptedFileTypes}
        maxFileCount={maxFileCount}
        minFileCount={minFileCount}
        maxFileSize={maxFileSize}
      />

      <Separator />

      {historicFiles.map((fileObj) => {
        return (
          <FileContainer
            key={fileObj.id}
            uploadFile={fileObj}
            UTUIFunctionsProps={UTUIFunctionsProps}
          />
        );
      })}

      {historicFiles.length > 0 && <Separator />}

      {/* Only cleans all the files from the state */}
      {allFilesUploaded && historicFiles.length > 0 && (
        <div className="flex w-full items-center justify-end">
          <Button onClick={resetFiles}>Clear All</Button>
        </div>
      )}

      {/* Cleans all the files from the state and aborts them */}
      {!allFilesUploaded && historicFiles.length > 0 && (
        <div className="flex w-full items-center justify-end">
          <Button variant={"destructive"} onClick={abortAllFiles}>
            Cancel All
          </Button>
        </div>
      )}
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// File Container
//////////////////////////////////////////////////////////////////////////////////

function FileContainer({
  uploadFile,
  UTUIFunctionsProps,
}: {
  uploadFile: UTUIUploadFile & { abort?: boolean };
  UTUIFunctionsProps: UTUIFunctionsProps;
}) {
  // [1] State & Ref
  const isMounted = useRef(true);
  const hasStartedUpload = useRef(false);
  const [progress, setProgress] = useState(0);
  const { updateFileStatus, removeFile } = useDropzoneGenericDriveStore();
  const abortControllerRef = useRef<AbortController | null>(
    new AbortController(),
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  // [2] Uploadthing
  const { startUpload, isUploading } = useUploadThing(
    UTUIFunctionsProps.fileRoute,
    {
      signal: abortControllerRef.current?.signal,
      uploadProgressGranularity: "fine",
      onUploadProgress: (progress) => {
        if (isMounted.current) {
          setProgress(progress);

          // Your additional code here
          UTUIFunctionsProps.onUploadProgress?.(progress);
        }
      },
      onClientUploadComplete: (res) => {
        if (isMounted.current && res?.[0]) {
          updateFileStatus(uploadFile.id, "complete", res[0].url);

          // Your additional code here
          UTUIFunctionsProps.onClientUploadComplete?.(res);
        }
      },
      onUploadError: (error) => {
        if (isMounted.current) {
          updateFileStatus(uploadFile.id, "error");
          setErrorMessage(error.message);

          // Your additional code here
          UTUIFunctionsProps.onUploadError?.(error);
        }
      },
      onBeforeUploadBegin: (files) => {
        UTUIFunctionsProps.onBeforeUploadBegin?.(files);

        return files;
      },
      onUploadBegin: UTUIFunctionsProps.onUploadBegin,
    },
  );

  // [3] Handlers
  const resetAbortController = () => {
    if (abortControllerRef.current && abortControllerRef.current.signal) {
      removeFile(uploadFile.id);
      abortControllerRef.current.abort();

      // Your additional code here
      UTUIFunctionsProps.onUploadAborted?.(uploadFile.file);
    }
  };

  // [4] Effects
  // When a file isn't uploading
  useEffect(() => {
    if (
      !hasStartedUpload.current &&
      !isUploading &&
      uploadFile.status === "pending"
    ) {
      hasStartedUpload.current = true;

      startUpload([uploadFile.file]).catch((error: UploadThingError) => {
        return error;
      });
      updateFileStatus(uploadFile.id, "uploading");
    }
  }, [
    uploadFile,
    isUploading,
    hasStartedUpload,
    startUpload,
    updateFileStatus,
  ]);

  useEffect(() => {
    // Check if the file has an abort status
    // If it does, abort the upload and remove it from the state
    if (uploadFile.abort) {
      resetAbortController();
    }
  }, [uploadFile, resetAbortController]);

  // [5] JSX
  return (
    <div className="flex h-40 w-full flex-col rounded-md border sm:h-20 sm:flex-row sm:items-center">
      <div className="hidden h-full min-w-20 items-center justify-center bg-accent sm:flex">
        {uploadFile.status === "pending" ||
        uploadFile.status === "uploading" ? (
          <Loader2 className="animate-spin stroke-1" />
        ) : uploadFile.status === "error" ? (
          <Info className="stroke-1" />
        ) : (
          <FileUpIcon className="stroke-1" />
        )}
      </div>

      <div className="flex h-20 flex-col justify-center gap-1 truncate px-4">
        <span className="truncate">{uploadFile.file.name}</span>
        <span className="h-fit truncate text-xs text-muted-foreground">
          {formatBytes(uploadFile.file.size)} ({progress}%)
        </span>
        <span className="truncate text-xs text-destructive">
          {errorMessage}
        </span>
      </div>

      {uploadFile.status === "complete" && !errorMessage && (
        <div className="flex h-20 w-full sm:ml-auto sm:w-fit">
          <div className="flex h-full w-1/2 items-center justify-center bg-accent sm:hidden">
            <FileUpIcon className="stroke-1" />
          </div>
          <div className="flex w-1/2 items-center justify-center gap-2 text-chart-2 sm:min-w-20 sm:gap-0">
            <span className="text-xs sm:hidden">Complete</span>
            <Check className="w-4 stroke-1" />
          </div>
        </div>
      )}

      {uploadFile.status === "pending" ||
        (uploadFile.status === "uploading" && !errorMessage && (
          <div className="flex h-20 w-full sm:ml-auto sm:w-fit">
            <div className="flex h-full w-1/2 items-center justify-center bg-accent sm:hidden">
              <Loader2 className="animate-spin stroke-1" />
            </div>
            <div
              className="flex w-1/2 cursor-pointer items-center justify-center gap-2 text-destructive sm:min-w-20 sm:gap-0"
              onClick={resetAbortController}
            >
              <span className="text-xs sm:hidden">Cancel</span>
              <Trash className="w-4 stroke-1" />
            </div>
          </div>
        ))}

      {uploadFile.status === "error" && errorMessage && (
        <div className="flex h-20 w-full sm:ml-auto sm:w-fit">
          <div className="flex h-full w-1/2 items-center justify-center bg-accent sm:hidden">
            <Info className="stroke-1" />
          </div>
          <div
            className="flex w-1/2 cursor-pointer items-center justify-center gap-2 text-destructive sm:min-w-20 sm:gap-0"
            onClick={resetAbortController}
          >
            <span className="text-xs sm:hidden">Cancel</span>
            <Trash className="w-4 stroke-1" />
          </div>
        </div>
      )}
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// Title
//////////////////////////////////////////////////////////////////////////////////

function Title() {
  // [1] JSX
  return (
    <div className="font-semibold">
      Upload files <span className="text-destructive">*</span>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
// Information
//////////////////////////////////////////////////////////////////////////////////

function Information({
  fileTypes,
  maxFileCount,
  minFileCount,
  maxFileSize,
}: {
  fileTypes: string;
  maxFileCount: number;
  minFileCount: number;
  maxFileSize: FileSize;
}) {
  // [1] JSX
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <span className="underline">Up to {maxFileSize}</span>
      <span className="underline">Allowed files: {fileTypes}</span>
      <span className="underline">Max files: {maxFileCount}</span>
      <span className="underline">Min files: {minFileCount}</span>
    </div>
  );
}
