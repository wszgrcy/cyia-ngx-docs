/** @deprecated 直接读出来md写到内容中 */
export function markdownFileReader() {
  return new MarkdownFileReader();
}
export class MarkdownFileReader {
  defaultPattern = /\.md$/;
  getDocs() {
    return [{ docType: 'markdownFile' }];
  }
}
