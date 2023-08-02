import elements from '@kitajs/html'
import { ExternalLink } from './link'

const projects = [
  {
    name: 'Supreme',
    description:
      'Supreme is a command line tool that helps you get up and running fast with new apps. It can currently generate rescript-react apps with Tailwind CSS, GraphQL APIs with examples for queries, mutations and subscriptions using TypeScript and React apps with both TypeScript and JavaScript. It can also help you install and generate commonly used configs for things like prettier, husky and jest. ',
    tech: ['rust', 'github actions'],
    link: 'https://github.com/opendevtools/supreme',
  },
  {
    name: 'rescript-intl',
    description:
      're-intl helps you with date, number and currency formatting in ReasonML (BuckleScript). Everything is built on top of Intl which comes built-in with browsers >= IE11 as well as Node.',
    tech: ['rescript', 'github actions'],
    link: 'https://github.com/opendevtools/rescript-intl',
  },
  {
    name: 'Clearingnummer',
    description:
      'Sort codes, clearingnummer in Swedish, are four or five digit identifiers for Swedish banks. This package helps you find the bank related to a specific number. ',
    tech: ['typescript', 'github actions'],
    link: 'https://github.com/believer/clearingnummer',
  },
  {
    name: 'Telefonnummer',
    description:
      'Telefonnummer is phone number in Swedish. This package formats all Swedish phone numbers, both mobile and landline, to a standard format. ',
    tech: ['typescript', 'github actions'],
    link: 'https://github.com/believer/telefonnummer',
  },
  {
    name: 'WCAG Color',
    tech: ['rescript', 'github actions'],
    link: 'https://github.com/opendevtools/wcag-color',
    description:
      '<p>According to the WHO an <a href="https://www.who.int/en/news-room/fact-sheets/detail/blindness-and-visual-impairment">estimated 1.3 billion</a> people live with some form of visual impairment. This includes people who are legally blind and people with less than 20/20 vision.</p>  <p>This library helps you achieve the accessibility standards for color contrast outlined in the WCAG 2.0 specification.</p> ',
  },
  {
    name: 'Wejay',
    description:
      'A Slack bot that controls a Sonos system. We use it at Iteam as a collaborative music player. It can do pretty much everything from managing the play queue, control playback, list most played songs and even contains some hidden easter eggs. ',
    tech: ['reasonml', 'docker', 'elasticsearch', 'github actions', 'slack'],
    link: 'https://github.com/Iteam1337/sonos-wejay',
  },
  {
    name: 'Workout of the Day',
    description:
      '<p>A collection of competition and benchmark CrossFit workouts but also workouts that I\'ve made. A combination of two of my passions code and CrossFit.</p><p>I\'ve also made a version of the app in <a href="https://github.com/believer/wod-elm">Elm</a>.</p> ',
    tech: ['rescript', 'vercel', 'github actions'],
    link: 'https://github.com/believer/wod',
  },
]

const Projects = () => {
  return (
    <section class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12">
      <header class="col-span-12 text-gray-600 dark:text-gray-400 md:col-span-2 md:text-right">
        Projects
      </header>
      <div class="col-span-12 space-y-2 md:col-span-10">
        {projects.map((p) => (
          <details>
            <summary class="group mb-2 flex cursor-pointer items-baseline space-x-4 text-gray-800 dark:text-gray-400">
              <span class="flex-none font-medium group-hover:text-brandBlue-600 group-hover:underline dark:group-hover:text-tokyoNight-blue">
                {p.name}
              </span>
              <span class="w-full flex-shrink border-t border-dashed border-gray-300 dark:border-gray-500"></span>
            </summary>
            <div class="mb-8 text-sm">
              <div class="flex items-center">
                <div class="mr-5 flex-1">
                  <div class="mb-2 flex space-x-2">
                    {p.tech.map((tech) => (
                      <div class="text-xs text-gray-600 dark:text-gray-400">
                        {tech}
                      </div>
                    ))}
                  </div>
                  {p.description}
                </div>
              </div>
              <div class="mt-4 flex flex-wrap"></div>
              <ExternalLink
                href={p.link}
                aria-label={`Source code for ${p.name} on GitHub`}
              >
                Link
              </ExternalLink>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export default Projects
