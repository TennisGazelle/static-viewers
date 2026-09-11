import { Link } from 'react-router-dom'
import {
  Gitgraph,
  Orientation,
  TemplateName,
  templateExtend,
} from '@gitgraph/react'
import { useCallback, useState } from 'react'
import type { GitgraphUserApi } from '@gitgraph/core'
import type { ReactElement } from 'react'

type PlotGitgraph = GitgraphUserApi<ReactElement<SVGElement>>
type GraphSettings = {
  orientation: Orientation
}

const initialGraphSettings: GraphSettings = {
  orientation: Orientation.VerticalReverse,
}

const baseGraphOptions = {
  template: templateExtend(TemplateName.Metro, {
    commit: {
      message: {
        displayAuthor: false,
      },
    },
  }),
}

function buildOppenheimerPlot(gitgraph: PlotGitgraph) {
  // React StrictMode may replay this callback in dev, so rebuild from scratch.
  gitgraph.clear()

  const master = gitgraph.branch('master')
  master.commit('movie starts')
  master.commit('Swirl visuals and text about Prometheus')

  const fission = master.branch('fission')
  fission
    .commit('older oppenheimer speaks a statement into the record')
    .tag('colored, INT, small room, early 1940s')

  const fusion = master.branch('fusion')
  fusion
    .commit('strauss is talking to legislative aide about congressional hearing')
    .tag('black and white, INT, small meeting room, early 1950s')
    .commit('Strauss asked about Oppenheimer Trial, says "Gosh that was so long ago, exactly 5 years ago."')
    // .tag('first instance of "who\'d want to justify their whole life?"')
    .commit("Strauss brought to courtroom to commence the hearing")
    .tag('INT Grand Congressional Room')
    // .tag('first instance of "this is not a trial"')
  
  fission
    .commit('Oppenheimer is asked if he was happier in Cambridge than the US')
  
  const cambridge = fission.branch('fission-cambridge')
  cambridge
    .commit('Oppenheimer is asked if he was happier in Cambridge than the US')
    .tag('Young Oppenheimer in England, early 1910s')
    .commit('Cool atom visuals, anxiety while him in bed, etc.')
    .tag('MONTAGE')
    .commit('Oppenheimer chastised by teacher for breaking glasses, he says he wants to go to lecture, is shot down by professor')
    .commit('Oppenheimer poisons apple.')
    .commit('more visuals and anxieties; brief forward flash visual of him in tent in Los Alamos')
    .tag('MONTAGE')
    .commit('Bell Tolls, he realizes gag with apple is too far')
    .commit('Meets Neil Bohr, saves him from apple, is told to study in Borne and that Algebra is like sheet music')
    .commit('Oppenheimer looks at art and more atom visuals; landscapes with classes; throwing glass at the wall, atomic visuals now complete')
    .tag('MONTAGE')
  
  fusion.merge(cambridge)

  fusion
    .commit('Strauss asked when he met Oppenheimer, establishes he was comissioner of the AEC, says he met him at IAS')
  
  const ias = fusion.branch('ias')
  ias
    .commit('Oppenheimer meets Strauss at brownstone in the IAS')
    .tag('black and white, EXT, brownstone, early 1950s')
    .commit('Strauss says where the commute is')
    .commit('Strauss corrects his pronunciation, says he was a self made man, so was Oppenheimer\'s dad')
    .commit("They see Einstein, discuss how much they've already known him, and progress since his time.")
    .tag('INT, brownstone')
    .commit("Oppenheimer, 'Strauss was a lowly shoe salesman.'; Strauss, 'No, just a salesman'")



  master.merge(fission).merge(fusion).tag('end of movie')
}

function OppenheimerPlotMap() {
  const [settings, setSettings] = useState<GraphSettings>(initialGraphSettings)

  const handleOptionsChange = useCallback(
    (nextSettings: Partial<GraphSettings>) => {
      setSettings((currentSettings) => ({
        ...currentSettings,
        ...nextSettings,
      }))
    },
    [],
  )

  return (
    <main>
      <p>
        <Link to="/">&larr; Home</Link>
      </p>
      <h1>Oppenheimer Plot Map</h1>
      <section>
        <select
          id="orientation"
          value={settings.orientation}
          onChange={(event) =>
            handleOptionsChange({
              orientation: event.currentTarget.value as Orientation,
            })
          }
        >
          {Object.values(Orientation).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>
      <Gitgraph
        key={JSON.stringify(settings)}
        options={{ ...baseGraphOptions, ...settings }}
      >
        {buildOppenheimerPlot}
      </Gitgraph>
    </main>
  )
}

export default OppenheimerPlotMap
