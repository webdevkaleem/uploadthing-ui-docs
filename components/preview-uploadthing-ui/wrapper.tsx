"use client";

export default function PreviewUTUIWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full border rounded-md flex justify-center items-center min-h-96">
      {children}
    </div>
  );
}
