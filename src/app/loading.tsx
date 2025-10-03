// src/app/loading.tsx
"use client";

import { LoaderOne } from "@/components/ui/loader"; // adjust path

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <LoaderOne />
    </div>
  );
}
