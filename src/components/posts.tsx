import { BaseHtml } from './layout'
import { Post } from '../db/schema'
import * as elements from 'typed-html'
import clsx from 'clsx'
import { formatDate, formatDateTime } from '../intl'
import PostList, { Sort } from './postList'

type Props = {
  sort?: Sort
  posts: (Pick<Post, 'slug' | 'title' | 'tilId' | 'createdAt' | 'updatedAt'> & {
    views?: number
  })[]
}

export function Posts({ posts, sort = 'createdAt' }: Props) {
  return (
    <BaseHtml path="/posts">
      <div class="mx-auto max-w-2xl">
        <div class="sm:grid-search grid grid-cols-1 gap-x-12 gap-y-4">
          <div>
            <label class="group flex-1">
              <span class="mb-2 block text-sm font-semibold">Search</span>
              <div class="relative rounded border-2 border-gray-300 ring-tokyoNight-blue group-focus-within:ring-2 group-focus-within:ring-offset-1 dark:border-gray-700 dark:ring-tokyoNight-blue dark:ring-offset-tokyoNight-dark">
                <input
                  class="w-full px-2 py-1 focus:outline-none dark:bg-tokyoNight-bg peer"
                  hx-post="/posts/search"
                  hx-target="#post-list"
                  hx-trigger="keyup changed delay:300ms, search"
                  type="search"
                  name="search"
                  required="true"
                />
              </div>
            </label>
          </div>
          <div>
            <div class="mb-2 text-sm font-semibold">Sort posts by</div>
            <ul class="flex space-x-2 text-sm">
              <li>
                <a
                  class={clsx({ 'font-bold': !sort || sort === 'createdAt' })}
                  href="?sort=createdAt"
                >
                  Created
                </a>
              </li>
              <li>
                <a
                  class={clsx({ 'font-bold': sort === 'updatedAt' })}
                  href="?sort=updatedAt"
                >
                  Last updated
                </a>
              </li>
              <li>
                <a
                  class={clsx({ 'font-bold': sort === 'views' })}
                  href="?sort=views"
                >
                  Views
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr class="my-8" />
        <PostList posts={posts} sort={sort} />
      </div>
    </BaseHtml>
  )
}
