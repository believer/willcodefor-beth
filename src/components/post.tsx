import elements from '@kitajs/html'
import { Post } from '../db/schema'
import { formatDateTime } from '../utils/intl'
import { md } from '../utils/markdown'
import { BaseHtml } from './layout'

export function Post({
  body,
  createdAt,
  id,
  tilId,
  title,
  updatedAt,
}: Pick<Post, 'id' | 'body' | 'title' | 'tilId' | 'updatedAt' | 'createdAt'>) {
  return (
    <BaseHtml title={title} highlight path="/posts">
      <article class="mx-auto max-w-prose prose dark:prose-invert dark:prose-dark">
        <h1 class="mb-5 flex text-2xl">
          <span class="not-prose font-medium">
            <a href="/">til</a>
          </span>
          <span class="mx-1 font-normal text-gray-400">/</span>
          <span>{title}</span>
        </h1>
        <div id="body">{md.render(body ?? '')}</div>
        <hr />
        <ul class="flex flex-col items-center justify-between gap-5 space-y-3 text-sm sm:flex-row sm:space-y-0">
          <div
            class="h-5"
            hx-get={`/posts/next/${tilId}`}
            hx-trigger="intersect"
            hx-swap="outerHTML"
          />
          <div
            class="h-5"
            hx-get={`/posts/previous/${tilId}`}
            hx-trigger="intersect"
            hx-swap="outerHTML"
          />
        </ul>
        <footer class="mt-8 text-center text-xs text-gray-600">
          This til was created{' '}
          <time class="font-semibold" datetime={createdAt}>
            {formatDateTime(createdAt)}
          </time>
          {createdAt !== updatedAt ? (
            <span>
              {' '}
              and last modified{' '}
              <time class="font-semibold" datetime={updatedAt}>
                {formatDateTime(updatedAt)}
              </time>
            </span>
          ) : null}
          . It has been viewed{' '}
          <span
            hx-post={`/posts/stats/${id}`}
            hx-trigger="intersect"
            hx-swap="outerHTML"
          >
            0
          </span>{' '}
          times. CC BY-NC-SA 4.0 2023-PRESENT © Rickard Natt och Dag
        </footer>
      </article>
    </BaseHtml>
  )
}
