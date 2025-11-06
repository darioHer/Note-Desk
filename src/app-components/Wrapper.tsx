import React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { NotesList, WindowButtons } from '@/assets/SharedComponents';
import Editor from './Editor';
import EmptyNoteUI from './EmptyNoteUI';
import { useMainStore } from '@/shared/zust-store';
import type { INoteData } from '@/shared/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sectionze_notes } from '@/shared/functions';

export default React.memo((props: any) => {
  const active_note = useMainStore((state) => state.active_note);
  const set_state   = useMainStore((state) => state.set_state);

  const [notes, set_notes] = React.useState<INoteData[]>([]);
  const section_notes = React.useMemo(() => sectionze_notes(notes), [notes]);

  const handle_create_new_note = React.useCallback(async () => {
    const dummy_data = {
      id: null,
      note: '',
    } as INoteData;

    const notes = await window.electron.set_note(dummy_data);
    set_state('active_note', notes[0]);
    set_notes(notes);
  }, [set_state]);

  React.useLayoutEffect(() => {
    const handler = (ev: Event & { detail: INoteData[] }) => {
      set_state('active_note', ev.detail[0]);
      set_notes(ev.detail);
    };
    window.addEventListener('all-notes-data', handler as any);
    return () => window.removeEventListener('all-notes-data', handler as any);
  }, [set_state]);

  return (
    <div className="h-[100vh] w-[100%]">
      <ResizablePanelGroup direction="horizontal">

        {/* LEFT */}
        <ResizablePanel minSize={30} defaultSize={35}>
          {/* Header izquierdo (solo barra) */}
          <div className="h-[40px] w-[100%] border-b-[.5px] border-b-stone-300 dark:border-b-stone-800 app-dragger flex items-center justify-between px-2">
            {notes.map((note) => (
              <div key={note.id ?? crypto.randomUUID()}>note{note.id}</div>
            ))}
          </div>

          {/* Lista scrolleable (fuera del header) */}
          <ScrollArea className="h-[calc(100%-40px)]">
            {Object.keys(section_notes).map((section) => (
              <NotesList
                key={section}
                section={section}
                data={section_notes[section as keyof typeof section_notes]}
              />
            ))}
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle />

        {/* RIGHT */}
        <ResizablePanel minSize={30}>
          {/* Header derecho */}
          <div className="h-[40px] w-[100%] border-b-[.5px] border-b-stone-300 dark:border-b-stone-800 app-dragger flex justify-end">
            {window.navigator.userAgent.toLowerCase().includes('win') && <WindowButtons />}
          </div>

          {/* Contenido */}
          {active_note == null && notes.length === 0 ? (
            <EmptyNoteUI onClick={handle_create_new_note} />
          ) : (
            <Editor />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
});
