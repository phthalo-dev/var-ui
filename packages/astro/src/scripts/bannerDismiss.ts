export function initDismissibleBanner(): void {
  document.querySelectorAll('[data-var-ui-banner-dismiss]').forEach((btn) => {
    if (btn.hasAttribute('data-var-ui-banner-dismiss-initialized')) return;
    btn.setAttribute('data-var-ui-banner-dismiss-initialized', '');

    btn.addEventListener('click', () => {
      const root = btn.closest('[data-var-ui-banner]');
      root?.remove();
    });
  });
}
