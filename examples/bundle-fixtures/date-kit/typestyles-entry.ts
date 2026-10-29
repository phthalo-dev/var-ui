// CSS extraction entry. @typestyles/vite evaluates this in Node (not through the bundler), so
// nothing is tree-shaken here: every recipe this entry imports is emitted to dist/typestyles.css.
// List only the component modules this fixture renders. Each component imports its recipe from a
// narrow `@var-ui/core/components/*` subpath, so unused components contribute no CSS.
import '@var-ui/react/components/Button';
import '@var-ui/react/components/Calendar';
import '@var-ui/react/components/DateInput';
import '@var-ui/core/register-default-theme';
