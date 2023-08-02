import elements from '@kitajs/html'
import { Post } from '../db/schema'
import { formatDate, formatDateTime } from '../utils/intl'
import { BaseHtml } from './layout'
import Projects from './projects'
import { GitHub, Twitter } from './socialMedia'
import Work from './work'

type Props = {
  latestPosts: Pick<Post, 'slug' | 'title' | 'tilId' | 'createdAt'>[]
}

export function Home({ latestPosts }: Props) {
  return (
    <BaseHtml path="/">
      <section class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-start-3 md:col-end-13">
          <header class="text-2xl font-light">
            <h1 class="mb-5 text-4xl font-bold md:text-5xl">
              Rickard Natt och Dag
            </h1>
            Hej! I'm a developer from Sweden. I enjoy making user-friendly
            websites and creating tools that make life easier for other
            developers. I currently love working in{' '}
            <a href="https://htmx.org/">htmx</a> and{' '}
            <a href="https://www.rust-lang.org/">Rust</a>.
          </header>
          <section class="mt-10 flex items-center space-x-6">
            <GitHub />
            <Twitter />
          </section>
        </div>
      </section>

      <section class="mt-10 grid gap-6 md:grid-cols-12">
        <header class="col-span-12 text-gray-600 dark:text-gray-400 md:col-span-2 md:text-right">
          Latest TIL
        </header>

        <div class="col-span-12 md:col-span-10">
          <p class="mt-0">
            Here are interesting things I found while browsing the web. It's
            ideas and thoughts, new findings, and reminders regarding software
            development. I see it as a second brain for all things related to
            development and a way for me to practice{' '}
            <a href="/posts/learning-in-public">Learning in public</a>.
          </p>

          <p>
            This is heavily inspired by Lee Byron's{' '}
            <a href="https://leebyron.com/til">TIL</a> and builds on top of my
            initial attempt with my{' '}
            <a href="https://devlog.willcodefor.beer">Devlog</a>.
          </p>

          <ol class="mt-8 space-y-2 sm:space-y-4">
            {latestPosts.map((post) => (
              <li
                class="til-counter grid-post relative grid w-full items-baseline gap-4 sm:inline-flex sm:gap-5"
                data-til={post.tilId}
              >
                <a href={`/posts/${post.slug}`}>{post.title}</a>
                <hr class="m-0 hidden flex-1 border-dashed border-gray-300 dark:border-gray-600 sm:block" />
                <time
                  class="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400"
                  datetime={post.createdAt}
                >
                  <span class="hidden sm:block">
                    {formatDateTime(post.createdAt)}
                  </span>
                  <span class="block sm:hidden">
                    {formatDate(post.createdAt)}
                  </span>
                </time>
              </li>
            ))}
          </ol>

          <div class="mt-4 flex justify-end">
            <a href="feed.xml" hx-boost="false">
              Feed
            </a>
          </div>
        </div>
      </section>
      <Work />
      <Projects />
    </BaseHtml>
  )
}
