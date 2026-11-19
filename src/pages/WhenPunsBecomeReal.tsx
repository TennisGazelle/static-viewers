import { Link } from 'react-router-dom'

type Term = {
  name: string
  startedAs: string
  whereItStuck: string
  status: string
  source: string
  sourceName: string
}

const terms: Term[] = [
  {
    name: 'Thagomizer',
    startedAs: 'A 1982 Far Side gag about “the late Thag Simmons.”',
    whereItStuck: 'Paleontology',
    status: 'Beloved expert slang, not formal anatomy.',
    source: 'https://www.vmnh.net/article/yes-this-is-legit/9-14-2021',
    sourceName: 'Virginia Museum of Natural History',
  },
  {
    name: 'Barn',
    startedAs: '“As big as a barn” at nuclear scale.',
    whereItStuck: 'Particle and nuclear physics',
    status: 'A standard unit of cross-sectional area: 10⁻²⁸ m².',
    source: 'https://www.astro.purdue.edu/about/history/war_period.html',
    sourceName: 'Purdue Physics and Astronomy',
  },
  {
    name: 'Sonic hedgehog',
    startedAs: 'A vertebrate gene named after the game character, related to the fruit-fly “hedgehog” gene.',
    whereItStuck: 'Developmental biology and medicine',
    status: 'SHH is the official symbol for the human sonic hedgehog signaling molecule gene.',
    source: 'https://www.statnews.com/2018/07/16/gene-names-oral-history/',
    sourceName: 'STAT: the researchers’ naming story',
  },
  {
    name: 'Spam',
    startedAs: 'Monty Python’s repetitive canned-meat sketch.',
    whereItStuck: 'The internet, security, and law',
    status: 'The everyday technical term for unsolicited bulk messages.',
    source: 'https://www.abc.net.au/listen/programs/futuretense/spam2c-spam2c-spam/5086792',
    sourceName: 'ABC: a history of spam',
  },
  {
    name: 'Smoot',
    startedAs: 'An MIT fraternity prank measuring a bridge with Oliver Smoot.',
    whereItStuck: 'Cambridge, Massachusetts',
    status: 'Harvard Bridge markings preserve 364.4 smoots plus one ear.',
    source: 'https://news.mit.edu/2026/new-unit-of-measurement-honors-influential-mit-alumnus-0512',
    sourceName: 'MIT News',
  },
  {
    name: 'Googol',
    startedAs: 'A child’s invented name for 10¹⁰⁰.',
    whereItStuck: 'Mathematics',
    status: 'A legitimate large-number term; later the inspiration for Google.',
    source: 'https://mathworld.wolfram.com/Googol.html',
    sourceName: 'Wolfram MathWorld',
  },
  {
    name: 'Big Bang',
    startedAs: 'Fred Hoyle’s 1949 radio description of a theory he opposed.',
    whereItStuck: 'Cosmology',
    status: 'The standard term; whether Hoyle meant it as a joke is disputed.',
    source: 'https://academic.oup.com/astrogeo/article/54/2/2.28/302975',
    sourceName: 'Astronomy & Geophysics: the etymology',
  },
  {
    name: 'Grawlix',
    startedAs: 'Mort Walker’s playful name for cartoon swearing symbols.',
    whereItStuck: 'Comics and writing',
    status: 'A word for symbols such as @#$%! that stand in for profanity.',
    source: 'https://www.worldwidewords.org/backissues/ww-gra1.html',
    sourceName: 'World Wide Words',
  },
  {
    name: 'Agra cadabra',
    startedAs: 'A taxonomist’s pun on “abracadabra.”',
    whereItStuck: 'Entomology',
    status: 'A valid scientific name for a beetle.',
    source: 'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=932605',
    sourceName: 'Integrated Taxonomic Information System',
  },
]

function WhenPunsBecomeReal() {
  return (
    <main className="terms-page">
      <section className="terms-shell">
        <Link className="back-link" to="/">
          ← Static viewers
        </Link>
        <header className="terms-header">
          <h1>When puns become real</h1>
          <p>
            Playful names and the places they ended up.
          </p>
        </header>

        <div className="terms-table-wrap">
          <table className="terms-table">
            <thead>
              <tr>
                <th scope="col">Term</th>
                <th scope="col">Started as</th>
                <th scope="col">Where it stuck</th>
                <th scope="col">What it became</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((term) => (
                <tr key={term.name}>
                  <th scope="row">
                    {term.name}
                    <a className="terms-source" href={term.source}>
                      Source: {term.sourceName}
                    </a>
                  </th>
                  <td data-label="Started as">{term.startedAs}</td>
                  <td data-label="Where it stuck">{term.whereItStuck}</td>
                  <td data-label="What it became">{term.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default WhenPunsBecomeReal
