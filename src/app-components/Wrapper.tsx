import React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { WindowButtons } from '@/assets/SharedComponents';
import Editor from './Editor';
import EmptyNoteUI from './EmptyNoteUI';
import { useMainStore } from '@/shared/zust-store';
import type { INoteData } from '@/shared/types';

export default React.memo((props: any) => {
  const active_note = useMainStore((state) => state.active_note);
  const set_state   = useMainStore((state) => state.set_state);

  const [notes, set_notes] = React.useState<INoteData[]>([]);

  const handle_create_new_note = React.useCallback(async () => {
    const dummy_data = {
      id: null,
      note: '',
    } as INoteData;

    const notes = await window.electron.set_note(dummy_data);
    set_state('active_note', notes[0]);
    set_notes(notes);
  }, []);

  React.useLayoutEffect(() => {
    window.addEventListener('all-notes-data',(ev: Event & {detail: INoteData[]})=>{
      console.log("ev",ev.detail);
      set_state('active_note', ev.detail[0])
      set_notes(ev.detail);
      
    });

  },[])

  return (
    <div className="h-[100vh] w-[100%]">
      <ResizablePanelGroup direction="horizontal">
    <ResizablePanel minSize={30} defaultSize={35}>
      <div className="h-[40px] w-[100%] border-b-[.5px] border-b-stone-300 dark:border-b-stone-800 app-dragger flex items-center justify-between px-2">

      {
          notes.map(
            note =>
              <div>note{note.id}</div>
          )
        }
      </div>
    </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel minSize={30}>
          <div className="h-[40px] w-[100%] border-b-[.5px] border-b-stone-300 dark:border-b-stone-800 app-dragger flex justify-end">
            {window.navigator.userAgent.toLowerCase().includes('win') && <WindowButtons />}
          </div>

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
