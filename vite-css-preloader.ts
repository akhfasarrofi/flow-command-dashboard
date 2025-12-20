import type { Plugin } from 'vite';

export function cssPreloader(): Plugin {
  return {
    enforce: 'post',
    name: 'rewrite-stylesheet-link',
    transformIndexHtml(html) {
      let capturedHref: string | null = null;

      const rewritten = html.replace(
        /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+\.css)["'][^>]*>/gi,
        (_m, href) => {
          capturedHref = href;
          return `<link rel="preload" as="style" href="${href}">
    <link rel="stylesheet" href="${href}" media="print" onload="this.media='all'">`;
        },
      );

      if (capturedHref && !/noscript>.*rel=["']stylesheet["']/i.test(rewritten)) {
        return rewritten.replace(
          /<\/head>/i,
          `  <noscript><link rel="stylesheet" href="${capturedHref}"></noscript>\n</head>`,
        );
      }

      return rewritten;
    },
  };
}
