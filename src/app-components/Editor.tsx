import React from 'react';
import EditorJSTemplate from './EditorJSTemplate';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMainStore } from '@/shared/zust-store';

export default React.memo(() => {
  const active_note = useMainStore(state => state.active_note)
  const handleChange = React.useCallback((api: any, event: any) => {
    console.log("api",api);
    api.saver.save().then((data:any)=>{
      console.log("database",data);
      window.electron.set_note({
        id: active_note.id,
        note: JSON.stringify(data)
      }, true)
      
    })
    
    // Maneja cambios si lo necesitas
  }, []);

  return (
    <ScrollArea className="h-[calc(100%-40px)]">
      <EditorJSTemplate onChange={handleChange} />
    </ScrollArea>
  );
});
