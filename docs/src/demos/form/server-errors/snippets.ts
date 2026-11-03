import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useState } from 'react';
import { Button, Form, TextField } from '@var-ui/react';

const TAKEN = 'taken@example.com';

// Stands in for your API: resolves with field errors keyed by input name.
async function createAccount(data: FormData): Promise<Record<string, string>> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return data.get('email') === TAKEN ? { email: 'That email is already registered' } : {};
}

export default function Preview() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState(false);

  async function onSubmit(_event: unknown, data: FormData) {
    setPending(true);
    setCreated(false);
    try {
      const result = await createAccount(data);
      setErrors(result);
      setCreated(Object.keys(result).length === 0);
    } finally {
      setPending(false);
    }
  }

  return (
    <Form errors={errors} onSubmit={onSubmit} onError={() => setErrors({ email: 'Network error' })}>
      <TextField
        name="email"
        type="email"
        label="Email"
        description={\`Try \${TAKEN} to see a server error.\`}
        required
        errorMessage={errors.email}
        onChange={() => setErrors({})}
      />
      <Button type="submit" loading={pending}>
        Create account
      </Button>
      {created ? <p role="status">Account created.</p> : null}
    </Form>
  );
}`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
