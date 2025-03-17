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
          onClientUploadComplete: (res) => {
            if (!res[0]) return;

            removeFile(res[0].key);
          },
        }}
      />
    </PreviewUTUIWrapper>
  );
}
