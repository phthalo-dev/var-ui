import { Button, CommandPalette } from '@var-ui/react';
import { useEffect, useState } from 'react';

const ALL = ['Alpha release', 'Beta release', 'Release notes', 'Roadmap', 'Rollback plan'];

export default function Preview() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setResults(ALL.filter((title) => title.toLowerCase().includes(query.trim().toLowerCase())));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <Button onPress={() => setOpen(true)}>Search remotely</Button>
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        hotkey={false}
        filter={false}
        highlightMatches
        isLoading={loading}
        onQueryChange={setQuery}
        placeholder="Search releases…"
        items={results.map((title) => ({ id: title, title, onSelect: () => {} }))}
      />
    </>
  );
}
