import { redis } from "@/server/db/redis";
import { Badge } from "../ui/badge";
import { Download } from "lucide-react";

export default async function DisplayDownloads({
  componentName,
}: {
  componentName: string;
}) {
  let views = 0;

  try {
    views =
      (await redis.get<number>(["component-views", componentName].join(":"))) ??
      0;
  } catch (error) {
    console.log(
      `Failed to fetch the component views | ${
        error instanceof Error ? error.message : error
      }`
    );
  }
  return (
    <Badge className="absolute right-4 top-4 gap-2">
      <Download className="w-4" />
      <span>{views}</span>
    </Badge>
  );
}
