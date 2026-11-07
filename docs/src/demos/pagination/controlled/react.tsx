import { Pagination } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [page, setPage] = useState(3);
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <p style={{ margin: 0, fontSize: '0.875rem' }}>Page {page} of 12</p>
      <Pagination page={page} onValueChange={setPage} totalPages={12} />
    </div>
  );
}
