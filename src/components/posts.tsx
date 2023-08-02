import clsx from 'clsx'
import elements from '@kitajs/html'
import { Post } from '../db/schema'
import { BaseHtml } from './layout'
import PostList, { Sort } from './postList'

type Props = {
  sort?: Sort
  posts: (Pick<Post, 'slug' | 'title' | 'tilId' | 'createdAt' | 'updatedAt'> & {
    views?: number
  })[]
  search?: string
}

export function Posts({ posts, sort = 'createdAt', search = '' }: Props) {
  return (
    <BaseHtml path="/posts">
      <div class="mx-auto max-w-2xl">
        <div class="sm:grid-search grid grid-cols-1 gap-x-12 gap-y-4">
          <div>
            <form action="/posts" method="get" class="flex items-end gap-2">
              <label class="group flex-1">
                <span class="mb-2 block text-sm font-semibold">Search</span>
                <div class="relative rounded border-2 border-gray-300 ring-tokyoNight-blue group-focus-within:ring-2 group-focus-within:ring-offset-1 dark:border-gray-700 dark:ring-tokyoNight-blue dark:ring-offset-tokyoNight-dark">
                  <input
                    class="w-full px-2 py-1 focus:outline-none dark:bg-tokyoNight-bg"
                    type="text"
                    name="search"
                    required="true"
                    value={search}
                  />
                  {search ? (
                    <a
                      class="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full text-sm focus:bg-brandBlue-100 focus:outline-none focus:ring-2 focus:ring-brandBlue-600 focus:ring-offset-1 dark:ring-offset-tokyoNight-dark dark:focus:bg-tokyoNight-blue dark:focus:text-gray-800 dark:focus:ring-tokyoNight-blue no-underline text-gray-500"
                      href="/posts"
                    >
                      &times;
                    </a>
                  ) : null}
                </div>
              </label>
              <button
                type="submit"
                class="rounded bg-brandBlue-100 p-2 px-4 text-sm ring-offset-2 focus:outline-none focus:ring-2 focus:ring-tokyoNight-blue dark:bg-tokyoNight-blue dark:text-gray-800 dark:focus:ring-2 dark:focus:ring-offset-tokyoNight-dark"
              >
                Search
              </button>
            </form>
          </div>
          <div>
            <div class="mb-2 text-sm font-semibold">Sort posts by</div>
            <ul class="flex space-x-2 text-sm">
              <li>
                <a
                  class={clsx({ 'font-bold': sort === 'createdAt' })}
                  href="/posts?sort=createdAt"
                >
                  Created
                </a>
              </li>
              <li>
                <a
                  class={clsx({ 'font-bold': sort === 'updatedAt' })}
                  href="/posts?sort=updatedAt"
                >
                  Last updated
                </a>
              </li>
              <li>
                <a
                  class={clsx({ 'font-bold': sort === 'views' })}
                  href="/posts?sort=views"
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
