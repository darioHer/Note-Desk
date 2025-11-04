import React from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Link from '@editorjs/link';
import List from '@editorjs/list';
import CheckList from '@editorjs/checklist';
import Quote from '@editorjs/quote';
// @ts-ignore
import Marker from '@editorjs/marker';

const EditorJSTemplate: React.FC<any> = (props) => {
  const holderRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<EditorJS | null>(null);

  React.useEffect(() => {
    if (holderRef.current) {
      editorRef.current = new EditorJS({
        holder: holderRef.current,
        autofocus: true,
        placeholder: 'Escribe aquí…',
        tools: {
          header: Header,
          linkTool: Link,
          checklist: CheckList,
          list: List,
          quote: Quote,
          marker: Marker,
        },
        onChange(api, event) {
          props.onChange?.(api, event);
        },
      });
    }
    return () => {
      editorRef.current?.destroy?.();
      editorRef.current = null;
    };
  }, [props]);

  return (
    <div
      ref={holderRef}
      id="editorjs-container"
      className="dark:[&_::selection]:bg-[oklch(37.4%_0.01_67.558)_!important] dark:[&_::selection]:text-white dark:[&_svg_path,_svg_line,_svg_rect]:stroke-[#ddd_!important] p-4 dark:text-white h-[100%] dark:[&_.ce-popover-item]:text-[white_!important] dark:[&__[class*=container]_::-webkit-scrollbar]:hidden dark:[&_.cdx-search-field]:bg-[oklch(37.4%_0.01_67.558)_!important] dark:[&_.ce-popover-item]:hover:bg-[oklch(37.4%_0.01_67.558)_!important] dark:[&_[class*=container]]:bg-[oklch(21.6%_0.006_56.043)_!important] dark:[&_[class*=container]]:border-[transparent_!important] dark:[&_[class*=plus]]:hover:bg-[oklch(37.4%_0.01_67.558)_!important]"
    />
  );
};

export default React.memo(EditorJSTemplate);
