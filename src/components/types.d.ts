export declare global {
  namespace JSX {
    interface HtmlSvgTag extends HtmlTag {
      height?: number | string
      preserveAspectRatio?: string
      viewBox?: string
      width?: number | string
      xmlns?: string
    }

    interface HtmlPathTag extends HtmlTag {
      d?: string
    }

    interface HtmlSummaryTag extends HtmlTag {}

    interface IntrinsicElements {
      path: HtmlPathTag
      svg: HtmlSvgTag
      summary: HtmlSummaryTag
    }
  }
}
