import { FileInput } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [files, setFiles] = useState<File[] | null>(null);

  return (
    <FileInput
      label="Attachments"
      value={files}
      onValueChange={(next) => setFiles(Array.isArray(next) ? next : next ? [next] : null)}
      multiple
      accept="image/*,.pdf"
      description="Select one or more files"
    />
  );
}
