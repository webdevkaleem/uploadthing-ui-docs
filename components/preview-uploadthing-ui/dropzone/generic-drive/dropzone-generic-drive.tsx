import Loader from "@/app/loader";
import { Suspense } from "react";
import DisplayDownloads from "../../display-downloads";
import PreviewUTUIDropzoneGenericDrive from "./dropzone-generic-drive-client";

export default function PreviewUTUIButtonUploadthing() {
  return (
    <div className="relative">
      <PreviewUTUIDropzoneGenericDrive />
      <Suspense fallback={<Loader />}>
        <DisplayDownloads componentName="dropzone-generic-drive" />
      </Suspense>
    </div>
  );
}
