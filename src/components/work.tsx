import * as elements from '@kitajs/html'
import { toYear, toYearShort } from '../utils/intl'

const work = [
  {
    name: 'SEB',
    start: '2023-06-05T00:00:00.000Z',
    end: null,
    position: 'Senior Fullstack Developer',
    description: '<p>SEB is one of the largest Swedish banks.</p>',
  },
  {
    name: 'Arizon',
    start: '2022-01-10T00:00:00.000Z',
    end: '2023-05-30T00:00:00.000Z',
    position: 'Developer Consultant',
    description: '<p>Arizon is a IT consultancy and startup incubator.</p>',
  },
  {
    name: 'Hemnet',
    start: '2020-04-20T00:00:00.000Z',
    end: '2022-12-01T00:00:00.000Z',
    position: 'Frontend Developer',
    description:
      "<p>With 2.8 miljon unique vistors each week, Hemnet is Sweden's biggest website when you're looking to buy or sell your appartment or house.</p><p>I was part of the Seller's Experience team. This team handles the \"behind the scenes\" of a sale. Everything from the broker adding your listing, you purchasing additional packages for better exposure of your listing to a dashboard where you can follow statistics on the sale.</p> ",
  },
  {
    name: 'Iteam',
    start: '2012-11-05T00:00:00.000Z',
    end: '2020-03-01T00:00:00.000Z',
    position: 'Developer / Head of Tech',
    description:
      "<p>Iteam is a development consultancy working mostly in-house.</p><p>My work focused on front-end, but also backend (Node) whenever there's a need. We use React and React Native with TypeScript, but recently we've also started using ReasonML. We write all code using TDD and Jest. API integrations are made using GraphQL, with some REST.</p> ",
    link: '/iteam',
    linkDescription:
      "Here's a list of all the projects I've a been a part of at Iteam",
  },
  {
    name: 'MatHem',
    start: '2011-12-01T00:00:00.000Z',
    end: '2012-06-01T00:00:00.000Z',
    position: 'Interaction designer',
    description:
      '<p>MatHem delivers groceries directly to your door, either as a prepackaged concept with recipes or as individual products of your choosing. MatHem has been selected as one of the best Swedish online stores two years running by Internetworld.</p><p>My job was mostly front-end development. I made mockups in Photoshop and then implemented the HTML, CSS and some jQuery on the website. I also made flash banners for advertising campaigns.</p> ',
  },
]

const Work = () => {
  return (
    <section class="mt-10 grid gap-6 md:grid-cols-12">
      <header class="col-span-12 text-gray-600 dark:text-gray-400 md:col-span-2 md:text-right">
        Work
      </header>
      <div class="col-span-12 space-y-2 md:col-span-10">
        {work.map((w) => (
          <details>
            <summary class="group mb-2 flex cursor-pointer items-baseline space-x-4 text-gray-800 dark:text-gray-400">
              <span class="flex-none font-medium group-hover:text-brandBlue-600 group-hover:underline dark:group-hover:text-tokyoNight-blue">
                {w.name}
              </span>
              <span class="w-full flex-shrink border-t border-dashed border-gray-300 dark:border-gray-500"></span>
              <span class="flex-none text-gray-600 dark:text-gray-400">
                {w.position}
              </span>
              <span class="flex-none font-mono text-sm tabular-nums text-gray-500">
                <time datetime={w.start}>{toYear(w.start)}</time>-
                {w.end ? (
                  <time datetime={w.end}>{toYearShort(w.end)}</time>
                ) : (
                  <span>&nbsp;&nbsp;</span>
                )}
              </span>
            </summary>
            <div class="mb-8 text-sm">
              {w.description}
              {w.link && (
                <a class="inline-block" href={w.link}>
                  {w.linkDescription}
                </a>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export default Work
