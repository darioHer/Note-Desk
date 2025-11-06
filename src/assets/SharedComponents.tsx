import React from "react";
import { Maximize, Minus, X } from "lucide-react";
import type { INoteData, TNote } from "@/shared/types";
import { userFriendlyTime } from "@/shared/functions";

export const WindowButtons: React.FC = React.memo(() => {
  const api =
    (window as any).electron ??
    (window as any).renderer ??
    null;

  const handle = (action: "minimizeApp" | "maximizeApp" | "closeApp") => {
    if (!api || typeof api[action] !== "function") {
      console.warn(`API Electron no disponible: ${action}`);
      return;
    }
    api[action]();
  };

  return (
    <div className="window-buttons flex [&>div]:hover:bg-[#e7e5e4] dark:[&>div]:hover:bg-[#1c1917]">
      <div className="p-2 flex justify-center items-center" onClick={() => handle("minimizeApp")}>
        <Minus className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
      </div>
      <div className="p-2 flex justify-center items-center" onClick={() => handle("maximizeApp")}>
        <Maximize className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
      </div>
      <div className="p-2 flex justify-center items-center" onClick={() => handle("closeApp")}>
        <X className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
      </div>
    </div>
  );
});

export const NotesItem = React.memo(({ note }: { note: INoteData }) => {
  const tnote = note.note as TNote;
  const firstText =
    tnote?.blocks?.find((b) => b?.data?.text)?.data?.text ?? '(sin título)';

  return (
    <div className="w-[100%] p-4 [&.active]:rounded-xl">
      <div className="font-bold text-md">{firstText}</div>
      <div className="flex text-sm text-stone-800 dark:text-stone-300">
        <div>{userFriendlyTime(tnote?.time ?? Date.now())}</div>
        <div className="flex-1 ml-2 truncate">This the note body</div>
      </div>
    </div>
  );
});

export const NotesList = React.memo(
  ({ section, data }: { section: string; data: INoteData[] }) => {
    return (
      <div className="w-[100%] p-3">
        <div className="text-md capitalize">{section}</div>
        <div className="divide-y-1 divide-y-stone-700 dark:divide-y-stone-400">
          {data.map((note) => (
            <NotesItem key={note.id ?? crypto.randomUUID()} note={note} />
          ))}
        </div>
      </div>
    );
  }
);
