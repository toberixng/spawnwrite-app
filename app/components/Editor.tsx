'use client'; // Required for client-side QuillJS

import { Box } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill's default styling

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    ['image', 'video', 'link'], // Media embed options
    [{ list: 'ordered' }, { list: 'bullet' }],
  ],
};

export default function Editor({ value, onChange }: EditorProps) {
  return (
    <Box border="1px solid" borderColor="gray.200" borderRadius="md" bg="white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        style={{ minHeight: '300px' }}
      />
    </Box>
  );
}