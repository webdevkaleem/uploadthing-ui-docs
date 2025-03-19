"use client";

import UTUIButtonUploadthing from "@/components/uploadthing-ui/button-uploadthing";
import PreviewUTUIWrapper from "../../wrapper";
import { removeFile } from "../../actions";

export default function PreviewUTUIButtonUploadthingClient() {
  return (
    <PreviewUTUIWrapper>
      <UTUIButtonUploadthing
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
