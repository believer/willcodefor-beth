import clsx from 'clsx'
import elements from '@kitajs/html'

export const BaseHtml = ({
  children,
  highlight = false,
  noHeader = false,
  path,
  title,
}: elements.PropsWithChildren<{
  highlight?: boolean
  noHeader?: boolean
  path?: string
  title?: string
}>) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ?? 'Rickard Natt och Dag'}</title>
        <link href="/styles.css" rel="stylesheet" />
        {highlight ? '<link href="/tokyonight.css" rel="stylesheet" />' : ''}
      </head>
      <body class="bg-white dark:bg-tokyoNight-bg dark:text-gray-200">
        <main class="grid-template-main grid py-5 md:px-8">
          {noHeader ? null : (
            <div class="col-start-3 col-end-4 flex flex-col space-y-2 border-b border-gray-200 pb-8 md:flex-row md:items-center md:justify-end md:space-y-0 md:space-x-8 md:border-0 md:pb-0">
              <a
                class={clsx('font-bold no-underline hover:underline', {
                  'text-gray-700 dark:text-white': path !== '/',
                })}
                href="/"
              >
                @rnattochdag
              </a>
              <a
                class={clsx('font-bold no-underline hover:underline', {
                  'text-gray-700 dark:text-white': path !== '/posts',
                })}
                href="/posts"
              >
                Writing
              </a>
            </div>
          )}
          <div
            class={clsx([
              'col-start-3 col-end-4',
              noHeader ? '' : 'my-10 md:my-12',
            ])}
          >
            {children}
          </div>
        </main>
        <script src="/public/htmx.min.js"></script>
      </body>
    </html>
  )
}
