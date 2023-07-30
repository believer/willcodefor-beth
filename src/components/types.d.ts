export declare global {
  namespace JSX {
    interface HtmlPathTag extends HtmlTag, Record<string, string | null> {}

    interface IntrinsicElements {
      path: HtmlPathTag
    }
  }
}
