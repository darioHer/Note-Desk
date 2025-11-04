import React from 'react';
import { Maximize, Minus, X } from 'lucide-react';

export const WindowButtons: React.FC = React.memo(() => {
  const api: any = (window as any).electron ?? (window as any).renderer ?? null;

  function handle(action: 'minimizeApp' | 'maximizeApp' | 'closeApp') {
    if (!api) return;
    api[action]?.();
  }

  return (
    <div className="window-buttons flex [&>div]:hover:bg-[#e7e5e4] dark:[&>div]:hover:bg-[#1c1917]">
      <div className="p-2 flex justify-center items-center" onClick={() => handle('minimizeApp')}>
        <Minus className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
      </div>
      <div className="p-2 flex justify-center items-center" onClick={() => handle('maximizeApp')}>
        <Maximize className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
      </div>
      <div className="p-2 flex justify-center items-center" onClick={() => handle('closeApp')}>
        <X className="w-[20px] h-[20px] text-black dark:text-[#e7e5e4]" />
      </div>
    </div>
  );
});
