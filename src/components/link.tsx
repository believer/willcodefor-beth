import elements from '@kitajs/html'

export function ExternalLink({
  href,
  children,
}: elements.PropsWithChildren<{ href: string }>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
