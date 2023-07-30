import * as elements from '@kitajs/html'
import { BaseHtml } from './layout'

export default function Iteam() {
  return (
    <BaseHtml>
      <div class="markdown grid grid-cols-1 md:grid-cols-12">
        <div
          class="col-span-12
      md:col-start-3 md:col-end-13"
        >
          <h2>Energiföretagen</h2>
          <p class="text-sm text-gray-500">Full stack developer ~ 2019</p>
          <p>
            Complete rebuild of Energiföretagens publications website, EBR-e, on
            top of their existing Episerver.
          </p>
          <div class="mt-4 text-xs dark:text-gray-600">
            React, TypeScript, Node, GraphQL, AWS, Docker, PostgreSQL, .NET,
            ElasticSearch
          </div>
          <h2>Motorbranschens Riksförbund</h2>
          <p class="text-sm text-gray-500">Full stack developer ~ 2019-2020</p>
          <p>
            Development of a new web-based system for car service workshops and
            billing insurance companies. The challenges of this project include
            supporting all legal requirements of GDPR, bookkeeping law and
            building a system with the end user in focus.
          </p>
          <div class="mt-4 text-xs dark:text-gray-600">
            ReScript (rescript-react), Node, GraphQL, PostgreSQL
          </div>
          <h2>Arbetsförmedlingen</h2>
          <p class="text-sm text-gray-500">
            Full stack developer ~ 2017 - 2019
          </p>
          <p>
            A service that made it easier for people who are new in Sweden to
            establish themselves on the Swedish job market.
          </p>
          <div class="mt-4 text-xs dark:text-gray-600">
            React, Node, GraphQL, Docker, PostgreSQL
          </div>
          <h2>Vimla</h2>
          <p class="text-sm text-gray-500">
            Full stack developer ~ 2014 - 2018
          </p>
          <p>
            Vimla is Telenors fighter brand. I was with them from the beginning
            and have helped them build multiple platforms including their
            website, app, API, forum, knowledge base and much more.
          </p>
          <div class="mt-4 text-xs dark:text-gray-600">
            React, React Native, Node, Docker, MongoDB, NodeBB, Flow, TypeScript
          </div>
          <h2>Playpilot</h2>
          <p class="text-sm text-gray-500">Backend developer ~ 2018</p>
          <p>
            Help them get started with setting up a GraphQL API on top of their
            existing REST API.
          </p>
          <div class="mt-4 text-xs dark:text-gray-600">
            Node, GraphQL, TypeScript
          </div>
          <h2>Läkare utan gränser (MSF)</h2>
          <p class="text-sm text-gray-500">Frontend developer ~ 2016 - 2017</p>
          <p>
            Digitalization of the recruitment process. Before there was a lot of
            paperwork and manual labor, but we helped MSF by building a web app
            that the recruiters could use on a tablet. These applications were
            then automatically processed through the system.
          </p>
          <div class="mt-4 text-xs dark:text-gray-600">React, PWA</div>
          <h2>Kvalitetsbygg</h2>
          <p class="text-sm text-gray-500">Frontend developer ~ 2016 - 2017</p>
          <p>
            Assisting an existing team of developers abroad with development and
            writing testable Angular.
          </p>
          <div class="mt-4 text-xs dark:text-gray-600">AngularJS, Mocha</div>
          <h2>Taxi Stockholm</h2>
          <p class="text-sm text-gray-500">Frontend developer ~ 2016 - 2017</p>
          <p>Multiple frontend and backend projects.</p>
          <div class="mt-4 text-xs dark:text-gray-600">
            React, React Native, Node
          </div>
          <h2>Svensk Förening för Allmänmedicin</h2>
          <p class="text-sm text-gray-500">Frontend developer ~ 2016</p>
          <p>Rebuild of their website</p>
          <h2>Swedbank</h2>
          <p class="text-sm text-gray-500">
            Frontend developer / Mentor ~ 2015 - 2016
          </p>
          <p>
            Building their new internet bank and mentoring their Java developers
            in JavaScript and CSS.
          </p>
          <div class="mt-4 text-xs dark:text-gray-600">
            AngularJS, Mentoring
          </div>
          <h2>Besedo</h2>
          <p class="text-sm text-gray-500">Frontend developer ~ 2015 - 2016</p>
          Auditing system for ads on services like Blocket.
          <div class="mt-4 text-xs dark:text-gray-600">AngularJS, Node</div>
          <h2>Radical FM</h2>
          <p class="text-sm text-gray-500">Frontend developer ~ 2013 - 2014</p>
          <p>
            Built a webapp for music streaming with all the basic features of a
            music streaming service we know today, but also with the ability to
            add your voice and stream to each other to make it more like your
            own radio station.
          </p>
          <div class="mt-4 text-xs dark:text-gray-600">
            AngularJS, ElasticSearch
          </div>
          <h2>Beckers</h2>
          <p class="text-sm text-gray-500">Frontend developer ~ 2012 - 2013</p>
          <p>Rebuilding the user-facing websites for customer and companies</p>
          <div class="mt-4 text-xs dark:text-gray-600">HTML, CSS, jQuery</div>
        </div>
      </div>
    </BaseHtml>
  )
}
