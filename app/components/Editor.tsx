// app/components/Editor.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Quill, { QuillOptions } from 'quill';
import 'quill/dist/quill.snow.css';
import { Box, Button, HStack, Text as ChakraText, useToast } from '@chakra-ui/react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Define the type for the Inline blot
interface InlineBlot {
  new (node: HTMLElement): any;
  create(value: string): HTMLElement;
  formats(node: HTMLElement): string;
}

// Define the type for HighlightBlot to include static properties
interface HighlightBlotConstructor {
  new (node: HTMLElement): any;
  create(value: string): HTMLElement;
  formats(node: HTMLElement): string;
  blotName: string;
  tagName: string;
  className: string;
}

// Custom Highlight Blot for Quill
const Inline = Quill.import('blots/inline') as unknown as InlineBlot;
class HighlightBlot extends Inline {
  static create(value: string) {
    const node = super.create(value); // Pass the value to the parent create method
    node.style.backgroundColor = value || '#ffeb3b'; // Default to yellow highlight
    return node;
  }

  static formats(node: HTMLElement) {
    return node.style.backgroundColor || '#ffeb3b';
  }
}

// Add static properties to HighlightBlot
(HighlightBlot as unknown as HighlightBlotConstructor).blotName = 'highlight';
(HighlightBlot as unknown as HighlightBlotConstructor).tagName = 'span';
(HighlightBlot as unknown as HighlightBlotConstructor).className = 'highlight';

// Register the blot with Quill
Quill.register('blots/highlight', HighlightBlot as any);

export default function Editor({ value, onChange }: EditorProps) {
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const toast = useToast();

  // Initialize Quill editor
  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'], // Add image button
        [{ color: [] }, { background: [] }],
        ['highlight'], // Custom highlight button
        ['clean'],
      ];

      const options: QuillOptions = {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: imageHandler, // Custom image handler
              highlight: highlightHandler, // Custom highlight handler
            },
          },
        },
      };

      quillInstance.current = new Quill(quillRef.current, options);

      // Set initial content
      if (value) {
        quillInstance.current.root.innerHTML = value;
      }

      // Update parent component on change
      quillInstance.current.on('text-change', () => {
        const content = quillInstance.current?.root.innerHTML || '';
        onChange(content);
        saveDraft(content); // Save draft on every change
      });
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off('text-change');
      }
    };
  }, [value, onChange]);

  // Custom image upload handler
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        // Generate a unique file name
        const fileName = `${Date.now()}-${file.name}`;

        // Get a signed URL from the API route
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName,
            fileType: file.type,
          }),
        });

        const { signedUrl, publicUrl } = await response.json();

        if (!response.ok) {
          throw new Error('Failed to get signed URL');
        }

        // Upload the file to Cloudflare R2 using the signed URL
        await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        // Insert the image into the editor
        const range = quillInstance.current?.getSelection();
        if (range && publicUrl) {
          quillInstance.current?.insertEmbed(range.index, 'image', publicUrl);
        }
      } catch (error) {
        toast({
          title: 'Image Upload Failed',
          description: (error as Error).message || 'Failed to upload image',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
  };

  // Custom highlight handler
  const highlightHandler = () => {
    quillInstance.current?.format('highlight', '#ffeb3b');
  };

  // Save draft to local storage
  const saveDraft = (content: string) => {
    localStorage.setItem(`draft-${window.location.pathname}`, content);
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000); // Reset draft saved status after 2 seconds
  };

  // Restore draft from local storage
  const restoreDraft = () => {
    const draft = localStorage.getItem(`draft-${window.location.pathname}`);
    if (draft && quillInstance.current) {
      quillInstance.current.root.innerHTML = draft;
      onChange(draft);
      toast({
        title: 'Draft Restored',
        description: 'Your draft has been restored.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'No Draft Found',
        description: 'There is no saved draft to restore.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Clear draft from local storage
  const clearDraft = () => {
    localStorage.removeItem(`draft-${window.location.pathname}`);
    setIsDraftSaved(false);
    toast({
      title: 'Draft Cleared',
      description: 'Your draft has been cleared.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      {/* Editor Container */}
      <Box
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        bg="white"
        boxShadow="sm"
        overflow="hidden"
      >
        {/* Custom Toolbar Styling */}
        <Box
          className="ql-toolbar"
          bg="gray.100"
          borderBottom="1px solid"
          borderColor="gray.300"
          p={2}
        >
          <span className="ql-formats">
            <select className="ql-header">
              <option value="1"></option>
              <option value="2"></option>
              <option value="3"></option>
              <option value=""></option>
            </select>
          </span>
          <span className="ql-formats">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-blockquote"></button>
            <button className="ql-code-block"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-link"></button>
            <button className="ql-image"></button>
          </span>
          <span className="ql-formats">
            <select className="ql-color"></select>
            <select className="ql-background"></select>
          </span>
          <span className="ql-formats">
            <button className="ql-highlight">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 2h16v6H4z" fill="#ffeb3b" />
                <path d="M4 2h16v6H4zm0 0v20h16V8m-4 4H8" />
              </svg>
            </button>
          </span>
          <span className="ql-formats">
            <button className="ql-clean"></button>
          </span>
        </Box>
        {/* Editor Content Area */}
        <Box
          ref={quillRef}
          minH="200px"
          p={4}
          fontSize="md"
          color="gray.800"
          className="ql-editor"
        />
      </Box>
      {/* Draft Controls */}
      <HStack mt={4} spacing={3}>
        <Button
          onClick={restoreDraft}
          colorScheme="blue"
          variant="outline"
          size="sm"
        >
          Restore Draft
        </Button>
        <Button
          onClick={clearDraft}
          colorScheme="red"
          variant="outline"
          size="sm"
          isDisabled={!isDraftSaved}
        >
          Clear Draft
        </Button>
        {isDraftSaved && (
          <ChakraText fontSize="sm" color="green.500">
            Draft Saved
          </ChakraText>
        )}
      </HStack>
    </Box>
  );
}