import elements from '@kitajs/html'
import { parsePercent } from '../utils/intl'

export function DataList({
  data,
  title,
}: {
  data: Record<string, number>
  title: string
}) {
  const sum = Object.values(data).reduce((acc, curr) => acc + curr, 0)

  return (
    <div>
      <h3 class="mb-2 font-semibold uppercase text-gray-500">{title}</h3>
      <ul class="space-y-1">
        {Object.entries(data).map(([value, count]) => (
          <li class="grid grid-cols-[auto_1fr_52px] items-center gap-2">
            <span class="flex-1">{value}</span>
            <span class="ml-auto text-sm text-gray-500 dark:text-gray-400">
              {count}
            </span>
            <span class="text-right font-mono text-xs tabular-nums text-gray-400 dark:text-gray-600">
              ({parsePercent(count / sum)})
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
