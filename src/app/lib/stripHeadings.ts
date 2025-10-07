export const stripH2Tags = (html: string): string => {
  return html.replace(/<h2[^>]*>|<\/h2>/gi, '')
}