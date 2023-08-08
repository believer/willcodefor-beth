import { Post } from '../db/schema'

type Props = {
  data: Pick<Post, 'slug' | 'title'>[]
}

export function CommandMenuSearch({ data }: Props) {
  return (
    <>
      {data.map((post, i) => (
        <li class="flex justify-between items-center focus-within:bg-gray-800 p-2 -mx-2 rounded-sm">
          <a
            class="focus:outline-none"
            href={`/posts/${post.slug}`}
            hx-trigger={`click, keyup[ctrlKey && key == ${i + 1}] from:body`}
          >
            {post.title}
          </a>
          <div class="text-xs text-gray-700">(ctrl + {i + 1})</div>
        </li>
      ))}
    </>
  )
}

export function CommandMenu({ data }: Props) {
  return (
    <div
      id="command-menu"
      class="bg-tokyoNight-bg/30 fixed inset-0 flex justify-center items-center"
    >
      <div class="w-[80dvw] md:w-[60dvw] lg:w-[40dvw] rounded shadow-lg bg-tokyoNight-dark p-6 border-gray-800">
        <input
          autofocus="true"
          type="text"
          name="search"
          class="mb-4 text-white block w-full rounded-sm border bg-transparent p-2 ring-blue-700 focus:outline-none focus:ring-2 dark:border-gray-800 dark:ring-offset-gray-900"
          placeholder="Search"
          hx-trigger="keyup changed delay:300ms"
          hx-get="/command-menu/search"
          hx-target="#command-menu-posts"
        />
        <ul id="command-menu-posts">
          <CommandMenuSearch data={data} />
        </ul>
      </div>
    </div>
  )
}
