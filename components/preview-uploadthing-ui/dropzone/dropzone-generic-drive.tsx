"use client";

import PreviewUTUIWrapper from "../wrapper";
import { removeFile } from "../actions";
import UTUIDropzoneGenericDrive from "@/components/uploadthing-ui/dropzone-generic-drive";

export default function PreviewUTUIDropzoneGenericDrive() {
  return (
    <PreviewUTUIWrapper>
      <UTUIDropzoneGenericDrive
        UTUIFunctionsProps={{
          fileRoute: "imageUploader",
          onBeforeUploadBegin: (files) => {
            // Your additional code here
            console.log(files);

            return files;
          },
          onUploadBegin: (fileName) => {
            // Your additional code here
            console.log(fileName);
          },
          onUploadProgress: (progress) => {
            // Your additional code here
            console.log(progress);
          },
          onClientUploadComplete: (res) => {
            // Your additional code here
            console.log(res);

            if (!res[0]) return;

            removeFile(res[0].key);
          },
          onUploadError: (error) => {
            // Your additional code here
            console.log(error);
          },
        }}
      />
    </PreviewUTUIWrapper>
  );
}
