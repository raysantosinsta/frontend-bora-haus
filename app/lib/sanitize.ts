// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'ul', 'li', 'br', 'img', 'h3', 'h4'],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt'],
  });
}