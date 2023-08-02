import clsx from 'clsx'
import elements from '@kitajs/html'

export const BaseHtml = ({
  children,
  noHeader = false,
  path,
  title,
  meta = null,
}: elements.PropsWithChildren<{
  noHeader?: boolean
  path?: string
  title?: string
  meta?: string | null
}>) => {
  return (
    '<!DOCTYPE html>' +
    (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="keywords" content="blog,today i learned" />
          <meta name="author" content="Rickard Natt och Dag" />
          {meta ? (
            meta
          ) : (
            <>
              <meta
                name="description"
                content="I am a developer from Sweden. I enjoy making user-friendly websites and creating tools that make life easier for other developers."
              />
            </>
          )}
          <title>{title ?? 'Rickard Natt och Dag'}</title>

          <link href="/public/styles.css" rel="stylesheet" />
          <link rel="icon" href="/public/favicon.ico" type="image/x-icon" />
          <link href="/public/tokyonight.css" rel="stylesheet" />
          <script src="/public/htmx.min.js"></script>
        </head>
        <body
          class="bg-white dark:bg-tokyoNight-bg dark:text-gray-200"
          hx-boost="true"
        >
          <main
            class={clsx('grid py-5', {
              'grid-template-main': path !== '/admin',
              'grid-template-admin': path === '/admin',
            })}
          >
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
        </body>
      </html>
    )
  )
}
