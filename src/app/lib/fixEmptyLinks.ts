export const fixEmptyLinks = (html: string, productName: string): string => {
  return html
    .replace(/<a([^>]*href="[^"]*"[^>]*)>\s*<\/a>/gi, `<a$1>${productName}</a>`)
    .replace(/<a([^>]*)>\s*<\/a>/gi, '')
}