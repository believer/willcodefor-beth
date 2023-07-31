import { Post } from '../db/schema'
import elements from '@kitajs/html'
import { formatDate, formatDateTime } from '../utils/intl'

export type Sort = 'createdAt' | 'updatedAt' | 'views'

type Props = {
  sort?: Sort
  posts: (Pick<Post, 'slug' | 'title' | 'tilId' | 'createdAt' | 'updatedAt'> & {
    views?: number
  })[]
}

export default function PostList({ posts, sort = 'createdAt' }: Props) {
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
    </ol>
  )
}
