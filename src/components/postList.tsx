import elements from '@kitajs/html'
import { Post } from '../db/schema'
import { formatDate, formatDateTime } from '../utils/intl'

export type Sort = 'createdAt' | 'updatedAt' | 'views'

type Props = {
  hasMore?: boolean
  sort?: Sort
  page?: number
  posts: (Pick<Post, 'slug' | 'title' | 'tilId' | 'createdAt' | 'updatedAt'> & {
    views?: number
  })[]
}

export default function PostList({
  posts,
  sort = 'createdAt',
  hasMore,
  page,
}: Props) {
  if (posts.length === 0) {
    return (
      <div class="text-center">
        <p class="text-gray-500">No posts found.</p>
      </div>
    )
  }

  return (
    <ol class="mt-8 space-y-2 sm:space-y-4" id="post-list">
      {posts.map((post) => {
        const time = sort === 'updatedAt' ? post.updatedAt : post.createdAt
        const isTimeSort = sort === 'updatedAt' || sort === 'createdAt'

        return (
          <li
            class="til-counter grid-post relative grid w-full items-baseline gap-4 sm:inline-flex sm:gap-5"
            data-til={post.tilId}
          >
            <a href={`/posts/${post.slug}`}>{post.title}</a>
            <hr class="m-0 hidden flex-1 border-dashed border-gray-300 dark:border-gray-600 sm:block" />
            {isTimeSort ? (
              <time
                class="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400"
                datetime={time}
              >
                <span class="hidden sm:block">{formatDateTime(time)}</span>
                <span class="block sm:hidden">{formatDate(time)}</span>
              </time>
            ) : (
              <div class="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                {post.views} views
              </div>
            )}
          </li>
        )
      })}
      {hasMore && page ? (
        <li>
          <div class="mt-8 flex justify-center">
            <button
              class="hover: rounded border border-gray-500 bg-gray-200 bg-opacity-25 px-4 py-2 text-center text-xs font-bold uppercase text-gray-500 no-underline transition-colors hover:border-brandBlue-500 hover:bg-brandBlue-300 hover:bg-opacity-25 hover:text-brandBlue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:dark:border-brandBlue-700 hover:dark:bg-brandBlue-500 hover:dark:text-brandBlue-100"
              hx-get={`/stats/most-viewed?page=${page + 1}`}
              hx-target="closest li"
              hx-swap="outerHTML"
              hx-select="ol > li"
            >
              Load more
            </button>
          </div>
        </li>
      ) : null}
    </ol>
  )
}
