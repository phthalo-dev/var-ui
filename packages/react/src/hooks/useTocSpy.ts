import { useEffect, useState } from 'react';
import {
  collectArticleHeadings,
  createTocSpy,
  type TocHeading,
  type TocSpyOptions,
} from '@var-ui/core/components/toc/spy';

export type UseTocSpyOptions = Omit<
  TocSpyOptions,
  'contentRoot' | 'onHeadingsChange' | 'onActiveChange'
>;

export type UseTocSpyResult = {
  headings: TocHeading[];
  activeId: string | null;
};

/** Track in-page headings and the active section for a table of contents. */
export function useTocSpy(
  contentRoot: ParentNode | null,
  options: UseTocSpyOptions = {},
): UseTocSpyResult {
  const { headingSelector, minHeadings, headerOffset } = options;
  const [headings, setHeadings] = useState<TocHeading[]>(() =>
    contentRoot ? collectArticleHeadings(contentRoot, headingSelector) : [],
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!contentRoot) {
      setHeadings([]);
      setActiveId(null);
      return;
    }

    return createTocSpy({
      contentRoot,
      headingSelector,
      minHeadings,
      headerOffset,
      onHeadingsChange: setHeadings,
      onActiveChange: setActiveId,
    });
  }, [contentRoot, headingSelector, minHeadings, headerOffset]);

  return { headings, activeId };
}
