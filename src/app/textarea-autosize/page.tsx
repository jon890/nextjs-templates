"use client";

import TextareaAutosize from "./textarea-autosize";

export default function TextareaAutosizePage() {
  return (
    <div className="flex flex-col items-center justify-center h-auto">
      <h1 className="text-2xl font-bold">Textarea Autosize</h1>
      <TextareaAutosize />
    </div>
  );
}
