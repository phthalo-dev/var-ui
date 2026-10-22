import { defineMiddleware } from 'astro:middleware';
import { FRAMEWORK_COOKIE, parseFrameworkCookie } from '@var-ui/docs-components/framework';

export const onRequest = defineMiddleware(async (context, next) => {
  const raw = context.cookies.get(FRAMEWORK_COOKIE)?.value;
  context.locals.framework = parseFrameworkCookie(raw);
  return next();
});
