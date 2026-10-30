import { Pagination } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} onValueChange={setPage} totalPages={5} />;
}
