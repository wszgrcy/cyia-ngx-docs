export function markdownFileReader() {
  return new MarkdownFileReader();
}
export class MarkdownFileReader {
  defaultPattern = /\.md$/;
  getDocs() {
    return [{ docType: 'markdownFile' }];
  }
}
