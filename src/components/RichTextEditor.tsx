"use client";

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-50 animate-pulse rounded-xl" />
});

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ value, onChange }: EditorProps) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange}
        modules={modules}
        className="min-h-[300px]"
      />
    </div>
  );
}
