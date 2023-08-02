export declare global {
  namespace JSX {
    interface HtmlPathTag extends HtmlTag, Record<string, string | null> {}

    interface HtmlMetaTag extends HtmlMetaTag {
      property?: string
    }

    interface HtmlScriptTag extends HtmlScriptTag {
      referrerpolicy?: string
    }

    interface HtmlDialogTag extends HtmlTag {}

    interface IntrinsicElements {
      dialog: HtmlDialogTag
      path: HtmlPathTag
    }
  }
}
