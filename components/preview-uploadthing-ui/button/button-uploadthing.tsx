"use client";

import UTUIButtonUploadthing from "@/components/uploadthing-ui/button-uploadthing";
import PreviewUTUIWrapper from "../wrapper";
import { removeFile } from "../actions";

export default function PreviewUTUIButtonUploadthing() {
  return (
    <PreviewUTUIWrapper>
      <UTUIButtonUploadthing
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
