export function getFile(
  fileName: string,
  { maxAge }: { maxAge?: number } = {}
) {
  return new Response(Bun.file(fileName), {
    headers: maxAge
      ? {
          'Cache-Control': `max-age=${maxAge}`,
        }
      : {},
  })
}
