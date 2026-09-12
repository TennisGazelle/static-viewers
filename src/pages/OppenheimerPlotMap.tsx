import { Link } from 'react-router-dom'
import {
  Gitgraph,
  Orientation,
  TemplateName,
  templateExtend,
} from '@gitgraph/react'
import { useCallback, useMemo, useState } from 'react'
import type { GitgraphUserApi, BranchUserApi } from '@gitgraph/core'
import type { ReactElement } from 'react'
import type { ThemeMode } from '../theme'

type PlotGitgraph = GitgraphUserApi<ReactElement<SVGElement>>
type PlotBranch = BranchUserApi<ReactElement<SVGElement>>
type GraphSettings = {
  orientation: Orientation
}

/** Fission family = warm amber (colour timeline). Fusion family = cool steel (B&W). */
const BRANCH_COLOR = {
  master: '#c9b8a4',
  fission: '#e8913a',
  cambridge: '#f0a85c',
  europe: '#d47828',
  berkeley: '#f5c078',
  fusion: '#7a8ba8',
  ias: '#a0b0c8',
} as const

const initialGraphSettings: GraphSettings = {
  orientation: Orientation.VerticalReverse,
}

function graphOptions(theme: ThemeMode) {
  const dark = theme === 'dark'

  return {
    template: templateExtend(TemplateName.Metro, {
      colors: Object.values(BRANCH_COLOR),
      commit: {
        message: {
          displayAuthor: false,
          color: dark ? '#fafafa' : '#000000',
          font: 'normal 15px system-ui, sans-serif',
        },
        dot: {
          size: 10,
        },
      },
      branch: {
        lineWidth: 6,
        spacing: 46,
        label: {
          display: true,
          color: dark ? '#000000' : '#fafafa',
          strokeColor: 'transparent',
          bgColor: dark ? '#fca311' : '#14213d',
          font: 'bold 12px system-ui, sans-serif',
        },
      },
      tag: {
        color: '#000000',
        bgColor: '#fca311',
        strokeColor: 'transparent',
        font: 'normal 12px system-ui, sans-serif',
      },
    }),
  }
}

function branchWithColor(
  parent: PlotGitgraph | PlotBranch,
  name: string,
  color: string,
): PlotBranch {
  return parent.branch({
    name,
    style: { color },
    commitDefaultOptions: {
      style: {
        color,
        dot: { color },
      },
    },
  })
}

function buildOppenheimerPlot(gitgraph: PlotGitgraph) {
  // React StrictMode may replay this callback in dev, so rebuild from scratch.
  gitgraph.clear()

  // Commits are issued in movie order across branches (intercuts), not
  // branch-by-branch. Flashbacks merge back into the hearing that opened them.

  const master = branchWithColor(gitgraph, 'master', BRANCH_COLOR.master)
  master.commit('Prometheus: fire of a thousand suns, stamping; Oppie opens his eyes')

  const fission = branchWithColor(master, 'fission', BRANCH_COLOR.fission)
  fission
    .commit('Oppenheimer begins reading his statement into the record')
    .tag('colour, INT, Room 2022, 1954')
  // .tag('first instance of "we\'re not judges"')

  const fusion = branchWithColor(master, 'fusion', BRANCH_COLOR.fusion)
  fusion
    .commit(
      'Strauss and aide: three-day testimony, month-long hearing; "who\'d want to justify their whole life?"',
    )
    .tag('B&W, INT, Senate office, 1959')
  // .tag('first instance of "who\'d want to justify their whole life?"')
  fusion
    .commit('Corridor to committee; flashbulbs as Strauss enters')
    .tag('B&W, INT, Senate committee room, 1959')
  // .tag('first instance of "this is not a trial"')

  fission.commit(
    'Robb: why leave the US? Cambridge under Blackett; were you happier there?',
  )

  const cambridge = branchWithColor(
    fission,
    'fission-cambridge',
    BRANCH_COLOR.cambridge,
  )
  cambridge
    .commit('Young Oppie in bed: particle visions, homesick, hidden universe')
    .tag('colour, INT, Cambridge, mid-1920s')
  cambridge.commit(
    'Blackett lab: denied Bohr lecture; injects cyanide into the apple',
  )
  cambridge.commit('Sneaks into Bohr lecture; raises hand with a question')

  fusion.commit(
    'McGee: relationship with Oppenheimer; met 1947 as AEC commissioner / IAS board',
  )

  const ias = branchWithColor(fusion, 'fusion-ias', BRANCH_COLOR.ias)
  ias
    .commit("Meets Oppie at IAS; corrects 'straws'; commute comes with the house")
    .tag('B&W, EXT/INT, Institute for Advanced Study, 1947')
  ias.commit(
    "Self-made man / father was one; Einstein at the pond; shoe salesman; Oppie walks to Einstein as hat blows",
  )

  fission.commit('Continues statement: struggled to visualize the new world')

  cambridge.commit(
    'Panic: Los Alamos apple insert; grabs poisoned apple from Bohr; Göttingen under Born; algebra like sheet music',
  )
  cambridge
    .commit(
      'Göttingen montage: art, Stravinsky, Waste Land, smashing glass, waves',
    )
    .tag('MONTAGE')

  fission.merge(cambridge)

  ias.commit(
    'Einstein ignores Strauss; past associations; job is yours; "with a great commute"',
  )

  fusion.merge(ias)

  fusion.commit(
    'Senate: concerned what he said to Einstein; "we all know what happened later"',
  )

  fission.commit('After Göttingen… Leiden in Holland')

  const europe = branchWithColor(fission, 'fission-europe', BRANCH_COLOR.europe)
  europe
    .commit('Lectures in Dutch; meets Isidor Rabi')
    .tag('colour, INT, Leiden, late 1920s')
  europe.commit(
    'Train to Zurich: Dutch in six weeks; schvitzer; seek out Heisenberg',
  )
  europe.commit(
    'Zurich: meets Heisenberg; New Mexico canyons; "go home, cowboys"',
  )

  fission.merge(europe)

  fission.commit(
    'Paths crossed; Robb: any Russians?; appointments at Caltech and Berkeley',
  )

  const berkeley = branchWithColor(
    fission,
    'fission-berkeley',
    BRANCH_COLOR.berkeley,
  )
  berkeley
    .commit(
      'Meets Lawrence at the rad lab; theory next door; first pupil Lomanitz',
    )
    .tag('colour, INT/EXT, Berkeley, early 1930s')
  berkeley.commit(
    'Class fills; dissolve years later; stellar-collapse lecture with Snyder',
  )
}

type OppenheimerPlotMapProps = {
  theme: ThemeMode
}

function OppenheimerPlotMap({ theme }: OppenheimerPlotMapProps) {
  const [settings, setSettings] = useState<GraphSettings>(initialGraphSettings)
  const options = useMemo(
    () => ({ ...graphOptions(theme), ...settings }),
    [settings, theme],
  )

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
    <main className="viewer-page oppenheimer-page">
      <header className="viewer-hero">
        <Link className="back-link" to="/">
          &larr; Static viewers
        </Link>
        <p className="eyebrow">Nolan screenplay · fission / fusion timelines</p>
        <h1>Oppenheimer plot map</h1>
        <p className="viewer-deck">
          A git-style map of the film&apos;s interleaved hearings and flashbacks.
          Warm amber is fission (colour); cool steel is fusion (black-and-white).
        </p>
      </header>

      <div className="plot-legend" aria-hidden="true">
        <span>
          <i style={{ background: BRANCH_COLOR.fission, color: BRANCH_COLOR.fission }} />
          Fission
        </span>
        <span>
          <i style={{ background: BRANCH_COLOR.cambridge, color: BRANCH_COLOR.cambridge }} />
          Cambridge
        </span>
        <span>
          <i style={{ background: BRANCH_COLOR.europe, color: BRANCH_COLOR.europe }} />
          Europe
        </span>
        <span>
          <i style={{ background: BRANCH_COLOR.berkeley, color: BRANCH_COLOR.berkeley }} />
          Berkeley
        </span>
        <span>
          <i style={{ background: BRANCH_COLOR.fusion, color: BRANCH_COLOR.fusion }} />
          Fusion
        </span>
        <span>
          <i style={{ background: BRANCH_COLOR.ias, color: BRANCH_COLOR.ias }} />
          IAS
        </span>
      </div>

      <section className="viewer-toolbar">
        <label htmlFor="orientation">
          Orientation
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
        </label>
      </section>

      <div className="plot-stage">
        <Gitgraph
          key={`${theme}-${JSON.stringify(settings)}`}
          options={options}
        >
          {buildOppenheimerPlot}
        </Gitgraph>
      </div>
    </main>
  )
}

export default OppenheimerPlotMap
