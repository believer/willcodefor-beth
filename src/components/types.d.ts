export declare global {
  namespace JSX {
    interface HtmlPathTag extends HtmlTag, Record<string, string | null> {}

    interface HtmlMetaTag extends HtmlMetaTag {
      property?: string
    }

    interface IntrinsicElements {
      path: HtmlPathTag
    }
  }
}
