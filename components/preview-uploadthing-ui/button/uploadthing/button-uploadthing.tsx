import DisplayDownloads from "../../display-downloads";
import PreviewUTUIButtonUploadthingClient from "./button-uploadthing-client";

export default function PreviewUTUIButtonUploadthing() {
  return (
    <div className="relative">
      <PreviewUTUIButtonUploadthingClient />
      <DisplayDownloads componentName="button-uploadthing" />
    </div>
  );
}
