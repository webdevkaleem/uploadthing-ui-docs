import { Suspense } from "react";
import DisplayDownloads from "../../display-downloads";
import PreviewUTUIButtonUploadthingClient from "./button-uploadthing-client";

export default function PreviewUTUIButtonUploadthing() {
  return (
    <div className="relative">
      <PreviewUTUIButtonUploadthingClient />
      <Suspense>
        <DisplayDownloads componentName="button-uploadthing" />
      </Suspense>
    </div>
  );
}
