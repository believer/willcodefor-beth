import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItLinkAttributes from 'markdown-it-link-attributes'
import markdownItHighlight from 'markdown-it-highlightjs'

export const md = markdownIt({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
})
  .use(markdownItHighlight)
  .use(markdownItAnchor, {
    level: [1, 2, 3, 4],
    permalink: markdownItAnchor.permalink.linkInsideHeader({
      symbol: `
        <span class="sr-only">Jump to heading</span>
        <span class="text-gray-400 dark:text-gray-500" aria-hidden="true">#</span>
      `,
      placement: 'after',
      class: 'no-underline',
    }),
  })
  .use(markdownItLinkAttributes, {
    matcher(href: string) {
      return href.startsWith('https:')
    },
    attrs: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  })

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s\(\W+\)/g, '')
    .replace(/ - /g, ' ')
    .replace(/\s/g, '-')
    .replace(/[*'\\/:]/g, '')
