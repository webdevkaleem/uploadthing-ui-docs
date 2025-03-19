"use client";

import PreviewUTUIWrapper from "../../wrapper";
import { removeFile } from "../../actions";
import UTUIDropzoneGenericDrive from "@/components/uploadthing-ui/dropzone-generic-drive";

export default function PreviewUTUIDropzoneGenericDrive() {
  return (
    <PreviewUTUIWrapper>
      <UTUIDropzoneGenericDrive
        UTUIFunctionsProps={{
          fileRoute: "imageUploader",
          onClientUploadComplete: (res) => {
            if (!res[0]) return;

            try {
              removeFile(res[0].key);
            } catch (error) {
              console.log(
                `Failed to remove file upon onUploadComplete | ${
                  error instanceof Error ? error.message : error
                }`
              );
            }
          },
        }}
      />
    </PreviewUTUIWrapper>
  );
}
