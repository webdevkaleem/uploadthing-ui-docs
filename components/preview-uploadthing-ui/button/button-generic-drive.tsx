"use client";

import UTUIButtonGenericDrive from "@/components/uploadthing-ui/button-generic-drive";
import PreviewUTUIWrapper from "../wrapper";
import { removeFile } from "../actions";

export default function PreviewUTUIButtonGenericDrive() {
  return (
    <PreviewUTUIWrapper>
      <UTUIButtonGenericDrive
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
