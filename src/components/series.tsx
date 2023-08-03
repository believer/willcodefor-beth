import elements from '@kitajs/html'
import { Post } from '../db/schema'

const seriesNames = {
  applescript: 'AppleScript',
  dataview: 'Dataview',
  htmx: 'htmx',
  intl: 'Intl',
  neovim: 'Neovim',
  rescript: 'ReScript',
  tmux: 'tmux',
}

type Props = {
  posts: Pick<Post, 'title' | 'slug'>[]
  series: string
  title: string
}

export function Series({ posts, series, title }: Props) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section class="mt-5 rounded-lg bg-brandBlue-50 p-5 text-sm shadow-lg dark:bg-tokyoNight-dark">
      <h2 class="mb-2">
        {seriesNames[series as keyof typeof seriesNames]} series
      </h2>
      <ul class="counter space-y-2">
        {posts.map((post) => (
          <li class="counter-increment">
            {title === post.title ? (
              <strong>{post.title}</strong>
            ) : (
              <a href={`/posts/${post.slug}`}>{post.title}</a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
