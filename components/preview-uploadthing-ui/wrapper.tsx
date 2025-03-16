"use client";

export default function PreviewUTUIWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full relative border rounded-md flex justify-center items-center min-h-96 p-5  sm:p-10">
      {children}
    </div>
  );
}
