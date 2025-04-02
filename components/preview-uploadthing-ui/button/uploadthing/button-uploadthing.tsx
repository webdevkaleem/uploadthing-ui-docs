import Loader from "@/app/loader";
import { Suspense } from "react";
import DisplayDownloads from "../../display-downloads";
import PreviewUTUIButtonUploadthingClient from "./button-uploadthing-client";

export default function PreviewUTUIButtonUploadthing() {
  return (
    <div className="relative">
      <PreviewUTUIButtonUploadthingClient />
      <Suspense fallback={<Loader />}>
        <DisplayDownloads componentName="button-uploadthing" />
      </Suspense>
    </div>
  );
}
