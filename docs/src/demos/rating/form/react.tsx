import { Button, Rating } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [posted, setPosted] = useState<string>('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setPosted(String(new FormData(event.currentTarget).get('quality') ?? ''));
      }}
      style={{ display: 'grid', gap: '0.75rem' }}
    >
      <Rating
        name="quality"
        label="Quality"
        description="Required before you can submit."
        required
      />
      <Button type="submit">Submit</Button>
      {posted ? <span>Posted quality={posted}</span> : null}
    </form>
  );
}
